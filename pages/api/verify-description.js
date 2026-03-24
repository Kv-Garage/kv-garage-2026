import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    console.log('🔍 Verifying product description...');
    
    // Fetch the product
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, description')
      .eq('slug', 'kv-ct-001')
      .single();

    if (error) {
      console.error('❌ Error fetching product:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('📋 PRODUCT DESCRIPTION:');
    console.log('=====================================');
    console.log(data.description);
    console.log('=====================================');
    console.log('📏 Length:', data.description.length);
    console.log('🔍 Contains h2:', data.description.includes('<h2>'));
    console.log('🔍 Contains Specifications:', data.description.includes('Specifications'));

    return res.status(200).json({
      success: true,
      product: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description_length: data.description.length,
        description_preview: data.description.substring(0, 200) + '...',
        full_description: data.description
      }
    });

  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
