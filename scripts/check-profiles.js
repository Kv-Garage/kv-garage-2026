/**
 * Script to check and fix profiles in Supabase
 * Run this with: node scripts/check-profiles.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfiles() {
  console.log('Checking profiles...\n');

  // Get all auth users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error fetching auth users:', authError.message);
    return;
  }

  console.log(`Found ${authUsers.users.length} auth users\n`);

  for (const user of authUsers.users) {
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.log(`Missing profile for user: ${user.email} (${user.id})`);
      
      // Create the profile
      const { error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          role: user.user_metadata?.role || 'customer',
          approved: true,
        }]);

      if (createError) {
        console.log(`  ❌ Failed to create profile: ${createError.message}`);
      } else {
        console.log(`  ✅ Profile created successfully`);
      }
    } else {
      console.log(`✅ Profile exists for: ${user.email} (role: ${profile.role}, approved: ${profile.approved})`);
    }
  }
}

checkProfiles().catch(console.error);