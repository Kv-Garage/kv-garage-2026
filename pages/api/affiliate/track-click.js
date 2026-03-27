import { trackAffiliateClick } from "../../../lib/affiliates";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { affiliateId, productId } = req.body;

    // Validate required fields
    if (!affiliateId) {
      return res.status(400).json({ error: "Affiliate ID is required" });
    }

    const result = await trackAffiliateClick(affiliateId, productId);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ message: "Click tracked successfully" });
  } catch (error) {
    console.error("Error tracking affiliate click:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}