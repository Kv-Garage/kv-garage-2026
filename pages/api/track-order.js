/**
 * Track Order API
 * Fetches order status from Shopify Storefront API
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderNumber, email } = req.body;

    if (!orderNumber || !email) {
      return res.status(400).json({ error: 'Order number and email are required' });
    }

    // Query Shopify for orders by customer email
    const query = `
      query GetCustomerOrders($email: String!, $first: Int!) {
        customerByEmailAddress(email: $email) {
          id
          displayName
          orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
            edges {
              node {
                id
                name
                orderNumber
                processedAt
                fulfillmentStatus
                financialStatus
                totalPrice {
                  amount
                  currencyCode
                }
                shippingAddress {
                  name
                  address1
                  city
                  province
                  country
                  zip
                }
                fulfillmentOrders(first: 10) {
                  edges {
                    node {
                      id
                      status
                      assignedLocation {
                        name
                      }
                      fulfillmentServiceHandle
                      lineItems(first: 10) {
                        edges {
                          node {
                            title
                            quantity
                            variant {
                              title
                              sku
                            }
                          }
                        }
                      }
                      assignedFulfillmentOrders {
                        edges {
                          node {
                            id
                            fulfillmentOrders {
                              edges {
                                node {
                                  id
                                  status
                                  trackingInfo(first: 10) {
                                    edges {
                                      node {
                                        trackingCompany
                                        trackingNumber
                                        trackingUrl
                                        trackingNumbers
                                        trackingUrls
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                lineItems(first: 50) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        title
                        sku
                        image {
                          url
                        }
                      }
                      originalUnitPrice {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await shopifyFetch(query, { email, first: 20 });

    if (!data?.customerByEmailAddress) {
      return res.status(404).json({ error: 'No customer found with this email address' });
    }

    const customer = data.customerByEmailAddress;
    const orders = customer.orders?.edges?.map(edge => edge.node) || [];

    // Find the specific order by order number
    const order = orders.find(o => 
      o.orderNumber === orderNumber || 
      o.name === orderNumber ||
      o.id.includes(orderNumber)
    );

    if (!order) {
      // If no specific order found, return all orders for this customer
      return res.status(200).json({
        customer: {
          name: customer.displayName,
          email: email,
        },
        orders: orders.map(o => formatOrder(o)),
        message: 'No order found with that order number. Showing all orders for this email.'
      });
    }

    return res.status(200).json({
      customer: {
        name: customer.displayName,
        email: email,
      },
      order: formatOrder(order),
    });

  } catch (error) {
    console.error('Track order error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to track order',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

function formatOrder(order) {
  // Map Shopify fulfillment status to our status system
  let status = 'processing';
  if (order.fulfillmentStatus === 'FULFILLED') {
    status = 'delivered';
  } else if (order.fulfillmentStatus === 'PARTIALLY_FULFILLED') {
    status = 'shipped';
  }

  // Extract tracking information
  let trackingNumber = null;
  let trackingUrl = null;
  let trackingCompany = null;

  const fulfillmentOrders = order.fulfillmentOrders?.edges?.map(edge => edge.node) || [];
  for (const fo of fulfillmentOrders) {
    const assignedFO = fo.assignedFulfillmentOrders?.edges?.map(edge => edge.node) || [];
    for (const afo of assignedFO) {
      const trackingInfo = afo.fulfillmentOrders?.edges?.map(edge => edge.node)?.[0]?.trackingInfo?.edges?.map(edge => edge.node) || [];
      if (trackingInfo.length > 0) {
        const ti = trackingInfo[0];
        trackingNumber = ti.trackingNumber || ti.trackingNumbers?.[0];
        trackingUrl = ti.trackingUrl || ti.trackingUrls?.[0];
        trackingCompany = ti.trackingCompany;
        break;
      }
    }
    if (trackingNumber) break;
  }

  return {
    id: order.orderNumber || order.name,
    orderNumber: order.orderNumber,
    name: order.name,
    status,
    financialStatus: order.financialStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    total: parseFloat(order.totalPrice?.amount || 0),
    currency: order.totalPrice?.currencyCode || 'USD',
    createdAt: order.processedAt,
    customerName: order.shippingAddress?.name,
    shippingAddress: order.shippingAddress,
    trackingNumber,
    trackingUrl,
    trackingCompany,
    lineItems: order.lineItems?.edges?.map(edge => ({
      title: edge.node.title,
      quantity: edge.node.quantity,
      variant: edge.node.variant?.title,
      sku: edge.node.variant?.sku,
      image: edge.node.variant?.image?.url,
      price: parseFloat(edge.node.originalUnitPrice?.amount || 0),
    })) || [],
  };
}