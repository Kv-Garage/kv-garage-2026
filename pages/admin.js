import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    console.log("✅ ADMIN PAGE LOADED");

    const auth = localStorage.getItem("kv_admin_auth");
    if (auth !== "true") {
      router.push("/admin-login");
    }
  }, []);

  const [form, setForm] = useState({
    name: "",
    price: "",
    cost: "",
    category: "glass",
    description: "",
    supplier: ""
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addImageByUrl = (url) => {
    if (!url) return;

    setImages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), url }
    ]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replaceAll(" ", "-")
      .replace(/[^\w-]+/g, "");
  };

  // 🧪 TEST CONNECTION
  const testConnection = async () => {
    console.log("🧪 TEST CONNECTION");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(1);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Supabase Connected");
    }
  };

  // 🚀 MAIN INSERT
  const handleSubmit = async () => {
    console.log("🚀 SUBMIT CLICKED");
    setMessage("");

    if (!form.name || !form.price || !form.cost) {
      setMessage("❌ Fill all required fields");
      return;
    }

    if (images.length === 0) {
      setMessage("❌ Add at least 1 image");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        price: Number(form.price),
        cost: Number(form.cost),
        category: form.category,
        description: form.description,
        supplier: form.supplier,
        slug: generateSlug(form.name),
        image: images[0].url,
        images: images.map((img) => img.url)
      };

      console.log("📦 PAYLOAD:", payload);

      const { data, error } = await supabase
        .from("products")
        .insert([payload])
        .select();

      console.log("📊 DATA:", data);
      console.log("❌ ERROR:", error);

      if (error) {
        setMessage("❌ " + error.message);
        return;
      }

      setMessage("✅ PRODUCT ADDED");

      setForm({
        name: "",
        price: "",
        cost: "",
        category: "glass",
        description: "",
        supplier: ""
      });

      setImages([]);

    } catch (err) {
      console.error("🔥 CRASH:", err);
      setMessage("❌ System error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white p-10">

      <h1 className="text-3xl mb-6 text-[#D4AF37]">
        Product Manager (Debug)
      </h1>

      {/* DEBUG BUTTON */}
      <button
        onClick={testConnection}
        className="bg-white text-black px-4 py-2 mb-6 rounded"
      >
        Test Supabase Connection
      </button>

      {/* FORM */}
      <div className="grid md:grid-cols-2 gap-6">

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="bg-[#111827] px-4 py-3 rounded-lg"
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="bg-[#111827] px-4 py-3 rounded-lg"
        />

        <input
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
          className="bg-[#111827] px-4 py-3 rounded-lg"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="bg-[#111827] px-4 py-3 rounded-lg"
        >
          <option value="glass">Glass</option>
          <option value="beauty">Beauty</option>
          <option value="tech">Tech</option>
        </select>

        <input
          name="supplier"
          placeholder="Supplier"
          value={form.supplier}
          onChange={handleChange}
          className="bg-[#111827] px-4 py-3 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="bg-[#111827] px-4 py-3 rounded-lg col-span-2"
        />

      </div>

      {/* IMAGE INPUT */}
      <div className="mt-8">

        <input
          type="text"
          placeholder="Paste image URL + press Enter"
          className="bg-[#111827] px-4 py-3 rounded-lg w-full mb-6"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addImageByUrl(e.target.value);
              e.target.value = "";
            }
          }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-xs px-2"
              >
                X
              </button>

              <img
                src={img.url}
                className="h-40 w-full object-cover rounded"
              />
            </div>
          ))}
        </div>

      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-10 bg-[#D4AF37] text-black px-10 py-3 rounded-lg font-semibold"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>

      {/* MESSAGE */}
      {message && (
        <p className="mt-6 text-gray-300">{message}</p>
      )}

    </div>
  );
}