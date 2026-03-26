import { supabaseAdmin } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id = null, page, event_type } = req.body || {};

  if (!page || !event_type) {
    return res.status(400).json({ error: "Missing event payload" });
  }

  const { error } = await supabaseAdmin.from("traffic_events").insert([
    {
      user_id,
      page,
      event_type,
    },
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
