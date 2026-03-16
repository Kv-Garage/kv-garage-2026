 import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    const { session_id } = req.query;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: "Stripe secret key missing in production",
      });
    }

    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return res.status(200).json(session);
  } catch (err) {
    console.error("GET SESSION ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}