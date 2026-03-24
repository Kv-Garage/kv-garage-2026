import { calculatePrice } from "../../lib/pricing.js";
import { supabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
  try {
    const { pid } = req.query;

    if (!pid) {
      return res.status(400).json({ error: "Missing PID parameter" });
    }

    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.status(500).json({ error: "Missing CJ_ACCESS_TOKEN" });
    }

    console.log("👉 Fetching CJ product details for PID:", pid);

    // 🔥 FETCH CJ DETAIL DATA
    const detailRes = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/queryByPid?pid=${pid}`,
      {
        method: "GET",
        headers: {
          "CJ-Access-Token": cjToken
        }
      }
    );

    const detailResponse = await detailRes.json();
    console.log('CJ DETAIL:', JSON.stringify(detailResponse.data, null, 2));

    if (!detailResponse?.data || detailResponse.code !== 200) {
      console.error("❌ CJ Detail API Error:", detailResponse);
      return res.status(400).json({ 
        error: "Product not found or CJ API error",
        details: detailResponse?.message || "Unknown error"
      });
    }

    const cjData = detailResponse.data;

    // 🔥 MAP DATA CORRECTLY
    
    // TITLE: Use productNameEn
    const title = cjData.productNameEn || cjData.productName || "Unknown Product";

    // IMAGES: Extract main image + all images from description/remark
    const images = [];
    
    // Add main product image
    if (cjData.productImage) {
      images.push(cjData.productImage);
    }

    // Extract all <img src=""> from description/remark HTML
    const htmlContent = cjData.remark || cjData.description || "";
    if (htmlContent) {
      const imgMatches = htmlContent.match(/<img[^>]+src="([^">]+)"/g);
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

    // DESCRIPTION: Use remark (HTML)
    const description = htmlContent;

    // PRICE: Parse sellPrice (handle ranges like "2.02 -- 3.10")
    let price = 10; // fallback
    let minPrice = 10;
    let maxPrice = 10;

    if (cjData.sellPrice) {
      const sellPriceStr = String(cjData.sellPrice);
      if (sellPriceStr.includes('--')) {
        // Handle price range
        const prices = sellPriceStr.split('--').map(p => parseFloat(p.trim()));
        if (prices.length === 2 && !isNaN(prices[0]) && !isNaN(prices[1])) {
          minPrice = prices[0];
          maxPrice = prices[1];
          price = minPrice; // Use min as default
        }
      } else {
        // Single price
        const singlePrice = parseFloat(sellPriceStr);
        if (!isNaN(singlePrice)) {
          minPrice = maxPrice = price = singlePrice;
        }
      }
    }

    // Calculate selling price using existing pricing logic
    const sellingPrice = calculatePrice({
      cost: price,
      quantity: 1,
      role: "retail",
      cartTotal: 0
    });

    // 🔥 SAVE TO DATABASE (SUPABASE)
    const productData = {
      title: title,
      name: title, // Keep name for compatibility
      slug: title
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      
      description: description,
      description_html: description, // Store HTML version
      
      images: images,
      image: images[0] || "", // Main image for compatibility
      
      cost: price,
      supplier_price: price,
      price: sellingPrice,
      
      min_price: minPrice,
      max_price: maxPrice,
      
      category: cjData.category || "general",
      supplier: "cj",
      source: "cj",
      
      cj_product_id: pid,
      
      // Physical attributes
      weight: Number(cjData.weight) || null,
      dimensions: {
        length: Number(cjData.length) || null,
        width: Number(cjData.width) || null,
        height: Number(cjData.height) || null
      },
      
      // Wholesale fields
      moq: Number(cjData.moq) || 1,
      wholesale_price: price * 0.7,
      type: "single",
      
      fulfillment_type: "dropship",
      inventory_count: Number(cjData.inventory || cjData.stock) || 0,
      active: true
    };

    console.log("🧠 SAVING PRODUCT:", JSON.stringify(productData, null, 2));

    const { data: savedProduct, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error("❌ DATABASE ERROR:", error);
      return res.status(500).json({ 
        error: "Failed to save product",
        details: error.message 
      });
    }

    console.log("✅ PRODUCT SAVED:", savedProduct.id);

    // 🔥 RESPONSE
    return res.status(200).json({
      success: true,
      product: savedProduct
    });

  } catch (err) {
    console.error("❌ IMPORT ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
