import { useState } from "react";

export default function ImportPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    supplier_price: "",
    supplier: "cj",

    // 🔥 NEW
    type: "standard",
    bundle_quantity: "",
    bundle_price: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImport = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/import-product", {
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
        setMessage("✅ Product Imported!");
      }
    } catch (err) {
      setMessage("❌ Error importing product");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">
          Import Product
        </h1>

        <input name="name" placeholder="Product Name" onChange={handleChange} className="w-full p-3 bg-gray-900 rounded" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-3 bg-gray-900 rounded" />
        <input name="image" placeholder="Image URL" onChange={handleChange} className="w-full p-3 bg-gray-900 rounded" />
        <input name="supplier_price" placeholder="Supplier Price" onChange={handleChange} className="w-full p-3 bg-gray-900 rounded" />

        {/* 🔥 PRODUCT TYPE */}
        <select name="type" onChange={handleChange} className="w-full p-3 bg-gray-900 rounded">
          <option value="standard">Standard</option>
          <option value="bundle">Bundle</option>
        </select>

        {/* 🔥 BUNDLE FIELDS */}
        {form.type === "bundle" && (
          <>
            <input
              name="bundle_quantity"
              placeholder="Bundle Quantity (ex: 10)"
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 rounded"
            />
            <input
              name="bundle_price"
              placeholder="Bundle Price"
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 rounded"
            />
          </>
        )}

        <button
          onClick={handleImport}
          disabled={loading}
          className="w-full bg-yellow-500 text-black py-3 rounded font-bold"
        >
          {loading ? "Importing..." : "Import Product"}
        </button>

        {message && <p>{message}</p>}

      </div>
    </div>
  );
}