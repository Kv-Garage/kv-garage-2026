import Head from "next/head";
import { useState } from "react";

export default function Academy() {

  const [loading, setLoading] = useState("");

  const handleCheckout = async (type, name, amount) => {
    try {
      setLoading(type);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount,
          quantity: 1,
          legalAgreement: true,
          type,
        }),
      });

      const data = await res.json();
      if (!data.url) return;

      window.location.href = data.url;

    } catch (err) {
      console.error(err);
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <Head>
        <title>KV Garage Academy</title>
        <meta name="description" content="Learn coding, sales, AI systems and execution." />
      </Head>

      <main className="bg-[#05070D] text-white overflow-hidden">

        {/* ================= HERO ================= */}
        <section className="relative py-32 border-b border-[#1C2233]">

          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>

          <div className="relative max-w-5xl mx-auto px-6">

            <p className="text-xs tracking-[0.3em] text-gray-500 mb-6">
              KV GARAGE ACADEMY
            </p>

            <h1 className="text-4xl md:text-6xl font-semibold mb-8 leading-tight">
              Build Systems That <br /> Generate Real Revenue
            </h1>

            <div className="w-20 h-[2px] bg-[#D4AF37] mb-8"></div>

            <p className="text-gray-400 max-w-2xl mb-10">
              Coding. Sales. AI Infrastructure. Execution.
              Built for operators — not consumers.
            </p>

            <button
              onClick={() => handleCheckout("call", "Qualification Interview", 50)}
              className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-semibold 
              shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition"
            >
              {loading === "call" ? "Processing..." : "Request Access — $50"}
            </button>

          </div>
        </section>

        {/* ================= QUOTE ================= */}
        <section className="py-20 text-center border-b border-[#1C2233]">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-2xl md:text-3xl text-gray-300">
              “Most people don’t fail because they’re incapable.  
              They fail because they never build real systems.”
            </p>
            <p className="text-gray-500 mt-6 text-sm">— KV Garage</p>
          </div>
        </section>

        {/* ================= IMAGE SECTION ================= */}
        <section className="py-28 border-b border-[#1C2233]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72"
              className="rounded-xl shadow-2xl"
            />

            <div>
              <h2 className="text-3xl mb-6">This Is Not Content.</h2>
              <p className="text-gray-400 mb-4">
                This is a structured system designed for execution,
                not entertainment.
              </p>
              <p className="text-gray-500">
                If you're serious about building — you're in the right place.
              </p>
            </div>

          </div>
        </section>

        {/* ================= TRAINING ================= */}
        <section className="py-24 border-b border-[#1C2233]">

          <h2 className="text-4xl text-center mb-16">
            Training Library
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">

            {[
              "Coding Systems",
              "Sales Foundations",
              "Trading Discipline",
              "AI Infrastructure",
              "Offer Creation",
              "Execution Systems"
            ].map((title, i) => (
              <div key={i} className="border border-[#1C2233] rounded-xl overflow-hidden hover:border-[#D4AF37] transition">

                <img
                  src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f"
                  className="w-full h-[180px] object-cover opacity-70"
                />

                <div className="p-4">
                  <p>{title}</p>
                </div>

              </div>
            ))}

          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => handleCheckout("course", "4 Week Course", 129.99)}
              className="bg-[#D4AF37] text-black px-10 py-4 rounded-lg"
            >
              {loading === "course" ? "Processing..." : "Unlock Full System — $129"}
            </button>
          </div>

        </section>

        {/* ================= MENTORSHIP ================= */}
        <section className="py-24 border-b border-[#1C2233] text-center">

          <h2 className="text-4xl mb-6">Mentorship</h2>
          <p className="text-gray-400 mb-4">
            Direct execution. Real accountability.
          </p>
          <p className="text-red-400 mb-4">Limited spots available</p>
          <p className="text-2xl mb-6">$500</p>

          <button
            onClick={() => handleCheckout("mentorship", "Mentorship Program", 500)}
            className="bg-[#D4AF37] text-black px-10 py-4 rounded-lg"
          >
            {loading === "mentorship" ? "Processing..." : "Join Mentorship"}
          </button>

        </section>

        {/* ================= ADVISORY ================= */}
        <section className="py-24 text-center">

          <h2 className="text-4xl mb-6">Full Advisory</h2>
          <p className="text-gray-400 mb-4">
            Build & scale with direct oversight.
          </p>
          <p className="text-2xl mb-6">$1000+</p>

          <button
            onClick={() => handleCheckout("full", "Full Advisory", 1000)}
            className="bg-[#D4AF37] text-black px-10 py-4 rounded-lg"
          >
            {loading === "full" ? "Processing..." : "Apply"}
          </button>

        </section>

        {/* ================= FINAL QUOTE ================= */}
        <section className="py-24 text-center">

          <h2 className="text-2xl md:text-3xl mb-6">
            You Either Build Systems… <br /> Or Stay Stuck Repeating Cycles
          </h2>

          <p className="text-gray-500">
            The difference is execution.
          </p>

        </section>

      </main>
    </>
  );
}