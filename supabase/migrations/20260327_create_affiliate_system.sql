-- Create affiliate applications table
CREATE TABLE affiliate_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliates table
CREATE TABLE affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  referral_code TEXT UNIQUE,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_earnings DECIMAL(10,2) DEFAULT 0,
  paid_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate payouts table
CREATE TABLE affiliate_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  payment_method TEXT,
  payment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate clicks table
CREATE TABLE affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  product_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate conversions table
CREATE TABLE affiliate_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  commission_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_affiliate_applications_email ON affiliate_applications(email);
CREATE INDEX idx_affiliate_applications_status ON affiliate_applications(status);
CREATE INDEX idx_affiliates_email ON affiliates(email);
CREATE INDEX idx_affiliates_status ON affiliates(status);
CREATE INDEX idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX idx_affiliate_payouts_affiliate_id ON affiliate_payouts(affiliate_id);
CREATE INDEX idx_affiliate_payouts_status ON affiliate_payouts(status);
CREATE INDEX idx_affiliate_clicks_affiliate_id ON affiliate_clicks(affiliate_id);
CREATE INDEX idx_affiliate_clicks_timestamp ON affiliate_clicks(timestamp);
CREATE INDEX idx_affiliate_conversions_affiliate_id ON affiliate_conversions(affiliate_id);
CREATE INDEX idx_affiliate_conversions_order_id ON affiliate_conversions(order_id);

-- Insert test affiliate account
INSERT INTO affiliates (
  name, 
  email, 
  password_hash, 
  status, 
  referral_code, 
  total_earnings, 
  pending_earnings, 
  paid_earnings
) VALUES (
  'Test Affiliate',
  'testaffiliate@example.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Test1234!
  'approved',
  'TEST123',
  0,
  0,
  0
);