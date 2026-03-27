import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

// Conversion tracking and optimization utilities

export const CONVERSION_EVENTS = {
  PRODUCT_VIEW: 'product_view',
  ADD_TO_CART: 'add_to_cart',
  INITIATE_CHECKOUT: 'initiate_checkout',
  PURCHASE: 'purchase',
  SIGNUP: 'signup',
  EMAIL_SUBSCRIBE: 'email_subscribe',
  BLOG_READ: 'blog_read',
  AFFILIATE_SIGNUP: 'affiliate_signup',
  WISHLIST_ADD: 'wishlist_add',
  SHARE_SOCIAL: 'share_social',
  REVIEW_SUBMIT: 'review_submit'
};

export async function trackConversionEvent(eventType, eventData, userId = null) {
  try {
    const { data, error } = await supabase
      .from('conversion_events')
      .insert({
        event_type: eventType,
        event_data: eventData,
        user_id: userId,
        session_id: getSessionId(),
        page_url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error tracking conversion event:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error tracking conversion event:', err);
    return false;
  }
}

export async function getConversionMetrics(timeframe = '7d') {
  try {
    const { data, error } = await supabase
      .from('conversion_events')
      .select('*')
      .gte('timestamp', getTimeframeStart(timeframe));

    if (error) {
      throw error;
    }

    return calculateConversionMetrics(data || []);
  } catch (err) {
    console.error('Error fetching conversion metrics:', err);
    return getDefaultMetrics();
  }
}

export async function getFunnelAnalysis() {
  try {
    const { data, error } = await supabase
      .from('conversion_events')
      .select('*')
      .in('event_type', [
        CONVERSION_EVENTS.PRODUCT_VIEW,
        CONVERSION_EVENTS.ADD_TO_CART,
        CONVERSION_EVENTS.INITIATE_CHECKOUT,
        CONVERSION_EVENTS.PURCHASE
      ])
      .order('timestamp', { ascending: false })
      .limit(1000);

    if (error) {
      throw error;
    }

    return calculateFunnelMetrics(data || []);
  } catch (err) {
    console.error('Error calculating funnel metrics:', err);
    return getDefaultFunnel();
  }
}

export async function getAbltResults() {
  try {
    const { data, error } = await supabase
      .from('ab_test_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching A/B test results:', err);
    return [];
  }
}

export function getSessionId() {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

export function getVisitorId() {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}

export function trackPageView() {
  const eventData = {
    page_title: document.title,
    page_path: window.location.pathname,
    page_url: window.location.href,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  };

  return trackConversionEvent('page_view', eventData);
}

export function trackProductView(productId, productName, category, price) {
  const eventData = {
    product_id: productId,
    product_name: productName,
    category: category,
    price: price,
    currency: 'USD'
  };

  return trackConversionEvent(CONVERSION_EVENTS.PRODUCT_VIEW, eventData);
}

export function trackAddToCart(productId, productName, quantity, price) {
  const eventData = {
    product_id: productId,
    product_name: productName,
    quantity: quantity,
    price: price,
    currency: 'USD'
  };

  return trackConversionEvent(CONVERSION_EVENTS.ADD_TO_CART, eventData);
}

export function trackPurchase(orderId, total, currency = 'USD', items = []) {
  const eventData = {
    order_id: orderId,
    total: total,
    currency: currency,
    items: items
  };

  return trackConversionEvent(CONVERSION_EVENTS.PURCHASE, eventData);
}

export function trackEmailSubscribe(email, source = 'newsletter') {
  const eventData = {
    email: email,
    source: source
  };

  return trackConversionEvent(CONVERSION_EVENTS.EMAIL_SUBSCRIBE, eventData);
}

export function trackSignup(userType = 'customer') {
  const eventData = {
    user_type: userType
  };

  return trackConversionEvent(CONVERSION_EVENTS.SIGNUP, eventData);
}

export function trackAffiliateSignup() {
  return trackConversionEvent(CONVERSION_EVENTS.AFFILIATE_SIGNUP, {});
}

export function trackBlogRead(postId, postTitle, readingTime) {
  const eventData = {
    post_id: postId,
    post_title: postTitle,
    reading_time: readingTime
  };

  return trackConversionEvent(CONVERSION_EVENTS.BLOG_READ, eventData);
}

export function trackWishlistAdd(productId) {
  const eventData = {
    product_id: productId
  };

  return trackConversionEvent(CONVERSION_EVENTS.WISHLIST_ADD, eventData);
}

export function trackSocialShare(platform, url, title) {
  const eventData = {
    platform: platform,
    url: url,
    title: title
  };

  return trackConversionEvent(CONVERSION_EVENTS.SHARE_SOCIAL, eventData);
}

export function trackReviewSubmit(productId, rating) {
  const eventData = {
    product_id: productId,
    rating: rating
  };

  return trackConversionEvent(CONVERSION_EVENTS.REVIEW_SUBMIT, eventData);
}

// A/B Testing Functions
export function getVariantForUser(testName, variants = ['A', 'B']) {
  const userId = getVisitorId();
  const testKey = `ab_test_${testName}`;
  
  // Check if user already has a variant assigned
  let assignedVariant = localStorage.getItem(testKey);
  
  if (!assignedVariant) {
    // Assign variant based on user ID hash
    const hash = hashCode(userId);
    const variantIndex = hash % variants.length;
    assignedVariant = variants[variantIndex];
    localStorage.setItem(testKey, assignedVariant);
  }
  
  return assignedVariant;
}

export function recordConversionForTest(testName, variant, conversionType, value = 1) {
  const eventData = {
    test_name: testName,
    variant: variant,
    conversion_type: conversionType,
    value: value
  };

  return trackConversionEvent('ab_test_conversion', eventData);
}

export function recordPageViewForTest(testName, variant) {
  const eventData = {
    test_name: testName,
    variant: variant
  };

  return trackConversionEvent('ab_test_page_view', eventData);
}

// Heatmap and Engagement Tracking
export function trackClick(elementType, elementId, position) {
  const eventData = {
    element_type: elementType,
    element_id: elementId,
    position: position,
    viewport_size: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };

  return trackConversionEvent('click', eventData);
}

export function trackScroll(depth) {
  const eventData = {
    scroll_depth: depth,
    max_scroll: Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
  };

  return trackConversionEvent('scroll', eventData);
}

export function trackTimeOnPage(startTime, endTime) {
  const eventData = {
    time_on_page: endTime - startTime,
    page_url: window.location.href
  };

  return trackConversionEvent('time_on_page', eventData);
}

// Conversion Optimization Helpers
export function calculateConversionRate(events, fromEvent, toEvent) {
  const fromCount = events.filter(e => e.event_type === fromEvent).length;
  const toCount = events.filter(e => e.event_type === toEvent).length;
  
  if (fromCount === 0) return 0;
  return (toCount / fromCount) * 100;
}

export function calculateCartAbandonmentRate(events) {
  const addToCartCount = events.filter(e => e.event_type === CONVERSION_EVENTS.ADD_TO_CART).length;
  const checkoutCount = events.filter(e => e.event_type === CONVERSION_EVENTS.INITIATE_CHECKOUT).length;
  const purchaseCount = events.filter(e => e.event_type === CONVERSION_EVENTS.PURCHASE).length;
  
  if (addToCartCount === 0) return 0;
  
  const checkoutAbandonment = ((addToCartCount - checkoutCount) / addToCartCount) * 100;
  const purchaseAbandonment = ((checkoutCount - purchaseCount) / checkoutCount) * 100;
  
  return {
    checkout_abandonment: checkoutAbandonment,
    purchase_abandonment: purchaseAbandonment,
    overall_abandonment: ((addToCartCount - purchaseCount) / addToCartCount) * 100
  };
}

export function calculateAverageOrderValue(events) {
  const purchases = events.filter(e => e.event_type === CONVERSION_EVENTS.PURCHASE);
  if (purchases.length === 0) return 0;
  
  const totalValue = purchases.reduce((sum, event) => sum + (event.event_data.total || 0), 0);
  return totalValue / purchases.length;
}

export function calculateCustomerLifetimeValue(events, userId) {
  const userPurchases = events.filter(e => 
    e.event_type === CONVERSION_EVENTS.PURCHASE && 
    (e.user_id === userId || e.event_data.user_id === userId)
  );
  
  if (userPurchases.length === 0) return 0;
  
  const totalValue = userPurchases.reduce((sum, event) => sum + (event.event_data.total || 0), 0);
  return totalValue;
}

// Admin Functions
export async function getConversionReport(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('conversion_events')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (error) {
      throw error;
    }

    return {
      events: data || [],
      metrics: calculateConversionMetrics(data || []),
      funnel: calculateFunnelMetrics(data || [])
    };
  } catch (err) {
    console.error('Error generating conversion report:', err);
    return { events: [], metrics: getDefaultMetrics(), funnel: getDefaultFunnel() };
  }
}

export async function createABTest(testData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('ab_tests')
      .insert(testData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error creating A/B test:', err);
    return { success: false, error: err.message };
  }
}

export async function updateABTestResults(testId, results) {
  try {
    const { data, error } = await supabaseAdmin
      .from('ab_tests')
      .update({ results: results, updated_at: new Date().toISOString() })
      .eq('id', testId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error updating A/B test results:', err);
    return { success: false, error: err.message };
  }
}

// Helper Functions
function getTimeframeStart(timeframe) {
  const now = new Date();
  switch (timeframe) {
    case '1d':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

function calculateConversionMetrics(events) {
  const totalEvents = events.length;
  const uniqueVisitors = new Set(events.map(e => e.user_id || e.session_id)).size;
  
  const productViews = events.filter(e => e.event_type === CONVERSION_EVENTS.PRODUCT_VIEW).length;
  const addToCarts = events.filter(e => e.event_type === CONVERSION_EVENTS.ADD_TO_CART).length;
  const checkouts = events.filter(e => e.event_type === CONVERSION_EVENTS.INITIATE_CHECKOUT).length;
  const purchases = events.filter(e => e.event_type === CONVERSION_EVENTS.PURCHASE).length;
  
  const addToCartRate = productViews > 0 ? (addToCarts / productViews) * 100 : 0;
  const checkoutRate = addToCarts > 0 ? (checkouts / addToCarts) * 100 : 0;
  const purchaseRate = checkouts > 0 ? (purchases / checkouts) * 100 : 0;
  const overallConversionRate = productViews > 0 ? (purchases / productViews) * 100 : 0;
  
  const aov = calculateAverageOrderValue(events);
  
  return {
    total_events: totalEvents,
    unique_visitors: uniqueVisitors,
    product_views: productViews,
    add_to_carts: addToCarts,
    checkouts: checkouts,
    purchases: purchases,
    add_to_cart_rate: addToCartRate,
    checkout_rate: checkoutRate,
    purchase_rate: purchaseRate,
    overall_conversion_rate: overallConversionRate,
    average_order_value: aov
  };
}

function calculateFunnelMetrics(events) {
  const productViews = events.filter(e => e.event_type === CONVERSION_EVENTS.PRODUCT_VIEW).length;
  const addToCarts = events.filter(e => e.event_type === CONVERSION_EVENTS.ADD_TO_CART).length;
  const checkouts = events.filter(e => e.event_type === CONVERSION_EVENTS.INITIATE_CHECKOUT).length;
  const purchases = events.filter(e => e.event_type === CONVERSION_EVENTS.PURCHASE).length;
  
  return {
    steps: [
      { name: 'Product Views', count: productViews, conversion_rate: 100 },
      { name: 'Add to Cart', count: addToCarts, conversion_rate: productViews > 0 ? (addToCarts / productViews) * 100 : 0 },
      { name: 'Checkout Initiated', count: checkouts, conversion_rate: addToCarts > 0 ? (checkouts / addToCarts) * 100 : 0 },
      { name: 'Purchases', count: purchases, conversion_rate: checkouts > 0 ? (purchases / checkouts) * 100 : 0 }
    ],
    abandonment_rates: calculateCartAbandonmentRate(events)
  };
}

function getDefaultMetrics() {
  return {
    total_events: 0,
    unique_visitors: 0,
    product_views: 0,
    add_to_carts: 0,
    checkouts: 0,
    purchases: 0,
    add_to_cart_rate: 0,
    checkout_rate: 0,
    purchase_rate: 0,
    overall_conversion_rate: 0,
    average_order_value: 0
  };
}

function getDefaultFunnel() {
  return {
    steps: [
      { name: 'Product Views', count: 0, conversion_rate: 100 },
      { name: 'Add to Cart', count: 0, conversion_rate: 0 },
      { name: 'Checkout Initiated', count: 0, conversion_rate: 0 },
      { name: 'Purchases', count: 0, conversion_rate: 0 }
    ],
    abandonment_rates: {
      checkout_abandonment: 0,
      purchase_abandonment: 0,
      overall_abandonment: 0
    }
  };
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}