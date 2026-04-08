import { getAffiliates } from "../../../lib/affiliates";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  // Check if request is from an admin user
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify admin status
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Check if user is admin
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (req.method === "GET") {
    // Get all affiliates
    const { status } = req.query;
    const affiliates = await getAffiliates(status);
    return res.status(200).json(affiliates);
  }

  return res.status(405).json({ error: "Method not allowed" });
}