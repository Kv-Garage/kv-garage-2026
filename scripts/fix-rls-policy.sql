-- Complete fix for traffic_events RLS policies
-- Run this in Supabase SQL Editor

-- First, let's check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'traffic_events';

-- Drop ALL existing policies on traffic_events
DROP POLICY IF EXISTS "Allow insert for tracking" ON traffic_events;
DROP POLICY IF EXISTS "Allow anonymous inserts for tracking" ON traffic_events;
DROP POLICY IF EXISTS "Authenticated users can read events" ON traffic_events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON traffic_events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON traffic_events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON traffic_events;

-- Disable RLS entirely on this table (simplest solution for tracking)
ALTER TABLE traffic_events DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled but allow anonymous inserts, use this instead:
-- Comment out the DISABLE line above and uncomment these:
/*
ALTER TABLE traffic_events ENABLE ROW LEVEL SECURITY;

-- Policy for anyone to insert
CREATE POLICY "Allow all inserts" ON traffic_events
  FOR INSERT 
  WITH CHECK (true);

-- Policy for authenticated users to read
CREATE POLICY "Allow authenticated read" ON traffic_events
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy for authenticated users to update
CREATE POLICY "Allow authenticated update" ON traffic_events
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON traffic_events
  FOR DELETE 
  USING (auth.role() = 'authenticated');
*/