import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";
import { getPrimaryProductImage } from "../../lib/productFields";
import { buildCanonicalUrl } from "../../lib/seo";
import { useCart } from "../../context/CartContext";
import { sortCategories } from "../../lib/categories";
import { getProducts as getShopifyProducts, getProductsByType as getShopifyProductsByType } from "../../lib/shopify";
import { calculatePrice } from "../../lib/pricing";
import Image from "next/image";

const PAGE_SIZE = 24;

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 to-transparent p-6">
      <div className="mb-4 h-48 rounded-xl bg-white/10" />
      <div className="mb-3 h-4 w-3/4 rounded bg-white/10" />
      <div className="mb-4 h-3 w-1/2 rounded bg-white/10" />
      <div className="h-4 w-1/3 rounded bg-white/10" />
    </div>
  );
}

export default function Shop({ profile }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchInput, setSearchInput] = useState(router.query.search || "");
  const [timeLeft, setTimeLeft] = useState("");

  const page = Math.max(1, Number(router.query.page) || 1);
  const role = profile?.role || "retail";
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const minPrice = Number(router.query.min || 0);
  const maxPrice = Number(router.query.max || 0);
  const topPickOnly = router.query.top_pick === "true";
  const inStockOnly = router.query.in_stock === "true";
  const selectedCategory = router.query.category || "";
  const sort = router.query.sort || "newest";

  useEffect(() => {
    setSearchInput(router.query.search || "");
  }, [router.query.search]);

  useEffect(() => {
    if (!router.isReady) return;

    const nextQuery = {
      ...router.query,
      search: searchInput || undefined,
      page: 1,
    };

    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
  }, [searchInput]);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchProducts = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const searchValue = String(router.query.search || "").trim();
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          sort,
        });

        if (searchValue) params.set("search", searchValue);
        if (selectedCategory) params.set("category", selectedCategory);

        // Fetch database products and Shopify products from multiple sources
        const [response, allShopifyProducts, womanProducts, petProducts] = await Promise.all([
          fetch(`/api/public-products?${params.toString()}`, {
            headers: await getAuthHeaders(),
          }),
          getShopifyProducts(50), // Fetch all Shopify products
          getShopifyProductsByType('Woman', 50), // Fetch Woman category
          getShopifyProductsByType('Pets', 50), // Fetch Pets category (plural)
        ]);

        const payload = await response.json();

        if (!response.ok) {
          console.error('API Error:', payload);
          // Don't throw - just use empty array for database products
          // This allows Shopify products to still show even if DB API fails
        }

        let dbProducts = payload.products || [];
        
        // Log fetched products for debugging
        console.log('📦 Fetched products - DB:', dbProducts.length, 'Shopify:', allShopifyProducts.length, 'Woman:', womanProducts.length, 'Pet:', petProducts.length);

        // Combine all Shopify products (deduplicate by id)
        const combinedShopifyProducts = [...allShopifyProducts, ...womanProducts, ...petProducts];
        const uniqueShopifyProducts = combinedShopifyProducts.filter((product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
        );
        
        console.log('📦 Unique Shopify products after dedup:', uniqueShopifyProducts.length);

        // Transform Shopify products to match the database product format
        const transformedShopifyProducts = uniqueShopifyProducts.map((sp) => {
          // Extract image URLs from Shopify's nested structure
          const imageUrlArray = sp.images && sp.images.length > 0
            ? sp.images.map(img => img.url).filter(Boolean)
            : [];
          
          // CRITICAL: Ensure variantId is properly set
          const variantId = sp.variantId || (sp.variants && sp.variants.length > 0 ? sp.variants[0].id : null);
          
          if (!variantId) {
            console.error('⚠️ Shopify product missing variantId:', sp.id, sp.title);
          }
          
          return {
            id: `shopify_${sp.id}`,
            shopifyId: sp.id,
            name: sp.title,
            slug: `shopify_${sp.handle}`,
            description: sp.description || '',
            price: sp.price || 0,
            display_price: sp.price || 0,
            compareAtPrice: sp.compareAtPrice || null,
            category: sp.productType || 'Shopify',
            image: sp.image || (imageUrlArray.length > 0 ? imageUrlArray[0] : '/placeholder.jpg'),
            images: imageUrlArray, // Array of URL strings for getPrimaryProductImage
            tags: sp.tags || [],
            top_pick: false,
            inventory: sp.availableForSale ? 99 : 0, // Shopify doesn't provide quantity
            availableForSale: sp.availableForSale,
            vendor: sp.vendor || '',
            source: 'shopify',
            handle: sp.handle,
            variantId: variantId, // CRITICAL for checkout
            shopifyVariantId: variantId, // Also set this for compatibility
            variants: sp.variants || [],
            // Apply pricing logic
            pricing: {
              basePrice: sp.price || 0,
              retailPrice: calculatePrice({ cost: sp.price || 0, role: 'retail' }),
              studentPrice: calculatePrice({ cost: sp.price || 0, role: 'student' }),
              wholesalePrice: calculatePrice({ cost: sp.price || 0, role: 'wholesale', approved: true }),
            }
          };
        });

        // Combine database and Shopify products
        let nextProducts = [...dbProducts, ...transformedShopifyProducts];

        // Apply filters
        if (searchValue) {
          const searchLower = searchValue.toLowerCase();
          nextProducts = nextProducts.filter((product) => 
            (product.name || '').toLowerCase().includes(searchLower) ||
            (product.description || '').toLowerCase().includes(searchLower) ||
            (product.category || '').toLowerCase().includes(searchLower) ||
            (product.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        if (selectedCategory) {
          nextProducts = nextProducts.filter((product) => 
            (product.category || '').toLowerCase() === selectedCategory.toLowerCase()
          );
        }

        if (minPrice > 0) {
          nextProducts = nextProducts.filter((product) => Number(product.display_price || product.price || 0) >= minPrice);
        }

        if (maxPrice > 0) {
          nextProducts = nextProducts.filter((product) => Number(product.display_price || product.price || 0) <= maxPrice);
        }

        if (inStockOnly) {
          nextProducts = nextProducts.filter((product) => 
            (product.inventory_count || product.inventory || 0) > 0 || product.availableForSale
          );
        }

        if (topPickOnly) {
          nextProducts = nextProducts.filter((product) => product.top_pick);
        }

        // Apply sorting
        if (sort === "price_asc") {
          nextProducts = [...nextProducts].sort((a, b) => 
            Number(a.display_price || a.price || 0) - Number(b.display_price || b.price || 0)
          );
        } else if (sort === "price_desc") {
          nextProducts = [...nextProducts].sort((a, b) => 
            Number(b.display_price || b.price || 0) - Number(a.display_price || a.price || 0)
          );
        } else if (sort === "popular") {
          nextProducts = [...nextProducts].sort((a, b) => Number(b.top_pick) - Number(a.top_pick));
        } else if (sort === "newest") {
          // Sort by source - database products first, then Shopify
          nextProducts = [...nextProducts].sort((a, b) => {
            const aOrder = a.source === 'shopify' ? 1 : 0;
            const bOrder = b.source === 'shopify' ? 1 : 0;
            return aOrder - bOrder;
          });
        }

        setProducts(nextProducts);
        setTotalCount(nextProducts.length);
      } catch (error) {
        console.error("Products fetch error:", error);
        setProducts([]);
        setTotalCount(0);
        setLoadError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSupportData = async () => {
      const [{ data: authData }, productsResponse, shopifyProducts] = await Promise.all([
        supabase.auth.getUser(),
        fetch("/api/public-products?limit=200", { headers: await getAuthHeaders() }),
        getShopifyProducts(50),
      ]);

      const payload = await productsResponse.json();
      const allProducts = payload.products || [];

      // Transform Shopify products for top picks
      const transformedShopifyProducts = shopifyProducts.slice(0, 10).map((sp) => ({
        id: `shopify_${sp.id}`,
        name: sp.title,
        slug: `shopify_${sp.handle}`,
        price: sp.price,
        display_price: sp.price,
        category: sp.productType || 'Shopify',
        image: sp.image,
        top_pick: true,
        source: 'shopify',
      }));

      setTopPicks([...allProducts.filter((product) => product.top_pick).slice(0, 12), ...transformedShopifyProducts]);
      
      // Combine categories from all sources - ensure all categories are included
      const dbCategories = allProducts.map((product) => product.category).filter(Boolean);
      const shopifyCategories = shopifyProducts.map(p => p.productType).filter(Boolean);
      const womanCategories = ['Woman']; // Add Woman category explicitly
      const petCategories = ['Pets']; // Add Pets category explicitly (plural)
      
      // Log categories for debugging
      console.log('📂 DB Categories:', [...new Set(dbCategories)]);
      console.log('📂 Shopify Categories:', [...new Set(shopifyCategories)]);
      console.log('📂 Added Categories:', womanCategories, petCategories);
      
      // Combine and deduplicate categories - include all sources
      const allCategories = [...new Set([...dbCategories, ...shopifyCategories, ...womanCategories, ...petCategories])];
      setCategories(sortCategories(allCategories));
      setCurrentUser(authData?.user || null);

      try {
        setRecentlyViewed(JSON.parse(localStorage.getItem("recentlyViewedProducts") || "[]"));
      } catch (error) {
        console.error("Recently viewed unavailable:", error);
      }
    };

    fetchProducts();
    fetchSupportData();
  }, [router.isReady, router.query.page, router.query.search, router.query.category, router.query.min, router.query.max, router.query.in_stock, router.query.top_pick, router.query.sort]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const localWishlist = JSON.parse(localStorage.getItem("wishlistProducts") || "[]");

        if (!currentUser?.id) {
          setWishlist(localWishlist);
          return;
        }

        const { data } = await supabase
          .from("wishlists")
          .select("product_id")
          .eq("user_id", currentUser.id);

        const merged = Array.from(new Set([...(data || []).map((item) => item.product_id), ...localWishlist]));
        setWishlist(merged);
      } catch (error) {
        console.error("Wishlist load failed:", error);
      }
    };

    loadWishlist();
  }, [currentUser?.id]);

  useEffect(() => {
    // Countdown timer for urgency
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft("00:00:00");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateQuery = (updates) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          ...updates,
          page: updates.page ?? 1,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const goToPage = (nextPage) => updateQuery({ page: nextPage });

  const toggleWishlist = async (productId) => {
    const isSaved = wishlist.includes(productId);
    const next = isSaved ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];
    setWishlist(next);

    try {
      localStorage.setItem("wishlistProducts", JSON.stringify(next));
    } catch (error) {
      console.error("Wishlist local save failed:", error);
    }

    if (!currentUser?.id) return;

    try {
      if (isSaved) {
        await supabase.from("wishlists").delete().eq("user_id", currentUser.id).eq("product_id", productId);
      } else {
        await supabase.from("wishlists").upsert([{ user_id: currentUser.id, product_id: productId }], {
          onConflict: "user_id,product_id",
        });
      }
    } catch (error) {
      console.error("Wishlist sync failed:", error);
    }
  };

  const resultsLabel = useMemo(() => {
    const shown = products.length;
    return `Showing ${shown} of ${totalCount} products`;
  }, [products.length, totalCount]);

  const renderFilterControls = () => (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm font-semibold text-gray-300 uppercase tracking-[0.2em]">Category</p>
        <div className="space-y-3">
          <button
            onClick={() => updateQuery({ category: undefined })}
            className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${
              !selectedCategory 
                ? "bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black border-transparent font-semibold shadow-lg shadow-[#D4AF37]/30" 
                : "border-white/30 text-gray-300 hover:bg-white/10"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => updateQuery({ category })}
              className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${
                selectedCategory === category 
                  ? "bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black border-transparent font-semibold shadow-lg shadow-[#D4AF37]/30" 
                  : "border-white/30 text-gray-300 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm font-semibold text-gray-300 uppercase tracking-[0.2em]">Price Range</p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            min="0"
            value={minPrice || ""}
            onChange={(event) => updateQuery({ min: event.target.value || undefined })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
            placeholder="Min Price"
          />
          <input
            type="number"
            min="0"
            value={maxPrice || ""}
            onChange={(event) => updateQuery({ max: event.target.value || undefined })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
            placeholder="Max Price"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between px-6 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300">
          <span className="text-sm font-semibold text-gray-300">In Stock Only</span>
          <input 
            type="checkbox" 
            checked={inStockOnly} 
            onChange={(event) => updateQuery({ in_stock: event.target.checked ? "true" : undefined })} 
            className="w-4 h-4 text-[#D4AF37] bg-white/10 border-white/30 rounded focus:ring-[#D4AF37] focus:ring-2"
          />
        </label>
        <label className="flex items-center justify-between px-6 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300">
          <span className="text-sm font-semibold text-gray-300">Top Picks Only</span>
          <input 
            type="checkbox" 
            checked={topPickOnly} 
            onChange={(event) => updateQuery({ top_pick: event.target.checked ? "true" : undefined })} 
            className="w-4 h-4 text-[#D4AF37] bg-white/10 border-white/30 rounded focus:ring-[#D4AF37] focus:ring-2"
          />
        </label>
      </div>

      <div>
        <p className="mb-4 text-sm font-semibold text-gray-300 uppercase tracking-[0.2em]">Sort</p>
        <select
          value={sort}
          onChange={(event) => updateQuery({ sort: event.target.value })}
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Shop Retail Inventory | Ready-to-Ship Products — KV Garage</title>
        <meta
          name="description"
          content="Browse ready-to-ship retail products sourced for quality and resale potential. Single-unit and bulk purchasing available with tiered pricing."
        />
        <link rel="canonical" href={buildCanonicalUrl("/shop")} />
        <meta property="og:title" content="Shop Retail Inventory | Ready-to-Ship Products — KV Garage" />
        <meta property="og:description" content="Browse ready-to-ship retail products sourced for quality and resale potential. Single-unit and bulk purchasing available with tiered pricing." />
        <meta property="og:url" content={buildCanonicalUrl("/shop")} />
        <meta property="og:image" content={buildCanonicalUrl("/logo/Kv%20garage%20icon.png")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shop Retail Inventory | Ready-to-Ship Products — KV Garage" />
        <meta name="twitter:description" content="Browse ready-to-ship retail products sourced for quality and resale potential. Single-unit and bulk purchasing available with tiered pricing." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* 🔥 URGENT HEADER BANNER */}
        <div className="bg-gradient-to-r from-green-600/20 via-green-700/20 to-green-800/20 border border-green-500/30 text-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIVE INVENTORY</span>
              </div>
              <span className="text-sm text-gray-300">Real-time stock updates - quantities change frequently</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-green-300">TIME LEFT:</span>
              <span className="text-white font-bold">{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* 🔥 ACCOUNT STATUS BANNER */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className={`border rounded-2xl p-8 ${
              role === "retail" 
                ? "bg-gradient-to-r from-red-900/10 to-transparent border-red-500/20" 
                : role === "student"
                ? "bg-gradient-to-r from-yellow-900/10 to-transparent border-yellow-500/20"
                : "bg-gradient-to-r from-green-900/10 to-transparent border-green-500/20"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-2">Account Access Level</p>
                  <p className="text-2xl font-bold mb-3">
                    {role === "retail" && "Retail Buyer"}
                    {role === "student" && "Reseller Account"}
                    {role === "wholesale" && "Wholesale Account"}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                    {role === "retail" &&
                      "You are browsing with standard retail access. Pricing reflects single-unit purchasing. Create an account to unlock structured pricing and better margins."}
                    {role === "student" &&
                      "Your account is optimized for reselling. Pricing improves as order size increases, allowing for better margins."}
                    {role === "wholesale" &&
                      "You are accessing supply-level pricing designed for volume purchasing and scalable operations."}
                  </p>
                </div>
                {role === "retail" && (
                  <div className="text-right">
                    <Link href="/signup">
                      <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                        Unlock Better Pricing
                      </button>
                    </Link>
                    <p className="text-xs text-gray-400 mt-3">Join 15,000+ successful operators</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 HERO SECTION */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-8">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-[#D4AF37]/30">KV GARAGE</span>
                  <span className="text-gray-400 text-sm border border-white/20 px-4 py-2 rounded-full">EST. 2022</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                    Retail
                  </span>
                  <br />
                  <span className="text-gray-300">Inventory</span>
                </h1>

                <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl">
                  Browse ready-to-ship retail products sourced for quality, resale potential, and clean sell-through. 
                  Search, filter, and sort the full catalog with real-time inventory updates and tiered pricing.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-3">1,000+</div>
                    <div className="text-sm text-gray-300">Products Available</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-3">Real-time</div>
                    <div className="text-sm text-gray-300">Inventory Updates</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-3">Tiered</div>
                    <div className="text-sm text-gray-300">Pricing Structure</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/30 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-3">Global</div>
                    <div className="text-sm text-gray-300">Supplier Network</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/signup">
                    <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105">
                      Create Account
                    </button>
                  </Link>
                  
                  <Link href="/wholesale">
                    <button className="border border-white/30 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                      Explore Wholesale
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">97%</div>
                      <div className="text-sm text-gray-300">Customer Satisfaction</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">24/7</div>
                      <div className="text-sm text-gray-300">Support Available</div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">48 Hours</div>
                      <div className="text-sm text-gray-300">Average Shipping</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">30 Days</div>
                      <div className="text-sm text-gray-300">Return Policy</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 SEARCH & FILTER SECTION */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="relative">
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="w-full px-8 py-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 text-lg"
                  placeholder="Search name, description, category, or tags..."
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  🔍
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Results</div>
                  <div className="text-xl font-semibold">{resultsLabel}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-2">Page</div>
                  <div className="text-xl font-semibold">{page}</div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="hidden lg:block bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
                {renderFilterControls()}
              </aside>

              <div>
                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <ProductSkeleton key={index} />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-12 text-center">
                    <div className="text-6xl mb-6">📦</div>
                    <h2 className="text-3xl font-bold mb-4">{loadError || "No products matched your filters"}</h2>
                    <p className="text-gray-400 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                      {loadError || "Try adjusting search terms, category, or price range to widen the catalog."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <button
                        onClick={() => {
                          updateQuery({
                            category: undefined,
                            min: undefined,
                            max: undefined,
                            in_stock: undefined,
                            top_pick: undefined,
                            search: undefined
                          });
                        }}
                        className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-10 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                      >
                        Clear All Filters
                      </button>
                      <Link href="/wholesale">
                        <button className="border border-white/30 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                          Explore Wholesale
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => {
                      const productUrl = `/shop/${product.slug || product.id}`;
                      const displayImage = getPrimaryProductImage(product);
                      const isWishlisted = wishlist.includes(product.id);

                      return (
                        <div key={product.id} className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                          <div className="absolute top-4 right-4 z-10">
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              className={`p-4 rounded-full border transition-all duration-300 ${
                                isWishlisted 
                                  ? "border-red-500/50 bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20" 
                                  : "border-white/30 bg-white/10 text-gray-400 hover:bg-white/20"
                              }`}
                              aria-label="Toggle wishlist"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>

                          <Link href={productUrl} className="block">
                            <div className="aspect-square w-full mb-6 rounded-xl overflow-hidden bg-white/10">
                              <img 
                                src={displayImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <h3 className="font-semibold text-xl line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">{product.name}</h3>
                              <p className="text-sm text-gray-400 capitalize">{product.category || "Uncategorized"}</p>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  {/* Show original price with strikethrough if discounted */}
                                  {product.retail_price && product.display_price < product.retail_price ? (
                                    <>
                                      <p className="text-sm text-gray-500 line-through">${Number(product.retail_price).toFixed(2)}</p>
                                      <p className="text-3xl font-bold text-[#D4AF37]">${Number(product.display_price || product.price || 0).toFixed(2)}</p>
                                      <span className="inline-block mt-1 bg-green-600/20 text-green-400 px-2 py-0.5 rounded text-xs font-semibold">
                                        {product.discountType === 'volume' ? '📦 Volume' : '💰 Cart'} -{Math.round((1 - product.display_price / product.retail_price) * 100)}%
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-3xl font-bold text-[#D4AF37]">${Number(product.display_price || product.price || 0).toFixed(2)}</p>
                                      {product.price_note && (
                                        <p className="text-sm text-[#B78B16] mt-2">{product.price_note}</p>
                                      )}
                                    </>
                                  )}
                                </div>
                                {product.top_pick && (
                                  <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-[#D4AF37]/30">
                                    TOP PICK
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>

                          <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex gap-4">
                              <button
                                onClick={() => {
                                  // Debug: Log the product's variantId
                                  console.log('🔍 Product variantId:', product.variantId);
                                  console.log('🔍 Product shopifyId:', product.shopifyId);
                                  console.log('🔍 Product variants:', product.variants?.slice(0, 2));
                                  
                                  // CRITICAL: For Shopify products, use variantId as the ID
                                  const itemToAdd = {
                                    id: product.variantId || product.id, // Use variantId for Shopify products
                                    name: product.name,
                                    price: product.display_price || product.price,
                                    quantity: 1,
                                    image: displayImage,
                                    category: product.category || "general",
                                    // Include Shopify-specific fields for checkout
                                    shopifyId: product.shopifyId || null,
                                    shopifyVariantId: product.variantId || null,
                                    variantId: product.variantId || null,
                                    isShopify: !!product.shopifyId,
                                  };
                                  console.log('🛒 ADDING TO CART:', itemToAdd);
                                  addToCart(itemToAdd);
                                }}
                                className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                              >
                                Add to Cart
                              </button>
                              <button
                                type="button"
                                onClick={() => setQuickViewProduct(product)}
                                className="border border-white/30 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300"
                              >
                                Quick View
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Page {page} of {totalPages} • {totalCount} total products
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => goToPage(Math.max(1, page - 1))} 
                        disabled={page === 1} 
                        className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Previous
                      </button>
                      <button 
                        onClick={() => goToPage(Math.min(totalPages, page + 1))} 
                        disabled={page === totalPages} 
                        className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 TOP PICKS SECTION */}
        {topPicks.length > 0 && (
          <section className="py-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-5xl font-bold mb-4">Top Picks</h2>
                  <p className="text-xl text-gray-300">Curated high-performing inventory with proven sell-through rates</p>
                </div>
                <Link href="/wholesale">
                  <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                    View All Inventory
                  </button>
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {topPicks.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug || product.id}`}
                    className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105"
                  >
                    <div className="aspect-square w-full mb-6 rounded-xl overflow-hidden bg-white/10">
                      <img
                        src={getPrimaryProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-xl line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">{product.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                      <p className="text-3xl font-bold text-[#D4AF37]">${Number(product.display_price || product.price || 0).toFixed(2)}</p>
                      <span className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-[#D4AF37]/30">
                        <span className="w-3 h-3 bg-black rounded-full"></span>
                        Top Performer
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 🔥 RECENTLY VIEWED */}
        {recentlyViewed.length > 0 && (
          <section className="py-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-5xl font-bold">Recently Viewed</h2>
                <p className="text-xl text-gray-300">Resume where you left off</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {recentlyViewed.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug || product.id}`}
                    className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105"
                  >
                    <div className="aspect-square w-full mb-6 rounded-xl overflow-hidden bg-white/10">
                      <img
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-xl line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">{product.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                      <p className="text-3xl font-bold text-[#D4AF37]">${Number(product.display_price || product.price || 0).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 🔥 VALUE PROPOSITION */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-bold mb-8">Built for Success</h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Whether you're testing products, building a reselling business, or scaling operations, 
                our retail inventory system is designed to grow with you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 rounded-2xl p-10 text-center hover:border-blue-500/40 transition-all duration-500 hover:scale-105">
                <div className="text-6xl mb-6">🛒</div>
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-6">Direct Retail Access</h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Purchase inventory immediately with no account required. Ideal for testing products 
                  or single-unit buying with instant access to our full catalog.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/10 to-transparent border border-green-500/20 rounded-2xl p-10 text-center hover:border-green-500/40 transition-all duration-500 hover:scale-105">
                <div className="text-6xl mb-6">📈</div>
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-6">Volume-Based Pricing</h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Increase order size to unlock improved pricing automatically. Designed to reward 
                  scale and consistency with transparent margin structures.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-2xl p-10 text-center hover:border-purple-500/40 transition-all duration-500 hover:scale-105">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-6">Scalable Supply System</h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Structured for growth. Transition from retail to reseller to wholesale with 
                  optimized pricing at each level. Your success is our priority.
                </p>
              </div>
            </div>

            <div className="mt-20 text-center">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-12">
                <h3 className="text-4xl font-bold mb-6">Ready to Start?</h3>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-4xl mx-auto">
                  Join 15,000+ operators who have transformed their businesses with our premium 
                  inventory and institutional-grade support system.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/signup">
                    <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-12 py-5 rounded-xl font-bold text-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                      Create Account
                    </button>
                  </Link>
                  <Link href="/wholesale">
                    <button className="border border-white/30 text-white px-12 py-5 rounded-xl font-semibold text-xl hover:bg-white hover:text-black transition-all duration-300">
                      Explore Wholesale
                    </button>
                  </Link>
                </div>
                <div className="mt-8 text-lg text-gray-400">
                  24/7 Support • 30-Day Returns • Global Shipping
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 MOBILE FILTER DRAWER */}
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
            <div className="ml-auto h-full w-[90vw] max-w-sm overflow-y-auto bg-gradient-to-br from-white/5 to-transparent border border-white/20 p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button onClick={() => setFilterDrawerOpen(false)} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Close</button>
              </div>
              {renderFilterControls()}
            </div>
          </div>
        )}

        {/* 🔥 QUICK VIEW MODAL */}
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 bg-black/50 p-6">
            <div className="mx-auto mt-16 max-w-5xl rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/20 p-10 shadow-2xl">
              <div className="mb-8 flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-3">Quick View</p>
                  <h2 className="text-4xl font-bold">{quickViewProduct.name}</h2>
                  <p className="text-sm text-gray-400 capitalize mt-3">{quickViewProduct.category}</p>
                </div>
                <button onClick={() => setQuickViewProduct(null)} className="text-gray-400 hover:text-white transition-colors duration-300 text-3xl">×</button>
              </div>
              
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-white/10">
                  <img
                    src={getPrimaryProductImage(quickViewProduct)}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-sm text-gray-400 mb-3">Price</p>
                    <p className="text-5xl font-bold text-[#D4AF37]">${Number(quickViewProduct.display_price || quickViewProduct.price || 0).toFixed(2)}</p>
                    {quickViewProduct.price_note && (
                      <p className="text-sm text-[#B78B16] mt-3">{quickViewProduct.price_note}</p>
                    )}
                  </div>
                  
                  {quickViewProduct.description && (
                    <div>
                      <p className="text-sm text-gray-400 mb-3">Description</p>
                      <p className="text-lg text-gray-300 leading-relaxed">
                        {String(quickViewProduct.description).replace(/<[^>]*>/g, " ")}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-6">
                    <button
                      onClick={() =>
                        addToCart({
                          id: quickViewProduct.id,
                          name: quickViewProduct.name,
                          price: quickViewProduct.display_price || quickViewProduct.price,
                          quantity: 1,
                          image: getPrimaryProductImage(quickViewProduct),
                          category: quickViewProduct.category || "general",
                        })
                      }
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-5 px-8 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                    <Link href={`/shop/${quickViewProduct.slug || quickViewProduct.id}`} className="border border-white/30 text-white px-8 py-5 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}