# Live Analytics Dashboard System Guide

## Overview

The KV Garage analytics system tracks user behavior across the website and displays real-time metrics in the admin dashboard. This guide explains how the system works and how to use it effectively.

## System Architecture

### Components

1. **Tracking API** (`/api/traffic-event`)
   - Receives tracking events from the frontend
   - Stores events in the `traffic_events` Supabase table
   - Returns success/failure status

2. **Analytics Library** (`lib/analytics.js`)
   - Provides helper functions for consistent event tracking
   - Handles event formatting and user data
   - Manages session tracking

3. **Admin Dashboard** (`/admin/analytics`)
   - Displays real-time metrics
   - Shows recent events
   - Updates every 5 seconds with live data

4. **Database** (`traffic_events` table)
   - Stores all tracking events
   - Indexed for performance
   - Secured with Row Level Security (RLS)

## Event Types

The system tracks these key events:

| Event Type | Description | When Triggered |
|------------|-------------|----------------|
| `Active on Site` | User is actively browsing | Page load + every 30 seconds |
| `Page View` | User visited a page | Every page navigation |
| `Viewed Product` | User viewed a product | Product page load |
| `Added to Cart` | User added item to cart | Add to cart button click |
| `Placed Order` | User completed purchase | Success page after payment |
| `Subscribed to Email` | User subscribed to newsletter | Email capture form submission |

## Key Metrics

The dashboard displays these metrics:

### Real-Time Metrics
- **Active Now**: Users active in the last 60 minutes
- **Total Visitors**: Unique visitors (by email or user ID)
- **Total Orders**: Completed orders
- **Total Revenue**: Sum of all order values
- **Email Subs**: Newsletter subscriptions
- **Product Views**: Total product page views
- **Add to Cart**: Items added to cart
- **Conversion Rate**: Orders ÷ Visitors × 100

### Event Breakdown
- Recent events list (last 20 events)
- Event type summary with counts
- Event timestamps and values

## How It Works

### 1. Page Load Tracking

When a user visits any page, the system automatically:
- Tracks a page view event
- Tracks an "active on site" event
- Sets up a heartbeat (every 30 seconds) to keep the user marked as active

**Implementation** (`components/Layout.js`):
```javascript
useEffect(() => {
  if (!router.isReady) return;
  const cleanup = initAnalytics(router.asPath, user);
  return cleanup;
}, [router.isReady, router.asPath, user]);
```

### 2. Product View Tracking

When a user views a product:
- Product ID, name, price, and category are tracked
- Linked to user profile if logged in

**Implementation** (`pages/shop/[slug].js`):
```javascript
useEffect(() => {
  if (!product?.id) return;
  trackProductView(product, user);
}, [product?.id, user]);
```

### 3. Add to Cart Tracking

When a user adds an item to cart:
- Product details, quantity, and price are tracked
- Total value is calculated

**Implementation** (`pages/shop/[slug].js`):
```javascript
const handleAddToCart = () => {
  addToCart(cartItem);
  trackAddToCart(product, quantity, cartItem.price, user);
};
```

### 4. Order Tracking

When a purchase is completed:
- Order details and total value are tracked
- Linked to user profile

**Implementation** (`pages/success.js`):
```javascript
if (orderData?.order?.order_number) {
  await trackPlacedOrder(
    {
      id: orderData.order.id,
      order_number: orderData.order.order_number,
      items: orderData.order.items || [],
    },
    orderValue
  );
}
```

### 5. Email Subscription Tracking

When a user subscribes to the newsletter:
- Email and source are tracked
- Linked to user profile if available

**Implementation** (`components/Layout.js`):
```javascript
const submitEmailCapture = async (event) => {
  // ... validation ...
  await trackEmailSubscription(captureForm.email, "footer", user);
};
```

## Using the Analytics Library

### Basic Usage

```javascript
import { trackEvent, EVENT_TYPES } from '../lib/analytics';

// Track a custom event
await trackEvent(EVENT_TYPES.PAGE_VIEW, { page: '/custom-page' });
```

### Available Functions

```javascript
// Track any event
trackEvent(eventType, properties, profile)

// Track page views
trackPageView(page, user)

// Track active presence
trackActiveOnSite(page, user)

// Track product views
trackProductView(product, user)

// Track add to cart
trackAddToCart(product, quantity, price, user)

// Track orders
trackPlacedOrder(order, value, user)

// Track email subscriptions
trackEmailSubscription(email, source, user)

// Initialize tracking for a page
initAnalytics(page, user) // Returns cleanup function
```

### Event Types Constant

```javascript
import { EVENT_TYPES } from '../lib/analytics';

EVENT_TYPES.ACTIVE_ON_SITE        // 'Active on Site'
EVENT_TYPES.VIEWED_PRODUCT         // 'Viewed Product'
EVENT_TYPES.ADDED_TO_CART          // 'Added to Cart'
EVENT_TYPES.PLACED_ORDER           // 'Placed Order'
EVENT_TYPES.SUBSCRIBED_TO_EMAIL    // 'Subscribed to Email'
EVENT_TYPES.PAGE_VIEW              // 'Page View'
```

## Testing the System

### Manual Test

1. Start your development server:
```bash
npm run dev
```

2. Visit your site and perform actions:
   - Browse pages
   - View products
   - Add items to cart
   - Complete a test purchase (use Stripe test mode)

3. Check the admin dashboard:
   - Visit `/admin/analytics`
   - Watch metrics update in real-time

### Automated Test

Run the test script:
```bash
node scripts/test-analytics.js
```

This will test all event types and verify the API is working correctly.

## Troubleshooting

### No Data Showing

1. **Check API endpoint**: Ensure `/api/traffic-event` is accessible
2. **Check database**: Verify `traffic_events` table exists in Supabase
3. **Check RLS policies**: Ensure policies allow inserts
4. **Check browser console**: Look for tracking errors

### Events Not Tracking

1. **Verify imports**: Ensure analytics functions are imported correctly
2. **Check user object**: Make sure user data is available when needed
3. **Check network**: Verify API calls are succeeding (check Network tab)
4. **Check event types**: Ensure event types match dashboard expectations

### Dashboard Not Updating

1. **Check real-time subscription**: Verify Supabase real-time is enabled
2. **Check polling**: Dashboard updates every 5 seconds automatically
3. **Check live mode**: Ensure live mode is toggled on in the dashboard
4. **Check browser console**: Look for subscription errors

## Database Schema

### traffic_events Table

```sql
CREATE TABLE traffic_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  properties JSONB DEFAULT '{}',
  profile_data JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

- `idx_traffic_events_type`: Fast filtering by event type
- `idx_traffic_events_timestamp`: Fast time-based queries
- `idx_traffic_events_profile`: Fast user profile lookups

### Row Level Security (RLS)

The table has RLS enabled with policies that allow:
- Authenticated users to read events
- Authenticated users to insert events
- Authenticated users to update/delete events (admin only)

## Best Practices

1. **Always use the analytics library** for consistent tracking
2. **Track events as close to the action as possible**
3. **Include relevant properties** with each event
4. **Handle tracking failures gracefully** (don't break user experience)
5. **Test tracking in development** before deploying
6. **Monitor the dashboard regularly** to catch issues early

## Privacy Considerations

- Only track necessary data
- Respect user privacy
- Don't track sensitive information
- Follow GDPR/privacy regulations
- Allow users to opt-out if required

## Future Enhancements

Potential improvements to consider:

1. **Funnel analysis**: Track conversion funnels
2. **User journeys**: Map user paths through the site
3. **A/B testing**: Track experiment results
4. **Custom dashboards**: Create role-specific views
5. **Export functionality**: Export data for external analysis
6. **Alerts**: Notify on significant events or thresholds
7. **Retention tracking**: Track returning users
8. **Revenue attribution**: Link revenue to traffic sources

## Support

If you encounter issues with the analytics system:

1. Check this documentation
2. Review the code in `lib/analytics.js`
3. Check the browser console for errors
4. Verify Supabase connection and permissions
5. Test with the automated test script

---

**Last Updated**: March 30, 2026
**Version**: 1.0.0