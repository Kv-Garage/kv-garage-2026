import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateQuantity,
    addToCart,
  } = useCart();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .limit(4);

    setProducts(data || []);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const getInventoryCount = (item) => {
    const raw =
      item?.inventory_count ??
      item?.inventory ??
      item?.stock ??
      item?.quantity_available ??
      item?.available_quantity;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const getUrgencyText = (item) => {
    const inventory = getInventoryCount(item);
    if (inventory != null && inventory < 10) return `Only ${inventory} left in stock`;
    return "High demand";
  };

  // 🔥 TIERS
  const tiers = [100, 250, 500];
  const nextTier = tiers.find(t => totalPrice < t);
  const amountToNext = nextTier ? (nextTier - totalPrice).toFixed(2) : null;

  // 🔥 BULK TRIGGER
  const bulkMode =
    totalPrice >= 100 ||
    cart.some(item => item.quantity >= 3);

  // 🔥 PROFIT (ONLY IF BULK)
  const estimatedRevenue = totalPrice * 2;
  const estimatedProfit = estimatedRevenue - totalPrice;

  // 🔥 STRIPE CHECKOUT (FIXED)
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cart, // ✅ FIX
          total: totalPrice,
          legalAgreement: true, // ✅ REQUIRED
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe error:", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070D] text-white px-6 py-16">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Order Review
        </h1>

        <div className="grid md:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">

            {cart.length === 0 && (
              <div className="text-gray-400">
                Your cart is empty — start adding products below.
              </div>
            )}

            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-[#111827] border border-[#1C2233] rounded-xl p-6 flex gap-6 items-center"
              >

                <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden">
                  {item.image && (
                    <img src={item.image} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1">

                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-400">
                    ${item.price.toFixed(2)} per unit
                  </p>
                  <p className="text-xs text-[#D4AF37] mt-1">
                    {getUrgencyText(item)}
                  </p>

                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="bg-gray-700 px-3 py-1 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="bg-gray-700 px-3 py-1 rounded"
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-400 text-sm mt-2"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

            {/* ADD MORE */}
            <div className="mt-12">

              <h2 className="text-xl font-semibold mb-4">
                Add More to Your Order
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#111827] border border-[#1C2233] rounded-lg p-4"
                  >

                    <div className="bg-gray-700 h-24 mb-3 rounded overflow-hidden">
                      {p.image && (
                        <img src={p.image} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <p className="text-sm font-medium">
                      {p.name}
                    </p>

                    <p className="text-xs text-gray-400 mb-2">
                      ${Number(p.price).toFixed(2)}
                    </p>

                    <button
                      onClick={() =>
                        addToCart({
                          name: p.name,
                          price: p.price,
                          quantity: 1,
                          image: p.image,
                          id: p.id,
                        })
                      }
                      className="w-full bg-[#D4AF37] text-black py-1 rounded text-sm font-semibold"
                    >
                      Add
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div className="bg-[#111827] border border-[#1C2233] rounded-xl p-6">

              <h3 className="font-semibold mb-3">
                Pricing Progress
              </h3>

              {amountToNext ? (
                <p className="text-sm text-gray-300 mb-2">
                  Add <strong>${amountToNext}</strong> more to unlock better pricing
                </p>
              ) : (
                <p className="text-green-400 text-sm mb-2">
                  Highest pricing tier reached
                </p>
              )}

              <div className="text-xs text-gray-400 space-y-1">
                <p>$100+ → improved pricing</p>
                <p>$250+ → stronger margins</p>
                <p>$500+ → bulk pricing</p>
              </div>

            </div>

            {bulkMode && (
              <div className="bg-[#111827] border border-[#1C2233] rounded-xl p-6">

                <h3 className="font-semibold mb-3">
                  Resell Potential
                </h3>

                <p className="text-sm text-gray-300">
                  Estimated Revenue: <strong>${estimatedRevenue.toFixed(2)}</strong>
                </p>

                <p className="text-green-400 text-sm">
                  Estimated Profit: ${estimatedProfit.toFixed(2)}
                </p>

              </div>
            )}

            <div className="bg-[#111827] border border-[#1C2233] rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-4">
                Total: ${totalPrice.toFixed(2)}
              </h2>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#D4AF37] text-black py-3 rounded-md font-semibold"
              >
                Checkout
              </button>

              <Link
                href="/shop"
                className="block mt-4 text-center text-sm text-gray-400"
              >
                Continue Shopping
              </Link>

              <button
                onClick={clearCart}
                className="w-full mt-3 bg-gray-700 py-2 rounded text-sm"
              >
                Clear Cart
              </button>

            </div>

          </div>

        </div>

        <section className="mt-20">

          <div className="bg-[#111827] border border-[#1C2233] rounded-2xl p-10">

            <h2 className="text-2xl font-bold mb-4">
              Partner With KV Garage
            </h2>

            <p className="text-gray-300 mb-6 max-w-3xl">
              Looking to move beyond retail buying? KV Garage provides a structured path
              into reselling and scalable supply access.
            </p>

            <div className="flex gap-4 flex-wrap">

              <Link href="/signup">
                <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-md font-semibold">
                  Apply for Access
                </button>
              </Link>

              <Link href="/mentorship">
                <button className="border border-white px-6 py-3 rounded-md font-semibold">
                  Learn System
                </button>
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}