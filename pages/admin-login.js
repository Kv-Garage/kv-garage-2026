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

  const [cjProducts, setCjProducts] = useState([]);
  const [loadingCJ, setLoadingCJ] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // 🔥 FETCH CJ PRODUCTS
  const fetchCJProducts = async (keyword = "", pageNum = 1) => {
    setLoadingCJ(true);

    try {
      const res = await fetch(
        `/api/cj-search?keyword=${keyword}&page=${pageNum}`
      );
      const data = await res.json();

      const list = data?.data?.list || [];

      if (pageNum === 1) {
        setCjProducts(list);
      } else {
        setCjProducts((prev) => [...prev, ...list]);
      }

      setHasMore(list.length >= 20);

    } catch (err) {
      console.error("CJ SEARCH ERROR:", err);
    }

    setLoadingCJ(false);
  };

  useEffect(() => {
    fetchCJProducts("", 1);
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
    fetchCJProducts(value, 1);
  };

  // 🔥 IMPORT (FULLY FIXED)
  const handleImportCJ = async (p) => {
    try {
      setMessage("Importing product...");

      const res = await fetch(`/api/cj-products?pid=${p.pid}`);
      const json = await res.json();

      console.log("🔥 CJ RESPONSE:", json);

      if (json?.error) {
        console.error("CJ ERROR:", json);
        setMessage("❌ CJ API failed");
        return;
      }

      const product = json?.product;

      if (!product) {
        console.error("NO PRODUCT:", json);
        setMessage("❌ No product data from CJ");
        return;
      }

      console.log("✅ PRODUCT:", product);

      // 🔥 IMAGES
      let images = [];

      if (product.productImage) {
        images.push(product.productImage);
      }

      if (Array.isArray(product.productImageList)) {
        images = images.concat(product.productImageList);
      }

      if (product.productImageListStr) {
        images = images.concat(product.productImageListStr.split(","));
      }

      images = images.filter((img) => img && img.includes("http"));
      const cleanImages = [...new Set(images)];

      // 🔥 DESCRIPTION
      let description =
        product.description ||
        product.productDescription ||
        product.remark ||
        "";

      description = description
        .replace(/<[^>]*>?/gm, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!description || description.length < 20) {
        description =
          "High quality product sourced directly from supplier.";
      }

      // 🔥 COST FIX (THIS WAS YOUR ISSUE)
      let baseCost = 0;

      baseCost =
        Number(product.sellPrice) ||
        Number(product.sellPriceUsd) ||
        Number(product.price) ||
        Number(product.defaultSellPrice) ||
        0;

      // fallback to variant price
      if (!baseCost && product.variantList?.length > 0) {
        baseCost = Number(product.variantList[0]?.variantSellPrice || 0);
      }

      // final fallback
      if (!baseCost || baseCost <= 0) {
        baseCost = 10;
      }

      console.log("💰 FINAL COST USED:", baseCost);

      const price = calculatePrice({
        cost: baseCost,
        quantity: 1,
        role: "retail",
        cartTotal: 0
      });

      // 🔥 INSERT PRODUCT
      const { data: newProduct, error } = await supabase
        .from("products")
        .insert([
          {
            name:
              product.productNameEn ||
              product.productName ||
              "Imported Product",

            slug:
              (
                product.productNameEn ||
                product.productName ||
                "product"
              )
                .toLowerCase()
                .replace(/[^\w]+/g, "-") +
              "-" +
              Date.now(),

            description,
            price,
            cost: baseCost,

            image: cleanImages[0] || null,
            images: cleanImages,

            supplier: "cj",
            cj_product_id: product.pid
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ INSERT ERROR:", error);
        setMessage("❌ Failed to insert product");
        return;
      }

      // 🔥 VARIANTS
      const variants = product.variantList || [];

      if (variants.length > 0) {
        const variantPayload = variants.map((v) => {
          const cost = Number(v.variantSellPrice || baseCost);

          return {
            product_id: newProduct.id,
            name: v.variantName || "Variant",

            option1: v.variantKey || null,
            option2: v.variantKey2 || null,

            sku: v.variantSku || null,
            supplier_sku: v.variantSku || null,

            price: calculatePrice({
              cost,
              quantity: 1,
              role: "retail",
              cartTotal: 0
            }),

            cost,

            image: v.variantImage || cleanImages[0] || null,
            inventory_count: v.variantStock || 0
          };
        });

        const { error: variantError } = await supabase
          .from("product_variants")
          .insert(variantPayload);

        if (variantError) {
          console.error("❌ VARIANT ERROR:", variantError);
          setMessage("⚠️ Product added, variants failed");
          return;
        }
      }

      setMessage("✅ Product imported successfully");

    } catch (err) {
      console.error("❌ IMPORT ERROR:", err);
      setMessage("❌ Import crashed");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white p-10">

      <h1 className="text-3xl mb-6 text-[#D4AF37]">
        KV Product Dashboard
      </h1>

      <input
        type="text"
        placeholder="Search CJ products..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full mb-6 px-4 py-3 bg-[#111827] rounded-lg"
      />

      {loadingCJ && <p>Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cjProducts.map((p, i) => (
          <div
            key={i}
            className="bg-[#111827] p-4 rounded-xl cursor-pointer"
            onClick={() => setPreview(p)}
          >
            <img
              src={p.productImage}
              className="h-40 w-full object-cover mb-3"
            />

            <p className="text-sm line-clamp-2 mb-2">
              {p.productNameEn || p.productName}
            </p>

            <p className="text-[#D4AF37]">
              ${p.sellPrice}
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => {
            const next = page + 1;
            setPage(next);
            fetchCJProducts(search, next);
          }}
          className="mt-10 bg-[#D4AF37] text-black px-6 py-3 rounded"
        >
          Load More
        </button>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111827] p-6 rounded-xl max-w-xl w-full">

            <button
              onClick={() => setPreview(null)}
              className="mb-4 text-red-400"
            >
              Close
            </button>

            <h2 className="mb-4">
              {preview.productNameEn || preview.productName}
            </h2>

            <img
              src={preview.productImage}
              className="h-60 w-full object-cover mb-4"
            />

            <button
              onClick={() => handleImportCJ(preview)}
              className="bg-[#D4AF37] text-black px-6 py-3 rounded w-full"
            >
              Import Product
            </button>

          </div>
        </div>
      )}

      {message && (
        <p className="mt-6 text-gray-300">
          {message}
        </p>
      )}

    </div>
  );
}