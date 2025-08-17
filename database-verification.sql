-- Database Verification Script for Chronos
-- Run this in your Supabase SQL Editor to check if everything is set up correctly

-- 1. Check if tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('products', 'user_profiles', 'wishlist', 'addresses', 'orders', 'order_items') 
    THEN '✅ EXISTS' 
    ELSE '❌ MISSING' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('products', 'user_profiles', 'wishlist', 'addresses', 'orders', 'order_items');

-- 2. Check if RLS is enabled on tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('products', 'user_profiles', 'wishlist', 'addresses', 'orders', 'order_items');

-- 3. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('products', 'user_profiles', 'wishlist', 'addresses', 'orders', 'order_items')
ORDER BY tablename, policyname;

-- 4. Check if functions exist
SELECT 
  routine_name,
  CASE 
    WHEN routine_name IN ('handle_new_user', 'update_updated_at_column', 'generate_order_number') 
    THEN '✅ EXISTS' 
    ELSE '❌ MISSING' 
  END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('handle_new_user', 'update_updated_at_column', 'generate_order_number');

-- 5. Check if triggers exist
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table IN ('user_profiles', 'addresses', 'orders', 'auth.users');

-- 6. Test wishlist table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'wishlist'
ORDER BY ordinal_position; 