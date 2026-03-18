import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Admin() {

  const router = useRouter();

  useEffect(() => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const previewImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...previewImages]);
  };

  const addImageByUrl = (url) => {
    if (!url) return;

    setImages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        url
      }
    ]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async () => {
    console.log("🚀 SUBMIT CLICKED");

    try {
      const slug = form.name.toLowerCase().replaceAll(" ", "-");

      const payload = {
        ...form,
        slug,
        images: images.map((img) => img.url),
        image: images[0]?.url || null,
        price: Number(form.price),
        cost: Number(form.cost)
      };

      console.log("📦 PAYLOAD:", payload);

      const { data, error } = await supabase
        .from("products")
        .insert([payload])
        .select();

      console.log("📊 DATA:", data);
      console.log("❌ ERROR:", error);

      if (error) {
        setMessage(`❌ ${error.message}`);
        return;
      }

      setMessage("✅ Product Added");

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
      setMessage("❌ System crash");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white p-10">

      <h1 className="text-3xl mb-10 text-[#D4AF37]">
        Product Manager (Debug Active)
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg" />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg" />
        <input name="cost" placeholder="Cost" value={form.cost} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg" />

        <select name="category" value={form.category} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg">
          <option value="glass">Glass</option>
          <option value="beauty">Beauty</option>
          <option value="tech">Tech</option>
        </select>

        <input name="supplier" placeholder="Supplier" value={form.supplier} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg" />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg col-span-2" />

      </div>

      <div className="mt-10">

        <h2 className="mb-4 text-lg text-[#D4AF37]">
          Product Images
        </h2>

        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="mb-4"
        />

        <input
          type="text"
          placeholder="Paste image URL and press Enter"
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
            <div key={img.id} className="relative bg-[#111827] rounded-xl overflow-hidden border border-[#1C2233]">

              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                X
              </button>

              <img src={img.url} className="h-40 w-full object-cover" />

            </div>
          ))}

        </div>

      </div>

      <button
        onClick={handleSubmit}
        className="mt-10 bg-[#D4AF37] text-black px-10 py-3 rounded-lg font-semibold"
      >
        Add Product
      </button>

      {message && (
        <p className="mt-6 text-gray-400">{message}</p>
      )}

    </div>
  );
}