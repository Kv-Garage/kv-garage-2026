/**
 * Analytics Tracking Utility
 * Provides consistent event tracking for the live analytics dashboard
 */

// Event types that match the analytics dashboard expectations
export const EVENT_TYPES = {
  ACTIVE_ON_SITE: 'Active on Site',
  VIEWED_PRODUCT: 'Viewed Product',
  ADDED_TO_CART: 'Added to Cart',
  PLACED_ORDER: 'Placed Order',
  SUBSCRIBED_TO_EMAIL: 'Subscribed to Email',
  PAGE_VIEW: 'Page View',
};

/**
 * Track an analytics event
 * @param {string} eventType - The type of event (use EVENT_TYPES constants)
 * @param {Object} properties - Additional event properties
 * @param {Object} profile - User profile data
 * @returns {Promise<Object>} The tracking result
 */
export async function trackEvent(eventType, properties = {}, profile = {}) {
  try {
    const response = await fetch('/api/traffic-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        properties,
        profile,
      }),
    });

    if (!response.ok) {
      console.error(`Analytics tracking failed for ${eventType}:`, await response.text());
      return { success: false, error: 'Tracking failed' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Analytics tracking error for ${eventType}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Track page view with automatic user detection
 * @param {string} page - The page path
 * @param {Object} user - Optional user object from auth
 */
export async function trackPageView(page, user = null) {
  const profile = user
    ? {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    : {};

  await trackEvent(EVENT_TYPES.PAGE_VIEW, { page }, profile);
}

/**
 * Track active site presence (heartbeat)
 * @param {string} page - Current page
 * @param {Object} user - Optional user object from auth
 */
export async function trackActiveOnSite(page, user = null) {
  const profile = user
    ? {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    : {};

  await trackEvent(EVENT_TYPES.ACTIVE_ON_SITE, { page, session_id: getSessionId() }, profile);
}

/**
 * Track product view
 * @param {Object} product - Product object
 * @param {Object} user - Optional user object from auth
 */
export async function trackProductView(product, user = null) {
  const profile = user
    ? {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    : {};

  const properties = {
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    price: product.price,
    category: product.category,
  };

  await trackEvent(EVENT_TYPES.VIEWED_PRODUCT, properties, profile);
}

/**
 * Track add to cart event
 * @param {Object} product - Product object added to cart
 * @param {number} quantity - Quantity added
 * @param {number} price - Price per unit
 * @param {Object} user - Optional user object from auth
 */
export async function trackAddToCart(product, quantity = 1, price = 0, user = null) {
  const profile = user
    ? {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    : {};

  const properties = {
    product_id: product.id,
    product_name: product.name,
    quantity,
    price,
    total: price * quantity,
    category: product.category,
  };

  await trackEvent(EVENT_TYPES.ADDED_TO_CART, properties, profile);
}

/**
 * Track order/placement event
 * @param {Object} order - Order details
 * @param {number} value - Order total value
 * @param {Object} user - Optional user object from auth
 */
export async function trackPlacedOrder(order, value = 0, user = null) {
  const profile = user
    ? {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    : {};

  const properties = {
    order_id: order.id || order.order_id,
    order_number: order.order_number,
    value,
    items: order.items || [],
    payment_method: order.payment_method,
  };

  await trackEvent(EVENT_TYPES.PLACED_ORDER, properties, profile);
}

/**
 * Track email subscription
 * @param {string} email - Email address
 * @param {string} source - Where the subscription came from
 * @param {Object} user - Optional user object from auth
 */
export async function trackEmailSubscription(email, source = 'unknown', user = null) {
  const profile = user
    ? {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    : { email };

  const properties = {
    email,
    source,
  };

  await trackEvent(EVENT_TYPES.SUBSCRIBED_TO_EMAIL, properties, profile);
}

/**
 * Generate a session ID for tracking user sessions
 * @returns {string} Session ID
 */
function getSessionId() {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Initialize analytics tracking for a page
 * Should be called in useEffect on page load
 * @param {string} page - Current page path
 * @param {Object} user - Optional user object from auth
 */
export function initAnalytics(page, user = null) {
  // Track page view
  trackPageView(page, user);
  
  // Track active presence
  trackActiveOnSite(page, user);
  
  // Set up heartbeat to keep "active" status updated
  const heartbeatInterval = setInterval(() => {
    trackActiveOnSite(page, user);
  }, 30000); // Update every 30 seconds
  
  // Clean up on unmount
  return () => clearInterval(heartbeatInterval);
}