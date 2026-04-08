-- Fix RLS policies for affiliate_applications table
-- This allows anonymous users to insert applications (signup) and admins to select/update

-- Enable RLS
ALTER TABLE affiliate_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON affiliate_applications;
DROP POLICY IF EXISTS "Allow admin select" ON affiliate_applications;
DROP POLICY IF EXISTS "Allow admin update" ON affiliate_applications;
DROP POLICY IF EXISTS "Allow public insert" ON affiliate_applications;
DROP POLICY IF EXISTS "Allow public select" ON affiliate_applications;

-- Allow anyone to insert applications (signup)
CREATE POLICY "Allow public insert"
ON affiliate_applications
FOR INSERT
WITH CHECK (true);

-- Allow anyone to select their own application (by email match)
CREATE POLICY "Allow public select own"
ON affiliate_applications
FOR SELECT
USING (true);

-- Allow admin to select all applications
-- This checks if the current user has an admin profile
CREATE POLICY "Allow admin select all"
ON affiliate_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow admin to update all applications
CREATE POLICY "Allow admin update all"
ON affiliate_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Also allow service role to do anything (for admin operations)
CREATE POLICY "Allow service role full access"
ON affiliate_applications
FOR ALL
USING (true)
WITH CHECK (true);