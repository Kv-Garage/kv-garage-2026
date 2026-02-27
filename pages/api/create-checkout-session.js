import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    console.log("ENV KEY:", process.env.STRIPE_SECRET_KEY);

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: "Stripe secret key is missing in production",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, amount, quantity, legalAgreement } = req.body;

    if (!legalAgreement) {
      return res.status(400).json({
        error: "Legal agreement must be accepted before checkout.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name },
            unit_amount: Math.round(amount * 100),
          },
          quantity,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("STRIPE ERROR:", error);
    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}