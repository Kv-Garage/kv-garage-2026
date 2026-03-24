import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    const htmlContent = `<h2>Luxury Moissanite Iced Out Watch</h2>

<p>This moissanite watch showcases an exquisite design featuring a fully iced-out bezel with precision-set stones that deliver maximum brilliance and shine. Built for statement wear, this timepiece is perfect for formal events, luxury styling, and high-end street fashion.</p>

<h3>Premium Build Quality</h3>
<ul>
<li>High-grade stainless steel construction</li>
<li>Scratch-resistant sapphire crystal glass</li>
<li>Hand-set moissanite stones with honeycomb inlay</li>
<li>Durable, long-lasting shine and structure</li>
</ul>

<h3>Customization Available</h3>
<p>We offer customization options for those looking to create a unique piece. Contact us directly for personalized designs and bulk orders.</p>

<h3>Specifications</h3>
<ul>
<li><strong>Style:</strong> Hip Hop / Rock</li>
<li><strong>Gender:</strong> Men's</li>
<li><strong>Movement:</strong> Mechanical Automatic</li>
<li><strong>Dial Shape:</strong> Square</li>
<li><strong>Band Material:</strong> Stainless Steel</li>
<li><strong>Glass:</strong> Sapphire Crystal</li>
<li><strong>Water Resistance:</strong> 100M</li>
<li><strong>Clasp Type:</strong> Folding Buckle</li>
</ul>

<h3>Why Choose This Watch</h3>
<ul>
<li>Passes diamond tester (moissanite stones)</li>
<li>Luxury look without inflated pricing</li>
<li>Perfect for resale or personal collection</li>
</ul>

<p>We focus on quality over cheap pricing. Every piece is crafted to meet high standards. Contact us anytime for support or bulk inquiries.</p>`;

    console.log('🔄 FORCE UPDATING kv-ct-001 description...');
    console.log('📝 New content length:', htmlContent.length);

    // Step 1: Get current product
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', 'kv-ct-001')
      .single();

    if (fetchError || !currentProduct) {
      console.error('❌ Could not fetch product:', fetchError);
      return res.status(404).json({ error: "Product not found", details: fetchError });
    }

    console.log('📋 Current description length:', currentProduct.description?.length || 0);
    console.log('📋 Current description:', currentProduct.description);

    // Step 2: Force update
    const { data: updateResult, error: updateError } = await supabase
      .from('products')
      .update({ description: htmlContent })
      .eq('id', currentProduct.id);

    console.log('🔄 Update result:', { updateResult, updateError });

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return res.status(500).json({ error: updateError.message });
    }

    // Step 3: Immediately fetch to verify
    const { data: verifyProduct, error: verifyError } = await supabase
      .from('products')
      .select('id, name, slug, description')
      .eq('id', currentProduct.id)
      .single();

    if (verifyError || !verifyProduct) {
      console.error('❌ Verification failed:', verifyError);
      return res.status(500).json({ error: "Verification failed", details: verifyError });
    }

    // Step 4: Log the description
    console.log('✅ UPDATE COMPLETE - LOGGING DESCRIPTION:');
    console.log('=====================================');
    console.log("DESCRIPTION VALUE:", verifyProduct.description);
    console.log('=====================================');
    console.log('📏 New length:', verifyProduct.description.length);
    console.log('🔍 Contains h2:', verifyProduct.description.includes('<h2>'));
    console.log('🔍 Contains Specifications:', verifyProduct.description.includes('Specifications'));

    return res.status(200).json({
      success: true,
      message: "Product description force updated and verified",
      product: {
        id: verifyProduct.id,
        name: verifyProduct.name,
        slug: verifyProduct.slug,
        description_length: verifyProduct.description.length,
        contains_html: verifyProduct.description.includes('<h2>'),
        description_preview: verifyProduct.description.substring(0, 200) + '...'
      }
    });

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({ error: err.message });
  }
}
