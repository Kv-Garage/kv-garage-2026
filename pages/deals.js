import { useState } from "react";

export default function Deals() {

  const [loading, setLoading] = useState("");

  // 🔥 STRIPE BOOKING (WORKING)
  const handleCheckout = async () => {
    try {
      setLoading("booking");

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "call", // 🔥 make sure your API supports this
        }),
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
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">

        <h1 className="text-3xl md:text-6xl font-extrabold text-black mb-6 tracking-tight">
          Business Infrastructure Engineering
        </h1>

        <div className="w-20 h-[3px] bg-black mx-auto mb-8"></div>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Custom-built systems engineered for real business operations.
        </p>

        <p className="text-gray-500 max-w-2xl mx-auto mb-10">
          Websites, backend infrastructure, automation pipelines, and payment systems 
          built as one complete operating system.
        </p>

        <button
          onClick={handleCheckout}
          className="bg-black text-white px-10 py-4 rounded-md font-semibold text-lg transition shadow-lg"
        >
          {loading === "booking" ? "Redirecting..." : "Reserve Strategy Session — $50"}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Session fee is credited toward your build if we proceed.
        </p>

      </section>

      {/* VISUAL SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-6 text-black">
              Full System Infrastructure
            </h2>

            <p className="text-gray-600 mb-6">
              Every build includes both frontend and backend systems designed 
              to operate together — not separate tools.
            </p>

            <ul className="space-y-3 text-gray-600">
              <li>• Frontend user experience</li>
              <li>• Backend systems + databases</li>
              <li>• Payment + checkout infrastructure</li>
              <li>• Automation + workflows</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" className="rounded-xl w-full h-full object-cover" />
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" className="rounded-xl w-full h-full object-cover" />
            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692" className="rounded-xl w-full h-full object-cover" />
            <img src="https://images.unsplash.com/photo-1556740749-887f6717d7e4" className="rounded-xl w-full h-full object-cover" />
          </div>

        </div>

      </section>

      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-6 py-24">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-black mb-4">
            Infrastructure Pricing
          </h2>

          <p className="text-gray-600">
            Transparent pricing based on system scope and complexity.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* FOUNDATION */}
          <div className="border border-gray-200 rounded-xl p-8">
            <h3 className="font-bold text-xl mb-2">Foundation</h3>
            <p className="text-4xl font-extrabold text-black mb-6">$1,500+</p>

            <ul className="space-y-3 text-gray-600 text-sm mb-6">
              <li>• Custom coded website (no templates)</li>
              <li>• Stripe / payment integration</li>
              <li>• Basic backend setup</li>
              <li>• Mobile responsive design</li>
            </ul>

            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-black text-white py-3 rounded"
            >
              Start Project
            </button>
          </div>

          {/* GROWTH */}
          <div className="border border-gray-200 rounded-xl p-8 shadow-lg">
            <h3 className="font-bold text-xl mb-2">Growth</h3>
            <p className="text-4xl font-extrabold text-black mb-6">$3,000 – $4,500</p>

            <ul className="space-y-3 text-gray-600 text-sm mb-6">
              <li>• Full custom platform</li>
              <li>• Backend database architecture</li>
              <li>• Automation workflows</li>
              <li>• CRM integration</li>
              <li>• Conversion-focused UI</li>
            </ul>

            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-black text-white py-3 rounded"
            >
              Start Project
            </button>
          </div>

          {/* ENTERPRISE */}
          <div className="border border-gray-200 rounded-xl p-8">
            <h3 className="font-bold text-xl mb-2">Enterprise</h3>
            <p className="text-4xl font-extrabold text-black mb-6">$5,000+</p>

            <ul className="space-y-3 text-gray-600 text-sm mb-6">
              <li>• Advanced backend systems</li>
              <li>• Multi-product infrastructure</li>
              <li>• Custom dashboards</li>
              <li>• Full automation pipelines</li>
              <li>• Scalable architecture design</li>
            </ul>

            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-black text-white py-3 rounded"
            >
              Start Project
            </button>
          </div>

        </div>

      </section>

      {/* QUEUE */}
      <section className="bg-gray-50 py-24">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-black mb-6">
            Limited Build Capacity
          </h2>

          <p className="text-gray-600">
            Only a limited number of builds are accepted to maintain speed and quality.
          </p>

        </div>

      </section>

    </main>
  );
}