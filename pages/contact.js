export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="py-32 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-8 text-[#D4AF37]">
          Connect With KV Garage
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed">
          Direct access for capital allocation, business partnerships,
          mentorship, and strategic discussions.
          <br /><br />
          All conversations begin with structured alignment.
        </p>
      </section>

      {/* FOUNDER POSITIONING */}
      <section className="py-20 max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-semibold mb-6">
          Founder-Led Access
        </h2>

        <p className="text-gray-400 leading-relaxed">
          Initial discussions are handled directly to ensure
          clarity, alignment, and execution quality.
          As the platform scales, qualified matters are routed
          through the appropriate division.
        </p>
      </section>

      {/* BOOKING OPTIONS */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-14 text-center">

          <div className="bg-black p-12 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-[#D4AF37]">
              Capital & Deal Allocation
            </h3>
            <p className="text-gray-400 mb-8">
              Investor alignment, structured introductions,
              and private allocation discussions.
            </p>

            <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-semibold">
              Book $50 Allocation Call
            </button>
          </div>

          <div className="bg-black p-12 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-[#D4AF37]">
              Wholesale & Partnerships
            </h3>
            <p className="text-gray-400 mb-8">
              Bulk distribution, pricing negotiation,
              and long-term supply relationships.
            </p>

            <button className="border border-[#D4AF37] px-8 py-3 rounded-xl">
              Schedule Business Call
            </button>
          </div>

          <div className="bg-black p-12 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-[#D4AF37]">
              Mentorship & Trading
            </h3>
            <p className="text-gray-400 mb-8">
              Structured guidance, academy enrollment,
              and performance development.
            </p>

            <button className="border border-[#D4AF37] px-8 py-3 rounded-xl">
              Book Strategy Session
            </button>
          </div>

        </div>
      </section>

      {/* DIRECT CONTACT */}
      <section className="py-28 text-center max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-8 text-[#D4AF37]">
          Direct Business Contact
        </h2>

        <div className="text-gray-400 space-y-4 text-lg">
          <p>Business Email: business@kvgarage.com</p>
          <p>General Inquiries: contact@kvgarage.com</p>
          <p>Response Time: 24–48 Hours</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-black text-center px-6">
        <h2 className="text-3xl font-semibold mb-6">
          Structured Conversations Build Structured Outcomes
        </h2>

        <p className="text-gray-400 mb-10">
          Select your path and initiate alignment.
        </p>

        <button className="bg-[#D4AF37] text-black px-12 py-4 rounded-xl text-lg font-semibold">
          Open Booking Calendar
        </button>
      </section>

    </div>
  );
}

