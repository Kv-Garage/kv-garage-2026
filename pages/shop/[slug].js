import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import { calculatePrice } from "../../lib/pricing";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!slug) return null;

  const product = {
    name: slug.replaceAll("-", " ").toUpperCase(),
    cost: 10,
    description:
      "Premium structured retail product built for clean presentation and confident purchasing.",
    images: [
      "/placeholder-product.jpg",
      "/placeholder-product.jpg",
      "/placeholder-product.jpg",
    ],
  };

  if (!selectedImage) {
    setSelectedImage(product.images[0]);
  }

  const pricePerUnit = calculatePrice(product.cost, quantity);
  const totalPrice = pricePerUnit * quantity;

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          amount: pricePerUnit,
          quantity: quantity,
        }),
      });

      const session = await response.json();
      if (!session.url) return;

      window.location.href = session.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{product.name} | KV Garage</title>
      </Head>

      <main className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <Link
            href="/shop"
            className="text-sm text-royal hover:underline mb-8 inline-block"
          >
            ← Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-12">

            {/* IMAGE SECTION */}
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

            {/* PRODUCT INFO */}
            <div>
              <h1 className="text-3xl font-bold text-royal mb-4">
                {product.name}
              </h1>

              <p className="text-xl mb-2">
                Price Per Unit: <strong>${pricePerUnit.toFixed(2)}</strong>
              </p>

              <p className="text-2xl font-semibold mb-6">
                Total: ${totalPrice.toFixed(2)}
              </p>

              <p className="text-gray-600 mb-8">
                {product.description}
              </p>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border px-4 py-2 w-24 rounded-md"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Buy Now"}
                </button>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition">
                  Add to Cart
                </button>
              </div>

              {/* Updated Trust Section */}
              <div className="border-t pt-6 text-sm text-gray-600 space-y-2">
                <p>✔ Secure checkout powered by Stripe</p>
                <p>✔ Payment processing typically clears in 1–2 business days</p>
                <p>✔ Order ships immediately after funds are confirmed</p>
              </div>

            </div>

          </div>
        </div>
      </main>
    </>
  );
}