// 🔥 KV GARAGE PRICING ENGINE (CLIENT-SIDE - MUST MATCH SERVER)

export function resolveMarkupMultiplier({
  role = "retail",
  approved = false,
  markupMultiplier,
}) {
  if (typeof markupMultiplier === "number" && Number.isFinite(markupMultiplier) && markupMultiplier > 1) {
    return markupMultiplier;
  }

  // =========================
  // 🔥 1. ROLE BASE MULTIPLIER (MUST MATCH SERVER)
  // =========================
  let roleMultiplier = 2.0; // default retail (matches server retail_price)

  if (role === "student") {
    roleMultiplier = 1.6; // 20% discount from retail (matches server student_multiplier 0.8)
  }

  if (role === "wholesale") {
    roleMultiplier = approved ? 1.4 : 1.6; // matches server wholesale logic
  }

  return roleMultiplier;
}

export function calculatePrice({
  cost = 0,
  quantity = 1,
  role = "retail",
  approved = false,
  cartTotal = 0,
  markupMultiplier,
}) {
  const roleMultiplier = resolveMarkupMultiplier({
    role,
    approved,
    markupMultiplier,
  });

  // =========================
  // 🔥 2. QUANTITY DISCOUNT (MUST MATCH SERVER)
  // =========================
  let quantityDiscount = 1;

  if (quantity >= 5 && quantity < 10) {
    quantityDiscount = 0.95;
  } else if (quantity >= 10 && quantity < 25) {
    quantityDiscount = 0.9;
  } else if (quantity >= 25) {
    quantityDiscount = 0.85;
  }

  // =========================
  // 🔥 3. CART SPEND DISCOUNT (MUST MATCH SERVER)
  // =========================
  let spendDiscount = 1;

  if (cartTotal >= 100 && cartTotal < 250) {
    spendDiscount = 0.95;
  } else if (cartTotal >= 250 && cartTotal < 500) {
    spendDiscount = 0.9;
  } else if (cartTotal >= 500 && cartTotal < 1000) {
    spendDiscount = 0.85;
  } else if (cartTotal >= 1000) {
    spendDiscount = 0.8;
  }

  // =========================
  // 🔥 FINAL CALCULATION
  // =========================
  const rawPrice =
    cost *
    roleMultiplier *
    quantityDiscount *
    spendDiscount;

  // 🔥 SAFETY FLOOR (protect margin)
  const minimumPrice = cost * 1.2;

  const finalPrice = Math.max(rawPrice, minimumPrice);

  return Number(finalPrice.toFixed(2));
}
