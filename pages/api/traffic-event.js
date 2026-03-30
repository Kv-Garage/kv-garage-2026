import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pwkafubmtyeufycnkmpz.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3a2FmdWJtdHlldWZ5Y25rbXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTA5NzQsImV4cCI6MjA4NjU4Njk3NH0.YqmBtvSchzy6wcN1OJ0G_lM6c51BxezBbg8n5TBPZfA";

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
      console.error('Traffic event insert error:', error);
      return res.status(500).json({ error: 'Failed to record event' });
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
