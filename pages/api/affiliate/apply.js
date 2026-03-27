import { submitAffiliateApplication, getAffiliateApplicationByEmail } from "../../../lib/affiliates";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, reason } = req.body;

    // Validate required fields
    if (!name || !email || !reason) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email already has an application
    const existingApplication = await getAffiliateApplicationByEmail(email);

    if (existingApplication) {
      return res.status(400).json({ error: "An application with this email already exists" });
    }

    const result = await submitAffiliateApplication({
      name,
      email,
      reason
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ 
      message: "Application submitted successfully", 
      application: result.data 
    });
  } catch (error) {
    console.error("Error submitting affiliate application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
