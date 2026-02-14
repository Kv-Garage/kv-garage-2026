import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

export default function ProductPage() {
  const router = useRouter();
  const { category, slug } = router.query;

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(4);

  // Placeholder product logic (real data later)
  const formattedName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    : "Product";

  const product = {
    name: formattedName,
    images: [1, 2, 3, 4],
    description:
      "Structured wholesale inventory built for operators who prioritize margin, clarity, and execution. All products qualify for tiered pricing starting at 4 units per SKU.",
    moq: 4,
    fulfillment: "7–10 Business Days",
  };

  return (
    <>
      <Head>
        <title>{product.name} | KV Garage Wholesale</title>
        <meta
          name="description"
          content="Premium structured wholesale inventory with tiered pricing."
        />
      </Head>

      <main className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT SIDE - IMAGE GALLERY */}
          <div>
            <div className="bg-gray-100 aspect-square flex items-center justify-center border border-gray-200 rounded">
              <span className="text-gray-400">
                Image {activeImage + 1}
              </span>
            </div>

            <div className="flex gap-4 mt-6">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 bg-gray-100 border rounded cursor-pointer flex items-center justify-center ${
                    activeImage === index
                      ? "border-royal"
                      : "border-gray-200"
                  }`}
                >
                  <span className="text-xs text-gray-400">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - PRODUCT DETAILS */}
          <div>

            <h1 className="text-3xl font-bold text-royal mb-4">
              {product.name}
            </h1>

            <div className="w-16 h-[3px] bg-gold mb-6"></div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-3 mb-8 text-sm text-gray-700">
              <div>
                <strong>Category:</strong> {category}
              </div>
              <div>
                <strong>Minimum Order Quantity:</strong> {product.moq} Units
              </div>
              <div>
                <strong>Fulfillment Window:</strong> {product.fulfillment}
              </div>
              <div>
                <strong>Wholesale Pricing:</strong> Tiered by volume.
              </div>
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Quantity (Minimum 4)
              </label>
              <input
                type="number"
                min="4"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border px-4 py-2 rounded w-32"
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button className="bg-royal text-white px-8 py-3 font-medium rounded hover:opacity-90 transition">
                Add to Cart
              </button>

              <button className="border border-gold text-royal px-8 py-3 font-medium rounded hover:bg-gray-50 transition">
                Buy Now
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              Secure checkout. Order confirmation issued instantly.
              Tracking provided upon fulfillment.
            </div>

            <div className="mt-10">
              <Link
                href={`/wholesale/${category}`}
                className="text-royal underline text-sm"
              >
                ← Back to {category}
              </Link>
            </div>

          </div>
        </div>

        {/* PREMIUM WATCH CTA */}
        <section className="mt-20 bg-gray-50 p-10 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-royal mb-4">
            Looking for Premium Models?
          </h2>

          <p className="text-gray-600 mb-6">
            Select inventory is available through private qualification.
            Submit a request for structured access.
          </p>

          <Link
            href="/private-preview"
            className="bg-royal text-white px-6 py-3 rounded font-semibold hover:opacity-90 transition"
          >
            Request Private Access
          </Link>
        </section>

      </main>
    </>
  );
}
