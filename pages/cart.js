import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCartCheckout = async () => {
    try {
      if (cart.length === 0) return;

      if (!agreed) {
        setError("You must agree to the Terms & Policies before proceeding.");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cart, // 🔥 THIS MUST MATCH API
          legalAgreement: true,
          type: "product", // 🔥 ensures no calendar popup
        }),
      });

      const session = await response.json();

      if (!session.url) {
        console.error("No checkout URL returned");
        return;
      }

      window.location.href = session.url;

    } catch (err) {
      console.error("Checkout Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070D] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-12">
          Secure Checkout
        </h1>

        {cart.length === 0 ? (
          <div>
            <p className="text-gray-400 mb-6">Your cart is empty.</p>

            <Link
              href="/shop"
              className="bg-blue-600 px-6 py-3 rounded-md font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* ITEMS */}
            <div className="space-y-6 mb-10">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="border border-[#1C2233] bg-[#111827] rounded-xl p-6 flex justify-between items-center"
                >
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-400">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="font-semibold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="border-t border-[#1C2233] pt-10">

              <h2 className="text-2xl font-bold mb-8">
                Total: ${totalPrice.toFixed(2)}
              </h2>

              {/* AGREEMENT */}
              <div className="mb-8 bg-[#111827] border border-[#1C2233] rounded-xl p-6">
                <label className="flex items-start space-x-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => {
                      setAgreed(!agreed);
                      setError("");
                    }}
                    className="mt-1"
                  />

                  <span>
                    I agree to the{" "}
                    <Link href="/terms-and-conditions" className="underline">
                      Terms
                    </Link>
                    ,{" "}
                    <Link href="/refund-policy" className="underline">
                      Refund Policy
                    </Link>
                    , and{" "}
                    <Link href="/privacy-policy" className="underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {error && (
                  <p className="text-red-500 text-sm mt-3">{error}</p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-4">

                <Link
                  href="/shop"
                  className="bg-blue-600 px-6 py-3 rounded-md font-semibold"
                >
                  Continue Shopping
                </Link>

                <button
                  onClick={clearCart}
                  className="bg-gray-600 px-6 py-3 rounded-md font-semibold"
                >
                  Clear Cart
                </button>

                <button
                  onClick={handleCartCheckout}
                  disabled={loading}
                  className="bg-[#D4AF37] text-black px-8 py-3 rounded-md font-semibold text-lg"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>

              </div>

            </div>
          </>
        )}

      </div>
    </main>
  );
}