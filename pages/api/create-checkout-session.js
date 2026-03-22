import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { type } = req.body;

    let price = 0;
    let name = "";

    // 🔥 PRODUCT MAP
    if (type === "course") {
      price = 12900;
      name = "4 Week Course";
    }

    if (type === "mentorship") {
      price = 50000;
      name = "Mentorship Program";
    }

    if (type === "full") {
      price = 100000;
      name = "Full Advisory";
    }

    if (type === "call") {
      price = 5000;
      name = "Qualification Call";
    }

    if (!price) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],

      // 🔥 THIS IS THE KEY FIX
      success_url: "http://localhost:3000/book",
      cancel_url: "http://localhost:3000/academy",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}