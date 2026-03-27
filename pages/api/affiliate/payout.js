import { createPayoutRequest } from "../../../lib/affiliates";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { affiliateId, amount, paymentMethod, paymentDetails } = req.body;

    // Validate required fields
    if (!affiliateId || !amount || !paymentMethod || !paymentDetails) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate amount
    if (amount < 10) {
      return res.status(400).json({ error: "Minimum payout amount is $10" });
    }

    const result = await createPayoutRequest(affiliateId, amount, paymentMethod, paymentDetails);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ 
      message: "Payout request submitted successfully", 
      payout: result.data 
    });
  } catch (error) {
    console.error("Error creating payout request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}