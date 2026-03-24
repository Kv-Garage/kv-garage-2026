require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const updateWatchDescription = async () => {
  const htmlContent = `<h2>Luxury Moissanite Iced Out Watch</h2>

<p>
This moissanite watch showcases an exquisite design featuring a fully iced-out bezel 
with precision-set stones that deliver maximum brilliance and shine. Built for statement wear, 
this timepiece is perfect for formal events, luxury styling, and high-end street fashion.
</p>

<h3>Premium Build Quality</h3>
<ul>
  <li>High-grade stainless steel construction</li>
  <li>Scratch-resistant sapphire crystal glass</li>
  <li>Hand-set moissanite stones with honeycomb inlay</li>
  <li>Durable, long-lasting shine and structure</li>
</ul>

<h3>Customization Available</h3>
<p>
We offer customization options for those looking to create a unique piece. 
Contact us directly for personalized designs and bulk orders.
</p>

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

<p>
We focus on quality over cheap pricing. Every piece is crafted to meet high standards.
Contact us anytime for support or bulk inquiries.
</p>`;

  try {
    console.log('🔄 Updating kv-ct-001 product description...');

    const { data, error } = await supabase
      .from('products')
      .update({ description: htmlContent })
      .eq('slug', 'kv-ct-001')
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating product:', error);
      return;
    }

    console.log('✅ Product updated successfully!');
    console.log('📋 Product details:', {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description_length: data.description.length,
      description_preview: data.description.substring(0, 100) + '...'
    });

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
};

// Run the update
updateWatchDescription();
