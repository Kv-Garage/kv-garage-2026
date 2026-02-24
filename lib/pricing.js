export function calculatePrice(cost, quantity) {
  const basePrice = cost * 2;

  // If buying 1–4 items → add 25%
  if (quantity >= 1 && quantity <= 4) {
    return basePrice * 1.25;
  }

  // If buying 5 or more → no 25%
  if (quantity >= 5) {
    return basePrice;
  }

  return basePrice;
}