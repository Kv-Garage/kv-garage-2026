import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About | KV Garage</title>
        <meta
          name="description"
          content="Learn about Kavion Steele and the structure behind KV Garage."
        />
      </Head>

      <main className="bg-white">

        <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT – FOUNDER IMAGE */}
          <div>
            <img
              src="/founder.jpg"
              alt="Kavion Steele"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>

          {/* RIGHT – STORY */}
          <div>

            <h1 className="text-4xl font-bold text-royal mb-6">
              About KV Garage
            </h1>

            <div className="w-16 h-[3px] bg-gold mb-8"></div>

            <p className="text-gray-600 mb-6">
              KV Garage was founded by Kavion Steele in 2022 and refined in 2026
              with one mission: build structured supply systems that make sense.
            </p>

            <p className="text-gray-600 mb-6">
              The focus has never been random product flipping. It has always been
              about positioning, margin control, supply reliability, and scalable execution.
            </p>

            <p className="text-gray-600 mb-8">
              Wholesale is built for operators. Retail is built for fast-moving
              opportunity. Both are structured to create leverage.
            </p>

            <p className="text-lg font-semibold text-royal mb-10">
              This is not a storefront. This is an infrastructure model.
            </p>

            {/* CTA */}
            <Link
              href="/contact"
              className="inline-block bg-royal text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition"
            >
              Contact Kavion Directly
            </Link>

          </div>

        </section>

      </main>
    </>
  );
}
