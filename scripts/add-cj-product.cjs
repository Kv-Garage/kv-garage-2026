/**
 * Add CJ Dropshipping product to main product catalog
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

async function addCJProduct() {
  console.log('📦 Adding CJ Dropshipping product to catalog...\n');

  const CJ_PRODUCT_ID = "1058688770";
  const PRODUCT_NAME = "Women's Soft Leather Flat - New Hot Casual Square Toe Single Shoes For Spring & Autumn";

  try {
    // First, check if product already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('cj_product_id', CJ_PRODUCT_ID)
      .single();

    if (existingProduct) {
      console.log('✅ Product already exists in catalog');
      console.log('   Product ID:', existingProduct.id);
      return;
    }

    console.log('📝 Creating CJ product in database...');

    // Calculate retail price (50% markup from supplier cost)
    const supplierCost = 25.00;
    const retailPrice = supplierCost * 1.5; // 50% markup

    // Insert the product into the products table
    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert({
        name: PRODUCT_NAME,
        price: retailPrice,
        description: "Premium quality leather flats perfect for everyday wear. Soft genuine leather construction with comfortable square toe design. Perfect for spring and autumn wear with versatile styling.",
        category: "Footwear",
        supplier: "cj",
        type: "cj_dropship",
        slug: "womens-soft-leather-flat-cj-1058688770",
        images: ["https://www.dhresource.com/f3/albu/bw/l/30/d67e641e-16aa-4be4-9454-eae599682426.jpg"],
        active: true,
        top_pick: true, // Mark as top pick for visibility
        cj_product_id: CJ_PRODUCT_ID,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('✅ Product successfully added to catalog!');
    console.log('   Product ID:', newProduct.id);
    console.log('   Name:', newProduct.name);
    console.log('   Price:', `$${newProduct.price}`);
    console.log('   Category:', newProduct.category);
    console.log('   URL: /shop/' + newProduct.slug);

    console.log('\n🎉 CJ Dropshipping product is now available in your main store!');
    console.log('   Customers can browse, add to cart, and purchase through your existing checkout flow.');
    console.log('   Orders will be automatically fulfilled through CJ Dropshipping.');

  } catch (error) {
    console.error('❌ Error adding CJ product:', error.message);
    process.exit(1);
  }
}

addCJProduct().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});