/**
 * Verify database connection and check if orders table exists
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔗 Connecting to Supabase...');
console.log('   URL:', supabaseUrl);
console.log('   Key present:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyOrdersTable() {
  console.log('\n🔍 Checking if orders table exists...\n');

  // Try to query the orders table directly
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(1);

  if (error) {
    if (error.code === '42P01') {
      console.log('❌ Orders table does NOT exist');
      console.log('   Error:', error.message);
      console.log('\n📝 To create it, run the SQL in scripts/create-orders-table.sql');
      console.log('   in your Supabase SQL Editor.');
    } else {
      console.log('❌ Error querying orders:', error);
    }
    return false;
  }

  console.log('✅ Orders table exists!');
  
  // Count orders
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📊 Total orders: ${count || 0}`);
  
  if (data && data.length > 0) {
    console.log('\n📋 Sample order:');
    console.log('   ', JSON.stringify(data[0], null, 2));
  } else {
    console.log('\n⚠️  No orders in database yet (this is normal if no purchases have been made)');
  }
  
  return true;
}

verifyOrdersTable().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});