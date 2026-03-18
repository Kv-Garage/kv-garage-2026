import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Head from "next/head";
import Link from "next/link";

export default function Home() {

  const [budget, setBudget] = useState(500);
  const [type, setType] = useState("glass");

  // ✅ SUPABASE PRODUCTS
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setDbProducts(data);
      }
    };

    fetchProducts();
  }, []);

  // ✅ FALLBACK PRODUCTS (FOR DESIGN)
  const products = dbProducts.length > 0 ? dbProducts : [
    {
      name: "Luxury Watch",
      price: 120,
      slug: "luxury-watch",
      image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg"
    },
    {
      name: "Skincare Kit",
      price: 45,
      slug: "skincare-kit",
      image: "https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg"
    },
    {
      name: "Nail Kit",
      price: 35,
      slug: "nail-kit",
      image: "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg"
    },
    {
      name: "Bulk Inventory",
      price: 300,
      slug: "bulk-pack",
      image: "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg"
    }
  ];

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

  return (
    <>
      <Head>
        <title>KV Garage | Supply → Systems → Revenue</title>
      </Head>

      <div className="min-h-screen text-white relative overflow-hidden">

        {/* GLOBAL GLOW */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#D4AF37]/25 blur-[140px] rounded-full"></div>

        {/* HERO */}
        <section className="py-16 md:py-20 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">

            <div>
              <h1 className="text-3xl md:text-5xl font-semibold mb-6 leading-tight">
                Source Inventory → Sell → Scale
              </h1>

              <p className="text-gray-400 mb-8">
                Wholesale supply and scalable systems.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/wholesale">
                  <button className="w-full sm:w-auto bg-[#D4AF37] text-black px-8 py-4 rounded-xl">
                    Enter Wholesale
                  </button>
                </Link>

                <Link href="/shop">
                  <button className="w-full sm:w-auto border border-[#D4AF37] px-8 py-4 rounded-xl">
                    Shop Retail
                  </button>
                </Link>
              </div>
            </div>

            {/* COLLAGE */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {products.map((item, i) => (
                <Link key={i} href={`/shop/${item.slug || "#"}`}>
                  <img
                    src={item.image}
                    className="h-28 md:h-32 w-full object-cover rounded-xl hover:scale-105 transition"
                  />
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* 🔥 MOVING PRODUCTS (NOW LIVE FROM DB) */}
        <section className="py-12 md:py-16 border-t border-[#1C2233] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
            <h2 className="text-lg md:text-xl text-[#D4AF37]">
              Live Inventory
            </h2>
          </div>

          <div className="flex gap-4 md:gap-6 animate-scroll w-max">
            {[...products, ...products].map((item, i) => (
              <div
                key={i}
                className="min-w-[160px] md:min-w-[220px] bg-[#111827] rounded-xl overflow-hidden border border-[#1C2233]
                hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition"
              >
                <img
                  src={item.image}
                  className="h-32 md:h-40 w-full object-cover"
                />

                <div className="p-3 md:p-4">
                  <p className="text-sm md:text-base">{item.name}</p>
                  <p className="text-gray-400 text-xs md:text-sm">${item.price}</p>

                  <button className="mt-3 w-full bg-[#D4AF37] text-black py-2 rounded-md text-sm font-semibold">
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROFIT TOOL */}
        <section className="py-16 md:py-24 border-t border-[#1C2233] text-center relative">

          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 px-4">

            <h2 className="text-2xl md:text-3xl mb-6 text-[#D4AF37]">
              Profit System Tool
            </h2>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {["glass", "accessories", "jewelry"].map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-4 py-2 rounded ${
                    type === t ? "bg-[#D4AF37] text-black" : "border"
                  }`}>
                  {t}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="bg-[#111827] px-6 py-4 rounded-xl mb-10 w-full max-w-xs mx-auto text-center"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              <Stat label="Units" value={units} />
              <Stat label="Revenue" value={`$${revenue}`} />
              <Stat label="Profit" value={`$${profit}`} />
              <Stat label="6 Month" value={`$${projected}`} />
            </div>

          </div>
        </section>

{/* ================= SERVICES (UPGRADED ELITE) ================= */}
<section className="py-20 md:py-28 border-t border-[#1C2233]">

  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

    {/* MENTORSHIP */}
    <Link href="/mentorship">
      <div className="relative group overflow-hidden rounded-2xl border border-[#1C2233]
      hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition duration-500 cursor-pointer">

        {/* BACKGROUND */}
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition duration-700"
        />

        {/* GLOW */}
        <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition"></div>

        {/* CONTENT */}
        <div className="relative p-10">
          <h3 className="text-2xl font-semibold mb-4">Mentorship</h3>
          <p className="text-gray-400 mb-6">
            Learn business systems, execution, and scaling structure.
          </p>

          <span className="text-sm text-[#D4AF37]">
            Enter →
          </span>
        </div>

      </div>
    </Link>

    {/* TRADING */}
    <Link href="/trading">
      <div className="relative group overflow-hidden rounded-2xl border border-[#1C2233]
      hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition duration-500 cursor-pointer">

        {/* BACKGROUND */}
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
          className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition duration-700"
        />

        {/* GLOW */}
        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition"></div>

        {/* CONTENT */}
        <div className="relative p-10">
          <h3 className="text-2xl font-semibold mb-4">Trading</h3>
          <p className="text-gray-400 mb-6">
            Learn futures trading, market structure, and execution models.
          </p>

          <span className="text-sm text-blue-400">
            Enter →
          </span>
        </div>

      </div>
    </Link>

    {/* BUILD SITE */}
    <Link href="/deals">
      <div className="relative group overflow-hidden rounded-2xl border border-[#1C2233]
      hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition duration-500 cursor-pointer">

        {/* BACKGROUND */}
        <img
          src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition duration-700"
        />

        {/* GLOW */}
        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition"></div>

        {/* CONTENT */}
        <div className="relative p-10">
          <h3 className="text-2xl font-semibold mb-4">We Build Your System</h3>
          <p className="text-gray-400 mb-6">
            Custom websites, funnels, backend systems built for scale.
          </p>

          <span className="text-sm text-purple-400">
            Enter →
          </span>
        </div>

      </div>
    </Link>

  </div>

</section>
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-[#1C2233]
    hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition">
      <p className="text-gray-400 text-xs md:text-sm">{label}</p>
      <h3 className="text-lg md:text-xl">{value}</h3>
    </div>
  );
}