/**
 * Check products table structure
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

async function checkProductsTable() {
  console.log('🔍 Checking products table structure...\n');

  try {
    // Try to get a sample product to see what columns exist
    const { data: sampleProduct, error: sampleError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (sampleError) {
      throw sampleError;
    }

    if (sampleProduct && sampleProduct.length > 0) {
      console.log('✅ Sample product structure:');
      const product = sampleProduct[0];
      Object.keys(product).forEach(key => {
        console.log(`   - ${key}: ${typeof product[key]} (${JSON.stringify(product[key]).slice(0, 50)}...)`);
      });
    } else {
      console.log('⚠️  No products found in database');
    }

    // Check if any products exist
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error counting products:', countError.message);
    } else {
      console.log(`\n📊 Total products in database: ${count || 0}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProductsTable().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});