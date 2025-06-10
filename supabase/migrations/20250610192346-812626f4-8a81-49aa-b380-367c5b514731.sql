
-- Check if your profile was created in the database
SELECT id, name, pulse_id, email, created_at, updated_at 
FROM public.users 
WHERE email = 'jimmy.pavlatos@gmail.com' OR pulse_id = 'jimpav61';

-- Check all recent user registrations to see what's happening
SELECT id, name, pulse_id, email, created_at, updated_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if there are any users without profiles (this would indicate trigger failures)
SELECT au.id, au.email, au.created_at as auth_created, 
       pu.id as profile_id, pu.created_at as profile_created
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 10;

-- Verify the trigger exists and is working
SELECT tgname, tgenabled, tgfoid 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check if the handle_new_user function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
