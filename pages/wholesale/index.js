import Head from "next/head";
import Link from "next/link";

export default function WholesaleCategories() {
  const categories = [
    { name: "Tech Accessories", slug: "tech" },
    { name: "Glass & Lifestyle", slug: "glass" },
    { name: "Jewelry", slug: "jewelry" },
    { name: "Essentials", slug: "essentials" },
    { name: "Comfort", slug: "comfort" },
    { name: "Hair & Nail Products", slug: "hair-nail" },
    { name: "Skincare", slug: "skincare" },
    { name: "Schooling Products", slug: "schooling" },
  ];

  return (
    <>
      <Head>
        <title>Wholesale Inventory | KV Garage</title>
        <meta
          name="description"
          content="Structured wholesale inventory with tiered pricing and scalable distribution."
        />
      </Head>

      <main className="max-w-7xl mx-auto px-8 py-16">

        <div className="mb-16">
          <h1 className="text-4xl font-bold text-royal mb-4">
            Wholesale Inventory Categories
          </h1>
          <div className="w-20 h-[3px] bg-gold mb-6"></div>

          <p className="text-gray-600 max-w-2xl">
            All inventory qualifies for structured wholesale pricing.
            Minimum order begins at 4 units per SKU.
            Higher volume results in stronger margin positioning.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/wholesale/${category.slug}`}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition group"
            >
              <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center mb-6">
                <span className="text-gray-400">Image</span>
              </div>

              <h3 className="text-xl font-semibold text-royal mb-3 group-hover:underline">
                {category.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Tiered wholesale pricing available. MOQ: 4 units per item.
              </p>

              <span className="text-royal font-medium">
                View Products →
              </span>
            </Link>
          ))}
        </div>

      </main>
    </>
  );
}
