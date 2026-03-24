import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    console.log('🔄 Simple update test...');
    
    const htmlContent = '<h2>Test Update</h2><p>This is a test update</p>';

    const { data, error } = await supabase
      .from('products')
      .update({ description: htmlContent })
      .eq('id', 38);

    console.log('Update result:', { data, error });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Verify by reading the product
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('id, name, description')
      .eq('id', 38)
      .single();

    console.log('Verify result:', { verifyData, verifyError });

    return res.status(200).json({ 
      success: true, 
      message: "Product updated",
      updated: data,
      verified: verifyData,
      description_length: verifyData?.description?.length || 0
    });

  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
