/**
 * Shopify Checkout API
 * Creates checkout sessions for Shopify products using the Storefront API
 */

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'kv-garage-2.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

/**
 * Fetch data from Shopify Storefront API
 */
async function shopifyFetch(query, variables = {}) {
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront Token is missing');
  }

  const response = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API Error: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error('Shopify GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}

/**
 * Create a cart in Shopify
 */
async function createShopifyCart(lineItems) {
  const query = `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          createdAt
          updatedAt
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          checkoutUrl
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { input: { lines: lineItems } });
  return data?.cartCreate?.cart;
}

/**
 * Add items to an existing Shopify cart
 */
async function addToShopifyCart(cartId, lineItems) {
  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          checkoutUrl
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { cartId, lines: lineItems });
  return data?.cartLinesAdd?.cart;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cartItems, customerEmail, customerName } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'No cart items provided' });
    }

    // Separate Shopify products from regular products
    const shopifyItems = cartItems.filter(item => 
      item.shopifyId || 
      (item.id && typeof item.id === 'string' && item.id.startsWith('shopify_'))
    );
    const regularItems = cartItems.filter(item => !shopifyItems.includes(item));

    console.log(`🛒 Checkout: ${shopifyItems.length} Shopify items, ${regularItems.length} regular items`);

    // If there are only regular items, redirect to regular checkout
    if (shopifyItems.length === 0) {
      return res.status(400).json({ 
        error: 'No Shopify products in cart - all items appear to be regular database products',
        redirect: '/api/create-checkout-session',
        cartItems: cartItems.length,
        shopifyItems: shopifyItems.length,
        regularItems: regularItems.length,
      });
    }

    // Create Shopify cart with Shopify products
    const shopifyLineItems = shopifyItems.map(item => {
      // CRITICAL: Must use Variant ID, not Product ID
      // Try multiple sources for variantId
      const variantId = item.shopifyVariantId 
        || item.variantId 
        || (item.variants && item.variants.length > 0 ? item.variants[0].id : null);
      
      console.log('🔍 Processing item:', {
        name: item.name,
        shopifyVariantId: item.shopifyVariantId,
        variantId: item.variantId,
        variants: item.variants?.slice(0, 1),
        shopifyId: item.shopifyId,
        finalVariantId: variantId
      });
      
      if (!variantId) {
        console.error('❌ No variantId found for item:', item.name, item);
        throw new Error(`Product "${item.name}" is missing a variant ID. Cannot add to cart.`);
      }
      
      return {
        merchandiseId: variantId,
        quantity: item.quantity || 1,
      };
    });

    console.log('📦 Creating Shopify cart with items:', shopifyLineItems);

    const cart = await createShopifyCart(shopifyLineItems);

    if (!cart) {
      throw new Error('Failed to create Shopify cart');
    }

    console.log('✅ Shopify cart created:', cart.id);
    console.log('🔗 Checkout URL:', cart.checkoutUrl);

    // If there are also regular items, we need to handle them separately
    // For now, we'll return the Shopify checkout URL and note that regular items need separate handling
    if (regularItems.length > 0) {
      return res.status(200).json({
        url: cart.checkoutUrl,
        shopifyCartId: cart.id,
        regularItemsCount: regularItems.length,
        message: 'Shopify products will be checked out. Regular products will need a separate checkout.',
        shopifyItems: shopifyItems.length,
      });
    }

    return res.status(200).json({
      url: cart.checkoutUrl,
      shopifyCartId: cart.id,
      total: cart.cost?.totalAmount?.amount || 0,
      currency: cart.cost?.totalAmount?.currencyCode || 'USD',
      items: cart.lines?.edges?.map(edge => ({
        id: edge.node.id,
        title: edge.node.merchandise?.product?.title,
        variant: edge.node.merchandise?.title,
        quantity: edge.node.quantity,
        price: edge.node.merchandise?.price?.amount,
      })) || [],
    });

  } catch (error) {
    console.error('💥 Shopify Checkout Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create Shopify checkout',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}