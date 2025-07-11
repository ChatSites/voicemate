
-- Ensure the trigger function exists and is properly configured
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_exists boolean := false;
BEGIN
  -- Log the trigger execution with all available data
  RAISE LOG 'TRIGGER START: handle_new_user called for user ID: %, email: %, metadata: %', 
    NEW.id, NEW.email, NEW.raw_user_meta_data;
  
  -- Check if profile already exists
  SELECT EXISTS(SELECT 1 FROM public.users WHERE id = NEW.id) INTO profile_exists;
  RAISE LOG 'Profile exists check: %', profile_exists;
  
  -- Insert or update user profile
  INSERT INTO public.users (id, name, pulse_id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'pulse_id',
    NEW.email,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, users.name),
    pulse_id = COALESCE(EXCLUDED.pulse_id, users.pulse_id),
    email = COALESCE(EXCLUDED.email, users.email),
    updated_at = now();
  
  RAISE LOG 'TRIGGER SUCCESS: User profile created/updated for ID: %', NEW.id;
  
  -- Verify the insert worked
  SELECT EXISTS(SELECT 1 FROM public.users WHERE id = NEW.id) INTO profile_exists;
  RAISE LOG 'Final verification - profile exists: %', profile_exists;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'TRIGGER ERROR: % - SQLSTATE: %', SQLERRM, SQLSTATE;
    -- Don't fail the auth operation, but log the error
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created correctly
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
