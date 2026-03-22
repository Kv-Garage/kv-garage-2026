import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import { calculatePrice } from "../lib/pricing";

export default function Admin() {

  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("kv_admin_auth");
    if (auth !== "true") {
      router.push("/admin-login");
    }
  }, []);

  // 🔥 MODES
  const [mode, setMode] = useState("manual"); // manual | url | bulk | cj

  const [url, setUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");

  const [cjProducts, setCjProducts] = useState([]);
  const [loadingCJ, setLoadingCJ] = useState(false);

  const [form, setForm] = useState({
    name: "",
    cost: "",
    supplier_price: "",
    category: "glass",
    description: "",
    supplier: "cj"
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "glass",
    "jewelry",
    "nails",
    "hair",
    "tech",
    "christian",
    "school",
    "comfort",
    "accessories"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replaceAll(" ", "-");
  };

  // 🔥 IMAGE SYSTEM
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
      { id: Date.now() + Math.random(), url }
    ]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // 🔥 SAVE PRODUCT (CORE SYSTEM)
  const saveProduct = async (data) => {
    const baseCost = Number(data.cost || data.supplier_price);

    const price = calculatePrice({
      cost: baseCost,
      quantity: 1,
      role: "retail",
      cartTotal: 0
    });

    const payload = {
      ...data,
      slug: generateSlug(data.name),
      cost: baseCost,
      supplier_price: baseCost,
      price,
      image: data.image,
      images: data.images || [],
      fulfillment_type: "dropship",
      inventory_count: 0
    };

    const { error } = await supabase
      .from("products")
      .insert([payload]);

    return error;
  };

  // 🔥 MANUAL ADD
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    if (!form.name) {
      setMessage("❌ Product name required");
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setMessage("❌ Add at least 1 image");
      setLoading(false);
      return;
    }

    const error = await saveProduct({
      ...form,
      image: images[0]?.url,
      images: images.map((img) => img.url)
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Product Added");
      setForm({
        name: "",
        cost: "",
        supplier_price: "",
        category: "glass",
        description: "",
        supplier: "cj"
      });
      setImages([]);
    }

    setLoading(false);
  };

  // 🔥 URL IMPORT
  const handleUrlImport = async () => {
    setLoading(true);
    setMessage("");

    if (!url) {
      setMessage("❌ Missing URL");
      setLoading(false);
      return;
    }

    const data = {
      name: "Imported Product",
      description: `Imported from ${url}`,
      supplier: url.includes("dhgate") ? "dhgate" : "cj",
      category: "glass",
      supplier_price: 10,
      image: "https://via.placeholder.com/300",
      images: ["https://via.placeholder.com/300"]
    };

    const error = await saveProduct(data);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ URL Product Imported");
    }

    setLoading(false);
  };

  // 🔥 BULK IMPORT
  const handleBulkImport = async () => {
    setLoading(true);
    setMessage("");

    const urls = bulkUrls.split("\n").filter((u) => u.trim());

    for (let u of urls) {
      await saveProduct({
        name: "Bulk Product",
        description: `Imported from ${u}`,
        supplier: u.includes("dhgate") ? "dhgate" : "cj",
        category: "glass",
        supplier_price: 10,
        image: "https://via.placeholder.com/300",
        images: ["https://via.placeholder.com/300"]
      });
    }

    setMessage(`✅ Imported ${urls.length} products`);
    setLoading(false);
  };

  // 🔥 FETCH CJ PRODUCTS
  const fetchCJProducts = async () => {
    setLoadingCJ(true);

    const res = await fetch("/api/cj-test");
    const data = await res.json();

    if (data?.data?.list) {
      setCjProducts(data.data.list);
    }

    setLoadingCJ(false);
  };

  // 🔥 IMPORT FROM CJ
  const handleImportCJ = async (p) => {
    setMessage("Importing...");

    const error = await saveProduct({
      name: p.productNameEn || p.productName,
      description: p.productNameEn || p.productName,
      supplier: "cj",
      category: "glass",
      supplier_price: p.sellPrice,
      image: p.productImage,
      images: [p.productImage],
      cj_product_id: p.pid
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Imported: " + (p.productNameEn || p.productName));
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white p-10">

      <h1 className="text-3xl mb-10 text-[#D4AF37]">
        KV Product System (CJ Connected)
      </h1>

      {/* 🔥 MODE SWITCH */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <button onClick={() => setMode("manual")}>Manual</button>
        <button onClick={() => setMode("url")}>URL Import</button>
        <button onClick={() => setMode("bulk")}>Bulk Import</button>
        <button onClick={() => {
          setMode("cj");
          fetchCJProducts();
        }}>
          CJ Products
        </button>
      </div>

      {/* 🔥 CJ MODE */}
      {mode === "cj" && (
        <div>
          <h2 className="text-xl mb-6">CJ Product Feed</h2>

          {loadingCJ && <p>Loading CJ Products...</p>}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cjProducts.map((p, i) => (
              <div key={i} className="bg-[#111827] p-4 rounded-xl">

                <img src={p.productImage} className="h-40 w-full object-cover mb-3" />

                <p className="text-sm mb-2 line-clamp-2">
                  {p.productNameEn || p.productName}
                </p>

                <p className="text-[#D4AF37] mb-3">
                  ${p.sellPrice}
                </p>

                <button
                  onClick={() => handleImportCJ(p)}
                  className="w-full bg-[#D4AF37] text-black py-2 rounded"
                >
                  Import
                </button>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 URL MODE */}
      {mode === "url" && (
        <div className="mb-10">
          <input
            placeholder="Paste CJ / DHGate URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 bg-[#111827] rounded-lg mb-4"
          />
          <button onClick={handleUrlImport}>Import Product</button>
        </div>
      )}

      {/* 🔥 BULK MODE */}
      {mode === "bulk" && (
        <div className="mb-10">
          <textarea
            placeholder="Paste URLs (1 per line)"
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            className="w-full p-3 bg-[#111827] rounded-lg mb-4"
          />
          <button onClick={handleBulkImport}>Import Bulk</button>
        </div>
      )}

      {/* 🔥 MANUAL MODE */}
      {mode === "manual" && (
        <div className="grid md:grid-cols-2 gap-6">

          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg" />

          <input name="supplier_price" placeholder="Supplier Price" value={form.supplier_price} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg" />

          <select name="category" value={form.category} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="bg-[#111827] px-4 py-3 rounded-lg col-span-2" />

        </div>
      )}

      {/* 🔥 IMAGE SYSTEM */}
      {mode !== "cj" && (
        <div className="mt-10">

          <input type="file" multiple onChange={handleImageUpload} className="mb-4" />

          <input
            type="text"
            placeholder="Paste image URL + Enter"
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
                <button onClick={() => removeImage(img.id)}>X</button>
                <img src={img.url} className="h-40 w-full object-cover" />
              </div>
            ))}
          </div>

        </div>
      )}

      {mode === "manual" && (
        <button
          onClick={handleSubmit}
          className="mt-10 bg-[#D4AF37] text-black px-10 py-3 rounded-lg"
        >
          {loading ? "Processing..." : "Add Product"}
        </button>
      )}

      {message && <p className="mt-6">{message}</p>}

    </div>
  );
}