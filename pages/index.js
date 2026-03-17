import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [budget, setBudget] = useState(500);
  const [type, setType] = useState("glass");

  const products = [
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
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#D4AF37]/25 blur-[140px] rounded-full"></div>

        {/* ================= HERO ================= */}
        <section className="py-20 border-b border-[#1C2233]">

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

            <div>
              <h1 className="text-5xl font-semibold mb-6">
                Source Inventory → Sell → Scale
              </h1>

              <p className="text-gray-400 mb-8">
                Wholesale supply and scalable systems.
              </p>

              <div className="flex gap-4">
                <Link href="/wholesale">
                  <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.6)]">
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

            {/* PRODUCT COLLAGE */}
            <div className="grid grid-cols-3 gap-4">
              {products.map((item, i) => (
                <Link key={i} href={`/shop/${item.slug}`}>
                  <img
                    src={item.image}
                    className="h-28 w-full object-cover rounded-xl hover:scale-105 transition"
                  />
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ================= CONVEYOR BELT ================= */}
        <section className="py-16 border-t border-[#1C2233] overflow-hidden">

          <div className="max-w-7xl mx-auto px-6 mb-6">
            <h2 className="text-xl text-[#D4AF37]">
              Trending Inventory
            </h2>
          </div>

          <div className="relative">

            <div className="flex gap-6 animate-scroll">

              {[...products, ...products].map((item, i) => (
                <Link key={i} href={`/shop/${item.slug}`}>
                  <div className="min-w-[220px] bg-[#111827] rounded-xl overflow-hidden border border-[#1C2233]
                  hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition">

                    <img src={item.image} className="h-40 w-full object-cover"/>

                    <div className="p-4">
                      <p>{item.name}</p>
                      <p className="text-gray-400 text-sm">${item.price}</p>
                    </div>

                  </div>
                </Link>
              ))}

            </div>

          </div>

        </section>

        {/* ================= PROFIT TOOL ================= */}
        <section className="py-24 border-t border-[#1C2233] text-center relative">

          {/* 🔥 BACKGROUND SYSTEM VISUAL */}
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">

            <h2 className="text-3xl mb-6 text-[#D4AF37]">
              Profit System Tool
            </h2>

            <div className="flex justify-center gap-4 mb-6">
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
              className="bg-[#111827] px-6 py-4 rounded-xl mb-10 text-center"
            />

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">

              <Stat label="Units" value={units} />
              <Stat label="Revenue" value={`$${revenue}`} />
              <Stat label="Profit" value={`$${profit}`} />
              <Stat label="6 Month" value={`$${projected}`} />

            </div>

          </div>

        </section>

        {/* ================= SERVICES ================= */}
        <section className="py-24 border-t border-[#1C2233]">

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

            <Link href="/mentorship">
              <div className="relative p-8 border rounded-xl overflow-hidden
              hover:shadow-[0_0_60px_rgba(212,175,55,0.7)] transition">

                <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"/>

                <div className="relative z-10">
                  <h3 className="text-xl mb-3">Mentorship</h3>
                  <p>Learn systems and execution</p>
                </div>

              </div>
            </Link>

            <Link href="/trading">
              <div className="relative p-8 border rounded-xl overflow-hidden
              hover:shadow-[0_0_60px_rgba(59,130,246,0.7)] transition">

                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"/>

                <div className="relative z-10">
                  <h3 className="text-xl mb-3">Trading</h3>
                  <p>Market systems & execution</p>
                </div>

              </div>
            </Link>

            <Link href="/deals">
              <div className="relative p-8 border rounded-xl overflow-hidden
              hover:shadow-[0_0_60px_rgba(168,85,247,0.7)] transition">

                <img src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"/>

                <div className="relative z-10">
                  <h3 className="text-xl mb-3">We Build Your Site</h3>
                  <p>Funnels, systems, infrastructure</p>
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
    <div className="bg-[#111827] p-6 rounded-xl border border-[#1C2233]
    hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition">
      <p className="text-gray-400 text-sm">{label}</p>
      <h3 className="text-xl">{value}</h3>
    </div>
  );
}