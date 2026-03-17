import { useState } from "react";

export default function Deals() {

  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {

    try {

      setLoading(true);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "Infrastructure Strategy Session",
          amount: 50,
          quantity: 1,
          legalAgreement: true,
          booking: true
        })
      });

      const data = await res.json();

      if (!data.url) {
        console.error("Stripe session failed");
        setLoading(false);
        return;
      }

      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      setLoading(false);
    }

  };

  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">

        <h1 className="text-3xl md:text-6xl font-extrabold text-royal mb-6 tracking-tight">
          Business Infrastructure Engineering
        </h1>

        <div className="w-20 h-[3px] bg-gold mx-auto mb-8"></div>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Custom digital systems engineered and deployed in 7 days.
          Websites, backend infrastructure, automation, and payment architecture
          built for modern businesses.
        </p>

        <button
          onClick={handleBooking}
          className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md font-semibold text-lg transition shadow-lg"
        >
          {loading ? "Redirecting..." : "Reserve Infrastructure Strategy Session — $50"}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Consultation fee applied toward project cost if we work together.
        </p>

      </section>


      {/* WHAT WE BUILD */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">

        <div>
          <h3 className="font-bold text-lg mb-3">Custom Websites</h3>
          <p className="text-gray-600">
            Fully coded responsive websites designed around your business model.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">Backend Infrastructure</h3>
          <p className="text-gray-600">
            Payment systems, automation pipelines, database architecture and
            scalable backend systems.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">Operational Systems</h3>
          <p className="text-gray-600">
            CRM integration, automation tools, and digital infrastructure that
            supports real business operations.
          </p>
        </div>

      </section>


      {/* BUILD TIMELINE */}
      <section className="bg-gray-50 py-24">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-10 text-royal">
            7 Day Infrastructure Build
          </h2>

          <ul className="space-y-4 text-gray-700 text-lg">
            <li>Day 1 — Architecture planning</li>
            <li>Day 2–4 — Platform development</li>
            <li>Day 5 — Payment + backend integration</li>
            <li>Day 6 — Testing + optimization</li>
            <li>Day 7 — Deployment + launch</li>
          </ul>

        </div>

      </section>


      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-6 py-24">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-royal mb-4">
            Infrastructure Build Pricing
          </h2>

          <p className="text-gray-600">
            Final pricing depends on system complexity and infrastructure requirements.
          </p>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="border border-gray-200 rounded-xl p-8">
            <h3 className="font-bold text-xl mb-4">Foundation Build</h3>
            <p className="text-3xl font-extrabold mb-6">$1,500+</p>

            <ul className="space-y-3 text-gray-600 text-sm">
              <li>Custom coded website</li>
              <li>Payment system integration</li>
              <li>Basic backend infrastructure</li>
            </ul>
          </div>


          <div className="border border-gray-200 rounded-xl p-8 shadow-lg">

            <h3 className="font-bold text-xl mb-4">Growth Infrastructure</h3>
            <p className="text-3xl font-extrabold mb-6">$3,000 – $4,500</p>

            <ul className="space-y-3 text-gray-600 text-sm">
              <li>Full custom platform</li>
              <li>Automation workflows</li>
              <li>Database architecture</li>
              <li>CRM integration</li>
            </ul>

          </div>


          <div className="border border-gray-200 rounded-xl p-8">

            <h3 className="font-bold text-xl mb-4">Enterprise Systems</h3>
            <p className="text-3xl font-extrabold mb-6">$5,000 – $6,000+</p>

            <ul className="space-y-3 text-gray-600 text-sm">
              <li>Advanced backend automation</li>
              <li>Multi-product infrastructure</li>
              <li>Operational dashboards</li>
              <li>Scalable architecture</li>
            </ul>

          </div>

        </div>

      </section>


      {/* BUILD QUEUE */}
      <section className="bg-gray-50 py-24">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-royal mb-6">
            Limited Build Queue
          </h2>

          <p className="text-gray-600 mb-10">
            To maintain speed and quality we only take a limited number of
            infrastructure builds at a time. New clients enter the queue
            once the current project begins.
          </p>

        </div>

      </section>

    </main>
  );
}