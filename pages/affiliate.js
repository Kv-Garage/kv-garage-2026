import Head from "next/head";
import Link from "next/link";

export default function Affiliate() {
  return (
    <>
      <Head>
        <title>KV Garage | Private Distribution Network</title>
        <meta
          name="description"
          content="Structured distribution partnership. Institutional payout systems. Controlled supply network."
        />
      </Head>

      <main className="bg-[#0B0F19] text-white">

        {/* ================= HERO ================= */}
        <section className="py-24 md:py-40 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 items-start">

            <div className="md:col-span-2">
              <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
                Private Distribution Network
              </p>

              <h1 className="text-3xl md:text-6xl font-semibold leading-tight mb-10">
                Structured Partner Access
              </h1>

              <div className="w-24 h-[2px] bg-[#D4AF37] mb-10"></div>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                A controlled revenue channel for operators with real distribution leverage.
              </p>

              <p className="text-gray-400 max-w-2xl leading-relaxed mb-6">
                This is not a public affiliate system. Access is limited to individuals 
                with verified buyer networks, operational capacity, or existing distribution channels.
              </p>

              <p className="text-gray-500 max-w-2xl leading-relaxed">
                You are not promoting a product — you are participating in a controlled 
                supply and revenue system.
              </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="bg-[#111827] border border-[#1C2233] rounded-2xl p-6 md:p-10">

              <h3 className="text-lg font-semibold mb-6 text-[#D4AF37]">
                Core Economics
              </h3>

              <ul className="text-sm text-gray-400 space-y-4 mb-8 leading-relaxed">
                <li>• 15% per completed order</li>
                <li>• $250 minimum order value</li>
                <li>• Weekly payout cycles</li>
                <li>• Real-time tracking visibility</li>
              </ul>

              <p className="text-xs text-gray-500 mb-6">
                Payments processed within 3 business days. Structured payout system.
              </p>

              <div className="border-t border-[#1C2233] pt-6 text-sm text-gray-400 space-y-2">
                <p>• Verified supply access</p>
                <p>• Controlled distribution model</p>
                <p>• Long-term partner structure</p>
              </div>

              <Link
                href="#apply"
                className="block text-center mt-8 bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Request Access
              </Link>
            </div>

          </div>
        </section>

        {/* ================= SYSTEM BREAKDOWN ================= */}
        <section className="py-24 border-b border-[#1C2233]">

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

            <div className="bg-[#111827] p-6 rounded-xl">
              <h4 className="text-[#D4AF37] mb-3">1. Access</h4>
              <p className="text-gray-400 text-sm">
                Approved partners gain access to controlled product supply and pricing structures.
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl">
              <h4 className="text-[#D4AF37] mb-3">2. Distribution</h4>
              <p className="text-gray-400 text-sm">
                You move product through your own network, channels, or buyers.
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl">
              <h4 className="text-[#D4AF37] mb-3">3. Payout</h4>
              <p className="text-gray-400 text-sm">
                Revenue is tracked and distributed through structured payout cycles.
              </p>
            </div>

          </div>

        </section>

        {/* ================= WHO THIS IS FOR ================= */}
        <section className="py-24 border-b border-[#1C2233]">

          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

            <div>
              <h2 className="text-3xl mb-6">Who This Is For</h2>

              <div className="space-y-3 text-gray-400">
                <p>• Individuals with buyer networks</p>
                <p>• Resellers / operators</p>
                <p>• Community leaders</p>
                <p>• Sales-focused individuals</p>
              </div>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl">
              <p className="text-gray-400">
                This is not open enrollment. Approval is based on your ability 
                to move product, not your interest level.
              </p>
            </div>

          </div>

        </section>

        {/* ================= APPLICATION ================= */}
        <section id="apply" className="py-24 md:py-40 text-center">
          <div className="max-w-3xl mx-auto px-6">

            <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
              Controlled Enrollment
            </p>

            <h2 className="text-4xl font-semibold mb-12">
              Request Distribution Access
            </h2>

            <form
              name="affiliate-application"
              method="POST"
              data-netlify="true"
              netlify
              data-netlify-honeypot="bot-field"
              className="space-y-6 border border-[#1C2233] rounded-2xl p-6 md:p-10 bg-[#111827]"
            >
              <input type="hidden" name="form-name" value="affiliate-application" />
              <input type="hidden" name="bot-field" />

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                className="w-full bg-[#0B0F19] border border-[#1C2233] rounded-lg px-4 py-3 text-white"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full bg-[#0B0F19] border border-[#1C2233] rounded-lg px-4 py-3 text-white"
              />

              <input
                type="text"
                name="businessDescription"
                placeholder="Business / Network Description"
                required
                className="w-full bg-[#0B0F19] border border-[#1C2233] rounded-lg px-4 py-3 text-white"
              />

              <textarea
                name="networkDetails"
                placeholder="Describe your network and buyer access"
                rows="4"
                required
                className="w-full bg-[#0B0F19] border border-[#1C2233] rounded-lg px-4 py-3 text-white"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Submit Request
              </button>

            </form>

          </div>
        </section>

      </main>
    </>
  );
}