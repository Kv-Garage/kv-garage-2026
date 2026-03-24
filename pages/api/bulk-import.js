import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    // 🔒 METHOD CHECK
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 🔥 COOKIE AUTHENTICATION
    const cookie = req.headers.cookie || "";
    console.log("COOKIE:", req.headers.cookie);
    
    const isAdmin = cookie.includes("adminAuth=true");
    
    if (!isAdmin) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Products array is required" });
    }

    console.log(`📦 BULK IMPORT: Processing ${products.length} products`);

    let successCount = 0;
    let skippedCount = 0;
    let errors = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // 🔥 VALIDATION
        if (!product.name || !product.price) {
          errors.push(`Product ${i + 1}: Missing required fields (name, price)`);
          continue;
        }

        // 🔥 GENERATE SLUG IF NOT PROVIDED
        let slug = product.slug;
        if (!slug) {
          slug = product.name
            .toLowerCase()
            .replaceAll(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        }

        // 🔥 CHECK FOR DUPLICATE SLUG
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("slug", slug)
          .single();

        if (existing) {
          console.log(`⚠️ Skipping duplicate slug: ${slug}`);
          skippedCount++;
          continue;
        }

        // 🔥 PROCESS IMAGES
        let images = [];
        if (product.images) {
          if (Array.isArray(product.images)) {
            images = product.images;
          } else if (typeof product.images === 'string') {
            images = product.images.split(',').map(img => img.trim()).filter(Boolean);
          }
        }

        // 🔥 PREPARE PRODUCT DATA
        const productData = {
          name: product.name,
          slug: slug,
          description: product.description || "",
          price: Number(product.price),
          cost: Number(product.cost) || Number(product.price) / 3,
          supplier_price: Number(product.cost) || Number(product.price) / 3,
          
          image: images[0] || "",
          images: images,
          
          category: product.category || "general",
          supplier: product.supplier || "manual",
          sku: product.sku || null,
          
          fulfillment_type: "dropship",
          inventory_count: Number(product.inventory) || 0,
          active: true
        };

        // 🔥 INSERT PRODUCT
        const { data: inserted, error } = await supabase
          .from("products")
          .insert([productData])
          .select()
          .single();

        if (error) {
          errors.push(`Product ${i + 1} (${product.name}): ${error.message}`);
        } else {
          console.log(`✅ Imported: ${product.name} (${slug})`);
          successCount++;
        }

      } catch (err) {
        errors.push(`Product ${i + 1} (${product.name || 'Unknown'}): ${err.message}`);
      }
    }

    console.log(`🎉 BULK IMPORT COMPLETE: ${successCount} success, ${skippedCount} skipped, ${errors.length} errors`);

    return res.status(200).json({
      success: true,
      successCount,
      skippedCount,
      errorCount: errors.length,
      errors: errors.slice(0, 10), // Limit error details
      total: products.length
    });

  } catch (err) {
    console.error("❌ BULK IMPORT ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
