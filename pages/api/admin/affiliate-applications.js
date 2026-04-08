import { getAffiliateApplications, approveAffiliateApplication, rejectAffiliateApplication } from "../../../lib/affiliates";
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
    // Get all affiliate applications
    const { status } = req.query;
    const applications = await getAffiliateApplications(status);
    return res.status(200).json(applications);
  }

  if (req.method === "POST") {
    // Approve or reject an application
    const { applicationId, action, rejectionReason } = req.body;

    if (!applicationId || !action) {
      return res.status(400).json({ error: "Application ID and action are required" });
    }

    if (action === "approve") {
      const result = await approveAffiliateApplication(applicationId);
      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }
      return res.status(200).json({ success: true, data: result });
    } else if (action === "reject") {
      const result = await rejectAffiliateApplication(applicationId, rejectionReason);
      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(400).json({ error: "Invalid action. Use 'approve' or 'reject'" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}