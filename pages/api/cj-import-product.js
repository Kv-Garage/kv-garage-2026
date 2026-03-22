import { supabase } from "../../lib/supabase";
import { calculatePrice } from "../../lib/pricing";

export default async function handler(req, res) {
  try {
    console.log("📦 BODY:", req.body);

    const { product, cjProduct } = req.body;

    // ✅ TEMP SUPPORT BOTH FORMATS
    const data = product || cjProduct;

    if (!data) {
      throw new Error("No product data received");
    }

    console.log("✅ USING DATA:", data);

    const cost = Number(data.basePrice || data.sellPrice || 10);

    const price = calculatePrice({
      cost,
      quantity: 1,
      role: "retail",
      cartTotal: 0
    });

    const payload = {
      name: data.name || data.productName,
      slug: (data.name || data.productName)
        ?.toLowerCase()
        .replaceAll(" ", "-"),

      description: data.description || "",

      category: "glass",
      supplier: "cj",

      cost,
      supplier_price: cost,
      price,

      image: data.images?.[0] || data.productImage || "",
      images: data.images || [data.productImage].filter(Boolean),

      cj_product_id: data.pid,

      fulfillment_type: "dropship",
      inventory_count: 0
    };

    console.log("🧠 PAYLOAD:", payload);

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