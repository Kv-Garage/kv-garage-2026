import Stripe from "stripe";

export default async function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Missing Stripe key" });
    }

    const { name, amount, quantity, legalAgreement, type } = req.body;

    if (!name || !amount || !quantity) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (!legalAgreement) {
      return res.status(400).json({ error: "Must accept terms" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name },
            unit_amount: Math.round(amount * 100),
          },
          quantity: quantity,
        },
      ],

      // 🔥 CONTROL FLOW HERE
      metadata: {
        type: type || "product",
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}