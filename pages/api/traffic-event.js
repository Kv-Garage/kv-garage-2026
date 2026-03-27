import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { event_type, page, referrer, user_agent, ip_address } = req.body;

    // Validate required fields
    if (!event_type || !page) {
      return res.status(400).json({ error: "Missing required fields: event_type and page" });
    }

    // Get client IP
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    // Create traffic event record
    const { data, error } = await supabase
      .from("traffic_events")
      .insert({
        event_type: event_type,
        page: page,
        referrer: referrer || null,
        user_agent: user_agent || null,
        ip_address: clientIP || null,
        metadata: {
          timestamp: new Date().toISOString(),
          headers: req.headers
        }
      })
      .select()
      .single();

    if (error) {
      console.error("Traffic event insertion error:", error);
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    return res.status(200).json({ 
      message: "Traffic event recorded successfully",
      event_id: data?.id 
    });

  } catch (error) {
    console.error("Traffic event error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}