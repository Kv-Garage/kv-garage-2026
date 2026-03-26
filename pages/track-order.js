import { useState } from "react";
import Head from "next/head";
import { getOrderStatusSteps } from "../lib/orderUtils";

const statusSteps = getOrderStatusSteps();

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeStepIndex = order ? Math.max(statusSteps.indexOf(order.status), 0) : -1;

  const handleTrack = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_number: orderNumber,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to track order");
      }

      setOrder(payload.order);
    } catch (trackError) {
      setError(trackError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Track Your Order | KV Garage</title>
      </Head>

      <main className="min-h-screen bg-white px-6 py-16 text-black">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">Track Your Order</h1>
          <p className="mt-4 text-gray-600">
            Enter your KV Garage order number to view your current shipping progress.
          </p>

          <form onSubmit={handleTrack} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <input
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value.toUpperCase())}
              placeholder="KVG-XXXXXX"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>

          {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

          {order ? (
            <div className="mt-10 rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Order #{order.order_number}</h2>
              <p className="mt-2 text-sm text-gray-600">
                Current status: <span className="font-semibold text-black capitalize">{order.status}</span>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Tracking number: {order.tracking_number || "Not assigned yet"}
              </p>

              <div className="mt-8 grid grid-cols-4 gap-3">
                {statusSteps.map((step, index) => (
                  <div key={step} className="text-center">
                    <div
                      className={`mx-auto h-3 w-full rounded-full ${
                        index <= activeStepIndex ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
