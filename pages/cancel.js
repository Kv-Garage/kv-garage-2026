import Link from "next/link";

export default function Cancel() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">

        <h1 className="text-4xl font-bold text-red-600 mb-6">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment was not completed. You can try again anytime.
        </p>

        <Link
          href="/shop"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition"
        >
          Back to Shop
        </Link>

      </div>
    </main>
  );
}