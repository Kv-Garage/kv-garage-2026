import { useState } from "react";

export default function Trading() {
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
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
            alt="Futures Trading"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-5xl font-bold mb-6">
            Institutional Futures Trading
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Structured intraday futures education built on risk management,
            market structure, and statistical edge.
          </p>

          <div className="space-x-4">
            <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-semibold">
              Begin Learning Free
            </button>

            <button
              onClick={handleCallCheckout}
              disabled={loading}
              className="border border-[#D4AF37] px-8 py-3 rounded-xl"
            >
              {loading ? "Redirecting..." : "Book $50 Strategy Call"}
            </button>

          </div>
        </div>
      </section>

      {/* INSTITUTIONAL OVERVIEW */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-[#D4AF37]">
          What We Teach
        </h2>

        <div className="grid md:grid-cols-2 gap-10 text-gray-300">
          <div>
            <h3 className="text-xl font-semibold mb-3">Market Structure</h3>
            <p>
              Understanding liquidity, order flow, session behavior,
              and institutional footprints within futures markets.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Risk Management</h3>
            <p>
              Position sizing models, statistical probability,
              and protecting capital before pursuing returns.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Trader Psychology</h3>
            <p>
              Emotional regulation, execution discipline,
              and performance-based self analysis.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Intraday Futures</h3>
            <p>
              ES, NQ, and commodities with a structured approach
              to session-based trading models.
            </p>
          </div>
        </div>
      </section>

      {/* FINANCIAL MEDIA SECTION */}
      <section className="bg-[#111827] py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">
          Stay Connected To The Global Markets
        </h2>

        <div className="max-w-4xl mx-auto">
          <iframe
            className="w-full h-[400px] rounded-xl"
            src="https://www.youtube.com/embed/iEpJwprxDdk"
            title="Bloomberg Live"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-400 mt-6">
          Markets move because information moves. Stay informed.
        </p>
      </section>

      {/* EDGE PILOT */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-4xl font-semibold mb-6 text-[#D4AF37]">
          EdgePilot™ AI Infrastructure
        </h2>

        <p className="text-gray-300 mb-10">
          A personalized AI trading assistant that tracks your win rate,
          analyzes your trade data, identifies behavioral weaknesses,
          and builds a structured roadmap to improve performance.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-gray-300">
          <div>Performance Analytics</div>
          <div>Behavior Pattern Detection</div>
          <div>Custom Learning Roadmap</div>
        </div>

        <div className="mt-10">
          <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-semibold">
            Access EdgePilot
          </button>
        </div>
      </section>

      {/* QUALIFICATION CTA */}
      <section className="bg-black py-24 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Serious About Becoming A Trader?
        </h2>

        <p className="text-gray-400 max-w-3xl mx-auto mb-8">
          Every strategy call is $50. This ensures focused conversations
          with individuals committed to developing professionally.
        </p>

        <button
          onClick={handleCallCheckout}
          disabled={loading}
          className="border border-[#D4AF37] px-10 py-4 rounded-xl text-lg"
        >
          {loading ? "Redirecting..." : "Apply For Strategy Call"}
        </button>
      </section>

    </div>
  );
}