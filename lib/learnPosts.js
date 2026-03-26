import { supabaseAdmin } from "./supabaseAdmin";
import { buildCanonicalUrl, stripHtml } from "./seo";

export const LEARN_CATEGORIES = [
  "Business & Reselling",
  "Markets & Investing",
  "AI & Technology",
  "Sales & Psychology",
];

export const FALLBACK_LEARN_POSTS = [
  {
    slug: "how-to-build-a-reselling-system-that-scales",
    title: "How to Build a Reselling System That Scales",
    category: "Business & Reselling",
    excerpt: "Build a repeatable resale business with stronger supplier sourcing, margin discipline, and fulfillment systems.",
    content_html: "<p>Scaling a resale business starts with verified supplier access, pricing discipline, and a repeatable operating cadence. Entrepreneurs who build durable margin do not guess on sourcing. They standardize supplier qualification, track landed cost, and create a predictable merchandising rhythm that compounds over time.</p><p>At KV Garage, we focus on moving beyond random product flipping into structured inventory operations. That means understanding margin bands, reordering the right products, and building a storefront that converts trust into revenue. The result is a supply chain business, not just a side hustle.</p>",
    featured: true,
    cover_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    related_product_slug: null,
    created_at: "2026-03-20T12:00:00.000Z",
  },
  {
    slug: "inventory-trading-systems-for-modern-operators",
    title: "Inventory Trading Systems for Modern Operators",
    category: "Markets & Investing",
    excerpt: "Treat inventory like an asset class by balancing rotation speed, downside protection, and capital velocity.",
    content_html: "<p>Inventory trading is a discipline built around capital velocity. Products become far more powerful when you evaluate them the way sophisticated operators evaluate positions: downside risk, return window, and liquidity. The most resilient operators are not simply buying cheap. They are buying with structure.</p><p>That means using pricing tiers, supply chain timing, and marketing leverage to increase turnover without wrecking margin. The goal is consistent decision quality across every buying cycle.</p>",
    featured: true,
    cover_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    related_product_slug: null,
    created_at: "2026-03-19T12:00:00.000Z",
  },
  {
    slug: "using-ai-to-create-leverage-in-ecommerce",
    title: "Using AI to Create Leverage in Ecommerce",
    category: "AI & Technology",
    excerpt: "AI can automate catalog cleanup, content workflows, support triage, and operational decision-making across the store.",
    content_html: "<p>AI becomes truly valuable in ecommerce when it reduces decision fatigue and compresses execution time. Instead of only generating copy, strong operators use AI for catalog normalization, support routing, marketing ideation, and workflow acceleration.</p><p>The brands that win with AI do not bolt it on as a novelty feature. They weave it into merchandising, conversion, and customer communication so the system becomes faster, more consistent, and more profitable.</p>",
    featured: true,
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    related_product_slug: null,
    created_at: "2026-03-18T12:00:00.000Z",
  },
  {
    slug: "sales-psychology-that-increases-conversion",
    title: "Sales Psychology That Increases Conversion",
    category: "Sales & Psychology",
    excerpt: "High-converting product experiences are built on clarity, status signaling, and frictionless decision-making.",
    content_html: "<p>Sales psychology is less about hype and more about reducing hesitation. Customers respond when the value path is obvious, the brand feels credible, and the offer makes the next step feel safe. Trust markers, clear value framing, and visual hierarchy do more to improve conversion than random gimmicks.</p><p>For premium ecommerce brands, the key is to create momentum without chaos. Good sales psychology guides the customer forward while preserving confidence.</p>",
    featured: false,
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    related_product_slug: null,
    created_at: "2026-03-17T12:00:00.000Z",
  },
];

function normalizePost(post) {
  return {
    ...post,
    excerpt:
      post.excerpt ||
      stripHtml(post.content_html || "").slice(0, 180),
    created_at: post.created_at || new Date().toISOString(),
    canonical_url: buildCanonicalUrl(`/learn/posts/${post.slug}`),
  };
}

export async function fetchLearnPosts({ category = "All", page = 1, pageSize = 6, featuredOnly = false } = {}) {
  try {
    let query = supabaseAdmin
      .from("learn_posts")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (featuredOnly) {
      query = query.eq("featured", true);
    }

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      posts: (data || []).map(normalizePost),
      totalCount: count || 0,
    };
  } catch (error) {
    const filtered = FALLBACK_LEARN_POSTS.filter((post) => {
      if (featuredOnly && !post.featured) return false;
      if (category !== "All" && category && post.category !== category) return false;
      return true;
    });
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return {
      posts: filtered.slice(from, to).map(normalizePost),
      totalCount: filtered.length,
    };
  }
}

export async function fetchLearnPostBySlug(slug) {
  try {
    const { data, error } = await supabaseAdmin
      .from("learn_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;
    if (data) return normalizePost(data);
  } catch (error) {
    // Fall through to static fallback.
  }

  const post = FALLBACK_LEARN_POSTS.find((item) => item.slug === slug);
  return post ? normalizePost(post) : null;
}

export async function fetchAllLearnPostSlugs() {
  try {
    const { data, error } = await supabaseAdmin
      .from("learn_posts")
      .select("slug")
      .eq("is_published", true)
      .limit(1000);

    if (error) throw error;
    return (data || []).map((row) => row.slug).filter(Boolean);
  } catch (error) {
    return FALLBACK_LEARN_POSTS.map((post) => post.slug);
  }
}
