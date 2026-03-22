import { supabase } from "../../lib/supabase";
import { calculatePrice } from "../../lib/pricing";

export default async function handler(req, res) {
  try {
    // 🔒 METHOD CHECK
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 🔒 AUTH CHECK
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Not logged in",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      return res.status(401).json({
        error: "Invalid user",
      });
    }

    // 🔒 ROLE CHECK
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    // 🔥 ORIGINAL LOGIC (UNCHANGED)
    console.log("📦 BODY:", req.body);

    const { product, cjProduct } = req.body;
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

      // 🔥 ADD WHOLESALE FIELDS
      moq: 4,
      wholesale_price: price * 0.7,
      type: "single",

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