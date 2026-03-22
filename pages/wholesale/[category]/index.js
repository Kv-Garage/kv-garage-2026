import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function WholesaleCategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);

  const formattedTitle = category?.replace(/-/g, " ");

  useEffect(() => {
    if (!category) return;

    fetchProducts();
    fetchProfile();
  }, [category]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category", category);

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

        {/* 🔥 NEW: AUTHORITY / SYSTEM HEADER */}
        <div className="mb-16">

          <h1 className="text-5xl font-bold mb-6 text-[#D4AF37] leading-tight">
            Structured Wholesale Supply
          </h1>

          <p className="text-gray-400 max-w-3xl mb-6">
            Built for resellers, retail store owners, and volume buyers looking for
            consistent inventory, clear pricing, and scalable supply access.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span>✔ Resellers</span>
            <span>✔ Retail Stores</span>
            <span>✔ Bulk Buyers</span>
            <span>✔ Inventory Scaling</span>
          </div>

          <div className="mt-6 flex gap-4">
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

        {/* 🔥 ORIGINAL HEADER (UNCHANGED) */}
        <Link href="/">
          <button className="mb-12 border border-gray-600 px-6 py-2 rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition">
            ← Back to Home
          </button>
        </Link>

        <h2 className="text-3xl font-bold mb-6 capitalize text-[#D4AF37]">
          {formattedTitle}
        </h2>

        <p className="text-gray-400 mb-12">
          Wholesale distribution inventory for {formattedTitle}.
        </p>

        {/* 🔥 ACCESS CONTROL */}
        {role === "retail" && (
          <div className="mb-10 bg-[#111827] border border-[#1C2233] p-6 rounded-xl">
            <p className="mb-3 text-sm">
              You are viewing limited wholesale inventory.
            </p>
            <Link href="/signup">
              <button className="bg-[#D4AF37] text-black px-4 py-2 rounded text-sm">
                Unlock Wholesale Access
              </button>
            </Link>
          </div>
        )}

        {role === "student" && !approved && (
          <div className="mb-10 bg-[#111827] border border-[#1C2233] p-6 rounded-xl">
            <p className="mb-3 text-sm">
              Preview mode — apply to unlock full pricing & bundles.
            </p>
            <Link href="/apply">
              <button className="bg-[#D4AF37] text-black px-4 py-2 rounded text-sm">
                Apply for Wholesale
              </button>
            </Link>
          </div>
        )}

        {/* 🔥 PRODUCT GRID (UNCHANGED) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {products.map((p) => {
            const isBundle = p.type === "bundle";

            return (
              <div
                key={p.id}
                className="bg-[#111827] p-6 rounded-xl shadow-lg"
              >

                <div className="h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  {p.image && (
                    <img src={p.image} className="w-full h-full object-cover" />
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {p.name}
                </h3>

                {role === "wholesale" && approved ? (
                  <p className="text-gray-300">
                    ${p.price}
                    {isBundle && (
                      <span className="text-xs ml-2 text-gray-400">
                        ({p.bundle_quantity} units)
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Login to view pricing
                  </p>
                )}

                {isBundle && (
                  <p className="text-xs text-[#D4AF37] mt-2">
                    Bundle Offer
                  </p>
                )}

                <Link href={`/wholesale/${category}/${p.slug}`}>
                  <button className="mt-4 w-full border border-gray-600 py-2 rounded hover:border-[#D4AF37]">
                    View
                  </button>
                </Link>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}