import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { calculatePrice } from "../../lib/pricing";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabase";

export default function ProductPage({ profile }) {
  const router = useRouter();
  const { slug } = router.query;

  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  // 🔥 UPSSELL (ADDED ONLY)
  const [upsellProducts, setUpsellProducts] = useState([]);
  const [bundleSelected, setBundleSelected] = useState([]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      const { data: v } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", data.id);

      // 🔥 UPSSELL FETCH (ADDED)
      const { data: upsells } = await supabase
        .from("products")
        .select("*")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(3);

      setUpsellProducts(upsells || []);

      setProduct(data);
      setVariants(v || []);

      if (v?.length > 0) {
        setSelectedVariant(v[0]);
        setSelectedImage(v[0].image);
      } else {
        setSelectedImage(data.image);
      }
    };

    fetchData();
  }, [slug]);

  if (!product) return <p className="p-10">Loading...</p>;

  // 🔥 CART TOTAL
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const role = profile?.role || "retail";
  const approved = profile?.approved || false;

  const activeCost =
    selectedVariant?.cost || product.cost || product.price;

  const basePrice = product.price || product.cost * 2;

  // 🔥 LIVE PRICING SYSTEM (UNCHANGED)
  const shouldDiscount =
    quantity > 1 || cartTotal >= 100 || role !== "retail";

  const pricePerUnit = shouldDiscount
    ? calculatePrice({
        cost: activeCost,
        quantity,
        role,
        approved,
        cartTotal,
      })
    : basePrice;

  const totalPrice = pricePerUnit * quantity;

  // 🔥 TIERS SYSTEM (UNCHANGED)
  const tiers = [100, 250, 500];
  const nextTier = tiers.find(t => cartTotal < t);
  const amountToNext = nextTier
    ? (nextTier - cartTotal).toFixed(2)
    : null;

  // 🔥 VARIANTS
  const sizes = [...new Set(variants.map(v => v.option1).filter(Boolean))];
  const colors = [...new Set(variants.map(v => v.option2).filter(Boolean))];

  const selectVariant = (type, value) => {
    let found;

    if (type === "size") {
      found = variants.find(v => v.option1 === value);
    }

    if (type === "color") {
      found = variants.find(v => v.option2 === value);
    }

    if (found) {
      setSelectedVariant(found);
      setSelectedImage(found.image);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      price: pricePerUnit,
      quantity,
      image: selectedImage,
    });

    setAddedMessage("Added to cart");
    setTimeout(() => setAddedMessage(""), 2000);
  };

  // 🔥 BUNDLE ADD (ADDED)
  const handleBundleAdd = () => {
    handleAddToCart();

    bundleSelected.forEach((p) => {
      addToCart({
        name: p.name,
        price: p.price,
        quantity: 1,
        image: p.image,
      });
    });

    setAddedMessage("Bundle added to cart");
  };

  return (
    <>
      <Head>
        <title>{product.name} | KV Garage</title>
      </Head>

      <main className="bg-white text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <Link href="/shop" className="text-sm mb-8 inline-block hover:underline">
            ← Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-12">

            {/* IMAGE */}
            <div>
              <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg mb-4">
                {selectedImage && (
                  <img src={selectedImage} className="h-full object-contain" />
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                {(product.images || []).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className="h-16 w-16 object-cover border cursor-pointer hover:border-black"
                  />
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div>

              <h1 className="text-3xl font-bold mb-2">
                {product.name}
              </h1>

              <p className="text-sm text-gray-500 mb-4">
                ⭐ 4.7 (128 reviews) • 2,100 sold
              </p>

              {/* 🔥 PRICING */}
              <p className="text-xl mb-1">
                Price Per Unit: <strong>${pricePerUnit.toFixed(2)}</strong>
              </p>

              <p className="text-2xl font-semibold mb-4">
                Total: ${totalPrice.toFixed(2)}
              </p>

              {/* 🔥 RETAIL UNLOCK (BACK EXACTLY) */}
              <div className="mb-6 border p-4 rounded-xl bg-gray-50">
                <p className="text-xs uppercase text-gray-500">
                  Account Status
                </p>

                <p className="font-semibold mb-2">
                  {role === "retail" && "Retail Buyer"}
                  {role === "student" && "Reseller"}
                  {role === "wholesale" && "Wholesale"}
                </p>

                {role === "retail" && (
                  <Link href="/signup">
                    <button className="text-sm bg-black text-white px-4 py-2 rounded">
                      Unlock Better Pricing
                    </button>
                  </Link>
                )}
              </div>

              {/* 🔥 PROGRESS SYSTEM (BACK EXACTLY) */}
              <div className="mb-6 bg-gray-100 p-4 rounded-xl">

                <p className="text-sm mb-2">
                  {amountToNext
                    ? `Add $${amountToNext} to unlock better pricing`
                    : "🔥 Highest pricing tier unlocked"}
                </p>

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-black h-2 rounded"
                    style={{
                      width: `${Math.min((cartTotal / 500) * 100, 100)}%`
                    }}
                  />
                </div>

                <div className="text-xs mt-2 text-gray-600">
                  $100 → better • $250 → stronger • $500 → bulk
                </div>
              </div>

              {/* SIZE */}
              {sizes.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 font-medium">Size</p>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => selectVariant("size", s)}
                        className="border px-3 py-2 rounded"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COLOR */}
              {colors.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 font-medium">Color</p>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => selectVariant("color", c)}
                        className="border px-3 py-2 rounded"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QTY */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border px-4 py-2 w-24 rounded-md"
                />
              </div>

              {addedMessage && (
                <p className="text-green-600 text-sm mb-4">
                  {addedMessage}
                </p>
              )}

              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-6 py-3 rounded-md font-semibold w-full"
              >
                Add to Cart
              </button>

              {/* 🔥 UPSSELL (ONLY ADDITION) */}
              {upsellProducts.length > 0 && (
                <div className="border p-4 rounded-xl mt-6 bg-gray-50">

                  <h3 className="font-semibold mb-3">
                    Frequently Bought Together
                  </h3>

                  {upsellProducts.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBundleSelected(prev => [...prev, u]);
                          } else {
                            setBundleSelected(prev =>
                              prev.filter(p => p.id !== u.id)
                            );
                          }
                        }}
                      />
                      <img src={u.image} className="h-12 w-12 object-cover" />
                      <p className="text-sm">{u.name}</p>
                      <span className="ml-auto text-sm font-medium">
                        ${u.price}
                      </span>
                    </div>
                  ))}

                  <button
                    onClick={handleBundleAdd}
                    className="bg-green-600 text-white px-4 py-2 mt-3 w-full rounded"
                  >
                    Add Bundle to Cart
                  </button>

                </div>
              )}

            </div>
          </div>

          <div className="mt-16 max-w-3xl">
            <h2 className="text-xl mb-4">Product Details</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

        </div>
      </main>
    </>
  );
}