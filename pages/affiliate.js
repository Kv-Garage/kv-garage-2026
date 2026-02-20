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
        <section className="py-40 border-b border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-20 items-start">

            <div className="md:col-span-2">

              <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
                Private Distribution Network
              </p>

              <h1 className="text-6xl font-semibold leading-tight mb-10">
                Structured Partner Access
              </h1>

              <div className="w-24 h-[2px] bg-[#D4AF37] mb-10"></div>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                A controlled revenue channel for operators
                with real networks.
              </p>

              <p className="text-gray-400 max-w-2xl leading-relaxed mb-6">
                When you move product through verified supply,
                you participate in structured upside.
              </p>

              <p className="text-gray-500 max-w-2xl leading-relaxed">
                No gimmicks. No public affiliate spam.
                Only disciplined referral relationships.
              </p>

            </div>

            {/* Terms Panel */}
            <div className="bg-[#111827] border border-[#1C2233] rounded-2xl p-10">

              <h3 className="text-lg font-semibold mb-6 text-[#D4AF37]">
                Core Economics
              </h3>

              <ul className="text-sm text-gray-400 space-y-4 mb-8 leading-relaxed">
                <li>• 15% per completed order</li>
                <li>• $250 minimum order value</li>
                <li>• Weekly payout cycles</li>
                <li>• Transparent tracking dashboard</li>
              </ul>

              <p className="text-xs text-gray-500 mb-8">
                Payments processed within 3 business days.
                Institutional payout structure.
              </p>

              <Link
                href="#apply"
                className="block text-center bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Request Access
              </Link>

            </div>

          </div>
        </section>


        {/* ================= ECONOMIC EXAMPLE ================= */}
        <section className="py-40 border-b border-[#1C2233] text-center">
          <div className="max-w-6xl mx-auto px-6">

            <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
              Economic Model
            </p>

            <h2 className="text-4xl font-semibold mb-12">
              Example Distribution Economics
            </h2>

            <div className="grid md:grid-cols-3 gap-12">

              <div className="border border-[#1C2233] rounded-2xl p-10">
                <h3 className="text-lg mb-4 text-gray-300">
                  10 Orders
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  $250 each
                </p>
                <p className="text-3xl font-semibold">
                  $375
                </p>
              </div>

              <div className="border border-[#D4AF37] rounded-2xl p-10">
                <h3 className="text-lg mb-4 text-gray-300">
                  25 Orders
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  $250 each
                </p>
                <p className="text-3xl font-semibold text-[#D4AF37]">
                  $937
                </p>
              </div>

              <div className="border border-[#1C2233] rounded-2xl p-10">
                <h3 className="text-lg mb-4 text-gray-300">
                  50 Orders
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  $250 each
                </p>
                <p className="text-3xl font-semibold">
                  $1,875
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ================= TIER STRUCTURE ================= */}
        <section className="py-40 border-b border-[#1C2233] text-center">
          <div className="max-w-6xl mx-auto px-6">

            <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
              Partnership Tiers
            </p>

            <h2 className="text-4xl font-semibold mb-16">
              Performance Alignment
            </h2>

            <div className="grid md:grid-cols-3 gap-12">

              <div className="border border-[#1C2233] rounded-2xl p-10">
                <h3 className="text-lg font-semibold mb-6">
                  Network Partner
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  0–15 Monthly Orders
                </p>
                <p className="text-2xl font-semibold">
                  15%
                </p>
              </div>

              <div className="border border-[#D4AF37] rounded-2xl p-10">
                <h3 className="text-lg font-semibold mb-6 text-[#D4AF37]">
                  Strategic Partner
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  16–40 Monthly Orders
                </p>
                <p className="text-2xl font-semibold">
                  15% + Performance Bonus
                </p>
              </div>

              <div className="border border-[#1C2233] rounded-2xl p-10">
                <h3 className="text-lg font-semibold mb-6">
                  Capital Partner
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  40+ Monthly Orders
                </p>
                <p className="text-2xl font-semibold">
                  Custom Incentives
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ================= APPLICATION ================= */}
        <section id="apply" className="py-40 text-center">
          <div className="max-w-3xl mx-auto px-6">

            <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-8">
              Controlled Enrollment
            </p>

            <h2 className="text-4xl font-semibold mb-12">
              Request Distribution Access
            </h2>

            <form className="space-y-6 border border-[#1C2233] rounded-2xl p-10 bg-[#111827]">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-[#0B0F19] border border-[#1C2233] rounded-lg px-4 py-3 text-white"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-[#0B0F19] border border-[#1C2233] rounded-lg px-4 py-3 text-white"
              />

              <input
                type="text"
                placeholder="Business / Network Description"
                className="w-full bg-[#0B0F19] border border-[#1C2233] rounded-lg px-4 py-3 text-white"
              />

              <textarea
                placeholder="Describe your network and buyer access"
                rows="4"
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
