import { useState } from "react";

export default function BookPage() {

  const [loading, setLoading] = useState(false);

  const startBooking = async () => {

    try {

      setLoading(true);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "Infrastructure Strategy Session",
          amount: 50,
          quantity: 1,
          booking: true,
          legalAgreement: true
        })
      });

      const data = await res.json();

      if (!data.url) {
        setLoading(false);
        return;
      }

      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      setLoading(false);
    }

  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">

      <div className="text-center max-w-xl">

        <h1 className="text-4xl font-bold mb-6">
          Reserve Infrastructure Strategy Session
        </h1>

        <p className="text-gray-600 mb-10">
          A paid consultation used to review your business infrastructure,
          architecture, and build requirements.
        </p>

        <button
          onClick={startBooking}
          className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md font-semibold text-lg"
        >
          {loading ? "Redirecting..." : "Reserve Session — $50"}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Consultation fee applied toward project cost if we proceed.
        </p>

      </div>

    </main>
  );
}