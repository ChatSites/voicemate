
-- Enable RLS on tables that don't have it yet (ignore if already enabled)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pulses' AND rowsecurity = true) THEN
        ALTER TABLE public.pulses ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'intent_logs' AND rowsecurity = true) THEN
        ALTER TABLE public.intent_logs ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'voiceprints' AND rowsecurity = true) THEN
        ALTER TABLE public.voiceprints ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view pulses sent to them" ON public.pulses;
DROP POLICY IF EXISTS "Users can create pulses" ON public.pulses;
DROP POLICY IF EXISTS "Users can update pulses sent to them" ON public.pulses;

-- Create RLS policies for pulses table
CREATE POLICY "Users can view pulses sent to them" ON public.pulses
FOR SELECT USING (
  pulse_id IN (
    SELECT pulse_id FROM public.users WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can create pulses" ON public.pulses
FOR INSERT WITH CHECK (
  pulse_id IS NOT NULL AND 
  LENGTH(pulse_id) >= 3 AND
  LENGTH(pulse_id) <= 50
);

CREATE POLICY "Users can update pulses sent to them" ON public.pulses
FOR UPDATE USING (
  pulse_id IN (
    SELECT pulse_id FROM public.users WHERE id = auth.uid()
  )
);

-- Drop existing policies for intent_logs if they exist
DROP POLICY IF EXISTS "Users can view own intent logs" ON public.intent_logs;
DROP POLICY IF EXISTS "Users can create own intent logs" ON public.intent_logs;

-- Create RLS policies for intent_logs table
CREATE POLICY "Users can view own intent logs" ON public.intent_logs
FOR SELECT USING (
  user_id::text = auth.uid()::text
);

CREATE POLICY "Users can create own intent logs" ON public.intent_logs
FOR INSERT WITH CHECK (
  user_id::text = auth.uid()::text AND
  LENGTH(transcript) <= 10000 AND
  LENGTH(intent) <= 1000
);

-- Drop existing policies for voiceprints if they exist
DROP POLICY IF EXISTS "Users can view own voiceprints" ON public.voiceprints;
DROP POLICY IF EXISTS "Users can create own voiceprints" ON public.voiceprints;
DROP POLICY IF EXISTS "Users can update own voiceprints" ON public.voiceprints;

-- Create RLS policies for voiceprints table
CREATE POLICY "Users can view own voiceprints" ON public.voiceprints
FOR SELECT USING (
  user_id = auth.uid()::text
);

CREATE POLICY "Users can create own voiceprints" ON public.voiceprints
FOR INSERT WITH CHECK (
  user_id = auth.uid()::text
);

CREATE POLICY "Users can update own voiceprints" ON public.voiceprints
FOR UPDATE USING (
  user_id = auth.uid()::text
);

-- Create security definer function for safe pulse ID validation
CREATE OR REPLACE FUNCTION public.validate_pulse_id_exists(pulse_id_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Input validation
  IF pulse_id_input IS NULL OR LENGTH(pulse_id_input) < 3 OR LENGTH(pulse_id_input) > 50 THEN
    RETURN false;
  END IF;
  
  -- Sanitize input (remove non-alphanumeric characters except underscore and dash)
  pulse_id_input := regexp_replace(pulse_id_input, '[^a-zA-Z0-9_-]', '', 'g');
  
  -- Check if pulse_id exists
  RETURN EXISTS(
    SELECT 1 FROM public.users 
    WHERE pulse_id = lower(pulse_id_input)
  );
END;
$$;

-- Create function to get user's own pulse_id safely
CREATE OR REPLACE FUNCTION public.get_current_user_pulse_id()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT pulse_id FROM public.users WHERE id = auth.uid();
$$;

-- Create audit trigger function for security monitoring
CREATE OR REPLACE FUNCTION public.audit_security_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log potential security events
  IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'pulses' THEN
    -- Log pulse creation for monitoring
    INSERT INTO public.intent_logs (
      user_id, 
      transcript, 
      intent, 
      category,
      created_at
    ) VALUES (
      COALESCE(auth.uid()::text::integer, 0),
      'PULSE_CREATED',
      'Security audit log',
      'SECURITY_EVENT',
      now()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the main operation if audit logging fails
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS audit_pulses_trigger ON public.pulses;

-- Create audit trigger for pulses
CREATE TRIGGER audit_pulses_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pulses
  FOR EACH ROW EXECUTE FUNCTION public.audit_security_events();

-- Add constraints for data validation (ignore if they already exist)
DO $$ BEGIN
    ALTER TABLE public.pulses 
    ADD CONSTRAINT check_pulse_id_length CHECK (LENGTH(pulse_id) >= 3 AND LENGTH(pulse_id) <= 50);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.pulses 
    ADD CONSTRAINT check_audio_url_format CHECK (audio_url IS NULL OR audio_url ~* '^https?://');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.pulses 
    ADD CONSTRAINT check_transcript_length CHECK (LENGTH(transcript) <= 10000);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.users
    ADD CONSTRAINT check_user_pulse_id_length CHECK (LENGTH(pulse_id) >= 3 AND LENGTH(pulse_id) <= 50);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.users
    ADD CONSTRAINT check_user_name_length CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 100);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.users
    ADD CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.intent_logs
    ADD CONSTRAINT check_transcript_length_logs CHECK (LENGTH(transcript) <= 10000);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.intent_logs
    ADD CONSTRAINT check_intent_length CHECK (LENGTH(intent) <= 1000);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for performance on frequently queried columns (ignore if they already exist)
CREATE INDEX IF NOT EXISTS idx_pulses_pulse_id ON public.pulses(pulse_id);
CREATE INDEX IF NOT EXISTS idx_users_pulse_id ON public.users(pulse_id);
CREATE INDEX IF NOT EXISTS idx_intent_logs_user_id ON public.intent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_voiceprints_user_id ON public.voiceprints(user_id);
