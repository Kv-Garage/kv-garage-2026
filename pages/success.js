import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

export default function Success() {
  const { clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showCalendly, setShowCalendly] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const { session_id } = router.query;

    if (!session_id) {
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch(`/api/get-session?session_id=${session_id}`);
        const session = await res.json();

        console.log("SESSION:", session);

        if (session?.payment_status === "paid") {
          clearCart();
          localStorage.removeItem("kv_cart");

          // SIMPLE RULE:
          // If the payment was $50 (5000 cents), unlock Calendly
          if (session?.amount_total === 5000) {
            setShowCalendly(true);
          }
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    verifySession();
  }, [router.isReady]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Verifying payment...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">

        <h1 className="text-5xl font-extrabold text-green-600 mb-8">
          Payment Confirmed
        </h1>

        {!showCalendly && (
          <>
            <p className="text-xl text-gray-800 mb-6">
              Thank you for your purchase.
            </p>

            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md font-semibold text-lg transition shadow-md"
            >
              Return Home
            </Link>
          </>
        )}

        {showCalendly && (
          <>
            <p className="text-xl text-gray-800 mb-6">
              Step 2 of 2 — Schedule Your Strategy Session
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