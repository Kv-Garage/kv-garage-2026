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

    console.log('🔄 Direct update attempt...');
    console.log('📝 Content length:', htmlContent.length);

    // Try direct update with upsert
    const { data, error } = await supabase
      .from('products')
      .upsert({ 
        id: 38,
        description: htmlContent
      })
      .select()
      .single();

    console.log('🔄 Upsert result:', { data, error });

    if (error) {
      console.error('❌ Upsert error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Verify immediately
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('description')
      .eq('id', 38)
      .single();

    console.log('🔍 Verify result:', { 
      length: verifyData?.description?.length || 0,
      error: verifyError 
    });

    return res.status(200).json({
      success: true,
      message: "Direct update completed",
      updated: data,
      verified_length: verifyData?.description?.length || 0,
      content_preview: verifyData?.description?.substring(0, 100) + '...'
    });

  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
