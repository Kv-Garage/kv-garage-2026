import { supabaseAdmin } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("order_number,status,total,created_at")
    .eq("stripe_session_id", session_id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ order: data || null });
}
