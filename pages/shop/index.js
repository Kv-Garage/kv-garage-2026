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

        {/* 🔥 ACCOUNT PANEL (UNCHANGED) */}
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

                console.log("SLUG:", product.slug);
                console.log("IMAGES VALUE:", product.images);
                console.log("IMAGES TYPE:", typeof product.images);
                console.log("IS ARRAY:", Array.isArray(product.images));

                // 🔥 SIMPLE SLUG CHECK FOR ALL PRODUCTS
                console.log("SLUG CHECK:", product.slug);

                // 🔥 LOG PRODUCT DATA FOR KV-CT-001
                if (product.slug === 'kv-ct-001' || product.id === 'kv-ct-001' || product.name?.includes('kv-ct-001')) {
                  console.log("IMAGES VALUE:", product.images);
                  console.log("IMAGES TYPE:", typeof product.images);
                  console.log("IS ARRAY:", Array.isArray(product.images));
                  
                  console.log('🔍 PRODUCT OBJECT FOR KV-CT-001:', {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    images: product.images,
                    image: product.image,
                    images_type: typeof product.images,
                    image_type: typeof product.image,
                    images_length: product.images?.length,
                    full_product: product
                  });
                }

                // 🔥 SLUG VALIDATION & FALLBACK
                const productSlug = product.slug || product.id || `product-${product.id}`;
                const productUrl = `/shop/${productSlug}`;
                
                // 🔥 LOG URL ISSUES
                if (!product.slug || product.slug === '') {
                  console.warn('⚠️ MISSING SLUG for product:', {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    fallbackUrl: productUrl
                  });
                }

                const displayPrice = product.price || (product.cost * 2);

                // 🔥 ONLY CHANGE IS HERE
                const displayImage =
                  product.images?.[0] ||
                  product.image ||
                  "/placeholder.jpg";

                return (
                  <Link
                    href={productUrl}
                    key={product.id}
                    className="bg-white rounded-xl p-4 hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="h-40 w-full object-cover mb-4 rounded-lg overflow-hidden">
                      <img
                        src={displayImage}
                        className="h-full w-full object-cover"
                        alt={product.name}
                      />
                    </div>

                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                      {product.category}
                    </p>

                    <p className="text-sm font-semibold mb-4">
                      ${Number(displayPrice).toFixed(2)}
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

        {/* TRUST SECTION (UNCHANGED) */}
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