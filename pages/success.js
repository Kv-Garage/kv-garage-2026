import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

export default function Success() {
  const { clearCart } = useCart();
  const router = useRouter();
  const { session_id } = router.query;

  const [isCall, setIsCall] = useState(false);

  useEffect(() => {
    clearCart();
    localStorage.removeItem("kv_cart");

    if (!session_id) return;

    const checkSession = async () => {
      try {
        const res = await fetch(`/api/get-session?session_id=${session_id}`);
        const data = await res.json();

        if (data?.metadata?.type === "call") {
          setIsCall(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkSession();
  }, [session_id]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">

        <h1 className="text-5xl font-extrabold text-green-600 mb-8 tracking-tight">
          Payment Confirmed
        </h1>

        {!isCall && (
          <>
            <p className="text-xl text-gray-800 mb-4">
              Thank you for shopping with KV Garage.
            </p>

            <p className="text-gray-600 mb-10">
              Your order is being processed.
            </p>

            <Link
              href="/shop"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md font-semibold text-lg transition shadow-md"
            >
              Continue Shopping
            </Link>
          </>
        )}

        {isCall && (
          <>
            <p className="text-xl text-gray-800 mb-4">
              Your strategy call access has been unlocked.
            </p>

            <p className="text-gray-600 mb-10">
              Please schedule your session below.
            </p>

            <div className="rounded-2xl shadow-lg overflow-hidden">
              <iframe
                src="https://calendly.com/kvgarage-kvgarage/60min"
                width="100%"
                height="700"
                frameBorder="0"
              ></iframe>
            </div>
          </>
        )}

      </div>
    </main>
  );
}