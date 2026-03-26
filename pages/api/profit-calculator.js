import { supabaseAdmin } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { productId, quantity = 1 } = req.body || {};
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    if (!productId) {
      return res.status(400).json({ error: "Missing productId" });
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("id,name,price,supplier_cost,images,image,slug,category,active")
      .eq("id", productId)
      .maybeSingle();

    if (error || !product || product.active === false) {
      return res.status(404).json({ error: "Product not found" });
    }

    const sellPrice = Number(product.price || 0);
    const supplierCost = Number(product.supplier_cost || 0);
    const profitPerUnit = Math.max(sellPrice - supplierCost, 0);
    const totalProfit = profitPerUnit * safeQuantity;
    const marginPercent = sellPrice > 0 ? (profitPerUnit / sellPrice) * 100 : 0;
    const totalRevenue = sellPrice * safeQuantity;
    const totalCost = supplierCost * safeQuantity;

    return res.status(200).json({
      product: {
        id: product.id,
        name: product.name,
        price: sellPrice,
        images: Array.isArray(product.images) ? product.images : [product.image].filter(Boolean),
        slug: product.slug,
        category: product.category || "General",
      },
      quantity: safeQuantity,
      sell_price: sellPrice,
      total_revenue: totalRevenue,
      estimated_total_profit: totalProfit,
      margin_percent: marginPercent,
      total_cost: totalCost,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Calculation failed" });
  }
}
