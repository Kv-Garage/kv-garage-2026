/**
 * Shopify Discount Function - Volume & Cart Tier Pricing
 * 
 * This function enforces pricing logic at checkout level, matching the frontend pricing exactly.
 * 
 * PRICING RULES:
 * 
 * CART TIERS (based on total cart value):
 * - $100+ → 5%
 * - $250+ → 10%
 * - $500+ → 15%
 * - $1000+ → 20%
 * 
 * VOLUME TIERS (per product quantity):
 * - 4+ units → 5%
 * - 10+ units → 10%
 * - 25+ units → 15%
 * 
 * LOGIC:
 * - Calculate BOTH cart-level and volume-level discounts
 * - Apply whichever is HIGHER per line item
 * - Do NOT combine or stack discounts
 */

/**
 * Get cart-level discount percentage based on total cart value
 * @param {number} total - Cart subtotal in dollars
 * @returns {number} Discount percentage as decimal (0.05 = 5%)
 */
function getCartDiscount(total) {
  if (total >= 1000) return 0.20;
  if (total >= 500) return 0.15;
  if (total >= 250) return 0.10;
  if (total >= 100) return 0.05;
  return 0;
}

/**
 * Get volume discount percentage based on item quantity
 * @param {number} qty - Quantity of a single product
 * @returns {number} Discount percentage as decimal (0.05 = 5%)
 */
function getVolumeDiscount(qty) {
  if (qty >= 25) return 0.15;
  if (qty >= 10) return 0.10;
  if (qty >= 4) return 0.05;
  return 0;
}

/**
 * Main discount function entry point
 * @param {Object} input - Shopify Functions input object
 * @returns {Object} Discount application result
 */
export default function run(input) {
  // Get cart subtotal
  const cartTotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  const cartDiscount = getCartDiscount(cartTotal);

  const discounts = [];

  // Process each line item in the cart
  for (const line of input.cart.lines) {
    const qty = line.quantity;
    const volumeDiscount = getVolumeDiscount(qty);

    // Apply whichever discount is HIGHER (no stacking)
    const bestDiscount = Math.max(cartDiscount, volumeDiscount);

    if (bestDiscount > 0) {
      discounts.push({
        targets: [
          {
            productVariant: {
              id: line.merchandise.id
            }
          }
        ],
        value: {
          percentage: bestDiscount * 100
        }
      });
    }
  }

  return {
    discounts,
    discountApplicationStrategy: "FIRST"
  };
}