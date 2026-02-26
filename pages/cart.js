// FULL cart.js replacement

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
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

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cart,
          legalAgreement: true,
        }),
      });

      const session = await response.json();
      if (!session.url) return;

      window.location.href = session.url;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-12 tracking-tight">
          Secure Checkout
        </h1>

        {cart.length === 0 ? (
          <div>
            <p className="text-gray-500 mb-6">Your cart is empty.</p>
            <Link
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-10">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 flex justify-between items-center shadow-sm"
                >
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <p className="font-semibold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-10">

              <h2 className="text-2xl font-bold mb-8">
                Total: ${totalPrice.toFixed(2)}
              </h2>

              <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <label className="flex items-start space-x-3 text-sm text-gray-700">
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
                    <Link href="/terms-and-conditions" className="underline font-medium">
                      Terms & Conditions
                    </Link>
                    ,{" "}
                    <Link href="/refund-policy" className="underline font-medium">
                      Refund Policy
                    </Link>
                    , and{" "}
                    <Link href="/privacy-policy" className="underline font-medium">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {error && (
                  <p className="text-red-600 text-sm mt-3">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">

                <Link
                  href="/shop"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition"
                >
                  Continue Shopping
                </Link>

                <button
                  onClick={clearCart}
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-md font-semibold transition"
                >
                  Clear Cart
                </button>

                <button
                  onClick={handleCartCheckout}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold text-lg transition shadow-md"
                >
                  Proceed to Secure Payment
                </button>

              </div>

            </div>
          </>
        )}

      </div>
    </main>
  );
}