import { createClient } from "@supabase/supabase-js";
import { normalizeCJProduct } from "../../lib/cjProduct";
import { deriveTierPrices } from "../../lib/serverPricing";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://pwkafubmtyeufycnkmpz.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3a2FmdWJtdHlldWZ5Y25rbXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTA5NzQsImV4cCI6MjA4NjU4Njk3NH0.YqmBtvSchzy6wcN1OJ0G_lM6c51BxezBbg8n5TBPZfA";

const supabase = createClient(supabaseUrl, supabaseKey);

const baseSelectColumns = [
  "id",
  "name",
  "slug",
  "image",
  "price",
  "supplier",
];

const optionalColumns = ["description", "images", "variants", "compare_price", "supplier_cost", "supplier_price", "cost"];

function buildSelect(columns) {
  return columns.join(",");
}

function parseMissingColumn(message) {
  const match = String(message || "").match(/Could not find the '([^']+)' column/i);
  return match?.[1] || null;
}

async function insertProductWithFallback(payload) {
  const allowedPayload = { ...payload };
  const selectedOptionalColumns = [...optionalColumns];
  const missingColumns = [];

  while (true) {
    const selectColumns = buildSelect([...baseSelectColumns, ...selectedOptionalColumns]);

    const { data, error } = await supabase
      .from("products")
      .insert([allowedPayload])
      .select(selectColumns)
      .single();

    if (!error) {
      return { data, missingColumns };
    }

    const missingColumn = parseMissingColumn(error.message);

    if (!missingColumn) {
      throw error;
    }

    missingColumns.push(missingColumn);
    delete allowedPayload[missingColumn];

    const optionalIndex = selectedOptionalColumns.indexOf(missingColumn);
    if (optionalIndex >= 0) {
      selectedOptionalColumns.splice(optionalIndex, 1);
      continue;
    }

    const baseColumnIndex = baseSelectColumns.indexOf(missingColumn);
    if (baseColumnIndex >= 0) {
      baseSelectColumns.splice(baseColumnIndex, 1);
      continue;
    }

    throw error;
  }
}

async function fetchCJProductDetail(cjProduct) {
  const token = process.env.CJ_ACCESS_TOKEN;
  const pid = cjProduct?.pid || cjProduct?.id;

  if (!token || !pid) {
    return cjProduct;
  }

  const response = await fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${encodeURIComponent(pid)}&countryCode=US&features=enable_video`,
    {
      method: "GET",
      headers: {
        "CJ-Access-Token": token,
      },
    }
  );

  const payload = await response.json();

  if (payload?.result === false || payload?.code >= 400 || !payload?.data) {
    return cjProduct;
  }

  return payload.data;
}

async function getMarkupMultiplier() {
  const { data } = await supabase
    .from("site_settings")
    .select("markup_multiplier")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const multiplier = Number(data?.markup_multiplier || 2.5);
  return multiplier > 1 ? multiplier : 2.5;
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let attempt = 2;

  while (true) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${attempt}`;
    attempt += 1;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cookie = req.headers.cookie || "";
  const isAdmin = cookie.includes("adminAuth=true");

  if (!isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const cjProduct = req.body?.cjProduct;

    if (!cjProduct) {
      return res.status(400).json({ error: "Missing cjProduct payload" });
    }

    const cjProductDetail = await fetchCJProductDetail(cjProduct);
    const markupMultiplier = await getMarkupMultiplier();
    const normalized = normalizeCJProduct(cjProductDetail, { markupMultiplier });
    const uniqueSlug = await generateUniqueSlug(normalized.slug);

    if (Number(normalized.price || 0) <= Number(normalized.supplier_cost || 0)) {
      throw new Error("Calculated sell price is not above supplier cost.");
    }

    const payload = {
      name: normalized.name,
      slug: uniqueSlug,
      description: normalized.description,
      image: normalized.image,
      images: normalized.images,
      variants: normalized.variants,
      supplier_cost: normalized.supplier_cost,
      price: normalized.price,
      compare_price: normalized.compare_price,
      supplier: normalized.supplier,
      category: normalized.category,
      sku: normalized.sku,
      cj_product_id: normalized.cj_product_id,
      supplier_price: normalized.supplier_price,
      cost: normalized.cost,
      ...deriveTierPrices({ retail_price: normalized.price }),
      fulfillment_type: normalized.fulfillment_type,
      inventory_count: normalized.inventory_count,
      is_active: true,
      active: true,
    };

    const { data, missingColumns } = await insertProductWithFallback(payload);

    const { data: verificationRow, error: verificationError } = await supabase
      .from("products")
      .select("id,cj_product_id")
      .eq("cj_product_id", normalized.cj_product_id)
      .maybeSingle();

    if (verificationError || !verificationRow) {
      throw new Error("Product insert could not be verified after import.");
    }

    return res.status(200).json({
      success: true,
      source: "cj",
      sourceLabel: "CJ Dropshipping",
      message:
        missingColumns.length > 0
          ? `Imported from CJ Dropshipping. Missing optional columns skipped: ${missingColumns.join(", ")}`
          : "1 product imported successfully. View in Products →",
      missingColumns,
      product: data,
    });
  } catch (error) {
    console.error("CJ import failed:", error);
    return res.status(500).json({ error: error.message || "Import failed" });
  }
}
