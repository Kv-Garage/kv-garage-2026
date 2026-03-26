import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import Head from "next/head";
import Link from "next/link";
import { getPrimaryProductImage } from "../lib/productFields";
import { buildCanonicalUrl } from "../lib/seo";
import { getSiteSettingsClient } from "../lib/siteSettings";

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Home() {

  const [dbProducts, setDbProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [calculatorProducts, setCalculatorProducts] = useState([]);
  const [selectedProfitProductId, setSelectedProfitProductId] = useState("");
  const [profitQuantity, setProfitQuantity] = useState(1);
  const [profitSearch, setProfitSearch] = useState("");
  const [profitResult, setProfitResult] = useState(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const productSelectRef = useRef(null);
  const productSearchInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchProfile();
    loadSiteSettings();
    fetchCalculatorProducts();

    const interval = setInterval(() => {
      fetchProducts();
      fetchCalculatorProducts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/public?limit=200", {
        headers: await getAuthHeaders(),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Could not load live inventory");
      }

      setDbProducts(payload.products || []);
    } catch (error) {
      console.error("Products fetch error:", error);
      setDbProducts([]);
    }
  };

  const fetchCalculatorProducts = async () => {
    try {
      const response = await fetch("/api/products/public", {
        headers: await getAuthHeaders(),
      });
      const payload = await response.json();
      setCalculatorProducts(payload.products || []);
    } catch (error) {
      console.error("Calculator inventory failed:", error);
      setCalculatorProducts([]);
    }
  };

  const loadSiteSettings = async () => {
    const settings = await getSiteSettingsClient();
    setSiteSettings(settings);
  };

  const fetchProfile = async () => {
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.user.id)
      .single();

    setProfile(data);
  };

  const products = dbProducts.length > 0 ? dbProducts : [];
  const topPicks = products.filter((product) => product.top_pick).slice(0, 4);
  const newArrivals = products.filter((product) => !product.top_pick).slice(0, 8);
  const liveInventory = products.slice(0, 30);
  const selectedProfitProduct =
    calculatorProducts.find((product) => product.id === selectedProfitProductId) ||
    calculatorProducts[0] ||
    null;
  const filteredCalculatorProducts = useMemo(
    () =>
      calculatorProducts.filter((product) =>
        String(product.name || "")
          .toLowerCase()
          .includes(profitSearch.toLowerCase())
      ),
    [calculatorProducts, profitSearch]
  );

  // 🔥 PRICING LOGIC
  const getPrice = (p) => {
    if (p?.display_price != null) {
      return p.display_price;
    }

    if (profile?.role === "student") {
      return p.student_price || p.price;
    }

    if (profile?.role === "wholesale" && profile?.approved) {
      return p.wholesale_price || p.price;
    }

    return p.retail_price || p.price;
  };

  const getMOQ = (p) => {
    if (p.type === "bundle") return p.bundle_quantity || 4;
    return p.moq || 1;
  };

  const getInventoryCount = (p) => {
    const raw =
      p?.inventory_count ??
      p?.inventory ??
      p?.stock ??
      p?.quantity_available ??
      p?.available_quantity;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const getUrgencyText = (p) => {
    const inventory = getInventoryCount(p);
    if (inventory != null && inventory < 10) return `Only ${inventory} left in stock`;
    return "Selling fast";
  };

  useEffect(() => {
    if (!selectedProfitProductId && calculatorProducts[0]?.id) {
      setSelectedProfitProductId(calculatorProducts[0].id);
    }
  }, [selectedProfitProductId, calculatorProducts]);

  useEffect(() => {
    const calculateProfit = async () => {
      if (!selectedProfitProductId) return;

      try {
        const response = await fetch("/api/calculator/profit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(await getAuthHeaders()),
          },
          body: JSON.stringify({
            productId: selectedProfitProductId,
            quantity: profitQuantity,
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Could not calculate profit");
        }

        setProfitResult(payload);
      } catch (error) {
        console.error(error);
        setProfitResult(null);
      }
    };

    calculateProfit();
  }, [selectedProfitProductId, profitQuantity]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!productSelectRef.current?.contains(event.target)) {
        setProductDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (productDropdownOpen) {
      window.requestAnimationFrame(() => {
        productSearchInputRef.current?.focus();
      });
    }
  }, [productDropdownOpen]);

  return (
    <>
      <Head>
        <title>KV Garage — Verified Wholesale Supplier | Retail, Mentorship & Trade Education</title>
        <meta
          name="description"
          content="KV Garage is your premier source for verified wholesale products, retail inventory, supplier sourcing, trade education, and business mentorship. Build your supply chain from the ground up."
        />
        <link rel="canonical" href={buildCanonicalUrl("/")} />
        <meta property="og:title" content="KV Garage — Verified Wholesale Supplier | Retail, Mentorship & Trade Education" />
        <meta
          property="og:description"
          content="KV Garage is your premier source for verified wholesale products, retail inventory, supplier sourcing, trade education, and business mentorship. Build your supply chain from the ground up."
        />
        <meta property="og:url" content={buildCanonicalUrl("/")} />
        <meta property="og:image" content={buildCanonicalUrl("/logo/Kv%20garage%20icon.png")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KV Garage — Verified Wholesale Supplier | Retail, Mentorship & Trade Education" />
        <meta
          name="twitter:description"
          content="Wholesale supplier, verified products, retail inventory, dropshipping, supply chain, trade education, and business mentorship in one structured ecosystem."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteSettings?.site_name || "KV Garage",
              url: buildCanonicalUrl("/"),
              logo: buildCanonicalUrl(siteSettings?.logo_url || "/logo/Kv%20garage%20icon.png"),
              description:
                "KV Garage is a verified wholesale supplier and retail inventory platform built for supply chain growth, trade education, and business mentorship.",
              sameAs: [],
            }),
          }}
        />
      </Head>

      <div className="min-h-screen text-white relative overflow-hidden">

        {/* 🔥 GLOW */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#D4AF37]/25 blur-[140px] rounded-full"></div>

        {/* ================= HERO ================= */}
        <section className="py-20 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <div>
              <h1 className="text-5xl font-semibold mb-6 leading-tight">
                Source Inventory → Sell → Scale
              </h1>

              <p className="text-gray-400 mb-8">
                Wholesale supply and scalable systems.
              </p>

              <div className="flex gap-4">
                <Link href="/wholesale">
                  <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl">
                    Enter Wholesale
                  </button>
                </Link>

                <Link href="/shop">
                  <button className="border border-[#D4AF37] px-8 py-4 rounded-xl">
                    Shop Retail
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-4">

              {/* 🔥 TOP PICKS */}
              <div className="grid grid-cols-2 gap-4">
                {(topPicks.slice(0, 2).length > 0 ? topPicks.slice(0, 2) : products.slice(0, 2)).map((p, i) => (
                  <Link key={i} href={`/shop/${p.slug}`}>
                    <div className="bg-[#111827] p-4 rounded-xl border border-[#1C2233] hover:border-[#D4AF37] transition">

                      <img src={getPrimaryProductImage(p)} className="h-24 w-full object-cover rounded mb-2" loading="lazy" alt={p.name} />

                      <p className="text-xs text-[#D4AF37]">Top Pick</p>
                      <p className="font-semibold">{p.name}</p>

                      <p className="text-xs text-gray-400">
                        Min Order: {getMOQ(p)} Units
                      </p>

                      <p className="text-xs text-gray-500">
                        ${Number(getPrice(p)).toFixed(2)}
                      </p>

                    </div>
                  </Link>
                ))}
              </div>

              {/* 🔥 WHOLESALE BLOCK */}
              <div className="bg-[#111827] p-5 rounded-xl border border-[#1C2233]">

                <h3 className="text-sm text-[#D4AF37] mb-2">
                  Wholesale Supply Model
                </h3>

                <p className="text-xs text-gray-400 mb-4">
                  Built for resellers, store owners, and volume buyers. Products require minimum quantities and offer better pricing at scale.
                </p>

                <div className="flex flex-col gap-2 text-xs text-gray-300 mb-4">
                  <span>• MOQ Based Pricing</span>
                  <span>• Bundle Inventory Available</span>
                  <span>• Weekly Supply Updates</span>
                </div>

                <div className="flex gap-2">
                  <Link href="/apply">
                    <button className="flex-1 bg-[#D4AF37] text-black py-2 rounded text-xs font-semibold">
                      Apply for Wholesale
                    </button>
                  </Link>

                  <Link href="/shop">
                    <button className="flex-1 border border-gray-500 py-2 rounded text-xs">
                      Shop Retail
                    </button>
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </section>

        <section className="py-16 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Featured Inventory</p>
                <h2 className="mt-2 text-3xl font-semibold">Top Picks</h2>
              </div>
              <Link href="/shop" className="text-sm text-[#D4AF37]">
                Shop All
              </Link>
            </div>

            {topPicks.length === 0 ? (
              <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#111827] px-6 py-10 text-center text-[#F4D67A]">
                Top picks coming soon
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {topPicks.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug || product.id}`}
                    className="group rounded-[28px] border border-[#1C2233] bg-[#111827] p-4 transition hover:-translate-y-1 hover:border-[#D4AF37]/60"
                  >
                    <div className="relative overflow-hidden rounded-[22px]">
                      <img
                        src={getPrimaryProductImage(product)}
                        alt={product.name}
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-[#D4AF37] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black">
                        Top Pick
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">{product.category || "General"}</p>
                      <p className="mt-2 line-clamp-2 text-lg font-semibold">{product.name}</p>
                      <p className="mt-3 text-lg font-semibold text-[#D4AF37]">${Number(getPrice(product)).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-b border-[#1C2233] py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#D4AF37]">Just In</p>
                <h2 className="mt-2 text-2xl font-semibold">Fresh Inventory</h2>
              </div>
              <Link href="/shop" className="text-sm text-[#D4AF37]">
                See All Inventory →
              </Link>
            </div>

            {newArrivals.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-3">
                {newArrivals.map((product) => {
                  const isNew = Date.now() - new Date(product.created_at || Date.now()).getTime() <= 7 * 24 * 60 * 60 * 1000;
                  return (
                    <Link
                      key={`${product.id}-strip`}
                      href={`/shop/${product.slug || product.id}`}
                      className="flex min-w-[280px] items-center gap-4 rounded-2xl border border-[#1C2233] bg-[#111827] p-4"
                    >
                      <img
                        src={getPrimaryProductImage(product)}
                        alt={product.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-white">{product.name}</p>
                        <p className="mt-2 text-sm text-[#D4AF37]">${Number(getPrice(product)).toFixed(2)}</p>
                      </div>
                      {isNew ? (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase text-emerald-300">
                          New
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>

        {/* ================= LIVE INVENTORY ================= */}
        <section className="py-16 border-t border-[#1C2233] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Live Inventory</p>
          </div>

          {liveInventory.length === 0 ? (
            <div className="max-w-7xl mx-auto px-6">
              <div className="rounded-2xl border border-[#1C2233] bg-[#111827] px-6 py-4 text-sm text-gray-300">
                New inventory dropping soon
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#05070D] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#05070D] to-transparent" />
              <div className="group overflow-hidden">
                <div className="flex w-max animate-[inventoryMarquee_60s_linear_infinite] gap-4 group-hover:[animation-play-state:paused]">
                  {[...liveInventory, ...liveInventory].map((item, index) => {
                  const isNew = Date.now() - new Date(item.created_at || Date.now()).getTime() <= 7 * 24 * 60 * 60 * 1000;
                  return (
                    <Link
                      key={`${item.id}-${index}`}
                      href={`/shop/${item.slug || item.id}`}
                      className="flex min-h-[120px] min-w-[210px] max-w-[220px] items-center gap-4 rounded-[22px] border border-[#1C2233] bg-[#111827] px-4 py-4"
                    >
                      <img
                        src={getPrimaryProductImage(item)}
                        className="h-20 w-20 rounded-2xl object-cover"
                        loading="lazy"
                        alt={item.name}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[14px] font-semibold leading-5 text-white">
                          {String(item.name || "Inventory").slice(0, 48)}
                        </p>
                        <p className="mt-2 text-base font-bold text-[#D4AF37]">${Number(getPrice(item)).toFixed(2)}</p>
                      </div>
                      {isNew ? (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase text-emerald-300">
                          New
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
                </div>
              </div>
            </div>
          )}

          <style jsx>{`
            @keyframes inventoryMarquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </section>

        {/* ================= PROFIT TOOL ================= */}
        <section className="py-20 border-t border-[#1C2233] text-center relative">

          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" className="w-full h-full object-cover"/>
          </div>

          <div className="relative z-10">
            <div className="mx-auto max-w-[560px] rounded-[28px] border border-[#1C2233] bg-[#111827] p-4 text-left shadow-2xl shadow-black/20">
              <button
                type="button"
                onClick={() => setCalculatorOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-2xl bg-[#D4AF37] px-5 py-4 text-base font-semibold text-black"
              >
                <span>📊 Profit Calculator</span>
                <span className={`transition-transform duration-300 ${calculatorOpen ? "rotate-180" : ""}`}>▾</span>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ${calculatorOpen ? "max-h-[600px] pt-5" : "max-h-0"}`}>
                <p className="mb-5 text-sm text-gray-300">
                  Model live inventory opportunities using KV Garage retail pricing. Profit math is calculated server-side so supplier cost never appears in the browser.
                </p>

                <div ref={productSelectRef} className="relative w-full max-w-[560px]">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                    Product
                  </label>
                  <button
                    type="button"
                    onClick={() => setProductDropdownOpen((prev) => !prev)}
                    className={`flex w-full items-center gap-3 rounded-md border border-[#1A1A16] bg-white/5 px-4 py-[14px] text-left transition ${productDropdownOpen ? "border-[#C9A84C]/40" : "hover:border-[#C9A84C]/40"}`}
                  >
                    {selectedProfitProduct ? (
                      <img
                        src={getPrimaryProductImage(selectedProfitProduct)}
                        alt={selectedProfitProduct.name}
                        className="h-9 w-9 rounded-md object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-md bg-white/5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {selectedProfitProduct?.name || "Select a product..."}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#C9A84C]">
                      {selectedProfitProduct ? `$${Number(getPrice(selectedProfitProduct)).toFixed(2)}` : ""}
                    </span>
                    <span className={`transition-transform duration-200 ${productDropdownOpen ? "rotate-180" : ""}`}>▾</span>
                  </button>

                  <div
                    className={`absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-md border border-[#C9A84C]/25 bg-[#0D0D0D] shadow-[0_16px_40px_rgba(0,0,0,0.6)] transition-all duration-200 ${productDropdownOpen ? "max-h-[320px]" : "max-h-0 border-transparent"}`}
                  >
                    <input
                      ref={productSearchInputRef}
                      type="text"
                      value={profitSearch}
                      onChange={(event) => setProfitSearch(event.target.value)}
                      placeholder="Search products..."
                      className="w-full border-b border-[#1A1A16] bg-white/5 px-4 py-3 text-[13px] text-[#F4F2EC] outline-none"
                    />
                    <div className="max-h-[260px] overflow-y-auto">
                      {(filteredCalculatorProducts || []).length === 0 ? (
                        <div className="px-4 py-6 text-sm text-[#6B6B5E]">No products found</div>
                      ) : (
                        (filteredCalculatorProducts || []).map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSelectedProfitProductId(product.id);
                              setProductDropdownOpen(false);
                            }}
                            className={`flex h-14 w-full items-center gap-3 border-b border-white/5 px-4 text-left transition last:border-b-0 ${selectedProfitProductId === product.id ? "border-l-2 border-l-[#C9A84C] bg-[#C9A84C]/10" : "hover:bg-[#C9A84C]/[0.06]"}`}
                          >
                            <img src={getPrimaryProductImage(product)} alt={product.name} className="h-9 w-9 rounded-md object-cover" loading="lazy" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-white">{product.name}</p>
                              <p className="truncate text-[11px] text-[#6B6B5E]">{product.category || "General"}</p>
                            </div>
                            <p className="text-sm font-bold text-[#C9A84C]">${Number(getPrice(product)).toFixed(2)}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                    How many units?
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={profitQuantity}
                    onChange={(event) => setProfitQuantity(Math.max(1, Number(event.target.value) || 1))}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-white"
                  />
                </div>

                {profitResult?.product ? (
                  <>
                    <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0B1020] p-4">
                      <img src={getPrimaryProductImage(profitResult.product)} alt={profitResult.product.name} className="h-16 w-16 rounded-2xl object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-white">{profitResult.product.name}</p>
                        <p className="mt-1 text-sm text-[#D4AF37]">Based on KV Garage retail pricing: ${Number(profitResult.sell_price || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Stat label="Sell Price / Unit" value={`$${Number(profitResult.sell_price || 0).toFixed(2)}`} />
                      <Stat label="Total Revenue" value={`$${Number(profitResult.total_revenue || 0).toFixed(2)}`} />
                      <Stat label="Estimated Profit" value={`$${Number(profitResult.estimated_total_profit || 0).toFixed(2)}`} />
                      <Stat label="Profit Margin %" value={`${Number(profitResult.margin_percent || 0).toFixed(1)}%`} />
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-4 text-sm text-[#F8E8A6]">
                      {Number(profitResult.margin_percent || 0) > 60
                        ? "🔥 Exceptional margin — high profit potential"
                        : Number(profitResult.margin_percent || 0) >= 40
                          ? "Strong margin — solid opportunity"
                          : Number(profitResult.margin_percent || 0) >= 20
                            ? "Healthy margin — consistent at volume"
                            : "Thin margin — best at high volume"}
                    </div>
                  </>
                ) : null}

                <p className="mt-5 text-sm leading-relaxed text-[#94A3B8]">
                  Based on avg KV Garage retail pricing. Many resellers achieve margins well above these estimates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES ================= */}
        <section className="py-20 border-t border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

            <ServiceCard title="Mentorship" link="/mentorship" img="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"/>
            <ServiceCard title="Trading" link="/trading" img="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"/>
            <ServiceCard title="We Build Your System" link="/deals" img="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"/>

          </div>
        </section>

      </div>
    </>
  );
}

function Stat({label,value}) {
  return (
    <div className="bg-[#111827] p-6 rounded-xl border border-[#1C2233]">
      <p className="text-gray-400">{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

function ServiceCard({title,link,img}) {
  return (
    <Link href={link}>
      <div className="relative group overflow-hidden rounded-2xl border border-[#1C2233] cursor-pointer">
        <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition"/>
        <div className="relative p-10">
          <h3 className="text-xl">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
