import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

export default function Success() {
  const { clearCart } = useCart();
  const router = useRouter();

  const [showCalendly, setShowCalendly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const { session_id } = router.query;

    if (!session_id) {
      setLoading(false);
      return;
    }

    clearCart();
    localStorage.removeItem("kv_cart");

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/get-session?session_id=${session_id}`);
        const data = await res.json();

        console.log("SESSION:", data);

        // 🔥 ONLY show calendar for these types
        if (
          data?.metadata?.type === "call" ||
          data?.metadata?.type === "mentorship" ||
          data?.metadata?.type === "full"
        ) {
          setShowCalendly(true);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router.isReady]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Processing...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">

      <div className="max-w-3xl text-center">

        <h1 className="text-4xl font-bold text-green-600 mb-6">
          Payment Successful
        </h1>

        {/* 🔥 NORMAL PURCHASE */}
        {!showCalendly && (
          <>
            <p className="text-gray-700 mb-6">
              Your purchase has been completed successfully.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">

              <Link
                href="/learn"
                className="bg-blue-600 text-white px-6 py-3 rounded-md"
              >
                Go to Learn
              </Link>

              <Link
                href="/mentorship"
                className="bg-orange-500 text-white px-6 py-3 rounded-md"
              >
                View Mentorship
              </Link>

              <Link
                href="/shop"
                className="bg-gray-200 px-6 py-3 rounded-md"
              >
                Continue Shopping
              </Link>

            </div>
          </>
        )}

        {/* 🔥 CALENDAR FLOW */}
        {showCalendly && (
          <>
            <p className="text-gray-700 mb-6">
              Your access has been unlocked. Book your session below.
            </p>

            <div className="rounded-xl overflow-hidden shadow-lg">
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