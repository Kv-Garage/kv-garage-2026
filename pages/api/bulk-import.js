import { createClient } from "@supabase/supabase-js";
import { normalizeCJProduct } from "../../lib/cjProduct";
import { autoCategorize, normalizeCategory } from "../../lib/categories";
import { deriveTierPrices } from "../../lib/serverPricing";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchCJDetail(pid) {
  if (!process.env.CJ_ACCESS_TOKEN) {
    throw new Error("CJ API Error: Missing CJ access token");
  }

  const response = await fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${encodeURIComponent(pid)}&countryCode=US&features=enable_video`,
    {
      method: "GET",
      headers: {
        "CJ-Access-Token": process.env.CJ_ACCESS_TOKEN,
      },
    }
  );

  const payload = await response.json();

  if (!response.ok || payload?.result === false || payload?.code >= 400 || !payload?.data) {
    throw new Error(`CJ API Error: ${payload?.message || payload?.error || "Could not load CJ product detail"}`);
  }

  return payload.data;
}

function buildManualProduct(product) {
  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.images === "string"
      ? product.images.split(",").map((image) => image.trim()).filter(Boolean)
      : [];

  const supplierCost = Number(product.supplier_cost || product.cost || 0);
  const price = Math.max(Number(product.price || 0), supplierCost * 2.5 || 0);

  return {
    name: product.name,
    slug: product.slug || String(product.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    description: product.description || "",
    price,
    compare_price: product.compare_price ? Number(product.compare_price) : null,
    supplier_cost: supplierCost || null,
    supplier_price: supplierCost || null,
    cost: supplierCost || null,
    image: images[0] || null,
    images,
    variants: Array.isArray(product.variants) ? product.variants : [],
    category: product.category
      ? normalizeCategory(product.category, product.name)
      : autoCategorize(product.name, product.description),
    supplier: product.supplier || "manual",
    sku: product.sku || null,
    ...deriveTierPrices({ retail_price: price }),
    fulfillment_type: "dropship",
    inventory_count: Number(product.inventory_count || product.inventory || 0),
    active: true,
  };
}

async function saveProduct(productData) {
  const payload = { ...productData };
  const { error } = await supabase
    .from("products")
    .insert([payload]);

  if (error) {
    const missingColumn = String(error.message || "").match(/Could not find the '([^']+)' column/i)?.[1];
    if (missingColumn && payload[missingColumn] !== undefined) {
      delete payload[missingColumn];
      const retry = await supabase.from("products").insert([payload]);
      if (retry.error) {
        throw retry.error;
      }
      return;
    }
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const products = Array.isArray(req.body?.products) ? req.body.products : [];

    if (!products.length) {
      return res.status(400).json({ error: "Products array is required" });
    }

    let successCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (let index = 0; index < products.length; index += 1) {
      const product = products[index];

      try {
        const pid = product?.pid || product?.cjProductId || product?.cj_product_id;
        const normalized = pid
          ? normalizeCJProduct(await fetchCJDetail(pid))
          : buildManualProduct(product);

        if (!normalized?.name) {
          skippedCount += 1;
          errors.push(`Row ${index + 1}: Missing product name`);
          continue;
        }

        normalized.category = normalizeCategory(normalized.category, normalized.name);
        normalized.active = true;

        if (normalized.supplier_cost != null && Number(normalized.price || 0) <= Number(normalized.supplier_cost || 0)) {
          normalized.price = Number((Number(normalized.supplier_cost) * 2.5).toFixed(2));
        }

        Object.assign(normalized, deriveTierPrices({ retail_price: normalized.price, wholesale_price: normalized.wholesale_price, student_price: normalized.student_price }));

        await saveProduct(normalized);
        successCount += 1;
      } catch (error) {
        errors.push(`Row ${index + 1}: ${error.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      total: products.length,
      successCount,
      skippedCount,
      errorCount: errors.length,
      errors,
      summary:
        successCount === 0
          ? `0 products saved. ${errors[0] || "Unknown import error."}`
          : errors.length > 0
          ? `Imported ${successCount} of ${products.length}. ${errors.length} issues detected.`
          : `${successCount} products imported successfully. View in Products →`,
    });
  } catch (error) {
    console.error("Bulk import failed:", error);
    return res.status(500).json({
      error: error.message || "Bulk import failed",
    });
  }
}
