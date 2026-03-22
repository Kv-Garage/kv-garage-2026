import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function WholesalePage() {
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchProfile();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .limit(6);

    setProducts(data || []);
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

  const role = profile?.role || "retail";
  const approved = profile?.approved || false;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-24">

      <div className="max-w-6xl mx-auto">

        {/* 🔥 HERO */}
        <div className="mb-20">

          <h1 className="text-5xl font-bold text-[#D4AF37] mb-6">
            Direct Wholesale Supply
          </h1>

          <p className="text-gray-400 max-w-3xl mb-6">
            Built for resellers, retail store owners, and volume buyers looking for
            consistent inventory, strong margins, and scalable supply access.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
            <span>✔ Resellers</span>
            <span>✔ Retail Stores</span>
            <span>✔ Bulk Buyers</span>
            <span>✔ Inventory Scaling</span>
          </div>

          <div className="flex gap-4">
            <Link href="/apply">
              <button className="bg-[#D4AF37] text-black px-6 py-3 rounded font-semibold">
                Apply for Access
              </button>
            </Link>

            <Link href="/signup">
              <button className="border border-gray-500 px-6 py-3 rounded">
                Create Account
              </button>
            </Link>
          </div>

        </div>

        {/* 🔥 WHY THIS SYSTEM */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">

          <div className="bg-[#111827] p-6 rounded-xl">
            <h3 className="font-semibold mb-2">
              Structured Supply
            </h3>
            <p className="text-sm text-gray-400">
              Access consistent inventory without relying on random sourcing or unstable suppliers.
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-xl">
            <h3 className="font-semibold mb-2">
              Bundle-Based Buying
            </h3>
            <p className="text-sm text-gray-400">
              Purchase optimized bundles designed for resale and higher margins.
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-xl">
            <h3 className="font-semibold mb-2">
              Scalable Orders
            </h3>
            <p className="text-sm text-gray-400">
              Designed for growth — from small resellers to full retail operations.
            </p>
          </div>

        </div>

        {/* 🔥 ACCESS CONTROL */}
        {role === "retail" && (
          <div className="mb-16 bg-[#111827] border border-[#1C2233] p-6 rounded-xl">
            <p className="mb-3 text-sm">
              Wholesale access is restricted. Create an account to unlock inventory.
            </p>
            <Link href="/signup">
              <button className="bg-[#D4AF37] text-black px-4 py-2 rounded text-sm">
                Unlock Access
              </button>
            </Link>
          </div>
        )}

        {role === "student" && !approved && (
          <div className="mb-16 bg-[#111827] border border-[#1C2233] p-6 rounded-xl">
            <p className="mb-3 text-sm">
              You are in preview mode. Apply to unlock full wholesale pricing.
            </p>
            <Link href="/apply">
              <button className="bg-[#D4AF37] text-black px-4 py-2 rounded text-sm">
                Apply Now
              </button>
            </Link>
          </div>
        )}

        {/* 🔥 INVENTORY PREVIEW */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">
            Inventory Preview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {products.map((p) => (
              <div key={p.id} className="bg-[#111827] p-4 rounded-xl">

                <div className="h-40 bg-gray-700 rounded mb-3 overflow-hidden">
                  {p.image && (
                    <img src={p.image} className="w-full h-full object-cover" />
                  )}
                </div>

                <p className="text-sm font-semibold">
                  {p.name}
                </p>

                <p className="text-xs text-gray-400">
                  {role === "wholesale" && approved
                    ? `$${p.price}`
                    : "Login to view pricing"}
                </p>

              </div>
            ))}

          </div>
        </div>

        {/* 🔥 FINAL CTA */}
        <div className="mt-20 bg-[#111827] p-10 rounded-xl text-center">

          <h2 className="text-2xl font-bold mb-4">
            Apply for Wholesale Access
          </h2>

          <p className="text-gray-400 mb-6">
            Access is limited to qualified buyers and partners.
          </p>

          <Link href="/apply">
            <button className="bg-[#D4AF37] text-black px-8 py-3 rounded font-semibold">
              Apply Now
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}