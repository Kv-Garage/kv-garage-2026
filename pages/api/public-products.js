import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { normalizeCategory } from "../../lib/categories";
import { getAuthenticatedViewer, getPriceForUser } from "../../lib/serverPricing";

async function normalizePublicProduct(product, viewer) {
  const pricing = await getPriceForUser(product, viewer.role, {
    userId: viewer.userId,
    quantity: 1,
  });

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: Number(product.price || 0),
    display_price: Number(pricing.price || 0),
    price_label: pricing.label,
    price_note: pricing.note,
    retail_price: Number(pricing.retailPrice || product.price || 0),
    wholesale_price: Number(pricing.wholesalePrice || product.price || 0),
    student_price: Number(pricing.studentPrice || product.price || 0),
    compare_price: product.compare_price ? Number(product.compare_price) : null,
    images: Array.isArray(product.images)
      ? product.images
      : [product.image].filter(Boolean),
    variants: Array.isArray(product.variants) ? product.variants : [],
    category: normalizeCategory(product.category, product.name),
    sku: product.sku || null,
    top_pick: Boolean(product.top_pick),
    is_active: product.active !== false,
    stock_quantity: Number(product.stock_quantity ?? product.inventory_count ?? 0),
    inventory_count: Number(product.inventory_count ?? product.stock_quantity ?? 0),
    created_at: product.created_at || null,
    type: product.type || null,
    bundle_quantity: product.bundle_quantity || null,
    moq: product.moq || null,
    wholesale_price: product.wholesale_price || null,
    cj_product_id: product.cj_product_id || null,
  };
}

async function fetchFromPublicView({ slug, search, category, sort, page, limit }) {
  let query = supabaseAdmin.from("public_products");

  const selectColumns =
    "*";

  if (slug) {
    const { data, error } = await query.select(selectColumns).eq("slug", slug).maybeSingle();
    if (error) throw error;
    return { data, count: data ? 1 : 0 };
  }

  query = query.select(selectColumns, { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
  }

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (sort === "price_asc") query = query.order("price", { ascending: true });
  else if (sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

async function fetchFromProductsFallback({ slug, search, category, sort, page, limit }) {
  let query = supabaseAdmin.from("products");
  const selectColumns = "*";

  if (slug) {
    const { data, error } = await query.select(selectColumns).eq("slug", slug).maybeSingle();
    if (error) throw error;
    return { data, count: data ? 1 : 0 };
  }

  query = query
    .select(selectColumns, { count: "exact" })
    .neq("active", false);

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
  }

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (sort === "price_asc") query = query.order("price", { ascending: true });
  else if (sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const slug = String(req.query.slug || "").trim() || null;
  const search = String(req.query.search || "").trim() || null;
  const category = String(req.query.category || "").trim() || null;
  const sort = String(req.query.sort || "newest");
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 24));

  try {
    const viewer = await getAuthenticatedViewer(req);
    let result;

    try {
      result = await fetchFromPublicView({ slug, search, category, sort, page, limit });
    } catch (viewError) {
      result = await fetchFromProductsFallback({ slug, search, category, sort, page, limit });
    }

    if (slug) {
      return res.status(200).json({ product: result.data ? await normalizePublicProduct(result.data, viewer) : null });
    }

    return res.status(200).json({
      products: await Promise.all((result.data || []).map((product) => normalizePublicProduct(product, viewer))),
      totalCount: result.count || 0,
    });
  } catch (error) {
    console.error("Public products fetch error:", error);
    return res.status(500).json({ error: error.message || "Could not load products" });
  }
}
