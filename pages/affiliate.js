import Head from "next/head";
import Link from "next/link";

export default function Affiliate() {
  return (
    <>
      <Head>
        <title>KV Garage Distribution Partner Program</title>
        <meta
          name="description"
          content="Tiered distribution partner program. 15% commission. Performance bonuses. Structured payouts."
        />
      </Head>

      <main className="bg-white">

        {/* ================= HERO ================= */}
        <section className="py-24 border-b">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-start">

            <div className="md:col-span-2">

              <h1 className="text-5xl font-bold text-royal mb-6 leading-tight">
                Distribution Partner Program
              </h1>

              <div className="w-20 h-[3px] bg-gold mb-8"></div>

              <p className="text-lg text-gray-700 mb-8">
                Structured earnings through controlled supply referrals.
              </p>

              <div className="mb-10">
                <p className="text-3xl font-bold text-royal mb-4">
                  15% Commission Per Order
                </p>

                <p className="text-gray-600 mb-4">
                  Earn 15% on every completed order placed through your encrypted partner link.
                </p>

                <p className="text-sm text-gray-500">
                  Minimum order requirement: <strong>$250 per customer</strong>.
                </p>
              </div>

              <p className="text-gray-600">
                Built for serious operators, buyers, and creators who want to extend
                the supply network and monetize responsibly.
              </p>

            </div>

            {/* Earnings Summary */}
            <div className="border rounded-xl p-8 bg-gray-50 shadow-sm">

              <h3 className="font-semibold text-royal mb-6">
                Core Terms
              </h3>

              <ul className="text-sm text-gray-700 space-y-4 mb-8">
                <li>• 15% per completed order ($250 minimum)</li>
                <li>• Weekly payout cycles</li>
                <li>• On-demand withdrawal after first payout</li>
                <li>• 1 Free Shipping Credit per referred customer</li>
              </ul>

              <p className="text-xs text-gray-500 mb-6">
                Payouts processed within 3 business days depending on bank.
              </p>

              <Link
                href="#apply"
                className="block text-center bg-royal text-white py-3 rounded font-semibold hover:opacity-90 transition"
              >
                Apply To Join
              </Link>

            </div>

          </div>
        </section>


        {/* ================= TIER SYSTEM ================= */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">

            <h2 className="text-3xl font-bold text-royal mb-12">
              Tier Structure
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              {/* Silver */}
              <div className="bg-white border rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-royal">
                  Silver Partner
                </h3>
                <p className="text-gray-600 mb-4">
                  0–15 monthly orders
                </p>
                <p className="text-2xl font-bold mb-4">
                  15%
                </p>
                <p className="text-sm text-gray-500">
                  Base commission level.
                </p>
              </div>

              {/* Gold */}
              <div className="bg-white border-2 border-royal rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-royal">
                  Gold Partner
                </h3>
                <p className="text-gray-600 mb-4">
                  16–40 monthly orders
                </p>
                <p className="text-2xl font-bold mb-4">
                  15% + Performance Bonus
                </p>
                <p className="text-sm text-gray-500">
                  Quarterly performance incentives.
                </p>
              </div>

              {/* Elite */}
              <div className="bg-white border rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-royal">
                  Elite Partner
                </h3>
                <p className="text-gray-600 mb-4">
                  40+ monthly orders
                </p>
                <p className="text-2xl font-bold mb-4">
                  Custom Bonus Structure
                </p>
                <p className="text-sm text-gray-500">
                  Strategic incentives & priority access.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ================= PERFORMANCE BONUSES ================= */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-4xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-royal mb-6">
              Performance Incentives
            </h2>

            <p className="text-gray-600 mb-8">
              High-volume partners may unlock structured bonuses,
              including increased payout leverage and supply priority.
            </p>

            <p className="text-sm text-gray-500">
              Exact bonus structure disclosed after performance review.
            </p>

          </div>
        </section>


        {/* ================= EARNINGS EXAMPLE ================= */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">

            <h2 className="text-3xl font-bold text-royal mb-12">
              Earnings Projection Example
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-white border rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4">
                  10 Orders
                </h3>
                <p className="text-gray-600 mb-4">
                  $250 Minimum Each
                </p>
                <p className="text-2xl font-bold text-royal">
                  $375+
                </p>
              </div>

              <div className="bg-white border rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4">
                  25 Orders
                </h3>
                <p className="text-gray-600 mb-4">
                  $250 Minimum Each
                </p>
                <p className="text-2xl font-bold text-royal">
                  $937+
                </p>
              </div>

              <div className="bg-white border rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4">
                  50 Orders
                </h3>
                <p className="text-gray-600 mb-4">
                  $250 Minimum Each
                </p>
                <p className="text-2xl font-bold text-royal">
                  $1,875+
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ================= APPLICATION ================= */}
        <section id="apply" className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-royal mb-10 text-center">
              Apply To Become A Partner
            </h2>

            <form className="space-y-6 border rounded-xl p-8 shadow-sm">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="text"
                placeholder="Business / Brand"
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="text"
                placeholder="Social Media / Content Links"
                className="w-full border rounded-lg px-4 py-3"
              />

              <textarea
                placeholder="Why should we approve you?"
                rows="4"
                className="w-full border rounded-lg px-4 py-3"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Submit Application
              </button>

            </form>

          </div>
        </section>

      </main>
    </>
  );
}
