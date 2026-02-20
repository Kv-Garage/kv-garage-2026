import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-900 text-white">

      {/* HERO */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-emerald-400">
            Connect With KV Garage
          </h1>

          <p className="text-blue-200 text-lg mb-4">
            Direct access for capital allocation, business partnerships, mentorship, and strategic discussions.
          </p>

          <p className="text-blue-300">
            All conversations begin with structured alignment.
          </p>
        </div>
      </section>

      {/* CLICKABLE ACCESS CARD */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">

          <Link href="/private-preview">
            <div className="cursor-pointer group bg-blue-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300 border border-emerald-500/20">

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
                  alt="Private Access"
                  className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent" />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-emerald-400 mb-2">
                  Private Ecosystem Access
                </h3>

                <p className="text-blue-200">
                  Click to view structured access tiers and capital pathways.
                </p>
              </div>

            </div>
          </Link>

        </div>
      </section>

      {/* BOOK A CALL */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto bg-blue-900/40 backdrop-blur-md rounded-2xl p-10 shadow-xl border border-emerald-500/20">

          <h2 className="text-3xl font-semibold text-emerald-400 mb-4">
            Book a Strategy Call
          </h2>

          <p className="text-blue-200 mb-6">
            1-on-1 structured consultation. Direct founder access.
          </p>

          <p className="text-emerald-300 text-xl font-bold mb-8">
            $50 USD
          </p>

          <a
            href="https://buy.stripe.com/YOUR_LINK_HERE"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 px-10 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg inline-block"
          >
            Book Now
          </a>

        </div>
      </section>

    </div>
  );
}
