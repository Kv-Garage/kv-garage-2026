import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SourcingDesk() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    request_type: "Wholesale",
    product_name: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("sourcing_requests")
      .insert([form]);

    setLoading(false);

    if (!error) {
      setSubmitted(true);
      setForm({
        full_name: "",
        email: "",
        request_type: "Wholesale",
        product_name: "",
        description: ""
      });
    } else {
      alert("Submission failed. Try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Sourcing Desk
      </h1>

      {submitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Someone from KV Garage will contact you shortly.
          </h2>
          <a
            href="/wholesale"
            className="inline-block mt-6 text-blue-600 underline"
          >
            Back to Wholesale
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full border p-3"
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-3"
          />

          <select
            name="request_type"
            value={form.request_type}
            onChange={handleChange}
            className="w-full border p-3"
          >
            <option value="Wholesale">Wholesale</option>
            <option value="Retail">Retail</option>
          </select>

          <input
            name="product_name"
            placeholder="Product Name"
            value={form.product_name}
            onChange={handleChange}
            required
            className="w-full border p-3"
          />

          <textarea
            name="description"
            placeholder="Describe the product you're looking for..."
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border p-3 h-32"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 font-semibold hover:bg-orange-600 transition"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
}
