// Direct update using fetch to Supabase REST API
const supabaseUrl = 'https://your-project.supabase.co'; // You'll need to fill this in
const supabaseKey = 'your-service-role-key'; // You'll need to fill this in

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

async function updateProduct() {
  try {
    console.log('🔄 Updating product description...');

    const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.38`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ description: htmlContent })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Product updated successfully!');
    console.log('📋 Updated data:', data);

  } catch (error) {
    console.error('❌ Error updating product:', error);
  }
}

console.log('⚠️  Please update supabaseUrl and supabaseKey in this script before running');
console.log('⚠️  Get these values from your .env.local file');
// updateProduct(); // Uncomment after filling in credentials
