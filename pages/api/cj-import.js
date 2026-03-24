import { supabase } from "../../lib/supabase";
import { calculatePrice } from "../../lib/pricing";

export default async function handler(req, res) {
  try {
    // 🔒 METHOD CHECK
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // � COOKIE AUTHENTICATION (NOT LOCAL STORAGE)
    const cookie = req.headers.cookie || "";
    console.log("COOKIE:", req.headers.cookie);
    
    const isAdmin = cookie.includes("adminAuth=true");
    
    if (!isAdmin) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 🔥 DEBUG: Log incoming data
    console.log("📦 BODY:", req.body);

    const { product, cjProduct } = req.body;
    const data = product || cjProduct;

    if (!data || !data.pid) {
      throw new Error("No product data received");
    }

    console.log("📦 USING LIST DATA ONLY:", JSON.stringify(data, null, 2));

    // 🔥 IMAGES: Start with main image + extract from remark HTML
    const images = [];
    
    // Add main product image
    if (data.productImage) {
      images.push(data.productImage);
    }

    // Extract ALL additional images from data.remark HTML
    if (data.remark) {
      const imgMatches = data.remark.match(/<img[^>]+src="([^">]+)"/g);
      if (imgMatches) {
        imgMatches.forEach(match => {
          const srcMatch = match.match(/src="([^">]+)"/);
          if (srcMatch && srcMatch[1]) {
            const imgSrc = srcMatch[1];
            // Avoid duplicates
            if (!images.includes(imgSrc)) {
              images.push(imgSrc);
            }
          }
        });
      }
    }

    // 🔥 TITLE: Use productNameEn
    const title = data.productNameEn || data.productName || "Unknown Product";

    // 🔥 DESCRIPTION: Use remark (HTML)
    const description = data.remark || data.description || "";

    // 🔥 PRICE: Parse sellPrice, use lowest value if range
    let cost = 10; // fallback
    
    if (data.sellPrice) {
      const sellPriceStr = String(data.sellPrice);
      if (sellPriceStr.includes('--')) {
        // Handle price range - use lowest value
        const prices = sellPriceStr.split('--').map(p => parseFloat(p.trim()));
        if (prices.length === 2 && !isNaN(prices[0]) && !isNaN(prices[1])) {
          cost = Math.min(prices[0], prices[1]);
        }
      } else {
        // Single price
        const singlePrice = parseFloat(sellPriceStr);
        if (!isNaN(singlePrice)) {
          cost = singlePrice;
        }
      }
    }

    // 🔥 APPLY PRICING LOGIC (simple markup)
    const price = cost * 3; // Simple retail markup
    
    console.log("💰 PRICING:", { cost, price });

    // 🔥 SAVE PRODUCT: Only use existing database columns
    const payload = {
      name: title,                   // Use existing 'name' column
      slug: title
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      
      description: description,       // Existing column
      
      image: images[0] || "",         // Keep for compatibility
      images: images,                 // Existing column
      
      price: price,                   // Existing column
      cost: cost,                     // Keep for reference
      supplier_price: cost,           // Keep for compatibility
      
      category: data.category || "glass",
      supplier: "cj",
      cj_product_id: data.pid,
      
      fulfillment_type: "dropship",
      inventory_count: Number(data.inventory || data.stock) || 0,
      active: true
    };

    console.log("🧠 SAVING PRODUCT:", JSON.stringify(payload, null, 2));

    // Insert product
    const { data: productData, error } = await supabase
      .from("products")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ SUPABASE ERROR:", error);
      throw error;
    }

    return res.status(200).json({ 
      success: true, 
      product: productData,
      imagesCount: images.length
    });

  } catch (err) {
    console.error("❌ IMPORT ERROR:", err);

    return res.status(500).json({
      error: err.message,
      full: err
    });
  }
}