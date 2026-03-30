import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pwkafubmtyeufycnkmpz.supabase.co";
// Use service role key to bypass RLS for tracking
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event_type, properties = {}, profile = {} } = req.body;
    
    // Validate required fields
    if (!event_type) {
      return res.status(400).json({ error: 'Event type is required' });
    }

    // Insert event into traffic_events table
    const { data, error } = await supabase
      .from('traffic_events')
      .insert({
        event_type,
        properties,
        profile_data: profile,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Traffic event insert error:', JSON.stringify(error, null, 2));
      return res.status(500).json({ 
        error: 'Failed to record event',
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    // Return success
    res.status(200).json({ 
      success: true, 
      message: 'Event tracked successfully',
      event_id: data.id 
    });

  } catch (error) {
    console.error('Traffic event handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
