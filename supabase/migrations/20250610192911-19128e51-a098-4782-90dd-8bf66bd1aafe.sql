
-- Check if Paul Deluca's profile was created in the database
SELECT id, name, pulse_id, email, created_at, updated_at 
FROM public.users 
WHERE email = 'dalaras2009@hotmail.com' OR name = 'Paul Deluca' OR pulse_id = 'pauldeluca';

-- Also check the most recent user registrations to see the latest activity
SELECT id, name, pulse_id, email, created_at, updated_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Verify the trigger is working properly by checking if there are any users without profiles
SELECT au.id, au.email, au.created_at as auth_created, 
       pu.id as profile_id, pu.created_at as profile_created
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 5;
