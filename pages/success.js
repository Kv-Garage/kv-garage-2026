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
              Thank you for your order.
            </p>

            <p className="text-gray-600 mb-6">
              Your payment has been successfully received and is now
              undergoing authorization and processing.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-left text-sm text-gray-700 space-y-3">

              <p>
                <strong>Payment Clearance:</strong> Orders are processed only
                after payment authorization and clearance, which may take up to 3 business days.
              </p>

              <p>
                <strong>Processing Time:</strong> Retail orders are typically
                prepared within 2–5 business days after clearance.
              </p>

              <p>
                <strong>Shipping & Delivery:</strong> Tracking information will be
                provided once dispatched. Delivery timelines are estimates and
                may vary depending on carrier conditions.
              </p>

              <p>
                <strong>Damaged Items:</strong> Any shipping damage must be reported
                within 3 days of delivery with photo evidence for review.
              </p>

              <p>
                Please review our{" "}
                <Link href="/shipping-policy" className="underline font-medium">
                  Shipping Policy
                </Link>{" "}
                and{" "}
                <Link href="/refund-policy" className="underline font-medium">
                  Refund Policy
                </Link>{" "}
                for full details.
              </p>

            </div>

            <p className="text-gray-600 mb-8">
              For assistance, contact{" "}
              <strong>kvgarage@kvgarage.com</strong> or call{" "}
              <strong>616-404-0751</strong>.
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

            <p className="text-gray-600 mb-6">
              By participating, you acknowledge that all trading education
              is provided for informational purposes only and involves risk.
            </p>

            <p className="text-gray-600 mb-8">
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

            <p className="text-xs text-gray-500 mt-6">
              See full{" "}
              <Link href="/risk-disclosure" className="underline">
                Risk Disclosure
              </Link>{" "}
              for important information.
            </p>
          </>
        )}

      </div>
    </main>
  );
}