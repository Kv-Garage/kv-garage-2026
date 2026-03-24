import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import Head from "next/head";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

export default function Home() {

  const [budget, setBudget] = useState(500);
  const [type, setType] = useState("glass");

  const [dbProducts, setDbProducts] = useState([]);
  const [profile, setProfile] = useState(null);

  const { addToCart } = useCart();
  const router = useRouter();
  const [addedKey, setAddedKey] = useState(null);

  const liveInventoryRef = useRef(null);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStateRef = useRef({ startX: 0, startScrollLeft: 0 });
  const manualOverrideUntilRef = useRef(0);
  const sequenceWidthRef = useRef(0);
  const lastTsRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchProfile();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setDbProducts(data || []);
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

  // 🔥 PRICING LOGIC
  const getPrice = (p) => {
    if (profile?.role === "wholesale" && profile?.approved) {
      return p.wholesale_price || p.price;
    }
    return p.price;
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

  // 🔥 PROFIT TOOL
  const pricing = {
    glass: { cost: 10, sell: 30 },
    accessories: { cost: 5, sell: 20 },
    jewelry: { cost: 8, sell: 35 },
  };

  const cost = pricing[type].cost;
  const sell = pricing[type].sell;

  const units = Math.floor(budget / cost);
  const revenue = units * sell;
  const profit = revenue - budget;
  const projected = profit * 6;

  // Conveyor auto-scroll for the "Live Inventory" section:
  // - auto scrolls horizontally
  // - pauses on hover
  // - supports mouse/touch drag
  // - temporarily overrides auto scroll after manual interaction
  useEffect(() => {
    const el = liveInventoryRef.current;
    if (!el) return;

    const updateMetrics = () => {
      // We render two identical sequences side-by-side.
      // Measure the exact pixel offset where the 2nd sequence starts to avoid seam jumps.
      const first = el.querySelector("[data-seq='a']");
      const second = el.querySelector("[data-seq='b']");
      if (!first || !second) return;
      sequenceWidthRef.current = second.offsetLeft - first.offsetLeft;
    };

    updateMetrics();

    const onResize = () => updateMetrics();
    window.addEventListener("resize", onResize);

    const speedPxPerSec = 60;

    const tick = (ts) => {
      const node = liveInventoryRef.current;
      if (!node) return;

      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      const sequenceWidth = sequenceWidthRef.current;
      const now = Date.now();
      const canAutoScroll =
        !isHoveringRef.current &&
        !isDraggingRef.current &&
        now >= manualOverrideUntilRef.current &&
        sequenceWidth > 0;

      if (canAutoScroll) {
        node.scrollLeft += (speedPxPerSec / 1000) * dt;
        const maxScrollLeft = node.scrollWidth - node.clientWidth;

        // Primary wrap: when we reach the start of the 2nd sequence.
        if (sequenceWidth > 0 && node.scrollLeft >= sequenceWidth) {
          node.scrollLeft -= sequenceWidth;
        } else if (maxScrollLeft > 0 && node.scrollLeft >= maxScrollLeft - 1) {
          // Wide viewport case: we might not be able to reach `sequenceWidth`.
          // Reset to keep continuous looping.
          node.scrollLeft = 0;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Re-measure after images/layout settle when products load.
    const t = setTimeout(updateMetrics, 250);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [products.length]);

  const handlePointerDown = (e) => {
    const el = liveInventoryRef.current;
    if (!el) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    manualOverrideUntilRef.current = Date.now() + 2000;
    isDraggingRef.current = true;
    dragStateRef.current = { startX: e.clientX, startScrollLeft: el.scrollLeft };
    lastTsRef.current = null;

    if (e.currentTarget?.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    const el = liveInventoryRef.current;
    if (!el || !isDraggingRef.current) return;

    manualOverrideUntilRef.current = Date.now() + 2000;

    const dx = e.clientX - dragStateRef.current.startX;
    el.scrollLeft = dragStateRef.current.startScrollLeft - dx;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    manualOverrideUntilRef.current = Date.now() + 2000;
  };

  const handleWheel = () => {
    // Wheel/trackpad horizontal scrolling should temporarily override conveyor motion.
    manualOverrideUntilRef.current = Date.now() + 2000;
  };

  const handleAddToCartFromCard = (product) => {
    addToCart({
      id: product.id || product.slug || product.name,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    const k = product.id || product.slug || product.name;
    setAddedKey(k);
    setTimeout(() => setAddedKey(null), 1200);
    router.push("/cart");
  };

  return (
    <>
      <Head>
        <title>KV Garage</title>
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
                {products.slice(0, 2).map((p, i) => (
                  <Link key={i} href={`/shop/${p.slug}`}>
                    <div className="bg-[#111827] p-4 rounded-xl border border-[#1C2233] hover:border-[#D4AF37] transition">

                      <img src={p.image} className="h-24 w-full object-cover rounded mb-2" />

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

        {/* ================= LIVE INVENTORY ================= */}
        <section className="py-16 border-t border-[#1C2233] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <h2 className="text-xl text-[#D4AF37]">Live Inventory</h2>
          </div>

          <div
            ref={liveInventoryRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide"
            onMouseEnter={() => {
              isHoveringRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveringRef.current = false;
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            style={{ touchAction: "pan-y" }}
          >
            <div className="flex gap-6 w-max">
              <div data-seq="a" className="flex gap-6">
                {products.map((item, i) => (
                  <Link
                    key={`a-${i}`}
                    href={`/shop/${item.slug}`}
                    className="block min-w-[220px] bg-[#111827] rounded-xl border border-[#1C2233]"
                  >
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="h-40 w-full bg-gray-700 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="p-4">
                      <p>{item.name}</p>
                      <p className="text-gray-400">${Number(item.price).toFixed(2)}</p>
                      <p className="text-xs text-[#D4AF37] mt-1">{getUrgencyText(item)}</p>
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCartFromCard(item);
                        }}
                        className="mt-3 w-full bg-[#D4AF37] text-black py-2 rounded text-xs font-semibold transition hover:opacity-90 active:scale-[0.98]"
                      >
                        {addedKey === (item.id || item.slug || item.name) ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
              <div data-seq="b" className="flex gap-6">
                {products.map((item, i) => (
                  <Link
                    key={`b-${i}`}
                    href={`/shop/${item.slug}`}
                    className="block min-w-[220px] bg-[#111827] rounded-xl border border-[#1C2233]"
                  >
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="h-40 w-full bg-gray-700 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="p-4">
                      <p>{item.name}</p>
                      <p className="text-gray-400">${Number(item.price).toFixed(2)}</p>
                      <p className="text-xs text-[#D4AF37] mt-1">{getUrgencyText(item)}</p>
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCartFromCard(item);
                        }}
                        className="mt-3 w-full bg-[#D4AF37] text-black py-2 rounded text-xs font-semibold transition hover:opacity-90 active:scale-[0.98]"
                      >
                        {addedKey === (item.id || item.slug || item.name) ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            /* Hide scrollbar while keeping overflow-x scrolling intact. */
            .scrollbar-hide {
              -ms-overflow-style: none; /* IE/Edge */
              scrollbar-width: none; /* Firefox */
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none; /* Chrome/Safari */
            }
          `}</style>
        </section>

        {/* ================= PROFIT TOOL ================= */}
        <section className="py-20 border-t border-[#1C2233] text-center relative">

          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" className="w-full h-full object-cover"/>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl mb-6 text-[#D4AF37]">
              Profit System Tool
            </h2>

            <div className="flex justify-center gap-3 mb-6">
              {["glass","accessories","jewelry"].map(t => (
                <button key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded ${type===t ? "bg-[#D4AF37] text-black":"border"}`}>
                  {t}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={budget}
              onChange={(e)=>setBudget(Number(e.target.value))}
              className="bg-[#111827] px-6 py-4 rounded-xl mb-10 text-center"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Stat label="Units" value={units}/>
              <Stat label="Revenue" value={`$${revenue}`}/>
              <Stat label="Profit" value={`$${profit}`}/>
              <Stat label="6 Month" value={`$${projected}`}/>
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