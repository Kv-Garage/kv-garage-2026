import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Shop() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true) // 🔥 ONLY CHANGE (soft delete system)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProducts(data);
    }
  };

  return (
    <>
      <Head>
        <title>Shop | KV Garage</title>
        <meta
          name="description"
          content="Premium retail inventory. Fast fulfillment. Structured checkout."
        />
      </Head>

      <main className="bg-white">

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <h1 className="text-5xl font-extrabold text-royal mb-6">
            SHOP
          </h1>
          <div className="w-20 h-[3px] bg-gold mb-6"></div>

          <p className="text-gray-600 max-w-2xl">
            Carefully sourced inventory designed for quality, value,
            and fast fulfillment. Every item ready to purchase now.
          </p>
        </section>

        {/* CATEGORY QUICK NAV */}
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
                className="border px-4 py-2 rounded hover:border-royal hover:text-royal transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24">

          {products.length === 0 ? (
            <p className="text-gray-500">No products yet...</p>
          ) : (

            <div className="grid md:grid-cols-4 gap-10">

              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl transition duration-300"
                >

                  <div className="bg-gray-100 aspect-square rounded-lg overflow-hidden mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-royal mb-2 group-hover:underline">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">
                    Ready to ship. Limited inventory.
                  </p>

                  <p className="text-sm font-semibold text-royal mb-4">
                    ${product.price}
                  </p>

                  <span className="text-sm font-medium text-royal">
                    View Product →
                  </span>

                </Link>
              ))}

            </div>

          )}

        </section>

        {/* LIMITED DROPS */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <h2 className="text-3xl font-bold text-royal mb-6">
              Limited Time Drops
            </h2>

            <div className="w-16 h-[3px] bg-gold mb-10"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border rounded-xl p-8 bg-white hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-3">
                  Streamline Pallet Drop
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Limited availability. Bulk-ready retail pallets.
                </p>
                <button className="text-royal font-medium">
                  Shop Drop →
                </button>
              </div>

              <div className="border rounded-xl p-8 bg-white hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-3">
                  Christian Collection
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Faith-based apparel & accessories.
                </p>
                <button className="text-royal font-medium">
                  Explore →
                </button>
              </div>

              <div className="border rounded-xl p-8 bg-white hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-3">
                  Outdoor Gear Release
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Freshly sourced seasonal inventory.
                </p>
                <button className="text-royal font-medium">
                  View Now →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
          <h2 className="text-3xl font-bold text-royal mb-6">
            Trusted By Buyers Nationwide
          </h2>

          <div className="w-16 h-[3px] bg-gold mb-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((review) => (
              <div key={review} className="border rounded-xl p-6">
                <div className="bg-gray-100 h-40 mb-4 flex items-center justify-center text-gray-400">
                  Customer Image
                </div>
                <p className="text-sm text-gray-600">
                  “Fast shipping. Clean packaging. Will purchase again.”
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}