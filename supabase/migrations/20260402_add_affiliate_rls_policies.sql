-- Add RLS policies for affiliate_applications table
-- This ensures the table is properly secured while allowing public submissions

-- Enable RLS on affiliate_applications table
ALTER TABLE affiliate_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can insert affiliate applications" ON affiliate_applications;
DROP POLICY IF EXISTS "Admin can read all affiliate applications" ON affiliate_applications;
DROP POLICY IF EXISTS "Admin can update affiliate applications" ON affiliate_applications;

-- Policy: Anyone (including anonymous users) can insert applications
CREATE POLICY "Public can insert affiliate applications"
ON affiliate_applications
FOR INSERT
WITH CHECK (true);

-- Policy: Only authenticated admin users can read applications
CREATE POLICY "Admin can read all affiliate applications"
ON affiliate_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Only authenticated admin users can update applications
CREATE POLICY "Admin can update affiliate applications"
ON affiliate_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on affiliates table
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Affiliates can read own data" ON affiliates;
DROP POLICY IF EXISTS "Admin can read all affiliates" ON affiliates;
DROP POLICY IF EXISTS "Admin can update affiliates" ON affiliates;

-- Policy: Affiliates can only read their own data
CREATE POLICY "Affiliates can read own data"
ON affiliates
FOR SELECT
USING (auth.uid()::text = id::text);

-- Policy: Admin can read all affiliates
CREATE POLICY "Admin can read all affiliates"
ON affiliates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Admin can update affiliates
CREATE POLICY "Admin can update affiliates"
ON affiliates
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on affiliate_clicks table
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can insert affiliate clicks" ON affiliate_clicks;
DROP POLICY IF EXISTS "Affiliates can read own clicks" ON affiliate_clicks;
DROP POLICY IF EXISTS "Admin can read all affiliate clicks" ON affiliate_clicks;

-- Policy: Anyone can insert clicks (for tracking)
CREATE POLICY "Public can insert affiliate clicks"
ON affiliate_clicks
FOR INSERT
WITH CHECK (true);

-- Policy: Affiliates can read their own clicks
CREATE POLICY "Affiliates can read own clicks"
ON affiliate_clicks
FOR SELECT
USING (auth.uid()::text = affiliate_id::text);

-- Policy: Admin can read all clicks
CREATE POLICY "Admin can read all affiliate clicks"
ON affiliate_clicks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on affiliate_conversions table
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can insert affiliate conversions" ON affiliate_conversions;
DROP POLICY IF EXISTS "Affiliates can read own conversions" ON affiliate_conversions;
DROP POLICY IF EXISTS "Admin can read all affiliate conversions" ON affiliate_conversions;

-- Policy: Only admin/service role can insert conversions
CREATE POLICY "Admin can insert affiliate conversions"
ON affiliate_conversions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Affiliates can read their own conversions
CREATE POLICY "Affiliates can read own conversions"
ON affiliate_conversions
FOR SELECT
USING (auth.uid()::text = affiliate_id::text);

-- Policy: Admin can read all conversions
CREATE POLICY "Admin can read all affiliate conversions"
ON affiliate_conversions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on affiliate_payouts table
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Affiliates can insert own payouts" ON affiliate_payouts;
DROP POLICY IF EXISTS "Affiliates can read own payouts" ON affiliate_payouts;
DROP POLICY IF EXISTS "Admin can read all affiliate payouts" ON affiliate_payouts;
DROP POLICY IF EXISTS "Admin can update affiliate payouts" ON affiliate_payouts;

-- Policy: Affiliates can request payouts for themselves
CREATE POLICY "Affiliates can insert own payouts"
ON affiliate_payouts
FOR INSERT
WITH CHECK (auth.uid()::text = affiliate_id::text);

-- Policy: Affiliates can read their own payouts
CREATE POLICY "Affiliates can read own payouts"
ON affiliate_payouts
FOR SELECT
USING (auth.uid()::text = affiliate_id::text);

-- Policy: Admin can read all payouts
CREATE POLICY "Admin can read all affiliate payouts"
ON affiliate_payouts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Admin can update payouts (mark as paid)
CREATE POLICY "Admin can update affiliate payouts"
ON affiliate_payouts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);