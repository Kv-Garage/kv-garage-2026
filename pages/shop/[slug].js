import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;

  // TEMP DUMMY PRODUCT DATA
  const product = {
    name: slug ? slug.replaceAll("-", " ").toUpperCase() : "Product",
    price: "$49.00",
    description:
      "Premium structured retail product built for clean presentation and confident purchasing. Fast processing. Secure checkout.",
    images: [
      "/placeholder-product.jpg",
      "/placeholder-product.jpg",
      "/placeholder-product.jpg",
    ],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  if (!slug) return null;

  return (
    <>
      <Head>
        <title>{product.name} | KV Garage</title>
      </Head>

      <main className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* Back Button */}
          <Link
            href="/shop"
            className="text-sm text-royal hover:underline mb-8 inline-block"
          >
            ← Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-12">

            {/* Image Section */}
            <div>
              <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg mb-4">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full object-contain"
                />
              </div>

              <div className="flex gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className="border rounded-md overflow-hidden w-20 h-20"
                  >
                    <img src={img} alt="" className="object-cover h-full w-full" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-royal mb-4">
                {product.name}
              </h1>

              <p className="text-2xl font-semibold mb-6">
                {product.price}
              </p>

              <p className="text-gray-600 mb-8">
                {product.description}
              </p>

              <div className="flex gap-4 mb-8">
                <button className="bg-royal text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
                  Buy Now
                </button>

                <button className="border border-royal text-royal px-6 py-3 rounded-md font-semibold hover:bg-royal hover:text-white transition">
                  Add to Cart
                </button>
              </div>

              <div className="border-t pt-6 text-sm text-gray-500">
                <p>✔ Secure checkout</p>
                <p>✔ Fast 7–10 day processing</p>
                <p>✔ Order confirmation + tracking email</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
