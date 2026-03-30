import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "./supabaseAdmin";

function roundCurrency(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

async function getSitePricingSettings() {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    wholesaleMultiplier: Number(data?.wholesale_discount_multiplier || 0.7),
    studentMultiplier: Number(data?.student_discount_multiplier || 0.8),
  };
}

export async function getAuthenticatedViewer(req) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    return { userId: null, role: "retail", approved: false };
  }

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: authData } = await client.auth.getUser(token);
  const user = authData?.user;

  if (!user?.id) {
    return { userId: null, role: "retail", approved: false };
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role,approved")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    role: profile?.role || "retail",
    approved: Boolean(profile?.approved),
  };
}

export async function getStudentTierDiscount(userId, baseStudentPrice) {
  if (!userId) {
    return {
      effectivePrice: roundCurrency(baseStudentPrice),
      tier: "Bronze",
      discountPercent: 0,
      orderCount: 0,
      totalSpend: 0,
      nextTier: "3 orders or $500 spend",
    };
  }

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("total")
    .eq("user_id", userId);

  const orderCount = (orders || []).length;
  const totalSpend = (orders || []).reduce((sum, order) => sum + Number(order.total || 0), 0);

  const candidates = [
    { tier: "Bronze", multiplier: 1, discountPercent: 0, qualifies: true, nextTier: "3 orders or $500 spend" },
    { tier: "Silver", multiplier: 0.95, discountPercent: 5, qualifies: orderCount >= 3, nextTier: "5 orders" },
    { tier: "Gold", multiplier: 0.9, discountPercent: 10, qualifies: orderCount >= 5, nextTier: "10 orders" },
    { tier: "Platinum", multiplier: 0.85, discountPercent: 15, qualifies: orderCount >= 10, nextTier: "Maintain top tier" },
    { tier: "Gold", multiplier: 0.88, discountPercent: 12, qualifies: totalSpend >= 500, nextTier: "10 orders" },
  ].filter((candidate) => candidate.qualifies);

  const best = candidates.reduce((winner, current) =>
    current.discountPercent > winner.discountPercent ? current : winner
  );

  return {
    effectivePrice: roundCurrency(Number(baseStudentPrice || 0) * best.multiplier),
    tier: best.tier,
    discountPercent: best.discountPercent,
    orderCount,
    totalSpend,
    nextTier: best.nextTier,
  };
}

export function getWholesalePricing(product, quantity = 1) {
  const baseWholesalePrice = roundCurrency(product.wholesale_price || product.retail_price || product.price || 0);
  const safeQuantity = Math.max(1, Number(quantity) || 1);

  let multiplier = 1;
  let label = "Standard wholesale";

  if (safeQuantity >= 25) {
    multiplier = 0.85;
    label = "15% volume discount";
  } else if (safeQuantity >= 10) {
    multiplier = 0.9;
    label = "10% volume discount";
  } else if (safeQuantity >= 5) {
    multiplier = 0.95;
    label = "5% volume discount";
  }

  return {
    price: roundCurrency(baseWholesalePrice * multiplier),
    label,
  };
}

export async function getPriceForUser(product, userRole = "retail", options = {}) {
  const settings = await getSitePricingSettings();
  const retailPrice = roundCurrency(product.retail_price || product.price || 0);
  const wholesaleBase = roundCurrency(product.wholesale_price || retailPrice * settings.wholesaleMultiplier);
  const studentBase = roundCurrency(product.student_price || retailPrice * settings.studentMultiplier);

  // 🔥 MANUAL PRODUCTS (WATCHES) - EXACT HARDCODED PRICING
  if (product.type === "manual") {
    const quantity = Math.max(1, Number(options.quantity) || 1);
    
    let price = 200; // Default retail price
    
    if (quantity >= 10) {
      price = 125; // 10+ units → $125 each
    } else if (quantity >= 4) {
      price = 150; // 4-9 units → $150 each
    } else {
      price = 200; // 1-3 units → $200 each
    }

    return {
      price: roundCurrency(price),
      label: `$${price.toFixed(2)}`,
      note: "",
      retailPrice: roundCurrency(price),
      wholesalePrice: roundCurrency(price),
      studentPrice: roundCurrency(price),
      appliedTier: "Manual",
    };
  }

  if (userRole === "wholesale") {
    const wholesale = getWholesalePricing(
      { ...product, wholesale_price: wholesaleBase, retail_price: retailPrice },
      options.quantity
    );

    return {
      price: wholesale.price,
      label: `Wholesale: $${wholesale.price.toFixed(2)}`,
      note: "Wholesale account pricing",
      retailPrice,
      wholesalePrice: wholesale.price,
      studentPrice: studentBase,
      appliedTier: wholesale.label,
    };
  }

  if (userRole === "student") {
    const tier = await getStudentTierDiscount(options.userId, studentBase);
    return {
      price: tier.effectivePrice,
      label: `Your Price: $${tier.effectivePrice.toFixed(2)}`,
      note: "Student rate applied",
      retailPrice,
      wholesalePrice: wholesaleBase,
      studentPrice: tier.effectivePrice,
      appliedTier: tier.tier,
      loyaltyDiscountPercent: tier.discountPercent,
      orderCount: tier.orderCount,
      totalSpend: tier.totalSpend,
      nextTier: tier.nextTier,
    };
  }

  return {
    price: retailPrice,
    label: `$${retailPrice.toFixed(2)}`,
    note: "",
    retailPrice,
    wholesalePrice: wholesaleBase,
    studentPrice: studentBase,
    appliedTier: "Retail",
  };
}

export function deriveTierPrices(product) {
  const retail = roundCurrency(product.retail_price || product.price || 0);
  return {
    retail_price: retail,
    wholesale_price: roundCurrency(product.wholesale_price || retail * 0.7),
    student_price: roundCurrency(product.student_price || retail * 0.8),
  };
}
