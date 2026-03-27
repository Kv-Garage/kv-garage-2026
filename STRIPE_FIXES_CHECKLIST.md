# ⚡ STRIPE AUDIT - QUICK FIXES

## 🔴 CRITICAL (Must Fix Before Production)

### 1. Add Missing Webhook Secret
**File:** `.env.local`  
**Add this line:**
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**How to get it:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → Webhooks
3. Find endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Click endpoint → Signing secret
5. Copy the value starting with `whsec_`

**Why:** Without this, webhook signature verification fails and orders aren't created.

---

## 🟡 HIGH PRIORITY (Before Production)

### 2. Implement Course Email Delivery
**File:** `/pages/success-course.js`  
**Status:** Form exists but doesn't send email

**Option A: Using Resend (Recommended)**
```bash
npm install react-email resend
```

**Update success-course.js:**
```javascript
import { sendCourseAccessEmail } from '../lib/email';

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    await sendCourseAccessEmail({
      email: email,
      courseUrl: process.env.NEXT_PUBLIC_COURSE_URL
    });
    setSubmitted(true);
  } catch (error) {
    console.error('Email failed:', error);
  } finally {
    setLoading(false);
  }
};
```

**Create `/lib/email.js`:**
```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCourseAccessEmail({ email, courseUrl }) {
  return resend.emails.send({
    from: 'noreply@kvgarage.com',
    to: email,
    subject: 'Your KV Garage Course Access Is Ready',
    html: `
      <h1>Welcome to your course!</h1>
      <p><a href="${courseUrl}">Access your course here</a></p>
    `
  });
}
```

**Add to .env.local:**
```bash
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_COURSE_URL=https://your-course-platform.com/courses/kv-garage
```

---

## 🟠 RECOMMENDED (Better Architecture)

### 3. Consolidate Checkout Endpoints

**Currently:** Two endpoints doing similar things
- `/api/create-checkout` (legacy, missing metadata)
- `/api/create-checkout-session` (full-featured, recommended)

**Action:** Update book.js and trading.js to use the modern endpoint

**File:** `/pages/book.js` (Line 21)
```javascript
// OLD:
const res = await fetch("/api/create-checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ type: "call" })
});

// NEW:
const res = await fetch("/api/create-checkout-session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "call",
    customerEmail: currentUser?.email, // Add if available
  })
});
```

**File:** `/pages/trading.js` (Line 16)
```javascript
// Apply same change as book.js
```

---

## ✅ VALIDATION CHECKLIST

### Environment Setup
- [ ] `STRIPE_SECRET_KEY` is set
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- [ ] `STRIPE_WEBHOOK_SECRET` is set (CRITICAL)
- [ ] `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard

### Checkout Flow Testing
- [ ] Can add items to cart
- [ ] Cart checkout works → redirects to Stripe
- [ ] Can pay with test card (4242 4242 4242 4242)
- [ ] Success page shows order number
- [ ] Order exists in Supabase

### Programs Testing
- [ ] Mentorship form → checkout works
- [ ] Mental form submission saves to database
- [ ] Success page shows Calendly
- [ ] Calendly opens in new window

### Webhook Testing
**Use Stripe CLI:**
```bash
# Install Stripe CLI
# Run:
stripe listen --forward-to https://kvgarage.com/api/stripe/webhook

# In another terminal:
stripe trigger payment_intent.succeeded

# Check webhook_logs table for success
```

---

## 📊 METRIC TRACKING

After implementing fixes, monitor these:

```sql
-- Track successful orders
SELECT COUNT(*) as total_orders, 
       COUNT(CASE WHEN status='confirmed' THEN 1 END) as confirmed,
       COUNT(CASE WHEN status='refunded' THEN 1 END) as refunded
FROM orders;

-- Track webhook health
SELECT type, COUNT(*) as count, COUNT(CASE WHEN error IS NOT NULL THEN 1 END) as errors
FROM webhook_logs
WHERE created_at > NOW() - INTERVAL 7 days
GROUP BY type;

-- Conversion funnel
SELECT 
  COUNT(*) as checkout_initiated,
  COUNT(CASE WHEN type='conversion' THEN 1 END) as completed,
  ROUND(100.0 * COUNT(CASE WHEN type='conversion' THEN 1 END) / COUNT(*), 2) as conversion_rate
FROM traffic_events
WHERE page IN ('/cart', '/mentorship', '/success')
AND created_at > NOW() - INTERVAL 30 days;
```

---

## 🚀 DEPLOYMENT STEPS

```bash
# 1. Fix webhook secret
cp .env.local.example .env.local
# Edit and add STRIPE_WEBHOOK_SECRET

# 2. Install email service (if using Resend)
npm install resend

# 3. Update endpoints (if consolidating)
# Edit pages/book.js and pages/trading.js

# 4. Test locally
npm run dev
# Go to https://kvgarage.com/mentorship
# Complete a test checkout

# 5. Deploy
git add .
git commit -m "chore: Stripe audit fixes"
git push origin main

# 6. Post-deployment
# Set STRIPE_WEBHOOK_SECRET in production environment
# Update webhook endpoint URL in Stripe Dashboard
# Test with real test card
# Monitor webhook logs for 24 hours
```

---

## 📞 SUPPORT REFERENCE

### Common Issues

**Problem:** "Missing Stripe webhook configuration"
- **Solution:** Add `STRIPE_WEBHOOK_SECRET` to .env.local and redeploy

**Problem:** Orders not created after payment
- **Solution:** Check webhook_logs table for errors, verify webhook delivery in Stripe Dashboard

**Problem:** "Price mismatch" error
- **Solution:** Server price doesn't match client price. Refresh page, clear cache, try again.

**Problem:** Cart items show "unavailable"
- **Solution:** Check inventory in database, ensures `is_active=true`

---

## 🔗 QUICK LINKS

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Webhook Testing Guide](https://stripe.com/docs/webhooks/test)
- [Resend Email](https://resend.com)
- [Calendly API](https://developer.calendly.com)

---

**Last Updated:** March 26, 2026  
**Status:** Ready for Implementation
