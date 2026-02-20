import Head from "next/head";
import Link from "next/link";

export default function Academy() {
  return (
    <>
      <Head>
        <title>KV Garage Academy | Institutional Operator Training</title>
        <meta
          name="description"
          content="An institutional-grade academy for operators. Structured systems, capital discipline, and long-term thinking."
        />
      </Head>

      <main className="bg-[#0B0F19] text-white">

        {/* ================= HERO ================= */}
        <section className="py-40 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-20 items-start">

            {/* LEFT */}
            <div className="md:col-span-2">

              <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
                Institutional Operator Development
              </p>

              <h1 className="text-6xl font-semibold leading-tight mb-10">
                KV Garage Academy
              </h1>

              <div className="w-24 h-[2px] bg-[#D4AF37] mb-10"></div>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                A capital-grade learning institution built for disciplined builders.
              </p>

              <p className="text-gray-400 max-w-2xl leading-relaxed mb-6">
                This is not content.
                This is structure.
                Infrastructure thinking.
                Execution at a standard most never reach.
              </p>

              <p className="text-gray-500 max-w-2xl leading-relaxed">
                Systems. Sales. AI Infrastructure. Capital Allocation.
                Character. Faith. Long-term thinking.
              </p>

            </div>

            {/* RIGHT PANEL */}
            <div className="bg-[#111827] border border-[#1C2233] rounded-2xl p-10">

              <h3 className="text-lg font-semibold mb-6 text-[#D4AF37]">
                Qualification Interview
              </h3>

              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Entry is selective.
                We work with builders committed to disciplined execution.
              </p>

              <p className="text-sm text-gray-500 mb-10">
                $50 — credited upon acceptance.
              </p>

              <Link
                href="/contact"
                className="block text-center bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Request Interview
              </Link>

            </div>

          </div>
        </section>


        {/* ================= LIBRARY ================= */}
        <section className="py-40 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6">

            <div className="mb-20">
              <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-6">
                Public Foundation
              </p>

              <h2 className="text-4xl font-semibold mb-6">
                Operator Library
              </h2>

              <div className="w-16 h-[2px] bg-[#D4AF37]"></div>
            </div>

            <div className="grid md:grid-cols-4 gap-12">

              {[
                "Building Infrastructure",
                "AI System Architecture",
                "Revenue & Distribution",
                "Market Intelligence",
                "Sales Positioning",
                "Automation Design",
                "Code & Execution",
                "Faith & Discipline"
              ].map((title, index) => (
                <div
                  key={index}
                  className="group border border-[#1C2233] rounded-2xl p-8 hover:border-[#D4AF37] transition"
                >
                  <div className="h-40 bg-[#111827] rounded-xl mb-8"></div>

                  <h3 className="text-sm tracking-wide font-medium mb-6">
                    {title}
                  </h3>

                  <div className="flex justify-between text-xs text-gray-500 group-hover:text-gray-300 transition">
                    <span>Watch</span>
                    <span>Playbook</span>
                  </div>
                </div>
              ))}

            </div>

          </div>
        </section>


        {/* ================= CORE PROGRAM ================= */}
        <section className="py-40 border-b border-[#1C2233] text-center">
          <div className="max-w-4xl mx-auto px-6">

            <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
              Cohort Program
            </p>

            <h2 className="text-4xl font-semibold mb-10">
              4-Week Operator Intensive
            </h2>

            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-10"></div>

            <p className="text-gray-400 mb-12 leading-relaxed">
              A structured immersion into systems thinking,
              revenue design, infrastructure, and disciplined execution.
            </p>

            <p className="text-3xl font-semibold mb-10">
              $129.99
            </p>

            <button className="border border-[#D4AF37] px-10 py-4 rounded-lg hover:bg-[#D4AF37] hover:text-black transition font-semibold">
              Secure Seat
            </button>

          </div>
        </section>


        {/* ================= PRIVATE MENTORSHIP ================= */}
        <section className="py-40 border-b border-[#1C2233] text-center">
          <div className="max-w-4xl mx-auto px-6">

            <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
              Private Tier
            </p>

            <h2 className="text-4xl font-semibold mb-10">
              Mentorship & Oversight
            </h2>

            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-10"></div>

            <p className="text-gray-400 mb-12 leading-relaxed">
              Personalized infrastructure alignment.
              Revenue architecture.
              Strategic accountability.
            </p>

            <p className="text-2xl font-semibold mb-10">
              $500 / Month
            </p>

            <Link
              href="/private-preview"
              className="bg-[#D4AF37] text-black px-10 py-4 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Apply For Consideration
            </Link>

          </div>
        </section>


        {/* ================= ADVISORY ================= */}
        <section className="py-40 text-center">
          <div className="max-w-4xl mx-auto px-6">

            <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
              Executive Advisory
            </p>

            <h2 className="text-4xl font-semibold mb-10">
              Strategic Partnership
            </h2>

            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-10"></div>

            <p className="text-gray-400 mb-12 leading-relaxed">
              For operators scaling teams, systems,
              and capital allocation at meaningful levels.
            </p>

            <p className="text-2xl font-semibold mb-12">
              Starting at $1000
            </p>

            <Link
              href="/contact"
              className="border border-gray-600 px-10 py-4 rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition font-semibold"
            >
              Initiate Conversation
            </Link>

          </div>
        </section>

      </main>
    </>
  );
}
