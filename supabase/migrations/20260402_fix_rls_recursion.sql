-- Fix infinite recursion in profiles RLS policies
-- The issue is that the admin policy queries profiles from within profiles policies

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert" ON public.profiles;
DROP POLICY IF EXISTS "Allow public select own" ON public.profiles;

-- Simple policies without recursion
-- 1. Users can always view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Allow insert if the user is inserting their own profile
CREATE POLICY "Allow self insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Service role can do anything (for admin operations)
CREATE POLICY "Service role full access"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FIX AFFILIATE_APPLICATIONS POLICIES TOO
-- ============================================

DROP POLICY IF EXISTS "Allow public insert" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow public select own" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow admin select all" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow admin update all" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow service role full access" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow admin select" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow admin update" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow public select" ON public.affiliate_applications;

-- 1. Anyone can insert affiliate applications (signup)
CREATE POLICY "Allow public insert"
ON public.affiliate_applications
FOR INSERT
WITH CHECK (true);

-- 2. Anyone can view affiliate applications (for now, for testing)
CREATE POLICY "Allow public select"
ON public.affiliate_applications
FOR SELECT
USING (true);

-- 3. Service role can update (for admin approval via API)
CREATE POLICY "Service role full access"
ON public.affiliate_applications
FOR ALL
USING (true)
WITH CHECK (true);