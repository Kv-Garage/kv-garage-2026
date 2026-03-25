import Head from "next/head";
import { useState } from "react";

export default function Academy() {

  const [loading, setLoading] = useState("");

  const handleCheckout = async (type) => {
    try {
      setLoading(type);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Checkout Error:", errorData);
        return;
      }

      const { url } = await response.json();

      if (!url) {
        console.error("No checkout URL returned");
        return;
      }

      window.location.href = url;

    } catch (err) {
      console.error(err);
      alert("Checkout error");
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <Head>
        <title>KV Garage Academy</title>
      </Head>

      <main className="bg-[#05070D] text-white relative overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#111827_1px,transparent_1px),linear-gradient(90deg,#111827_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#D4AF37]/20 blur-[120px] rounded-full pointer-events-none" />

        {/* HERO */}
        <section className="py-32 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">

            <div>
              <h1 className="text-5xl mb-6 leading-tight">
                Build Systems That Generate Real Results
              </h1>

              <p className="text-gray-400 mb-8">
                Learn business, AI, coding, and execution through structured systems.
              </p>

              <button
                onClick={() => handleCheckout("call")}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg"
              >
                {loading === "call" ? "Loading..." : "Book $50 Strategy Call"}
              </button>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl">
              <p>✔ Structured learning</p>
              <p>✔ AI + coding systems</p>
              <p>✔ Execution focused</p>
              <p>✔ Real-world application</p>
            </div>

          </div>
        </section>

        {/* COURSE */}
        <section className="py-24 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">

            <div>
              <h2 className="text-4xl mb-4">4 Week System Course</h2>

              <p className="text-gray-400 mb-6">
                Learn systems thinking, AI tools, coding, and execution.
              </p>

              <div className="space-y-2 text-gray-300 mb-6">
                <p>• Week 1: Systems thinking</p>
                <p>• Week 2: AI workflows</p>
                <p>• Week 3: Coding basics</p>
                <p>• Week 4: Execution</p>
              </div>

              <p className="text-2xl mb-6">$129</p>

              {/* COMING SOON BADGE */}
              <div className="mb-4">
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                  Coming Soon
                </span>
              </div>

              {/* DISABLED BUTTON */}
              <button
                disabled
                className="bg-gray-600 text-gray-400 px-8 py-3 rounded-lg cursor-not-allowed opacity-50"
              >
                Join Course - Coming Soon
              </button>
            </div>

            <div className="bg-[#111827] p-8 rounded-xl">
              <p className="text-gray-400">
                This course builds real-world skills that apply across industries.
              </p>
            </div>

          </div>
        </section>

        {/* MENTORSHIP */}
        <section className="py-24 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">

            <div>
              <h2 className="text-4xl mb-4">Mentorship</h2>

              <p className="text-gray-400 mb-6">
                Direct support, accountability, and guidance.
              </p>

              <div className="space-y-2 text-gray-300 mb-6">
                <p>• Weekly guidance</p>
                <p>• Execution help</p>
                <p>• Problem solving</p>
                <p>• Real-world application</p>
              </div>

              <p 
                className="text-2xl mb-6 cursor-pointer hover:text-[#D4AF37] transition-colors"
                onClick={() => handleCheckout("mentorship")}
              >
                {loading === "mentorship" ? "Loading..." : "$500"}
              </p>

              {/* 🔥 FIXED BUTTON */}
              <button
                onClick={() => handleCheckout("mentorship")}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg"
              >
                {loading === "mentorship" ? "Loading..." : "Join Mentorship - $500"}
              </button>
            </div>

            <div className="bg-[#111827] p-8 rounded-xl">
              <p className="text-gray-400">
                Designed for serious individuals ready to move faster.
              </p>
            </div>

          </div>
        </section>

        {/* ADVISORY */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">

            <div className="bg-[#111827] p-8 rounded-xl border border-[#D4AF37]/20">
              <h2 className="text-3xl text-[#D4AF37] mb-4">
                Full Advisory
              </h2>

              <p className="text-gray-400 mb-6">
                Advanced strategy and execution support.
              </p>

              <p 
                className="text-2xl mb-6 cursor-pointer hover:text-[#D4AF37] transition-colors"
                onClick={() => handleCheckout("advisory")}
              >
                {loading === "advisory" ? "Loading..." : "$1000"}
              </p>

              {/* 🔥 FIXED BUTTON */}
              <button
                onClick={() => handleCheckout("advisory")}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg"
              >
                {loading === "advisory" ? "Loading..." : "Apply for Advisory - $1000"}
              </button>
            </div>

            <div>
              <p className="text-gray-400">
                Built for individuals ready to operate at a higher level.
              </p>
            </div>

          </div>
        </section>

      </main>
    </>
  );
}