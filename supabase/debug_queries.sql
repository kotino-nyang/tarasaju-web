-- 1. Check if users table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'users';

-- 2. Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 3. Check auth.users (should have data after login)
SELECT id, email, created_at
FROM auth.users;

-- 4. Check public.users (might be empty)
SELECT id, email, created_at
FROM public.users;

-- 5. Manually insert existing auth users into public.users (if trigger didn't work)
INSERT INTO public.users (id, email, full_name, avatar_url)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
