import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Academy() {

  const [loading, setLoading] = useState("");

  const handleCheckout = async (type, name, amount) => {
    try {
      setLoading(type);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount,
          quantity: 1,
          legalAgreement: true,
          type
        }),
      });

      const session = await response.json();
      if (!session.url) return;

      window.location.href = session.url;

    } catch (err) {
      console.error(err);
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <Head>
        <title>KV Garage Academy | Institutional Operator Training</title>
      </Head>

      <main className="bg-[#0B0F19] text-white">

        {/* HERO */}
        <section className="py-24 md:py-40 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 items-start">

            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-6xl font-semibold mb-10">
                KV Garage Academy
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Institutional-grade systems, execution, and discipline.
              </p>
            </div>

            <div className="bg-[#111827] border border-[#1C2233] rounded-2xl p-6 md:p-10">
              <h3 className="text-lg font-semibold mb-6 text-[#D4AF37]">
                Qualification Interview
              </h3>

              <button
                onClick={() => handleCheckout("call", "Qualification Interview", 50)}
                className="w-full bg-[#D4AF37] text-black py-3 rounded-lg"
              >
                {loading === "call" ? "Redirecting..." : "Request Interview — $50"}
              </button>
            </div>

          </div>
        </section>

        {/* 4 WEEK COURSE */}
        <section className="py-24 md:py-40 border-b border-[#1C2233] text-center">

          <h2 className="text-4xl mb-10">4-Week Operator Intensive</h2>

          <p className="text-gray-400 mb-10">
            Structured training on systems, execution, and revenue.
          </p>

          <p className="text-3xl mb-8">$129.99</p>

          <button
            onClick={() => handleCheckout("course", "4 Week Course", 129.99)}
            className="border border-[#D4AF37] px-10 py-4 rounded-lg"
          >
            {loading === "course" ? "Processing..." : "Secure Seat"}
          </button>

        </section>

        {/* MENTORSHIP */}
        <section className="py-24 md:py-40 border-b border-[#1C2233] text-center">

          <h2 className="text-4xl mb-10">Mentorship</h2>

          <p className="text-gray-400 mb-10">
            Direct guidance, execution refinement, and accountability.
          </p>

          <p className="text-2xl mb-8">$500</p>

          <button
            onClick={() => handleCheckout("mentorship", "Mentorship Program", 500)}
            className="bg-[#D4AF37] text-black px-10 py-4 rounded-lg"
          >
            {loading === "mentorship" ? "Processing..." : "Join Mentorship"}
          </button>

        </section>

        {/* FULL */}
        <section className="py-24 md:py-40 text-center">

          <h2 className="text-4xl mb-10">Full Advisory</h2>

          <p className="text-gray-400 mb-10">
            Full system build, strategy, and scaling partnership.
          </p>

          <p className="text-2xl mb-8">$1000+</p>

          <button
            onClick={() => handleCheckout("full", "Full Advisory", 1000)}
            className="bg-[#D4AF37] text-black px-10 py-4 rounded-lg"
          >
            {loading === "full" ? "Processing..." : "Apply For Advisory"}
          </button>

        </section>

      </main>
    </>
  );
}