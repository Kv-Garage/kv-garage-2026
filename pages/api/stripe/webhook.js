import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { deriveStudentSpendCategory, generateUniqueOrderNumber } from "../../../lib/orderUtils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readBuffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function logWebhookError(eventId, type, error) {
  await supabaseAdmin.from("webhook_logs").insert([
    {
      event_id: eventId,
      type,
      error: error,
    },
  ]);
}

async function maybeTrackStudentSpend({ userId, orderId, items, total }) {
  if (!userId || !orderId) return;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role !== "student") return;

  await supabaseAdmin.from("student_spend").insert([
    {
      user_id: userId,
      order_id: orderId,
      amount: Number(total || 0),
      category: deriveStudentSpendCategory(items),
    },
  ]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(400).json({ error: "Missing Stripe webhook configuration" });
  }

  let event;

  try {
    const rawBody = await readBuffer(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    await logWebhookError(null, "signature_verification", error.message);
    return res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("id,order_number")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (!existingOrder) {
        const orderNumber = await generateUniqueOrderNumber(supabaseAdmin);
        const items = JSON.parse(session.metadata?.items || "[]");
        const total = Number(session.metadata?.total || session.amount_total / 100 || 0);

        // Convert user_id to number if it's a string, or null if invalid
        let userId = null;
        const rawUserId = session.metadata?.user_id || session.client_reference_id;
        if (rawUserId) {
          const numericUserId = Number(rawUserId);
          if (!isNaN(numericUserId) && isFinite(numericUserId)) {
            userId = numericUserId;
          }
        }

        const { data: insertedOrder, error } = await supabaseAdmin.from("orders").insert([
          {
            order_number: orderNumber,
            user_id: userId,
            items,
            total,
            status: "confirmed",
            tracking_number: null,
            stripe_session_id: session.id,
            stripe_event_id: event.id,
            customer_email:
              session.metadata?.customer_email ||
              session.customer_details?.email ||
              session.customer_email ||
              null,
          },
        ]).select("id").single();

        if (error) {
          throw error;
        }

        await maybeTrackStudentSpend({
          userId: userId,
          orderId: insertedOrder?.id,
          items,
          total,
        });

        await stripe.checkout.sessions.update(session.id, {
          metadata: {
            ...(session.metadata || {}),
            order_number: orderNumber,
          },
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    await logWebhookError(event.id, event.type, error.message);
    return res.status(500).json({ error: error.message });
  }
}
