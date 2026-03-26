import { supabaseAdmin } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const orderNumber =
    req.method === "POST" ? req.body?.order_number : req.query?.order_number;

  if (!orderNumber) {
    return res.status(400).json({ error: "Missing order_number" });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("order_number,status,tracking_number,created_at")
    .eq("order_number", String(orderNumber).trim().toUpperCase())
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Order not found" });
  }

  return res.status(200).json({ order: data });
}
