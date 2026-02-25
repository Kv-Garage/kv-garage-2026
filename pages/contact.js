import { useState } from "react";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleCallCheckout = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Strategy Call",
          amount: 50,
          quantity: 1,
          type: "call",
        }),
      });

      const session = await response.json();
      if (!session.url) return;

      window.location.href = session.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-900 text-white">

      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-emerald-400">
            Connect With KV Garage
          </h1>

          <p className="text-blue-200 text-lg mb-4">
            Direct access for capital allocation, business partnerships, mentorship, and strategic discussions.
          </p>

          <p className="text-blue-300">
            All conversations begin with structured alignment.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto bg-blue-900/40 backdrop-blur-md rounded-2xl p-10 shadow-xl border border-emerald-500/20">

          <h2 className="text-3xl font-semibold text-emerald-400 mb-4">
            Book a Strategy Call
          </h2>

          <p className="text-blue-200 mb-6">
            1-on-1 structured consultation. Direct founder access.
          </p>

          <p className="text-emerald-300 text-xl font-bold mb-8">
            $50 USD
          </p>

          <button
            onClick={handleCallCheckout}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 px-10 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
          >
            {loading ? "Redirecting..." : "Book Now"}
          </button>

        </div>
      </section>

    </div>
  );
}