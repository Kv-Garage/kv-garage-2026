-- Complete Affiliate System Fix
-- Run this entire script in Supabase SQL Editor to fix all issues

-- ============================================
-- 1. FIX PROFILES TABLE RLS
-- ============================================

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access" ON public.profiles;

-- Create new policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admin can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Public can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role full access"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. FIX AFFILIATE_APPLICATIONS TABLE RLS
-- ============================================

-- Enable RLS on affiliate_applications
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow admin select" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow admin update" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow public insert" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow public select" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow public select own" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow admin select all" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow admin update all" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Allow service role full access" ON public.affiliate_applications;

-- Create new policies for affiliate_applications
CREATE POLICY "Allow public insert"
ON public.affiliate_applications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public select own"
ON public.affiliate_applications
FOR SELECT
USING (true);

CREATE POLICY "Allow admin select all"
ON public.affiliate_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE public.profiles.id = auth.uid() 
    AND public.profiles.role = 'admin'
  )
);

CREATE POLICY "Allow admin update all"
ON public.affiliate_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE public.profiles.id = auth.uid() 
    AND public.profiles.role = 'admin'
  )
);

CREATE POLICY "Allow service role full access"
ON public.affiliate_applications
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- 3. CREATE PROFILE TRIGGER
-- ============================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    company,
    role,
    partner,
    reseller,
    monthly_volume,
    has_license,
    approved
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'partner', 'ipvalue'),
    (NEW.raw_user_meta_data->>'reseller')::boolean = true,
    COALESCE(NEW.raw_user_meta_data->>'monthly_volume', 'beginner'),
    (NEW.raw_user_meta_data->>'has_license')::boolean = false,
    true
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. ENSURE TABLE STRUCTURE IS CORRECT
-- ============================================

-- Make sure profiles table has all needed columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS partner TEXT,
ADD COLUMN IF NOT EXISTS reseller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS monthly_volume TEXT,
ADD COLUMN IF NOT EXISTS has_license BOOLEAN DEFAULT false;

-- ============================================
-- 5. CREATE HELPER FUNCTION FOR ADMIN APPROVAL
-- ============================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.approve_affiliate(TEXT);

-- Create function to approve affiliate by email
CREATE OR REPLACE FUNCTION public.approve_affiliate(affiliate_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET 
    approved = true,
    role = 'affiliate'
  WHERE email = affiliate_email;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. GRANT NECESSARY PERMISSIONS
-- ============================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.affiliate_applications TO authenticated;

-- Grant permissions to anon users (for signup)
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.affiliate_applications TO anon;
GRANT SELECT ON public.affiliate_applications TO anon;

-- ============================================
-- DONE!
-- ============================================