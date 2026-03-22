import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Shop({ profile }) {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProducts(data);
    }
  };

  const role = profile?.role || "retail";

  return (
    <>
      <Head>
        <title>Shop Inventory | KV Garage Supply</title>
        <meta
          name="description"
          content="Shop premium inventory ready for immediate purchase. Retail buyers, resellers, and wholesale partners can access structured pricing and scalable supply."
        />
      </Head>

      <main className="bg-white text-black">

        {/* 🔥 ACCOUNT PANEL (PREMIUM) */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">

            <p className="text-xs uppercase text-gray-500 mb-1">
              Account Access
            </p>

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
                <button className="mt-3 text-sm bg-black text-white px-4 py-2 rounded-md">
                  Unlock Better Pricing
                </button>
              </Link>
            )}

          </div>
        </div>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <h1 className="text-5xl font-extrabold mb-6">
            Shop Inventory
          </h1>

          <div className="w-20 h-[3px] bg-black mb-6"></div>

          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Browse ready-to-ship inventory sourced for quality, consistency, and resale potential.
            Purchase directly at retail or scale into structured pricing through volume and account access.
          </p>
        </section>

        {/* CATEGORY NAV */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-12">
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700">
            {[
              "Nails & Beauty",
              "Skincare",
              "Sports & Apparel",
              "Glass & Devices",
              "Outdoor",
              "Christian Collection",
              "Essentials"
            ].map((cat) => (
              <button
                key={cat}
                className="border px-4 py-2 rounded hover:border-black hover:text-black transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24">

          {products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (

            <div className="grid md:grid-cols-4 gap-10">

              {products.map((product) => {

                // 🔥 BASE PRICE ONLY (NO LOGIC HERE)
                const displayPrice = product.price || (product.cost * 2);

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl transition duration-300 bg-white"
                  >

                    <div className="bg-gray-100 aspect-square rounded-lg overflow-hidden mb-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-lg font-semibold mb-2 group-hover:underline">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-2">
                      Ready to ship. Limited inventory.
                    </p>

                    <p className="text-sm font-semibold mb-4">
                      ${displayPrice}
                    </p>

                    <span className="text-sm font-medium">
                      View Product →
                    </span>

                  </Link>
                );
              })}

            </div>

          )}

        </section>

        {/* TRUST SECTION */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">

            <h2 className="text-3xl font-bold mb-6">
              Built for Buyers & Resellers
            </h2>

            <div className="w-16 h-[3px] bg-black mb-10"></div>

            <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-700">

              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-3">
                  Direct Retail Access
                </h3>
                <p>
                  Purchase inventory immediately with no account required.
                  Ideal for testing products or single-unit buying.
                </p>
              </div>

              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-3">
                  Volume-Based Pricing
                </h3>
                <p>
                  Increase order size to unlock improved pricing automatically.
                  Designed to reward scale and consistency.
                </p>
              </div>

              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-3">
                  Scalable Supply System
                </h3>
                <p>
                  Structured for growth. Transition from retail to reseller
                  to wholesale with optimized pricing at each level.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}