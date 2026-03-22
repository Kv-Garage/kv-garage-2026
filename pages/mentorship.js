import Head from "next/head";
import { useState } from "react";

export default function Academy() {

  const [loading, setLoading] = useState("");

  const handleCheckout = async (type) => {
    try {
      console.log("CLICKED:", type);
      setLoading(type);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();

      if (!data.url) {
        alert("Stripe failed");
        return;
      }

      window.location.href = data.url;

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
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#111827_1px,transparent_1px),linear-gradient(90deg,#111827_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#D4AF37]/20 blur-[120px] rounded-full" />

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
                onClick={() => handleCheckout("course")}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg"
              >
                {loading === "course" ? "Loading..." : "Start Learning"}
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

              {/* 🔥 FIXED BUTTON */}
              <button
                onClick={() => handleCheckout("course")}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg"
              >
                {loading === "course" ? "Loading..." : "Join Course"}
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

              <p className="text-2xl mb-6">$500</p>

              {/* 🔥 FIXED BUTTON */}
              <button
                onClick={() => handleCheckout("mentorship")}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg"
              >
                {loading === "mentorship" ? "Loading..." : "Apply for Mentorship"}
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

              <p className="text-2xl mb-6">$1000+</p>

              {/* 🔥 FIXED BUTTON */}
              <button
                onClick={() => handleCheckout("full")}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg"
              >
                {loading === "full" ? "Loading..." : "Apply"}
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