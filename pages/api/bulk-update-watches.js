import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    const htmlContent = `<h2>Luxury Moissanite Iced Out Watch</h2>

<p>
This moissanite watch showcases an exquisite fully iced-out design with precision-set stones 
that deliver maximum brilliance and shine. Built for statement wear, this timepiece is perfect 
for formal events, luxury styling, and high-end street fashion.
</p>

<h3>Premium Build Quality</h3>
<ul>
  <li>High-grade stainless steel construction</li>
  <li>Scratch-resistant sapphire crystal glass</li>
  <li>Hand-set moissanite stones with honeycomb setting</li>
  <li>Durable, long-lasting shine and structure</li>
</ul>

<h3>Certified Moissanite Stones</h3>
<ul>
  <li>GRA certified moissanite stones</li>
  <li>Passes diamond tester</li>
  <li>Exceptional brilliance and fire</li>
  <li>Individually set for maximum shine</li>
</ul>

<h3>Specifications</h3>
<ul>
  <li><strong>Movement:</strong> Mechanical Automatic</li>
  <li><strong>Material:</strong> Stainless Steel</li>
  <li><strong>Glass:</strong> Sapphire Crystal</li>
  <li><strong>Water Resistance:</strong> 100M</li>
  <li><strong>Clasp:</strong> Folding Buckle</li>
</ul>

<h3>Why Choose This Watch</h3>
<ul>
  <li>GRA certified stones for verified quality</li>
  <li>Luxury appearance without inflated pricing</li>
  <li>Perfect for resale or personal collection</li>
</ul>

<p>
We focus on quality over cheap pricing. Every piece is crafted to meet high standards. 
Contact us for bulk orders or customization.
</p>`;

    console.log('🔄 BULK UPDATING all kv-ct-* products...');
    console.log('📝 HTML content length:', htmlContent.length);

    // Step 1: Find all products with slug starting with "kv-ct-"
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, slug, description')
      .like('slug', 'kv-ct-%');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    if (!products || products.length === 0) {
      console.log('📋 No products found with slug starting with "kv-ct-"');
      return res.status(200).json({
        success: true,
        message: "No products found to update",
        updated_count: 0,
        products: []
      });
    }

    console.log(`📋 Found ${products.length} products to update`);
    products.forEach(p => {
      console.log(`  - ${p.slug} (${p.name}) - Current desc length: ${p.description?.length || 0}`);
    });

    // Step 2: Update all matching products
    const { data: updateResult, error: updateError } = await supabase
      .from('products')
      .update({ description: htmlContent })
      .like('slug', 'kv-ct-%')
      .select('id, name, slug');

    if (updateError) {
      console.error('❌ Error updating products:', updateError);
      return res.status(500).json({ error: updateError.message });
    }

    console.log(`✅ Updated ${updateResult?.length || 0} products`);

    // Step 3: Verify updates
    const { data: verifyProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, name, slug, description')
      .like('slug', 'kv-ct-%');

    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError);
      return res.status(500).json({ error: "Verification failed", details: verifyError });
    }

    console.log('🔍 VERIFICATION RESULTS:');
    verifyProducts.forEach(p => {
      console.log(`  - ${p.slug}: ${p.description?.length || 0} chars (contains HTML: ${p.description?.includes('<h2>') || false})`);
    });

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${updateResult?.length || 0} products`,
      updated_count: updateResult?.length || 0,
      products: verifyProducts?.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description_length: p.description?.length || 0,
        contains_html: p.description?.includes('<h2>') || false
      })) || []
    });

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({ error: err.message });
  }
}
