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
  const [emailPopupOpen, setEmailPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
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

  // Email popup logic
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('emailPopupSeen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setEmailPopupOpen(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmailSubmitted(true);
        localStorage.setItem('emailPopupSeen', 'true');
        setTimeout(() => {
          setEmailPopupOpen(false);
          setEmailSubmitted(false);
          setEmail('');
        }, 2000);
      }
    } catch (error) {
      console.error('Email subscription failed:', error);
    }
  };

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

      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white relative overflow-hidden">

        {/* 🔥 GLOW EFFECTS */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl"></div>

        {/* ================= HERO ================= */}
        <section className="section-spacing border-t border-white/20 pt-16">
          <div className="container-responsive grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">EST. 2022</span>
                <span className="text-gray-400 text-sm">Trusted by 1,200+ operators</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                  Source Inventory
                </span>
                <br />
                <span className="text-gray-300">→ Sell → Scale</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Wholesale supply and scalable systems designed for serious operators. 
                Build your supply chain with verified products and institutional-grade support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/wholesale">
                  <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                    Enter Wholesale
                  </button>
                </Link>

                <Link href="/shop">
                  <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                    Shop Retail
                  </button>
                </Link>
              </div>

              {/* 🔥 TRUST INDICATORS */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">7,800+</div>
                  <div className="text-sm text-gray-400">Verified Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">30+</div>
                  <div className="text-sm text-gray-400">Global Markets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">2022</div>
                  <div className="text-sm text-gray-400">Est. Year</div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* 🔥 TOP PICKS */}
              <div className="grid grid-cols-2 gap-6">
                {(topPicks.slice(0, 2).length > 0 ? topPicks.slice(0, 2) : products.slice(0, 2)).map((p, i) => (
                  <Link key={i} href={`/shop/${p.slug}`}>
                    <div className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                      <div className="aspect-square w-full mb-4 rounded-xl overflow-hidden bg-white/10">
                        <img src={getPrimaryProductImage(p)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" alt={p.name} />
                      </div>
                      
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-black rounded-full"></span>
                          Top Pick
                        </span>
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">{p.name}</h3>
                        <p className="text-sm text-gray-400">Min Order: {getMOQ(p)} Units</p>
                        <p className="text-2xl font-bold text-[#D4AF37]">${Number(getPrice(p)).toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 🔥 WHOLESALE BLOCK */}
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                  <h3 className="text-2xl font-bold text-[#D4AF37]">Wholesale Supply Model</h3>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  Built for resellers, store owners, and volume buyers. Products require minimum quantities and offer better pricing at scale.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="text-2xl mb-2">📦</div>
                    <div className="font-semibold mb-1">MOQ Based Pricing</div>
                    <div className="text-sm text-gray-400">Better margins at volume</div>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="font-semibold mb-1">Bundle Inventory</div>
                    <div className="text-sm text-gray-400">Pre-packaged deals</div>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="font-semibold mb-1">Weekly Updates</div>
                    <div className="text-sm text-gray-400">Fresh inventory drops</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/apply">
                    <button className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                      Apply for Wholesale
                    </button>
                  </Link>

                  <Link href="/shop">
                    <button className="flex-1 border border-white/30 text-white py-4 px-6 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300">
                      Shop Retail
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= FEATURED INVENTORY ================= */}
        <section className="section-spacing border-t border-white/20">
          <div className="container-responsive">
            <div className="mb-12 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">FEATURED INVENTORY</span>
                <span className="text-gray-400 text-sm">EST. 2022</span>
              </div>
              
              <h2 className="text-5xl font-bold mb-6">Top Picks</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Curated high-performing inventory with proven sell-through rates and exceptional margins
              </p>
            </div>

            {topPicks.length === 0 ? (
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-4">Top picks coming soon</h3>
                <p className="text-gray-400">Check back for our curated selection of high-performing products</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {topPicks.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug || product.id}`}
                    className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105"
                  >
                    <div className="aspect-square w-full mb-6 rounded-xl overflow-hidden bg-white/10">
                      <img
                        src={getPrimaryProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">TOP PICK</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-sm text-gray-400 uppercase tracking-wider">{product.category || "General"}</div>
                      <h3 className="text-2xl font-bold line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-[#D4AF37]">${Number(getPrice(product)).toFixed(2)}</p>
                        {product.top_pick && (
                          <span className="bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">TOP PICK</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= FRESH INVENTORY ================= */}
        <section className="section-spacing border-t border-white/20">
          <div className="container-responsive">
            <div className="mb-10 flex items-center justify-between">
              <div className="text-center lg:text-left">
                <p className="text-sm text-[#D4AF37] font-semibold uppercase tracking-[0.2em] mb-4">JUST IN</p>
                <h2 className="text-4xl font-bold mb-4">Fresh Inventory</h2>
                <p className="text-gray-300 text-lg">New products added daily with verified supplier relationships</p>
              </div>
              <Link href="/shop" className="hidden lg:block text-lg text-[#D4AF37] font-semibold hover:text-white transition-colors duration-300">
                See All Inventory →
              </Link>
            </div>

            {newArrivals.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {newArrivals.map((product) => {
                  const isNew = Date.now() - new Date(product.created_at || Date.now()).getTime() <= 7 * 24 * 60 * 60 * 1000;
                  return (
                    <Link
                      key={`${product.id}-strip`}
                      href={`/shop/${product.slug || product.id}`}
                      className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105"
                    >
                      <div className="aspect-square w-full mb-4 rounded-xl overflow-hidden bg-white/10">
                        <img
                          src={getPrimaryProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-[#D4AF37]">${Number(getPrice(product)).toFixed(2)}</p>
                          {isNew && (
                            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-500/30">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center">
                <p className="text-gray-400">New inventory dropping soon</p>
              </div>
            )}
          </div>
        </section>

        {/* ================= LIVE INVENTORY ================= */}
        <section className="py-24 border-t border-white/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <p className="text-sm text-[#D4AF37] font-semibold uppercase tracking-[0.2em] mb-4">LIVE INVENTORY</p>
            <h2 className="text-4xl font-bold">Real-Time Product Flow</h2>
            <p className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
              Watch our inventory rotate in real-time. Products update every 60 seconds with fresh drops and availability changes.
            </p>
          </div>

          {liveInventory.length === 0 ? (
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center">
                <p className="text-gray-300 text-lg">New inventory dropping soon</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0B0F19] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0B0F19] to-transparent" />
              
              <div className="group overflow-hidden">
                <div className="flex w-max animate-[inventoryMarquee_60s_linear_infinite] gap-6 group-hover:[animation-play-state:paused]">
                  {[...liveInventory, ...liveInventory].map((item, index) => {
                    const isNew = Date.now() - new Date(item.created_at || Date.now()).getTime() <= 7 * 24 * 60 * 60 * 1000;
                    return (
                      <Link
                        key={`${item.id}-${index}`}
                        href={`/shop/${item.slug || item.id}`}
                        className="group flex min-h-[140px] min-w-[240px] max-w-[260px] items-center gap-6 rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 to-transparent p-6 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105"
                      >
                        <div className="aspect-square w-24 rounded-xl overflow-hidden bg-white/10">
                          <img
                            src={getPrimaryProductImage(item)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            alt={item.name}
                          />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 mb-2">{String(item.name || "Inventory").slice(0, 48)}</h3>
                          <p className="text-2xl font-bold text-[#D4AF37] mb-2">${Number(getPrice(item)).toFixed(2)}</p>
                          {isNew && (
                            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-500/30">
                              NEW
                            </span>
                          )}
                        </div>
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

        {/* ================= PROFIT CALCULATOR ================= */}
        <section className="py-24 border-t border-white/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-4xl">📊</span>
                <h3 className="text-3xl font-bold text-[#D4AF37]">Profit Calculator</h3>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-3xl mx-auto">
                Model live inventory opportunities using KV Garage retail pricing. Profit math is calculated server-side so supplier cost never appears in the browser.
              </p>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div ref={productSelectRef} className="relative w-full mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Select Product</label>
                  <button
                    type="button"
                    onClick={() => setProductDropdownOpen((prev) => !prev)}
                    className={`w-full flex items-center gap-4 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-left transition-all duration-300 ${
                      productDropdownOpen ? "border-[#D4AF37]/50" : "hover:border-white/40"
                    }`}
                  >
                    {selectedProfitProduct ? (
                      <img
                        src={getPrimaryProductImage(selectedProfitProduct)}
                        alt={selectedProfitProduct.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/10" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-white truncate">
                        {selectedProfitProduct?.name || "Select a product..."}
                      </p>
                      <p className="text-sm text-gray-400">{selectedProfitProduct?.category || "General"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-[#D4AF37]">
                        {selectedProfitProduct ? `$${Number(getPrice(selectedProfitProduct)).toFixed(2)}` : ""}
                      </span>
                      <span className={`transition-transform duration-300 ${productDropdownOpen ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  <div
                    className={`absolute left-0 right-0 top-[calc(100%+12px)] z-50 overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/5 to-transparent transition-all duration-300 ${
                      productDropdownOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 border-b border-white/20">
                      <input
                        ref={productSearchInputRef}
                        type="text"
                        value={profitSearch}
                        onChange={(event) => setProfitSearch(event.target.value)}
                        placeholder="Search products..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {(filteredCalculatorProducts || []).length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-400">
                          No products found
                        </div>
                      ) : (
                        (filteredCalculatorProducts || []).map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSelectedProfitProductId(product.id);
                              setProductDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 px-6 py-4 border-b border-white/20 text-left transition-all duration-300 last:border-b-0 ${
                              selectedProfitProductId === product.id 
                                ? "bg-[#D4AF37]/20 border-l-4 border-l-[#D4AF37]" 
                                : "hover:bg-white/10"
                            }`}
                          >
                            <img 
                              src={getPrimaryProductImage(product)} 
                              alt={product.name} 
                              className="w-12 h-12 rounded-xl object-cover" 
                              loading="lazy" 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-lg font-semibold text-white truncate">{product.name}</p>
                              <p className="text-sm text-gray-400">{product.category || "General"}</p>
                            </div>
                            <p className="text-lg font-bold text-[#D4AF37]">${Number(getPrice(product)).toFixed(2)}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={profitQuantity}
                    onChange={(event) => setProfitQuantity(Math.max(1, Number(event.target.value) || 1))}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                  />
                </div>

                {profitResult?.product ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                      <div className="flex items-center gap-6">
                        <img 
                          src={getPrimaryProductImage(profitResult.product)} 
                          alt={profitResult.product.name} 
                          className="w-20 h-20 rounded-xl object-cover" 
                          loading="lazy" 
                        />
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-white mb-2">{profitResult.product.name}</h4>
                          <p className="text-lg text-[#D4AF37]">
                            Based on KV Garage retail pricing: ${Number(profitResult.sell_price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6 text-center">
                        <div className="text-2xl font-bold text-[#D4AF37] mb-2">${Number(profitResult.sell_price || 0).toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Sell Price / Unit</div>
                      </div>
                      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6 text-center">
                        <div className="text-2xl font-bold text-[#D4AF37] mb-2">${Number(profitResult.total_revenue || 0).toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Total Revenue</div>
                      </div>
                      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6 text-center">
                        <div className="text-2xl font-bold text-[#D4AF37] mb-2">${Number(profitResult.estimated_total_profit || 0).toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Estimated Profit</div>
                      </div>
                      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6 text-center">
                        <div className="text-2xl font-bold text-[#D4AF37] mb-2">{Number(profitResult.margin_percent || 0).toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">Profit Margin</div>
                      </div>
                    </div>

                    <div className={`rounded-xl p-6 text-center ${
                      Number(profitResult.margin_percent || 0) > 60
                        ? "bg-green-500/20 border border-green-500/40 text-green-300"
                        : Number(profitResult.margin_percent || 0) >= 40
                          ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                          : Number(profitResult.margin_percent || 0) >= 20
                            ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300"
                            : "bg-red-500/20 border border-red-500/40 text-red-300"
                    }`}>
                      {Number(profitResult.margin_percent || 0) > 60
                        ? "🔥 Exceptional margin — high profit potential"
                        : Number(profitResult.margin_percent || 0) >= 40
                          ? "Strong margin — solid opportunity"
                          : Number(profitResult.margin_percent || 0) >= 20
                            ? "Healthy margin — consistent at volume"
                            : "Thin margin — best at high volume"}
                    </div>
                  </div>
                ) : null}

                <p className="text-gray-400 text-sm mt-6 leading-relaxed">
                  Based on avg KV Garage retail pricing. Many resellers achieve margins well above these estimates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES ================= */}
        <section className="section-spacing border-t border-white/20">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <p className="text-sm text-[#D4AF37] font-semibold uppercase tracking-[0.2em] mb-4">Complete Solutions</p>
              <h2 className="text-5xl font-bold mb-8">Your Success Ecosystem</h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                From mentorship to trading systems, we provide the complete infrastructure for building a profitable resale business
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <ServiceCard 
                title="Business Mentorship" 
                description="Work directly with KV Garage to develop your wholesale strategy, supply chain, and business systems. Structured mentorship for serious entrepreneurs." 
                link="/mentorship" 
                img="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              />
              <ServiceCard 
                title="Trading Education" 
                description="Learn how to trade inventory, maximize margins, and build a repeatable trading system. Practical education for resellers and entrepreneurs." 
                link="/trading" 
                img="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
              />
              <ServiceCard 
                title="Build Your System" 
                description="We build your complete supply chain system from the ground up. Inventory sourcing, supplier relationships, and operational infrastructure." 
                link="/deals" 
                img="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
              />
            </div>
          </div>
        </section>

        {/* ================= EMAIL POPUP ================= */}
        {emailPopupOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
              <button
                onClick={() => setEmailPopupOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                ×
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
                <p className="text-gray-300">Get exclusive updates, product drops, and wholesale opportunities.</p>
              </div>

              {emailSubmitted ? (
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">✓</div>
                  <h4 className="text-xl font-bold text-[#D4AF37] mb-2">You're In!</h4>
                  <p className="text-gray-300">Thanks for subscribing! Check your inbox for our welcome email.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 text-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Subscribe Now
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

function Stat({label,value}) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6">
      <p className="text-gray-400 mb-2">{label}</p>
      <h3 className="text-2xl font-bold text-[#D4AF37]">{value}</h3>
    </div>
  );
}

function ServiceCard({title, description, link, img}) {
  return (
    <Link href={link} className="group block">
      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={img} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">{title}</h3>
          <p className="text-gray-300 leading-relaxed mb-6">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-[#D4AF37] font-semibold">Learn More →</span>
            <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}