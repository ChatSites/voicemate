
-- Check if the users table exists and its structure
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- Check how many users are in each table
SELECT 'auth_users' as table_name, count(*) as count FROM auth.users
UNION ALL
SELECT 'public_users' as table_name, count(*) as count FROM public.users;

-- Check recent registrations from both tables
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created,
  au.email_confirmed_at,
  pu.name,
  pu.pulse_id,
  pu.created_at as profile_created
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 10;

-- Check if the trigger exists and is working
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
