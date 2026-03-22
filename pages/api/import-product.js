import { supabase } from "../../lib/supabase";
import { calculatePrice } from "../../lib/pricing";

export default async function handler(req, res) {
  try {
    console.log("📦 BODY:", req.body);

    const {
      product,
      cjProduct,
      name,
      description,
      image,
      supplier_price,
      supplier,

      // 🔥 NEW
      type,
      bundle_quantity,
      bundle_price
    } = req.body;

    // ✅ SUPPORT MULTIPLE INPUT TYPES (KEEPING YOUR SYSTEM)
    const data = product || cjProduct || {
      name,
      description,
      image,
      supplier_price,
      supplier
    };

    if (!data) {
      throw new Error("No product data received");
    }

    console.log("✅ USING DATA:", data);

    // 🔥 COST
    const cost = Number(
      data.basePrice ||
      data.sellPrice ||
      supplier_price ||
      10
    );

    // 🔥 NORMAL PRICE (KEEP YOUR SYSTEM)
    let price = calculatePrice({
      cost,
      quantity: 1,
      role: "retail",
      cartTotal: 0
    });

    // 🔥 BUNDLE OVERRIDE (ONLY IF BUNDLE)
    let finalType = type || "standard";

    let finalBundleQty = null;
    let finalBundlePrice = null;

    if (finalType === "bundle") {
      finalBundleQty = Number(bundle_quantity || 0);
      finalBundlePrice = Number(bundle_price || 0);

      if (!finalBundleQty || !finalBundlePrice) {
        throw new Error("Bundle requires quantity + price");
      }

      // override price to bundle price
      price = finalBundlePrice;
    }

    const payload = {
      name: data.name || data.productName,
      slug: (data.name || data.productName)
        ?.toLowerCase()
        .replace(/[^\w]+/g, "-") + "-" + Date.now(),

      description: data.description || "",

      category: "glass",
      supplier: supplier || "cj",

      cost,
      supplier_price: cost,
      price,

      image: data.image || data.productImage || "",
      images: data.images || [data.productImage].filter(Boolean),

      cj_product_id: data.pid || null,

      fulfillment_type: "dropship",
      inventory_count: 0,

      // 🔥 NEW FIELDS
      type: finalType,
      bundle_quantity: finalBundleQty,
      bundle_price: finalBundlePrice
    };

    console.log("🧠 FINAL PAYLOAD:", payload);

    const { error } = await supabase
      .from("products")
      .insert([payload]);

    if (error) {
      console.error("❌ SUPABASE ERROR:", error);
      throw error;
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ IMPORT ERROR:", err);

    return res.status(500).json({
      error: err.message,
      full: err
    });
  }
}