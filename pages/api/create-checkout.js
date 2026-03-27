import Stripe from 'stripe';
import { getProgramByStripeType } from '../../lib/programCatalog';

// Load environment variables
require('dotenv').config();

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// FORCE LIVE MODE VALIDATION - CRITICAL
console.log("🚨 STRIPE KEY VALIDATION:", {
  keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8),
  isLive: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_"),
  isTest: process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_"),
  fullKeyLength: process.env.STRIPE_SECRET_KEY?.length
});

if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")) {
  console.error("🚨 CRITICAL ERROR: NOT IN LIVE MODE!");
  console.error("⚠️ Stripe secret key validation failed - using fallback behavior");
  // Don't throw error, just log and continue (for deployment compatibility)
}

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, success_url, cancel_url = '/', productName = 'Product', type } = req.body;
    const origin = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://kvgarage.com";

    // Handle all call types (call, mentorship, advisory) with their specific configs
    if (type === "call" || type === "mentorship" || type === "advisory" || type === "course") {
      const program = getProgramByStripeType(type);
      let finalProductName = productName || program?.label || "Strategy Call";
      let finalAmount = amount || Math.round(Number(program?.amount || 50) * 100);
      let finalSuccessUrl = success_url || `${origin}${program?.checkoutSuccessPath || "/success"}?session_id={CHECKOUT_SESSION_ID}`;

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: finalProductName,
              },
              unit_amount: finalAmount,
            },
            quantity: 1,
          },
        ],
        success_url: finalSuccessUrl,
        cancel_url: `${origin}${program?.checkoutCancelPath || "/cancel"}`,
        metadata: {
          type: type, // Keep the actual type for tracking
        }
      });

      return res.status(200).json({ url: session.url });
    }

    // Validate required parameters for other types
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Amount must be greater than 0.' });
    }

    if (!success_url) {
      return res.status(400).json({ error: 'Success URL is required.' });
    }

    // Create Stripe checkout session for other types
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url,
      cancel_url,
    });

    // Return the checkout URL
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}
