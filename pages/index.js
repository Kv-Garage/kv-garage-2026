import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Head from "next/head";
import Link from "next/link";

export default function Home() {

  const [budget, setBudget] = useState(500);
  const [type, setType] = useState("glass");

  const [dbProducts, setDbProducts] = useState([]);
  const [profile, setProfile] = useState(null);

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
                        ${getPrice(p)}
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

          <div className="flex gap-6 animate-scroll w-max">
            {[...products, ...products].map((item, i) => (
              <div key={i} className="min-w-[220px] bg-[#111827] rounded-xl border border-[#1C2233]">
                <img src={item.image} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <p>{item.name}</p>
                  <p className="text-gray-400">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
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