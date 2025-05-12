
-- Enable RLS on users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create policy to allow service_role to manage all profiles
CREATE POLICY "Service role can manage all profiles"
ON public.users
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
