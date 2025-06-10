
-- Check all users in the auth.users table to see total registrations
SELECT id, email, created_at, email_confirmed_at, 
       raw_user_meta_data->>'full_name' as full_name,
       raw_user_meta_data->>'pulse_id' as pulse_id
FROM auth.users 
ORDER BY created_at DESC;

-- Check all profiles in public.users table
SELECT id, name, pulse_id, email, created_at, updated_at 
FROM public.users 
ORDER BY created_at DESC;

-- Find users who registered but don't have profiles (trigger failures)
SELECT au.id, au.email, au.created_at as auth_created, 
       au.raw_user_meta_data->>'full_name' as metadata_name,
       au.raw_user_meta_data->>'pulse_id' as metadata_pulse_id,
       pu.id as profile_id, pu.created_at as profile_created
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- Check for any duplicate or conflicting pulse_ids that might cause insert failures
SELECT pulse_id, COUNT(*) as count
FROM public.users 
GROUP BY pulse_id 
HAVING COUNT(*) > 1;

-- Check if there are any users with the same email in auth vs public tables
SELECT 'auth_only' as source, au.email, au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
UNION ALL
SELECT 'public_only' as source, pu.email, pu.created_at
FROM public.users pu
LEFT JOIN auth.users au ON au.id = pu.id
WHERE au.id IS NULL;

-- Check the trigger function exists and is properly configured
SELECT trigger_name, event_manipulation, action_statement, action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the handle_new_user function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check recent PostgreSQL logs for any trigger errors
SELECT * FROM pg_stat_activity 
WHERE query LIKE '%handle_new_user%' 
ORDER BY query_start DESC 
LIMIT 10;
