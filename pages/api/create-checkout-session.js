import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      amount,
      quantity,
      cartItems,
      type,
      legalAgreement,
    } = req.body;

    // 🔒 HARD STOP — Legal agreement required
    if (!legalAgreement) {
      return res.status(400).json({
        error: "Legal agreement must be accepted before checkout.",
      });
    }

    // Capture IP Address
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      "Unknown";

    // Capture Browser / Device Info
    const userAgent = req.headers["user-agent"] || "Unknown";

    let line_items = [];

    if (cartItems && Array.isArray(cartItems)) {
      line_items = cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));
    } else {
      line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: quantity,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,

      metadata: {
        type: type || "product",
        legalAgreementAccepted: "true",
        agreementTimestamp: new Date().toISOString(),
        agreementIP: Array.isArray(ip) ? ip[0] : ip,
        agreementUserAgent: userAgent,
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}