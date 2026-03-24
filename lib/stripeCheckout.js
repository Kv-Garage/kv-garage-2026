import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a Stripe checkout session and returns the checkout URL
 * @param {number} amount - Amount in cents (e.g., 5000 for $50.00)
 * @param {string} success_url - URL to redirect to after successful payment
 * @param {string} cancel_url - URL to redirect to if payment is cancelled (optional)
 * @param {string} productName - Name of the product/service (optional)
 * @returns {Promise<string>} - Stripe checkout URL
 */
export async function createCheckoutSession({
  amount,
  success_url,
  cancel_url = '/',
  productName = 'Product'
}) {
  try {
    // Validate required parameters
    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    if (!success_url) {
      throw new Error('Success URL is required');
    }

    // Create Stripe checkout session
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
    return session.url;
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

/**
 * Client-side function to initiate checkout and redirect to Stripe
 * @param {number} amount - Amount in cents
 * @param {string} success_url - Success redirect URL
 * @param {string} cancel_url - Cancel redirect URL (optional)
 * @param {string} productName - Product name (optional)
 */
export async function initiateCheckout({
  amount,
  success_url,
  cancel_url = '/',
  productName = 'Product'
}) {
  try {
    // Call the API endpoint to create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        success_url,
        cancel_url,
        productName
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    
    if (!url) {
      throw new Error('No checkout URL returned');
    }

    // Redirect to Stripe checkout
    window.location.href = url;
  } catch (error) {
    console.error('Checkout initiation failed:', error);
    throw error;
  }
}

/**
 * API route helper for creating checkout sessions
 * Use this in API routes like /api/create-checkout-session
 */
export async function handleCheckoutRequest(req, res) {
  try {
    const { amount, success_url, cancel_url, productName } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!success_url) {
      return res.status(400).json({ error: 'Success URL is required' });
    }

    // Create checkout session
    const checkoutUrl = await createCheckoutSession({
      amount,
      success_url,
      cancel_url,
      productName
    });

    // Return the checkout URL
    res.status(200).json({ url: checkoutUrl });
  } catch (error) {
    console.error('Checkout request failed:', error);
    res.status(500).json({ error: error.message });
  }
}
