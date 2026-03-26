import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";
import { getPrimaryProductImage } from "../../lib/productFields";
import { buildCanonicalUrl } from "../../lib/seo";
import { useCart } from "../../context/CartContext";
import { sortCategories } from "../../lib/categories";

const PAGE_SIZE = 24;

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-4 h-40 rounded-lg bg-gray-100" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
      <div className="mb-4 h-3 w-1/2 rounded bg-gray-100" />
      <div className="h-4 w-1/3 rounded bg-gray-100" />
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
    const timeout = setTimeout(() => {
      if (!router.isReady) return;

      const nextQuery = {
        ...router.query,
        search: searchInput || undefined,
        page: 1,
      };

      router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
    }, 300);

    return () => clearTimeout(timeout);
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

        const response = await fetch(`/api/public-products?${params.toString()}`, {
          headers: await getAuthHeaders(),
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Could not load products");
        }

        let nextProducts = payload.products || [];

        if (minPrice > 0) {
          nextProducts = nextProducts.filter((product) => Number(product.display_price || product.price || 0) >= minPrice);
        }

        if (maxPrice > 0) {
          nextProducts = nextProducts.filter((product) => Number(product.display_price || product.price || 0) <= maxPrice);
        }

        if (inStockOnly) {
          nextProducts = nextProducts.filter((product) => Number(product.inventory_count || 0) > 0);
        }

        if (topPickOnly) {
          nextProducts = nextProducts.filter((product) => product.top_pick);
        }

        if (sort === "popular") {
          nextProducts = [...nextProducts].sort((a, b) => Number(b.top_pick) - Number(a.top_pick));
        }

        setProducts(nextProducts);
        setTotalCount(payload.totalCount || nextProducts.length || 0);
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
      const [{ data: authData }, productsResponse] = await Promise.all([
        supabase.auth.getUser(),
        fetch("/api/public-products?limit=200", { headers: await getAuthHeaders() }),
      ]);

      const payload = await productsResponse.json();
      const allProducts = payload.products || [];

      setTopPicks(allProducts.filter((product) => product.top_pick).slice(0, 12));
      setCategories(sortCategories(allProducts.map((product) => product.category)));
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
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Category</p>
        <div className="space-y-2">
          <button
            onClick={() => updateQuery({ category: undefined })}
            className={`block w-full rounded-lg border px-4 py-2 text-left text-sm ${!selectedCategory ? "border-black bg-black text-white" : "border-gray-200 text-gray-700"}`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => updateQuery({ category })}
              className={`block w-full rounded-lg border px-4 py-2 text-left text-sm ${selectedCategory === category ? "border-black bg-black text-white" : "border-gray-200 text-gray-700"}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Price Range</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            value={minPrice || ""}
            onChange={(event) => updateQuery({ min: event.target.value || undefined })}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="Min"
          />
          <input
            type="number"
            min="0"
            value={maxPrice || ""}
            onChange={(event) => updateQuery({ max: event.target.value || undefined })}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="Max"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm">
          <span>In Stock only</span>
          <input type="checkbox" checked={inStockOnly} onChange={(event) => updateQuery({ in_stock: event.target.checked ? "true" : undefined })} />
        </label>
        <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm">
          <span>Top Picks only</span>
          <input type="checkbox" checked={topPickOnly} onChange={(event) => updateQuery({ top_pick: event.target.checked ? "true" : undefined })} />
        </label>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Sort</p>
        <select
          value={sort}
          onChange={(event) => updateQuery({ sort: event.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price Low to High</option>
          <option value="price_desc">Price High to Low</option>
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

      <main className="bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
            <p className="text-xs uppercase text-gray-500 mb-1">Account Access</p>
            <p className="text-sm font-semibold mb-2">
              {role === "retail" && "Retail Buyer"}
              {role === "student" && "Reseller Account"}
              {role === "wholesale" && "Wholesale Account"}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {role === "retail" &&
                "You are browsing with standard retail access. Pricing reflects single-unit purchasing. Create an account to unlock structured pricing and better margins."}
              {role === "student" &&
                "Your account is optimized for reselling. Pricing improves as order size increases, allowing for better margins."}
              {role === "wholesale" &&
                "You are accessing supply-level pricing designed for volume purchasing and scalable operations."}
            </p>
            {role === "retail" && (
              <Link href="/signup">
                <button className="mt-3 text-sm bg-black text-white px-4 py-2 rounded-md">Unlock Better Pricing</button>
              </Link>
            )}
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-6 md:px-8 py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-extrabold mb-4">Shop Inventory</h1>
              <div className="w-20 h-[3px] bg-black mb-5" />
              <p className="max-w-2xl text-gray-600 leading-relaxed">
                Browse ready-to-ship retail products sourced for quality, resale potential, and clean sell-through. Search, filter, and sort the full catalog without losing the structure of the current storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium lg:hidden"
            >
              Open Filters
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm"
                placeholder="Search name, description, category, or tags"
              />
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-600">
                <span>{resultsLabel}</span>
                <span>Page {page}</span>
              </div>
            </div>
          </div>
        </section>

        {topPicks.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-8 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Top Picks</h2>
              <p className="text-sm text-gray-500">Curated high-performing inventory</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {topPicks.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug || product.id}`}
                  className="min-w-[220px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <img
                    src={getPrimaryProductImage(product)}
                    alt={product.name}
                    className="h-44 w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                  <p className="mt-4 line-clamp-2 font-semibold">{product.name}</p>
                  <p className="mt-2 text-sm font-medium">${Number(product.display_price || product.price || 0).toFixed(2)}</p>
                  {product.price_note ? <p className="mt-1 text-xs text-[#B78B16]">{product.price_note}</p> : null}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
          <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden lg:block">{renderFilterControls()}</aside>

            <div>
              {loading ? (
                <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-10">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                  <h2 className="text-xl font-semibold">{loadError || "No products matched your filters"}</h2>
                  <p className="mt-3 text-sm text-gray-600">
                    {loadError || "Try adjusting search terms, category, or price range to widen the catalog."}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-10">
                  {products.map((product) => {
                    const productUrl = `/shop/${product.slug || product.id}`;
                    const displayImage = getPrimaryProductImage(product);

                    return (
                      <div key={product.id} className="group relative rounded-xl bg-white p-4 transition-all hover:shadow-xl">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute right-6 top-6 z-10 rounded-full border px-2.5 py-2 text-xs ${wishlist.includes(product.id) ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 bg-white text-gray-500"}`}
                          aria-label="Toggle wishlist"
                        >
                          ♥
                        </button>

                        <Link href={productUrl}>
                          <div className="h-40 w-full object-cover mb-4 rounded-lg overflow-hidden">
                            <img src={displayImage} className="h-full w-full object-cover" alt={product.name} loading="lazy" />
                          </div>
                          <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-gray-500 mb-4">{product.category || "Uncategorized"}</p>
                          <p className="text-sm font-semibold mb-1">${Number(product.display_price || product.price || 0).toFixed(2)}</p>
                          {product.price_note ? <p className="mb-3 text-xs text-[#B78B16]">{product.price_note}</p> : <div className="mb-4" />}
                          <span className="text-sm font-medium">View Product →</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(product)}
                          className="mt-4 hidden w-full rounded-lg border border-black px-4 py-2 text-sm font-medium text-black transition group-hover:block"
                        >
                          Quick View
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                  <div className="flex gap-3">
                    <button onClick={() => goToPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-40">
                      Previous
                    </button>
                    <button onClick={() => goToPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-40">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {recentlyViewed.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recently Viewed</h2>
              <p className="text-sm text-gray-500">Resume where you left off</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewed.map((product) => (
                <Link key={product.id} href={`/shop/${product.slug || product.id}`} className="min-w-[220px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <img src={product.image || "/placeholder.jpg"} alt={product.name} className="h-44 w-full rounded-xl object-cover" loading="lazy" />
                  <p className="mt-4 line-clamp-2 font-semibold">{product.name}</p>
                  <p className="mt-2 text-sm font-medium">${Number(product.display_price || product.price || 0).toFixed(2)}</p>
                  {product.price_note ? <p className="mt-1 text-xs text-[#B78B16]">{product.price_note}</p> : null}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <h2 className="text-3xl font-bold mb-6">Built for Buyers & Resellers</h2>
            <div className="w-16 h-[3px] bg-black mb-10" />
            <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-700">
              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-3">Direct Retail Access</h3>
                <p>Purchase inventory immediately with no account required. Ideal for testing products or single-unit buying.</p>
              </div>
              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-3">Volume-Based Pricing</h3>
                <p>Increase order size to unlock improved pricing automatically. Designed to reward scale and consistency.</p>
              </div>
              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-3">Scalable Supply System</h3>
                <p>Structured for growth. Transition from retail to reseller to wholesale with optimized pricing at each level.</p>
              </div>
            </div>
          </div>
        </section>

        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
            <div className="ml-auto h-full w-[88vw] max-w-sm overflow-y-auto bg-white p-5">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setFilterDrawerOpen(false)} className="text-sm text-gray-500">Close</button>
              </div>
              {renderFilterControls()}
            </div>
          </div>
        )}

        {quickViewProduct && (
          <div className="fixed inset-0 z-50 bg-black/50 p-4">
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Quick View</p>
                  <h2 className="mt-2 text-2xl font-bold">{quickViewProduct.name}</h2>
                </div>
                <button onClick={() => setQuickViewProduct(null)} className="text-sm text-gray-500">Close</button>
              </div>
              <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
                <img
                  src={getPrimaryProductImage(quickViewProduct)}
                  alt={quickViewProduct.name}
                  className="h-64 w-full rounded-xl object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm text-gray-500">{quickViewProduct.category || "Uncategorized"}</p>
                  <p className="mt-3 text-2xl font-semibold">${Number(quickViewProduct.display_price || quickViewProduct.price || 0).toFixed(2)}</p>
                  {quickViewProduct.price_note ? <p className="mt-1 text-sm text-[#B78B16]">{quickViewProduct.price_note}</p> : null}
                  {quickViewProduct.description ? (
                    <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-gray-600">
                      {String(quickViewProduct.description).replace(/<[^>]*>/g, " ")}
                    </p>
                  ) : null}
                  <div className="mt-6 flex flex-wrap gap-3">
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
                      className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
                    >
                      Add to Cart
                    </button>
                    <Link href={`/shop/${quickViewProduct.slug || quickViewProduct.id}`} className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium">
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
