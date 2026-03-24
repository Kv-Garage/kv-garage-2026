import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const htmlContent = `<h2>Luxury Moissanite Iced Out Watch</h2>

<p>This moissanite watch showcases an exquisite design featuring a fully iced-out bezel with precision-set stones that deliver maximum brilliance and shine. Built for statement wear, this timepiece is perfect for formal events, luxury styling, and high-end street fashion.</p>

<h3>Premium Build Quality</h3>
<ul>
<li>High-grade stainless steel construction</li>
<li>Scratch-resistant sapphire crystal glass</li>
<li>Hand-set moissanite stones with honeycomb inlay</li>
<li>Durable, long-lasting shine and structure</li>
</ul>

<h3>Specifications</h3>
<ul>
<li><strong>Style:</strong> Hip Hop / Rock</li>
<li><strong>Movement:</strong> Mechanical Automatic</li>
<li><strong>Dial Shape:</strong> Square</li>
<li><strong>Band Material:</strong> Stainless Steel</li>
<li><strong>Water Resistance:</strong> 100M</li>
</ul>

<h3>Why Choose This Watch</h3>
<ul>
<li>Passes diamond tester (moissanite stones)</li>
<li>Luxury look without inflated pricing</li>
<li>Perfect for resale or personal collection</li>
</ul>`;

  try {
    console.log('🔄 Updating kv-ct-001 product description...');
    console.log('📝 New content length:', htmlContent.length);
    console.log('📝 New content preview:', htmlContent.substring(0, 100) + '...');

    // First, let's find the product
    const { data: existingProduct, error: findError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', 'kv-ct-001')
      .single();

    console.log('🔍 Find result:', { existingProduct, findError });
    console.log('📏 Old description length:', existingProduct?.description?.length || 0);

    if (findError || !existingProduct) {
      console.error('❌ Product not found with slug: kv-ct-001');
      return res.status(404).json({ error: "Product not found", details: findError });
    }

    // Now update it using the exact ID with force update
    const { data, error } = await supabase
      .from('products')
      .update({ description: htmlContent })
      .eq('id', 38)
      .select();

    console.log('🔄 Update result:', { data, error });

    if (error) {
      console.error('❌ Error updating product:', error);
      return res.status(500).json({ error: error.message });
    }

    // Verify by reading the product
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('id, name, description')
      .eq('id', 38)
      .single();

    if (verifyError) {
      console.error('❌ Error verifying product:', verifyError);
      return res.status(500).json({ error: verifyError.message });
    }

    console.log('✅ Product updated successfully!');
    console.log('📋 Product details:', {
      id: verifyData.id,
      name: verifyData.name,
      description_length: verifyData.description.length,
      description_preview: verifyData.description.substring(0, 100) + '...'
    });

    return res.status(200).json({
      success: true,
      message: "Product description updated successfully",
      product: {
        id: verifyData.id,
        name: verifyData.name,
        description_length: verifyData.description.length
      }
    });

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({ error: err.message });
  }
}
