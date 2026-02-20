import { useRouter } from "next/router";
import Link from "next/link";

export default function WholesaleCategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const formattedTitle = category?.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-24">

      <div className="max-w-6xl mx-auto">

        <Link href="/">
          <button className="mb-12 border border-gray-600 px-6 py-2 rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition">
            ← Back to Home
          </button>
        </Link>

        <h1 className="text-4xl font-bold mb-6 capitalize text-[#D4AF37]">
          {formattedTitle}
        </h1>

        <p className="text-gray-400 mb-12">
          Wholesale distribution inventory for {formattedTitle}.
        </p>

        <div className="grid md:grid-cols-3 gap-12">

          <div className="bg-[#111827] p-6 rounded-xl shadow-lg">
            <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Product A</h3>
            <p className="text-gray-400">$199</p>
          </div>

          <div className="bg-[#111827] p-6 rounded-xl shadow-lg">
            <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Product B</h3>
            <p className="text-gray-400">$299</p>
          </div>

          <div className="bg-[#111827] p-6 rounded-xl shadow-lg">
            <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Product C</h3>
            <p className="text-gray-400">$399</p>
          </div>

        </div>

      </div>

    </div>
  );
}
