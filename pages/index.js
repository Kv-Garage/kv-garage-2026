import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-20 items-center">

        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Structured Operations.<br />
            Disciplined Growth.
          </h1>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Wholesale distribution, retail execution, and capital alignment managed through controlled systems and measurable standards.
          </p>

          <Link href="/wholesale">
            <button className="bg-[#D4AF37] text-black px-10 py-4 rounded-xl font-semibold hover:opacity-90 transition">
              Explore Operations
            </button>
          </Link>
        </div>

        <div>
          <img
            src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg"
            alt="Warehouse Operations"
            className="rounded-2xl shadow-2xl object-cover w-full h-[480px]"
          />
        </div>
      </section>

      {/* STRATEGIC BAR */}
      <section className="border-t border-b border-gray-800 py-8 text-center text-gray-400">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 text-sm tracking-wide">
          <p>Wholesale & Distribution</p>
          <p>Capital Allocation</p>
          <p>Founder-Led Oversight</p>
          <p>Operational Discipline</p>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <h2 className="text-3xl font-semibold text-center mb-20 text-[#D4AF37]">
          Divisions
        </h2>

        <div className="grid md:grid-cols-3 gap-16">

          <Link href="/wholesale" className="group">
            <div className="rounded-2xl overflow-hidden bg-[#111827] hover:bg-[#161F2E] transition shadow-lg">
              <img
                src="https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg"
                alt="Wholesale"
                className="w-full h-72 object-cover group-hover:scale-105 transition"
              />
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-3 text-white">Wholesale</h3>
                <p className="text-gray-400">
                  Bulk distribution and structured supply relationships.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/deals" className="group">
            <div className="rounded-2xl overflow-hidden bg-[#111827] hover:bg-[#161F2E] transition shadow-lg">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Capital"
                className="w-full h-72 object-cover group-hover:scale-105 transition"
              />
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-3 text-white">Capital</h3>
                <p className="text-gray-400">
                  Strategic alignment and controlled deal execution.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/learn" className="group">
            <div className="rounded-2xl overflow-hidden bg-[#111827] hover:bg-[#161F2E] transition shadow-lg">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                alt="Education"
                className="w-full h-72 object-cover group-hover:scale-105 transition"
              />
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-3 text-white">Education</h3>
                <p className="text-gray-400">
                  Execution-based business and market instruction.
                </p>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* FOSTER TO FOUNDER */}
      <section className="py-28 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

          <div>
            <img
              src="/founder.jpg"
              alt="Founder"
              className="rounded-2xl shadow-2xl object-cover w-full h-[500px]"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-6 text-[#D4AF37]">
              Foster to Founder
            </h2>

            <p className="text-gray-400 leading-relaxed mb-6">
              Systems were built from instability. Discipline replaced chaos.
              Execution replaced circumstance.
            </p>

            <p className="text-gray-400 leading-relaxed mb-8">
              Retail, wholesale, capital allocation, and education operate under
              defined structure and measurable performance standards.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/about">
                <button className="border border-[#D4AF37] px-8 py-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition">
                  Full Profile
                </button>
              </Link>

              <Link href="/wholesale">
                <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-semibold">
                  Wholesale Division
                </button>
              </Link>

              <Link href="/shop">
                <button className="border border-gray-600 px-8 py-3 rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition">
                  Retail Division
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* DISTRIBUTION CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-28 border-t border-gray-800">
        <h2 className="text-3xl font-semibold text-center mb-20 text-[#D4AF37]">
          Distribution Categories
        </h2>

        <div className="grid md:grid-cols-4 gap-12">

          <Category title="Tech Accessories" image="https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1200&auto=format&fit=crop" slug="tech-accessories" />
          <Category title="Glass & Lifestyle" image="/bong.webp" slug="glass-lifestyle" />
          <Category title="Jewelry" image="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg" slug="jewelry" />
         <Category title="Essentials" image="/febreze-vent-clip.png" slug="essentials" />
          <Category title="Comfort" image="https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg" slug="comfort" />
          <Category title="Hair & Nail" image="https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg" slug="hair-nail" />
          <Category title="Skincare" image="https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg" slug="skincare" />
          <Category title="Schooling Products" image="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg" slug="schooling-products" />

        </div>
      </section>

    </div>
  );
}

function Category({ title, image, slug }) {
  return (
    <Link href={`/wholesale/${slug}`} className="group">
      <div className="bg-[#111827] rounded-2xl p-6 hover:bg-[#161F2E] transition shadow-lg cursor-pointer">

        <div className="w-full h-56 flex items-center justify-center bg-white rounded-xl mb-6 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="max-h-[180px] max-w-full object-contain"
          />
        </div>

        <p className="text-center font-medium text-white group-hover:text-[#D4AF37] transition">
          {title}
        </p>

      </div>
    </Link>
  );
}
