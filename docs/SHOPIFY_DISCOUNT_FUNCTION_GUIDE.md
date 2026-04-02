# Shopify Discount Function Deployment Guide

## Overview

This guide explains how to deploy the KV Garage Volume Pricing Shopify Function that enforces automatic discounts at checkout level, matching the frontend pricing logic exactly.

## Pricing Rules

### Cart Tiers (based on total cart value):
- $100+ → 5% off
- $250+ → 10% off
- $500+ → 15% off
- $1000+ → 20% off

### Volume Tiers (per product quantity):
- 4+ units → 5% off
- 10+ units → 10% off
- 25+ units → 15% off

### Logic:
- Calculates BOTH cart-level and volume-level discounts
- Applies whichever is HIGHER per line item
- Does NOT combine or stack discounts

## Prerequisites

1. **Shopify CLI installed globally:**
   ```bash
   npm install -g @shopify/cli @shopify/app
   ```

2. **Shopify Partners account** with access to the store

3. **Store on Shopify Plus** (required for Shopify Functions)

## File Structure

```
functions/
└── discount-volume-pricing/
    ├── discount-volume-pricing.js    # Main function code
    ├── shopify.function.extension.toml  # Function configuration
    └── package.json                  # Node.js dependencies
```

## Deployment Steps

### Step 1: Initialize Shopify App (if not already done)

If you don't have a Shopify app set up yet:

```bash
# Navigate to project root
cd /Users/kavionwilson/Desktop/kv-garage

# Initialize Shopify app (follow prompts)
shopify app init --template none
```

### Step 2: Create the Function

```bash
# Navigate to project root
cd /Users/kavionwilson/Desktop/kv-garage

# Create function from template (or use existing files)
shopify app generate function \
  --name "KV Garage Volume Pricing" \
  --type discount \
  --template javascript
```

### Step 3: Copy Function Files

Copy the function files to the correct location:

```bash
# The files should be in:
# extensions/kv-garage-volume-pricing/

# Or update shopify.function.extension.toml to point to functions/ directory
```

### Step 4: Build and Deploy

```bash
# Navigate to project root
cd /Users/kavionwilson/Desktop/kv-garage

# Build the function
shopify app build

# Deploy to Shopify
shopify app deploy
```

### Step 5: Create Discount in Shopify Admin

1. Go to **Shopify Admin → Discounts**
2. Click **Create discount**
3. Select **Automatic discount**
4. Under **Active discounts**, find and select **KV Garage Volume Pricing**
5. Configure:
   - **Discount name**: KV Garage Volume Pricing
   - **Active**: Yes
   - **Start date**: Now
   - **End date**: (leave blank for no end)
6. Click **Save**

## Testing

### Test Cases

| Cart Total | Item Qty | Cart Discount | Volume Discount | Applied Discount |
|------------|----------|---------------|-----------------|------------------|
| $50        | 1        | 0%            | 0%              | 0%               |
| $100       | 1        | 5%            | 0%              | 5%               |
| $250       | 1        | 10%           | 0%              | 10%              |
| $500       | 1        | 15%           | 0%              | 15%              |
| $1000      | 1        | 20%           | 0%              | 20%              |
| $50        | 4        | 0%            | 5%              | 5%               |
| $50        | 10       | 0%            | 10%             | 10%              |
| $50        | 25       | 0%            | 15%             | 15%              |
| $250       | 10       | 10%           | 10%             | 10%              |
| $100       | 25       | 5%            | 15%             | 15%              |

### Test Commands

```bash
# Run function locally for testing
shopify app function run \
  --path functions/discount-volume-pricing \
  --input test-input.json
```

## Troubleshooting

### Function Not Applying

1. Check that the discount is **active** in Shopify Admin
2. Verify the function is **deployed** successfully
3. Ensure no other automatic discounts are conflicting

### Incorrect Discount Amount

1. Verify cart subtotal meets tier threshold
2. Check that quantity thresholds are met for volume discounts
3. Review function logs in Shopify Admin

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .shopify
shopify app build
```

## Function Code Reference

The function is located at `functions/discount-volume-pricing/discount-volume-pricing.js`:

```javascript
function getCartDiscount(total) {
  if (total >= 1000) return 0.20;
  if (total >= 500) return 0.15;
  if (total >= 250) return 0.10;
  if (total >= 100) return 0.05;
  return 0;
}

function getVolumeDiscount(qty) {
  if (qty >= 25) return 0.15;
  if (qty >= 10) return 0.10;
  if (qty >= 4) return 0.05;
  return 0;
}

export default function run(input) {
  const cartTotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  const cartDiscount = getCartDiscount(cartTotal);
  const discounts = [];

  for (const line of input.cart.lines) {
    const qty = line.quantity;
    const volumeDiscount = getVolumeDiscount(qty);
    const bestDiscount = Math.max(cartDiscount, volumeDiscount);

    if (bestDiscount > 0) {
      discounts.push({
        targets: [{ productVariant: { id: line.merchandise.id } }],
        value: { percentage: bestDiscount * 100 }
      });
    }
  }

  return { discounts, discountApplicationStrategy: "FIRST" };
}
```

## Support

For issues with Shopify Functions:
- [Shopify Functions Documentation](https://shopify.dev/docs/api/functions)
- [Shopify Community Forums](https://community.shopify.com/)