export default function Markets() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="py-24 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-6 text-[#D4AF37]">
          Markets & Investing
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Financial markets allocate capital across global economies.
          Understanding how they function creates leverage, perspective,
          and long-term opportunity.
        </p>
      </section>

      {/* STRUCTURED GUIDE */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12 text-gray-300">

          <div>
            <h2 className="text-2xl font-semibold mb-4">What Is Investing?</h2>
            <p>
              Investing is the allocation of capital into assets expected to
              generate long-term returns through appreciation, dividends,
              or yield.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">What Is Trading?</h2>
            <p>
              Trading focuses on shorter-term price movements and requires
              structured risk management, discipline, and statistical awareness.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">What Are Futures?</h2>
            <p>
              Futures contracts allow participation in commodities,
              stock indices, and financial instruments using leverage.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Risk & Volatility</h2>
            <p>
              Markets move because of liquidity, macroeconomic forces,
              institutional positioning, and global information flow.
            </p>
          </div>

        </div>
      </section>

      {/* MEDIA SECTION */}
      <section className="bg-[#111827] py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">
          Market Intelligence
        </h2>

        <div className="max-w-4xl mx-auto">
          <iframe
            className="w-full h-[400px] rounded-xl"
            src="https://www.youtube.com/embed/iEpJwprxDdk"
            title="Bloomberg Live"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-400 mt-6">
          Stay connected to macroeconomic developments and global markets.
        </p>
      </section>

      {/* SOURCES */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#D4AF37]">
          Primary Sources
        </h2>

        <ul className="space-y-3 text-gray-400">
          <li>
            <a
              href="https://www.cmegroup.com/education.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              CME Group Education
            </a>
          </li>

          <li>
            <a
              href="https://www.sec.gov/education"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              U.S. Securities and Exchange Commission
            </a>
          </li>

          <li>
            <a
              href="https://www.federalreserve.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Federal Reserve
            </a>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Ready To Go Deeper?
        </h2>

        <a href="/trading">
          <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-semibold">
            Explore Trading Division
          </button>
        </a>
      </section>

    </div>
  );
}
