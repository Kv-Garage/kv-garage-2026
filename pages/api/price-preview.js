import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { getAuthenticatedViewer, getPriceForUser, getWholesalePricing } from "../../lib/serverPricing";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { productId, slug, quantity = 1 } = req.body || {};
    const viewer = await getAuthenticatedViewer(req);

    let query = supabaseAdmin
      .from("products")
      .select("*");

    if (productId) query = query.eq("id", productId);
    else if (slug) query = query.eq("slug", slug);
    else return res.status(400).json({ error: "Missing productId or slug" });

    const { data: product, error } = await query.maybeSingle();

    if (error || !product || product.active === false) {
      return res.status(404).json({ error: "Product not found" });
    }

    const pricing = await getPriceForUser(product, viewer.role, {
      userId: viewer.userId,
      quantity,
    });

    return res.status(200).json({
      productId: product.id,
      role: viewer.role,
      quantity: Math.max(1, Number(quantity) || 1),
      display_price: pricing.price,
      label: pricing.label,
      note: pricing.note,
      applied_tier: pricing.appliedTier,
      volume_pricing:
        viewer.role === "wholesale"
          ? [
              { range: "1-4", price: getWholesalePricing(product, 1).price, note: "Standard wholesale" },
              { range: "5-9", price: getWholesalePricing(product, 5).price, note: "5% off" },
              { range: "10-24", price: getWholesalePricing(product, 10).price, note: "10% off" },
              { range: "25+", price: getWholesalePricing(product, 25).price, note: "15% off" },
            ]
          : [],
    });
  } catch (error) {
    console.error("Price preview failed:", error);
    return res.status(500).json({ error: error.message || "Could not calculate price" });
  }
}
