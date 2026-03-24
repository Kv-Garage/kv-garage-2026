import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .single();

    console.log('DB Test Result:', { data, error });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Database connection working",
      count: data 
    });

  } catch (err) {
    console.error('❌ DB Test Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
