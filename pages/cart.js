import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCartCheckout = async () => {
    try {
      if (cart.length === 0) return;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cart,
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
              Back to Shop
            </Link>
          </div>
        ) : (
          <>
            {/* CART ITEMS */}
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

              {/* ENTERPRISE SECURITY PANEL */}
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-lg">

                <div className="flex items-center mb-6 space-x-3">
                  <span className="text-2xl">🛡</span>
                  <h3 className="text-xl font-bold">
                    Enterprise-Grade Cyber Security
                  </h3>
                </div>

                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✔ 256-bit SSL Encryption</li>
                  <li>✔ PCI-DSS Level 1 Compliant</li>
                  <li>✔ Real-Time Fraud Monitoring</li>
                  <li>✔ Zero Card Data Stored</li>
                </ul>

                {/* CLICKABLE STRIPE BADGE */}
                <div className="flex items-center space-x-6 mb-6">

                  <a
                    href="https://stripe.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition"
                  >
                    <svg viewBox="0 0 48 20" className="h-6 fill-current text-purple-600">
                      <text x="0" y="15" fontSize="14" fontWeight="700">
                        Powered by Stripe
                      </text>
                    </svg>
                  </a>

                  <a
                    href="https://www.pcisecuritystandards.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition"
                  >
                    <div className="text-xs font-semibold border px-3 py-1 rounded">
                      PCI DSS Compliant
                    </div>
                  </a>

                  <a
                    href="https://en.wikipedia.org/wiki/Transport_Layer_Security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition"
                  >
                    <div className="text-xs font-semibold border px-3 py-1 rounded">
                      SSL Secured
                    </div>
                  </a>

                </div>

                {/* CARD NETWORK DISPLAY (OFFICIAL STYLE) */}
                <div className="flex items-center space-x-6 opacity-90">

                  <span className="font-bold text-blue-700">VISA</span>
                  <span className="font-bold text-red-500">MASTERCARD</span>
                  <span className="font-bold text-blue-600">AMEX</span>
                  <span className="font-bold text-gray-800">DISCOVER</span>

                </div>

                <p className="text-xs text-gray-500 mt-6">
                  All transactions are encrypted and securely processed through Stripe’s global payment infrastructure.
                </p>

              </div>

              {/* CONFIDENCE SECTION */}
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600 mb-10">

                <div>
                  <h4 className="font-semibold mb-2">🚚 Fast Fulfillment</h4>
                  <p>Orders processed within 24–72 hours.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">📦 Order Protection</h4>
                  <p>Tracking provided on all shipments.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">⭐ Satisfaction Promise</h4>
                  <p>Built for serious operators.</p>
                </div>

              </div>

              <div className="flex space-x-4">

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