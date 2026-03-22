import { useState } from "react";

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    business_type: "",
    volume: "",
    sales_channel: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.error) {
        setMessage("❌ " + data.error);
      } else {
        setMessage("✅ Application submitted. We will review within 24–48 hours.");

        setForm({
          name: "",
          email: "",
          business_type: "",
          volume: "",
          sales_channel: "",
          experience: "",
        });
      }

    } catch (err) {
      setMessage("❌ Submission failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-24">

      <div className="max-w-xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-4">
          Apply for Wholesale Access
        </h1>

        <p className="text-gray-400 mb-8">
          This system is designed for resellers, retail store owners, and volume buyers.
          Access is limited to qualified applicants.
        </p>

        {/* FORM */}
        <div className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 bg-[#111827] rounded"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 bg-[#111827] rounded"
          />

          <select
            name="business_type"
            value={form.business_type}
            onChange={handleChange}
            className="w-full p-3 bg-[#111827] rounded"
          >
            <option value="">Business Type</option>
            <option>Reseller</option>
            <option>Retail Store Owner</option>
            <option>E-commerce Seller</option>
            <option>Distributor</option>
            <option>Other</option>
          </select>

          <select
            name="volume"
            value={form.volume}
            onChange={handleChange}
            className="w-full p-3 bg-[#111827] rounded"
          >
            <option value="">Monthly Purchase Volume</option>
            <option>Under $500</option>
            <option>$500 – $2,000</option>
            <option>$2,000 – $10,000</option>
            <option>$10,000+</option>
          </select>

          <select
            name="sales_channel"
            value={form.sales_channel}
            onChange={handleChange}
            className="w-full p-3 bg-[#111827] rounded"
          >
            <option value="">Sales Channel</option>
            <option>Shopify / Website</option>
            <option>Amazon</option>
            <option>eBay</option>
            <option>Retail Store</option>
            <option>Social Media</option>
          </select>

          <select
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full p-3 bg-[#111827] rounded"
          >
            <option value="">Experience Level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded font-bold"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          {message && (
            <p className="text-sm mt-2">{message}</p>
          )}

        </div>

      </div>

    </div>
  );
}