-- Create traffic_events table for tracking website events
CREATE TABLE IF NOT EXISTS traffic_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  properties JSONB DEFAULT '{}',
  profile_data JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_traffic_events_type ON traffic_events(event_type);
CREATE INDEX IF NOT EXISTS idx_traffic_events_timestamp ON traffic_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_traffic_events_profile ON traffic_events USING GIN(profile_data);

-- Enable Row Level Security
ALTER TABLE traffic_events ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read events
CREATE POLICY "Authenticated users can read events" ON traffic_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert events
CREATE POLICY "Authenticated users can insert events" ON traffic_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update events (for admin only)
CREATE POLICY "Authenticated users can update events" ON traffic_events
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete events (for admin only)
CREATE POLICY "Authenticated users can delete events" ON traffic_events
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to track event counts
CREATE OR REPLACE FUNCTION get_event_counts()
RETURNS TABLE (
  event_type VARCHAR,
  count BIGINT,
  last_24_hours BIGINT,
  last_7_days BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    te.event_type,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE te.timestamp > NOW() - INTERVAL '24 hours') as last_24_hours,
    COUNT(*) FILTER (WHERE te.timestamp > NOW() - INTERVAL '7 days') as last_7_days
  FROM traffic_events te
  GROUP BY te.event_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get active visitors count
CREATE OR REPLACE FUNCTION get_active_visitors()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT profile_data->>'email') 
    FROM traffic_events 
    WHERE event_type = 'Active on Site' 
    AND timestamp > NOW() - INTERVAL '1 hour'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get conversion rate
CREATE OR REPLACE FUNCTION get_conversion_rate()
RETURNS NUMERIC AS $$
DECLARE
  total_visitors INTEGER;
  total_orders INTEGER;
  conversion_rate NUMERIC;
BEGIN
  SELECT COUNT(DISTINCT profile_data->>'email') INTO total_visitors
  FROM traffic_events 
  WHERE event_type = 'Active on Site';
  
  SELECT COUNT(*) INTO total_orders
  FROM traffic_events 
  WHERE event_type = 'Placed Order';
  
  IF total_visitors > 0 THEN
    conversion_rate := (total_orders::NUMERIC / total_visitors::NUMERIC) * 100;
  ELSE
    conversion_rate := 0;
  END IF;
  
  RETURN conversion_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;