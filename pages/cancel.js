import Link from "next/link";

export default function Cancel() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">

      <div className="max-w-xl text-center">

        <h1 className="text-4xl font-bold text-red-500 mb-6">
          Payment Cancelled
        </h1>

        <p className="text-gray-700 mb-8">
          Your checkout was not completed. You can continue anytime.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">

          <Link
            href="/learn"
            className="bg-blue-600 text-white px-6 py-3 rounded-md"
          >
            Go to Learn
          </Link>

          <Link
            href="/mentorship"
            className="bg-orange-500 text-white px-6 py-3 rounded-md"
          >
            View Mentorship
          </Link>

          <Link
            href="/shop"
            className="bg-gray-200 px-6 py-3 rounded-md"
          >
            Back to Shop
          </Link>

        </div>

      </div>

    </main>
  );
}