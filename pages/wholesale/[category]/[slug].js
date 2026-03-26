import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { useCart } from "../../../context/CartContext";
import { PUBLIC_PRODUCT_FIELDS, getProductImageArray } from "../../../lib/productFields";
import { buildCanonicalUrl, buildProductDescription } from "../../../lib/seo";

export default function ProductPage() {
  const router = useRouter();
  const { category, slug } = router.query;

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [profile, setProfile] = useState(null);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(4);

  useEffect(() => {
    if (!slug) return;

    fetchProduct();
    fetchProfile();
  }, [slug]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select(PUBLIC_PRODUCT_FIELDS)
      .eq("slug", slug)
      .single();

    setProduct(data);

    if (data?.bundle_quantity) {
      setQuantity(data.bundle_quantity);
    }
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

  if (!product) return <p className="p-10">Loading...</p>;

  const role = profile?.role || "retail";
  const approved = profile?.approved || false;

  const isBundle = product.type === "bundle";
  const images = getProductImageArray(product);

  const perUnit = isBundle
    ? (product.bundle_price / product.bundle_quantity).toFixed(2)
    : product.price;

  const handleAddToCart = () => {
    // 🔥 ENFORCE MINIMUM
    if (!isBundle && quantity < 4) {
      alert("Minimum order is 4 units");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: isBundle ? product.bundle_price : product.price,
      quantity: isBundle ? 1 : quantity,
      image: product.image,
      category: product.category || "wholesale",
    });
  };

  return (
    <>
      <Head>
        <title>{product.name} | KV Garage Wholesale</title>
        <meta name="description" content={buildProductDescription(product)} />
        <link rel="canonical" href={buildCanonicalUrl(`/wholesale/${category}/${slug}`)} />
      </Head>

      <main className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid md:grid-cols-2 gap-12">

          {/* IMAGE */}
          <div>
            <div className="bg-gray-100 aspect-square flex items-center justify-center border rounded">
              {product.image ? (
                <img src={images[activeImage] || product.image} className="h-full object-contain" loading="lazy" alt={product.name} />
              ) : (
                <span>Image</span>
              )}
            </div>
            {images.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button key={image} onClick={() => setActiveImage(index)} className={`overflow-hidden rounded-xl border ${activeImage === index ? "border-black" : "border-gray-300"}`}>
                    <img src={image} alt={`${product.name} ${index + 1}`} className="h-16 w-16 object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* RIGHT */}
          <div>

            <h1 className="text-3xl font-bold text-royal mb-4">
              {product.name}
            </h1>

            <div className="w-16 h-[3px] bg-gold mb-6"></div>

            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            {/* 🔥 ACCESS CONTROL */}
            {role === "retail" && (
              <div className="mb-6 bg-yellow-50 border p-4 rounded">
                <p className="text-sm mb-2">
                  Wholesale pricing locked.
                </p>
                <Link href="/signup">
                  <button className="bg-black text-white px-4 py-2 rounded text-sm">
                    Unlock Access
                  </button>
                </Link>
              </div>
            )}

            {role === "student" && !approved && (
              <div className="mb-6 bg-gray-100 border p-4 rounded">
                <p className="text-sm mb-2">
                  Preview pricing — apply for full access.
                </p>
                <Link href="/apply">
                  <button className="bg-black text-white px-4 py-2 rounded text-sm">
                    Apply
                  </button>
                </Link>
              </div>
            )}

            {/* 🔥 PRICING */}
            {(role === "wholesale" && approved) ? (
              <div className="mb-6">
                <p className="text-xl font-semibold">
                  ${product.price}
                </p>

                {isBundle && (
                  <p className="text-sm text-gray-500">
                    {product.bundle_quantity} units • ${perUnit}/unit
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 mb-6">
                Login to view wholesale pricing
              </p>
            )}

            {/* 🔥 QUANTITY */}
            {!isBundle && (
              <div className="mb-6">
                <label className="block mb-2">
                  Quantity (Min 4)
                </label>
                <input
                  type="number"
                  min="4"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border px-4 py-2 rounded w-32"
                />
              </div>
            )}

            {/* 🔥 BUNDLE DISPLAY */}
            {isBundle && (
              <div className="mb-6 bg-gray-100 p-4 rounded">
                <p className="font-semibold">
                  Bundle Includes {product.bundle_quantity} Units
                </p>
                <p className="text-sm text-gray-600">
                  Optimized for bulk resale
                </p>
              </div>
            )}

            {/* 🔥 ACTION */}
            {(role === "wholesale" && approved) && (
              <button
                onClick={handleAddToCart}
                className="bg-royal text-white px-8 py-3 rounded"
              >
                Add to Cart
              </button>
            )}

            <div className="mt-10">
              <Link href={`/wholesale/${category}`}>
                ← Back
              </Link>
            </div>

          </div>
        </div>

      </main>
    </>
  );
}
