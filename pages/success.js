import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

export default function Success() {
  const { clearCart } = useCart();
  const router = useRouter();

  const [isCall, setIsCall] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const { session_id } = router.query;

    if (!session_id) return;

    clearCart();
    localStorage.removeItem("kv_cart");

    const checkSession = async () => {
      try {
        const res = await fetch(`/api/get-session?session_id=${session_id}`);
        const data = await res.json();

        console.log("SESSION DATA:", data);

        if (data?.metadata?.type === "call") {
          setIsCall(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router.isReady, router.query.session_id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">

        <h1 className="text-5xl font-extrabold text-green-600 mb-8 tracking-tight">
          Payment Confirmed
        </h1>

        {!isCall && (
          <>
            <p className="text-xl text-gray-800 mb-4">
              Thank you for your order.
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