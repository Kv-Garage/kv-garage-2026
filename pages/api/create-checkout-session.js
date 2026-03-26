import Stripe from "stripe";
import { buildOrderItems } from "../../lib/orderUtils";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { getAuthenticatedViewer, getPriceForUser } from "../../lib/serverPricing";
import { getProgramByStripeType } from "../../lib/programCatalog";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { type, cartItems, total, userId = null, customerEmail = null } = req.body;
    const origin = req.headers.origin || "http://localhost:3000";

    // Handle individual CTA checkouts
    const program = getProgramByStripeType(type);

    if (program && type === "call") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: program.label },
              unit_amount: Math.round(program.amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}${program.checkoutSuccessPath}`,
        cancel_url: `${origin}${program.checkoutCancelPath}`,
      });
      return res.status(200).json({ url: session.url });
    }

    if (program && type === "course") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: program.label },
              unit_amount: Math.round(program.amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}${program.checkoutSuccessPath}`,
        cancel_url: `${origin}${program.checkoutCancelPath}`,
      });
      return res.status(200).json({ url: session.url });
    }

    if (program && type === "mentorship") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: program.label },
              unit_amount: Math.round(program.amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}${program.checkoutSuccessPath}`,
        cancel_url: `${origin}${program.checkoutCancelPath}`,
      });
      return res.status(200).json({ url: session.url });
    }

    if (program && type === "advisory") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: program.label },
              unit_amount: Math.round(program.amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}${program.checkoutSuccessPath}`,
        cancel_url: `${origin}${program.checkoutCancelPath}`,
      });
      return res.status(200).json({ url: session.url });
    }

    // Existing cart checkout flow support
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const viewer = await getAuthenticatedViewer(req);
      const validatedCart = [];

      for (const item of cartItems) {
        const { data: product, error: productError } = await supabaseAdmin
          .from("products")
          .select("*")
          .eq("id", item.id)
          .maybeSingle();

        if (productError || !product || product.active === false) {
          return res.status(400).json({ error: `Product unavailable: ${item.name || item.id}` });
        }

        const quantity = Math.max(1, Number(item.quantity) || 1);
        const pricing = await getPriceForUser(product, viewer.role, {
          userId: viewer.userId || userId,
          quantity,
        });

        const serverPrice = Number(pricing.price || 0);
        const clientPrice = Number(item.price || 0);

        if (Math.abs(clientPrice - serverPrice) > 0.009) {
          return res.status(400).json({ error: "Price mismatch — please refresh and try again" });
        }

        validatedCart.push({
          id: product.id,
          name: product.name,
          price: serverPrice,
          quantity,
          image: item.image || product.image || null,
          category: product.category || "General",
          applied_tier: pricing.appliedTier,
        });
      }

      const orderItems = buildOrderItems(validatedCart);
      const orderTotal =
        orderItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);

      const line_items = validatedCart.map((item) => ({
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
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
        client_reference_id: userId || undefined,
        customer_email: customerEmail || undefined,
        metadata: {
          items: JSON.stringify(orderItems),
          total: String(Number(orderTotal.toFixed(2))),
          user_id: userId || "",
          customer_email: customerEmail || "",
          checkout_type: "cart",
          role: viewer.role || "retail",
        },
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
