export default function Learn() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="py-24 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-6">
          The KV Garage Knowledge Library
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          A structured gateway into business, markets, technology,
          and personal execution. Choose your direction and begin.
        </p>
      </section>

      {/* PATH SELECTOR GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-10">

          {/* BUSINESS */}
          <a href="/learn/business" className="bg-[#111827] rounded-2xl overflow-hidden hover:scale-[1.02] transition">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
              alt="Business"
              className="w-full h-60 object-cover opacity-80"
            />
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-3 text-[#D4AF37]">
                Business & Reselling
              </h2>
              <p className="text-gray-400">
                Learn wholesale, margins, inventory systems,
                and how to build structured income from products.
              </p>
            </div>
          </a>

          {/* MARKETS */}
          <a href="/learn/markets" className="bg-[#111827] rounded-2xl overflow-hidden hover:scale-[1.02] transition">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
              alt="Markets"
              className="w-full h-60 object-cover opacity-80"
            />
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-3 text-[#D4AF37]">
                Markets & Investing
              </h2>
              <p className="text-gray-400">
                Understand investing, futures, volatility,
                risk management, and how markets actually move.
              </p>
            </div>
          </a>

          {/* AI */}
          <a href="/learn/ai" className="bg-[#111827] rounded-2xl overflow-hidden hover:scale-[1.02] transition">
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
              alt="AI Technology"
              className="w-full h-60 object-cover opacity-80"
            />
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-3 text-[#D4AF37]">
                AI & Technology
              </h2>
              <p className="text-gray-400">
                Automation, APIs, AI systems, and how to build
                digital leverage in the modern economy.
              </p>
            </div>
          </a>

          {/* PSYCHOLOGY */}
          <a href="/learn/psychology" className="bg-[#111827] rounded-2xl overflow-hidden hover:scale-[1.02] transition">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Psychology"
              className="w-full h-60 object-cover opacity-80"
            />
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-3 text-[#D4AF37]">
                Sales & Psychology
              </h2>
              <p className="text-gray-400">
                Communication, discipline, execution habits,
                and decision-making under pressure.
              </p>
            </div>
          </a>

        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-black py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-[#D4AF37]">
            Why This Exists
          </h2>
          <p className="text-gray-400">
            When building from the ground up, access to structured
            information changes everything. This library exists to
            remove confusion and provide clear paths toward ownership,
            markets, leverage, and execution.
          </p>
        </div>
      </section>

    </div>
  );
}
