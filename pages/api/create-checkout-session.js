import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: "Stripe secret key missing",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const {
      cartItems,
      name,
      amount,
      quantity,
      legalAgreement,
      type,
    } = req.body;

    if (!legalAgreement) {
      return res.status(400).json({
        error: "You must accept terms before checkout",
      });
    }

    let line_items = [];

    // 🔥 CART CHECKOUT (MULTIPLE ITEMS)
    if (cartItems && Array.isArray(cartItems)) {
      line_items = cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity),
      }));
    }

    // 🔥 SINGLE ITEM CHECKOUT (BUY NOW / CALL / COURSE)
    else if (name && amount && quantity) {
      line_items = [
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
      ];
    } else {
      return res.status(400).json({
        error: "Missing checkout data",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items,

      metadata: {
        type: type || "product", // 🔥 THIS CONTROLS CALENDAR LOGIC
      },

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