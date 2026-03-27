import { authenticateAffiliate } from "../../../lib/affiliates";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authenticateAffiliate(email, password);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    // Return affiliate data (excluding password hash)
    const { password_hash, ...affiliateData } = result.data;

    res.status(200).json({ 
      message: "Login successful", 
      affiliate: affiliateData 
    });
  } catch (error) {
    console.error("Error during affiliate login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}