/**
 * Import KV Garage Camping & Camera Products to Supabase
 * 
 * This script imports all 12 products from the camping-products.json data file
 * into the Supabase products table for display in the shop.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load products from our generated data
const productsDataPath = path.join(__dirname, '..', 'data', 'camping-products.json');
const productsData = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function importProducts() {
  console.log('📦 Importing KV Garage Camping & Camera Products...\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const product of productsData.products) {
    try {
      // Check if product already exists by slug
      const newSlug = slugify(product.title);
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', newSlug)
        .single();

      if (existingProduct) {
        console.log(`⏭️  Skipping: ${product.sku} (already exists)`);
        skipCount++;
        continue;
      }

      // Prepare product data for insertion
      const productData = {
        name: product.title.replace('KVGarage | ', ''),
        slug: slugify(product.title),
        description: product.full_description,
        price: product.price,
        category: product.category,
        images: product.images,
        active: true,
        top_pick: false,
        type: 'camping_gear',
        supplier: 'kv_garage',
        inventory_count: 100, // Default inventory
        cost: product.cost_estimate,
        created_at: new Date().toISOString()
      };

      // Insert product into database
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log(`✅ Added: ${product.sku} - ${product.title.substring(0, 50)}...`);
      successCount++;

    } catch (error) {
      console.error(`❌ Error adding ${product.sku}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary:');
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ⏭️  Skipped (existing): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total processed: ${productsData.products.length}`);
  console.log('='.repeat(50));

  if (successCount > 0) {
    console.log('\n🎉 Products are now available in the shop!');
    console.log('   Visit /shop to see the new inventory.');
  }
}

importProducts().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});