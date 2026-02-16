export default function Deals() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="py-32 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-8 text-[#D4AF37]">
          KV Garage Capital
        </h1>
        <p className="text-gray-400 text-xl leading-relaxed">
          A private capital allocation desk connecting investors,
          operators, and expanding businesses through structured
          introductions and coordinated execution.
        </p>
      </section>

      {/* MODEL */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-10">
          Structured Introductions. Controlled Access.
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Opportunities are privately sourced and reviewed before
          capital alignment. Detailed materials and CEO introductions
          are facilitated through KV Garage under structured agreement.
        </p>
      </section>

      {/* PROCESS */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-16 text-center text-gray-300">

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#D4AF37]">
              1. Capital Profile
            </h3>
            <p>
              Investors submit allocation criteria and deployment capacity.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#D4AF37]">
              2. NDA & Review
            </h3>
            <p>
              Qualified introductions occur under structured agreement.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#D4AF37]">
              3. Coordinated Execution
            </h3>
            <p>
              CEO discussions and deal structuring are facilitated directly.
            </p>
          </div>

        </div>
      </section>

      {/* BOOK CALL SECTION */}
      <section className="py-32 text-center max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-semibold mb-8 text-[#D4AF37]">
          Allocation Qualification Call
        </h2>

        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          All allocation discussions begin with a structured
          30-minute qualification call.
          <br />
          The call fee is $50 to ensure serious alignment.
        </p>

        <button className="bg-[#D4AF37] text-black px-12 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition">
          Book $50 Allocation Call
        </button>
      </section>

      {/* SELLER SECTION */}
      <section className="py-24 bg-black text-center px-6">
        <h2 className="text-2xl font-semibold mb-6">
          Seeking Expansion Capital?
        </h2>

        <p className="text-gray-400 mb-8">
          Submit your business overview for private review.
        </p>

        <button className="border border-[#D4AF37] px-10 py-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition">
          Submit Business Overview
        </button>
      </section>

    </div>
  );
}

