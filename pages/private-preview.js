import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function PrivatePreview() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    productLink: "",
    description: "",
    quantity: 1
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("sourcing_requests")
      .insert([
        {
          name: form.name,
          email: form.email,
          product_link: form.productLink,
          description: form.description,
          quantity: form.quantity
        }
      ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Request submitted successfully");

    setForm({
      name: "",
      email: "",
      productLink: "",
      description: "",
      quantity: 1
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white px-6 py-16">

      <div className="max-w-5xl mx-auto">

        {/* 🔥 HEADER */}
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-3">
          Private Sourcing Desk
        </h1>

        <p className="text-gray-400 mb-8 max-w-2xl">
          Submit a product request and our procurement team will source it directly 
          from verified global suppliers. Designed for resellers, wholesale buyers, 
          and high-volume operators.
        </p>

        {/* 🔥 INSTITUTION BLOCK */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <div className="bg-[#111827] p-5 rounded-xl border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Response Time</p>
            <p className="text-lg font-semibold text-[#D4AF37]">
              Under 30 Minutes
            </p>
          </div>

          <div className="bg-[#111827] p-5 rounded-xl border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Availability</p>
            <p className="text-lg font-semibold">
              9:00 AM – 6:00 PM (EST)
            </p>
          </div>

          <div className="bg-[#111827] p-5 rounded-xl border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Network</p>
            <p className="text-lg font-semibold">
              Global Supplier Access
            </p>
          </div>

        </div>

        {/* 🔥 FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111827] p-8 rounded-2xl border border-white/5 space-y-5"
        >

          <div className="grid md:grid-cols-2 gap-4">

            <input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#05070D] rounded-lg outline-none"
            />

            <input
              required
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#05070D] rounded-lg outline-none"
            />

          </div>

          <input
            placeholder="Product Link (Amazon, TikTok, Supplier, etc.)"
            value={form.productLink}
            onChange={(e) =>
              setForm({ ...form, productLink: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#05070D] rounded-lg outline-none"
          />

          <textarea
            placeholder="Describe the product, specs, or sourcing requirements..."
            rows="4"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#05070D] rounded-lg outline-none"
          />

          <input
            type="number"
            min="1"
            placeholder="Estimated Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
            className="w-full px-4 py-3 bg-[#05070D] rounded-lg outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
          >
            {loading ? "Submitting Request..." : "Submit Request"}
          </button>

          {success && (
            <p className="text-green-400 text-sm text-center">
              {success}
            </p>
          )}

        </form>

        {/* 🔥 TRUST + POSITIONING */}
        <div className="mt-10 text-sm text-gray-400 max-w-3xl">
          KV Garage operates as a direct sourcing intermediary with access to 
          vetted manufacturers and logistics channels. All requests are reviewed 
          by our internal procurement team.
        </div>

        {/* 🔥 CONTACT */}
        <div className="mt-4 text-sm text-gray-500">
          Contact: <span className="text-white">kvgarage@kvgarage.com</span>
        </div>

      </div>
    </div>
  );
}