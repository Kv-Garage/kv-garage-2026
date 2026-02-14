export default function SourcingDesk() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl font-bold text-royal mb-6">
            Sourcing Desk
          </h1>

          <p className="text-gray-300 mb-6">
            Can't find what you're looking for?
            Submit a product request for wholesale or retail.
          </p>

          <p className="text-gray-400 mb-4">
            Response time:
          </p>

          <ul className="text-gray-400 mb-6 list-disc pl-5 space-y-2">
            <li>Within 30 minutes (9AM–6PM)</li>
            <li>Within 24 hours outside office hours</li>
          </ul>

          <p className="text-gray-300">
            If sourced successfully, you’ll receive:
          </p>

          <ul className="text-gray-400 list-disc pl-5 space-y-2 mt-2">
            <li>Product photos</li>
            <li>Pricing breakdown</li>
            <li>Secure payment link</li>
          </ul>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 bg-black border border-zinc-700 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-black border border-zinc-700 rounded"
            />

            <select className="w-full p-3 bg-black border border-zinc-700 rounded">
              <option>Wholesale</option>
              <option>Retail</option>
            </select>

            <input
              type="text"
              placeholder="Product Name"
              className="w-full p-3 bg-black border border-zinc-700 rounded"
            />

            <textarea
              placeholder="Describe what you're looking for..."
              rows="4"
              className="w-full p-3 bg-black border border-zinc-700 rounded"
            />

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 transition p-3 font-semibold rounded"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
