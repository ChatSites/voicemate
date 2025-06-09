
-- Drop the users table and related objects
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop the trigger and function since we no longer need them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
