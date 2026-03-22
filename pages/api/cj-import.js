import { supabase } from "../../lib/supabase";
import { calculatePrice } from "../../lib/pricing";

export default async function handler(req, res) {
  try {
    const {
      name,
      description,
      images,
      price,
      cj_product_id,
      cj_variant_id,
      source_url
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing product name" });
    }

    const cost = Number(price || 10);

    const finalPrice = calculatePrice({
      cost,
      quantity: 1,
      role: "retail",
      cartTotal: 0
    });

    const payload = {
      name,
      slug: name.toLowerCase().replaceAll(" ", "-"),
      description,
      category: "glass",

      cost,
      supplier_price: cost,
      price: finalPrice,

      image: images?.[0] || null,
      images: images || [],

      supplier: "cj",
      cj_product_id,
      cj_variant_id,
      source_url,

      fulfillment_type: "dropship",
      inventory_count: 0
    };

    const { error } = await supabase
      .from("products")
      .insert([payload]);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      product: payload
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}