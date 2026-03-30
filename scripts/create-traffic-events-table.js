/**
 * Script to create the traffic_events table in Supabase
 * Run this if the table doesn't exist
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTable() {
  console.log('🔧 Creating traffic_events table...\n');

  // First, check if table exists
  const { data: tables, error: tablesError } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public')
    .eq('tablename', 'traffic_events');

  if (tablesError) {
    console.error('❌ Error checking tables:', tablesError);
    process.exit(1);
  }

  if (tables && tables.length > 0) {
    console.log('✅ Table traffic_events already exists');
    return;
  }

  // Create the table using raw SQL
  const sql = `
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
    DROP POLICY IF EXISTS "Authenticated users can read events" ON traffic_events;
    CREATE POLICY "Authenticated users can read events" ON traffic_events
      FOR SELECT USING (auth.role() = 'authenticated');

    -- Create policy for inserting events (allow anon for tracking)
    DROP POLICY IF EXISTS "Allow insert for tracking" ON traffic_events;
    CREATE POLICY "Allow insert for tracking" ON traffic_events
      FOR INSERT WITH CHECK (true);

    -- Create policy for authenticated users to update events (for admin only)
    DROP POLICY IF EXISTS "Authenticated users can update events" ON traffic_events;
    CREATE POLICY "Authenticated users can update events" ON traffic_events
      FOR UPDATE USING (auth.role() = 'authenticated');

    -- Create policy for authenticated users to delete events (for admin only)
    DROP POLICY IF EXISTS "Authenticated users can delete events" ON traffic_events;
    CREATE POLICY "Authenticated users can delete events" ON traffic_events
      FOR DELETE USING (auth.role() = 'authenticated');
  `;

  // Execute SQL via Supabase RPC or direct connection
  // Since we can't execute raw SQL via JS client, we'll use a different approach
  console.log('⚠️  Cannot execute raw SQL via JavaScript client');
  console.log('📋 Please run this SQL in your Supabase SQL Editor:\n');
  console.log(sql);
  console.log('\n✅ Or run the migration manually in Supabase dashboard');
}

createTable().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});