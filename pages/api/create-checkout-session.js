import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    console.log("METHOD:", req.method);
    console.log("BODY:", req.body);

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.log("❌ Missing Stripe Secret Key");
      return res.status(500).json({
        error: "Stripe secret key is missing",
      });
    }

    const { name, amount, quantity, legalAgreement } = req.body;

    if (!name || !amount || !quantity) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        error: "Missing required checkout fields",
      });
    }

    if (!legalAgreement) {
      console.log("❌ Legal agreement missing");
      return res.status(400).json({
        error: "Legal agreement must be accepted before checkout.",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name,
            },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: Number(quantity),
        },
      ],
      metadata: {
        type: "call",
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    console.log("✅ Session Created:", session.id);

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("🔥 STRIPE ERROR:", error);
    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}