/**
 * Check if orders exist in the database
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOrders() {
  console.log('🔍 Checking orders in database...\n');

  // Check if orders table exists
  const { data: tables } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public')
    .eq('tablename', 'orders');

  if (!tables || tables.length === 0) {
    console.log('❌ Orders table does not exist');
    return;
  }

  console.log('✅ Orders table exists');

  // Check how many orders exist
  const { count, error: countError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.log('❌ Error counting orders:', countError);
    return;
  }

  console.log(`📊 Total orders in database: ${count || 0}`);

  // Get sample of recent orders
  const { data: recentOrders, error: fetchError } = await supabase
    .from('orders')
    .select('id,stripe_session_id,customer_name,customer_email,total,status,created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (fetchError) {
    console.log('❌ Error fetching orders:', fetchError);
    return;
  }

  if (recentOrders && recentOrders.length > 0) {
    console.log('\n📋 Recent orders:');
    recentOrders.forEach((order, i) => {
      console.log(`\n  ${i + 1}. Order ${order.id}`);
      console.log(`     Customer: ${order.customer_name} (${order.customer_email})`);
      console.log(`     Total: $${order.total}`);
      console.log(`     Status: ${order.status}`);
      console.log(`     Created: ${order.created_at}`);
    });
  } else {
    console.log('\n⚠️  No orders found in database');
    console.log('   Orders will appear here once customers make purchases');
  }

  // Check RLS policies
  const { data: policies } = await supabase
    .from('pg_policies')
    .select('policyname, cmd, roles')
    .eq('tablename', 'orders');

  console.log('\n🔒 RLS Policies on orders table:');
  if (policies && policies.length > 0) {
    policies.forEach(p => {
      console.log(`   - ${p.policyname} (${p.cmd}) for ${p.roles}`);
    });
  } else {
    console.log('   No policies found');
  }
}

checkOrders().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});