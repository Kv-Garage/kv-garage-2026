import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { type, cartItems } = req.body;
    const origin = req.headers.origin || "http://localhost:3000";

    // Handle individual CTA checkouts
    if (type === "call") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Strategy Call" },
              unit_amount: 5000, // $50
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/success-call`,
        cancel_url: `${origin}/contact`,
      });
      return res.status(200).json({ url: session.url });
    }

    if (type === "course") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Course Access" },
              unit_amount: 12900, // $129
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/success-course`,
        cancel_url: `${origin}/`,
      });
      return res.status(200).json({ url: session.url });
    }

    if (type === "mentorship") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Mentorship Program" },
              unit_amount: 50000, // $500
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/success-mentorship`,
        cancel_url: `${origin}/`,
      });
      return res.status(200).json({ url: session.url });
    }

    if (type === "advisory") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Full Advisory" },
              unit_amount: 100000, // $1000
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/success-advisory`,
        cancel_url: `${origin}/`,
      });
      return res.status(200).json({ url: session.url });
    }

    // Existing cart checkout flow support
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const line_items = cartItems
        .filter((item) => item && item.name && Number(item.price) > 0)
        .map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: Math.round(Number(item.price) * 100),
          },
          quantity: Math.max(1, Number(item.quantity) || 1),
        }));

      if (line_items.length === 0) {
        return res.status(400).json({ error: "Invalid cart items" });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items,
        success_url: `${origin}/success`,
        cancel_url: `${origin}/cart`,
      });

      return res.status(200).json({ url: session.url });
    }

    // Legacy support for old types
    let price = 0;
    let name = "";

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
      name = "Strategy Session";
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

      // ✅ SUCCESS PAGE (after payment)
      success_url: `${origin}/book`,

      // ✅ FIXED CANCEL PAGE (NO MORE 404)
      cancel_url: `${origin}/cancel`,
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}