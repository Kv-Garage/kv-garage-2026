import { supabase } from "../../lib/supabase";
import { getAuthenticatedViewer, getPriceForUser } from "../../lib/serverPricing";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { productId, quantity } = req.body;

    // Validate inputs
    if (!productId || !quantity) {
      return res.status(400).json({ error: "Missing productId or quantity" });
    }

    const numericProductId = Number(productId);
    const numericQuantity = Number(quantity);

    if (isNaN(numericProductId) || isNaN(numericQuantity) || numericProductId <= 0 || numericQuantity <= 0) {
      return res.status(400).json({ error: "Invalid productId or quantity" });
    }

    // Get authenticated viewer
    let viewer = { role: "retail", userId: null };
    try {
      const authViewer = await getAuthenticatedViewer(req);
      if (authViewer) {
        viewer = authViewer;
      }
    } catch (authError) {
      console.warn("⚠️ Auth viewer failed, using defaults:", authError.message);
    }

    // Get product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", numericProductId)
      .maybeSingle();

    if (productError) {
      return res.status(500).json({ error: `Database error: ${productError.message}` });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get pricing
    let displayPrice = Number(product.price || 0);
    let note = "";

    try {
      const pricing = await getPriceForUser(product, viewer.role, {
        userId: viewer.userId,
        quantity: numericQuantity,
      });
      displayPrice = Number(pricing.price || 0);
      note = pricing.note || "";
    } catch (priceError) {
      console.warn("⚠️ Price calculation failed, using product price:", priceError.message);
      // Continue with product price
    }

    // Get volume pricing tiers
    let volume_pricing = [];
    try {
      const { data: pricingData } = await supabase
        .from("product_pricing")
        .select("*")
        .eq("product_id", numericProductId)
        .order("min_quantity", { ascending: true });

      if (pricingData && pricingData.length > 0) {
        volume_pricing = pricingData.map(p => ({
          range: `${p.min_quantity}+`,
          price: Number(p.price || 0),
          note: p.note || ""
        }));
      }
    } catch (pricingError) {
      console.warn("⚠️ Volume pricing fetch failed:", pricingError.message);
    }

    return res.status(200).json({
      productId: numericProductId,
      display_price: displayPrice,
      note: note,
      volume_pricing: volume_pricing,
      role: viewer.role,
      quantity: numericQuantity
    });

  } catch (error) {
    console.error("Price preview error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}