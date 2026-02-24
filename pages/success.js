import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    localStorage.removeItem("kv_cart");
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">

        <h1 className="text-5xl font-extrabold text-green-600 mb-8 tracking-tight">
          Payment Received
        </h1>

        <p className="text-xl text-gray-800 mb-4">
          Thank you for shopping with KV Garage.
        </p>

        <p className="text-gray-600 mb-10">
          Your payment is currently being processed through our secure
          financial infrastructure. Once funds have officially cleared,
          your order will immediately move into fulfillment.
        </p>

        <div className="bg-gray-50 border rounded-2xl p-8 mb-10 text-base text-gray-700 shadow-sm">

          <p className="mb-2">✔ Payment processing initiated</p>
          <p className="mb-2">✔ Funds verification in progress</p>
          <p>✔ Order will ship once payment clears (typically 1–2 business days)</p>

        </div>

        <div className="bg-gradient-to-r from-gray-50 to-white border rounded-xl p-6 mb-10 text-sm text-gray-600">
          <p className="font-semibold mb-2">Security Notice</p>
          <p>
            All transactions are encrypted and processed through Stripe’s
            PCI-DSS Level 1 compliant infrastructure. No card data is stored
            on our servers.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md font-semibold text-lg transition shadow-md"
        >
          Continue Shopping
        </Link>

      </div>
    </main>
  );
}