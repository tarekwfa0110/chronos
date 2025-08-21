-- Admin Setup Script for Chronos1
-- Run this in your Supabase SQL editor to set up admin users

-- Method 1: Update existing user to admin role
-- Replace 'user-uuid-here' with the actual user ID from Supabase Auth Dashboard
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'user-uuid-here';

-- Method 2: Grant admin role to existing user by email
-- Uncomment and replace with actual email
-- UPDATE user_profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users
--   WHERE email = 'admin@yourdomain.com'
-- );

-- Method 3: Create a new admin user profile (after creating the auth user)
-- Uncomment and replace with actual values
-- INSERT INTO user_profiles (id, full_name, email, role, created_at, updated_at)
-- VALUES (
--   'user-uuid-here',
--   'Admin User',
--   'admin@example.com',
--   'admin',
--   NOW(),
--   NOW()
-- );

-- Check existing users and their roles
SELECT
  u.id,
  u.email,
  up.full_name,
  up.role,
  u.created_at
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
ORDER BY u.created_at DESC;

-- Grant super_admin role (uncomment if needed)
-- UPDATE user_profiles
-- SET role = 'super_admin'
-- WHERE id = 'user-uuid-here';
