import { supabase } from "../../lib/supabase";
import { calculatePrice } from "../../lib/pricing";

export default async function handler(req, res) {
  try {
    const { name, supplier_price, description, supplier, images } = req.body;

    const cost = Number(supplier_price || 10);

    const price = calculatePrice({
      cost,
      quantity: 1,
      role: "retail",
      cartTotal: 0
    });

    const payload = {
      name,
      slug: name.toLowerCase().replaceAll(" ", "-"),
      description,
      supplier,
      category: "glass",

      cost,
      supplier_price: cost,
      price,

      image: images?.[0] || null,
      images: images || [],

      fulfillment_type: "dropship",
      inventory_count: 0
    };

    const { error } = await supabase
      .from("products")
      .insert([payload]);

    if (error) throw error;

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}