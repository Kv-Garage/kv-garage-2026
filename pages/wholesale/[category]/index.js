import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  if (!category) return null;

  const formattedCategory =
    category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  const products = [
    { name: "Product One", slug: "product-one" },
    { name: "Product Two", slug: "product-two" },
    { name: "Product Three", slug: "product-three" },
    { name: "Product Four", slug: "product-four" },
    { name: "Product Five", slug: "product-five" },
    { name: "Product Six", slug: "product-six" },
    { name: "Product Seven", slug: "product-seven" },
    { name: "Product Eight", slug: "product-eight" },
  ];

  return (
    <>
      <Head>
        <title>{formattedCategory} | KV Garage Wholesale</title>
        <meta
          name="description"
          content="Wholesale inventory with structured tier pricing."
        />
      </Head>

      <main className="max-w-7xl mx-auto px-8 py-20">

        {/* HEADER SECTION */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold text-royal mb-4">
            {formattedCategory}
          </h1>

          <div className="w-16 h-[3px] bg-gold mb-6"></div>

          <p className="text-gray-600 max-w-2xl leading-relaxed">
            All products in this category qualify for structured wholesale pricing.
            Minimum order begins at 4 units per SKU.
            Volume positioning strengthens unit economics.
          </p>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid md:grid-cols-4 gap-10">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/wholesale/${category}/${product.slug}`}
              className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl transition duration-300"
            >
              <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                <span className="text-gray-400 text-sm">
                  Image
                </span>
              </div>

              <h3 className="text-lg font-semibold text-royal mb-2 group-hover:underline">
                {product.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Tiered wholesale pricing. MOQ: 4 units.
              </p>

              <span className="text-sm font-medium text-royal">
                View Product →
              </span>
            </Link>
          ))}
        </div>

      </main>
    </>
  );
}
