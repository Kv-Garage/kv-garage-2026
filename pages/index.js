import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>KV Garage | Structured Supply Systems</title>
        <meta
          name="description"
          content="Wholesale infrastructure. Retail execution. Structured sourcing for serious operators."
        />
      </Head>

      <main>

        {/* ================= HERO ================= */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

            <div>
              <h1 className="text-5xl font-extrabold text-royal mb-6 leading-tight">
                Structured Products <br />
                For Serious Buyers
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                Wholesale supply. Retail execution.  
                Built for operators, store owners, and long-term buyers.
              </p>

              <div className="flex gap-4">
                <Link
                  href="/wholesale"
                  className="bg-royal text-white px-6 py-3 rounded font-semibold hover:opacity-90 transition"
                >
                  Enter Wholesale
                </Link>

                <Link
                  href="/shop"
                  className="border border-royal text-royal px-6 py-3 rounded font-semibold hover:bg-royal hover:text-white transition"
                >
                  Shop Retail
                </Link>
              </div>
            </div>

            <div className="bg-gray-100 h-96 rounded-xl flex items-center justify-center">
              Hero Image Placeholder
            </div>

          </div>
        </section>


        {/* ================= TRUST STRIP ================= */}
        <section className="bg-gray-50 py-8 border-y">
          <div className="max-w-6xl mx-auto px-6 flex justify-between text-sm text-gray-600">
            <span>Structured Supply Model</span>
            <span>Fast 7–10 Day Shipping</span>
            <span>Bulk Pricing Available</span>
            <span>U.S. Based Operations</span>
          </div>
        </section>


        {/* ================= WHOLESALE VALUE ================= */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-royal mb-6">
              Wholesale Built For Scale
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              The higher the volume, the lower the unit cost.  
              Every retail product is eligible for wholesale once minimum quantities are met.
            </p>
          </div>
        </section>


        {/* ================= CHOOSE YOUR PATH ================= */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-royal mb-12 text-center">
              Choose Your Path
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <Link href="/wholesale" className="border p-8 rounded-xl hover:shadow-lg transition bg-white">
                <h3 className="text-xl font-semibold mb-3">Wholesale</h3>
                <p className="text-gray-600 text-sm">
                  Bulk inventory. Structured pricing.  
                  Built for operators and store owners.
                </p>
              </Link>

              <Link href="/shop" className="border p-8 rounded-xl hover:shadow-lg transition bg-white">
                <h3 className="text-xl font-semibold mb-3">Retail</h3>
                <p className="text-gray-600 text-sm">
                  Fast-moving products. Clean checkout.  
                  Direct to consumer buying.
                </p>
              </Link>

              <Link href="/private-preview" className="border p-8 rounded-xl hover:shadow-lg transition bg-white">
                <h3 className="text-xl font-semibold mb-3">Sourcing Desk</h3>
                <p className="text-gray-600 text-sm">
                  Request products not listed.  
                  Custom sourcing for serious buyers.
                </p>
              </Link>

            </div>
          </div>
        </section>


        {/* ================= PRODUCT CATEGORIES ================= */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-royal mb-12 text-center">
              Product Categories
            </h2>

            <div className="grid md:grid-cols-4 gap-6 text-center">

              {[
                "Tech Accessories",
                "Glass & Lifestyle",
                "Jewelry",
                "Essentials",
                "Comfort",
                "Hair & Nail",
                "Skincare",
                "Schooling Products"
              ].map((cat, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-6 hover:shadow-md transition bg-gray-50"
                >
                  <div className="bg-gray-200 h-32 mb-4 rounded"></div>
                  <h4 className="font-semibold text-sm">{cat}</h4>
                </div>
              ))}

            </div>
          </div>
        </section>


        {/* ================= FOUNDER SECTION ================= */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

            {/* REAL IMAGE */}
            <div>
              <img
                src="/founder.jpg"
                alt="Kavion Steele"
                className="rounded-xl shadow-lg w-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-royal mb-6">
                Built By Kavion Steele
              </h2>

              <p className="text-gray-600 mb-6">
                KV Garage was built on positioning, margin control,
                supply reliability, and scalable execution.
              </p>

              <p className="text-gray-600 mb-8">
                This is not random flipping.  
                This is infrastructure.
              </p>

              <Link
                href="/about"
                className="bg-royal text-white px-6 py-3 rounded font-semibold hover:opacity-90 transition"
              >
                Read My Story
              </Link>
            </div>

          </div>
        </section>


        {/* ================= ECOSYSTEM ================= */}
        <section className="py-20 bg-white text-center">
          <h2 className="text-3xl font-bold text-royal mb-12">
            KV Garage Ecosystem
          </h2>

          <div className="flex justify-center gap-8 text-gray-600 text-sm">
            <Link href="/mentorship">Mentorship</Link>
            <Link href="/affiliate">Affiliate</Link>
            <Link href="/trading">Trading</Link>
            <Link href="/private-preview">Sourcing Desk</Link>
          </div>
        </section>

      </main>
    </>
  );
}
