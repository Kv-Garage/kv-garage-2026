export default function Business() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="py-24 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-6 text-[#D4AF37]">
          Business & Reselling
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Learn how products move, how margins work, and how structured
          systems create scalable income.
        </p>
      </section>

      {/* STRUCTURED GUIDE */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12 text-gray-300">

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              What Is Wholesale?
            </h2>
            <p>
              Wholesale involves purchasing products in bulk directly
              from suppliers and distributing them at a margin.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Retail & Arbitrage
            </h2>
            <p>
              Retail arbitrage focuses on identifying pricing inefficiencies
              and reselling products for structured profit.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Margins & Cost Structure
            </h2>
            <p>
              Understanding cost of goods, operating expenses, and
              profit margins determines business sustainability.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Systems & Scaling
            </h2>
            <p>
              Inventory systems, supplier relationships, and logistics
              allow businesses to scale beyond manual effort.
            </p>
          </div>

        </div>
      </section>

      {/* MEDIA SECTION */}
      <section className="bg-[#111827] py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">
          Business Foundations
        </h2>

        <div className="max-w-4xl mx-auto">
          <iframe
            className="w-full h-[400px] rounded-xl"
            src="https://www.youtube.com/embed/9No-FiEInLA"
            title="Business Basics"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-400 mt-6">
          Structured thinking creates sustainable growth.
        </p>
      </section>

      {/* SOURCES */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#D4AF37]">
          Primary Resources
        </h2>

        <ul className="space-y-3 text-gray-400">
          <li>
            <a
              href="https://www.sba.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              U.S. Small Business Administration
            </a>
          </li>

          <li>
            <a
              href="https://www.irs.gov/businesses"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              IRS Business Guidelines
            </a>
          </li>

          <li>
            <a
              href="https://www.score.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              SCORE Business Mentoring
            </a>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Want Structured Guidance?
        </h2>

        <a href="/mentorship">
          <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-semibold">
            Explore Mentorship
          </button>
        </a>
      </section>

    </div>
  );
}
