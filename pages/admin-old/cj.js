import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminCJ() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const fetchCJ = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cj-test");
      const data = await res.json();
      setProducts(data?.data?.list || []);
    } catch (err) {
      console.error(err);
      setError("CJ API error or no products available.");
    } finally {
      setLoading(false);
    }
  };

  const importProduct = async (item) => {
    try {
      const resp = await fetch("/api/cj-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cjProduct: item }),
      });
      const result = await resp.json();
      if (result.error) throw new Error(result.error);
      setError("Imported product successfully.");
    } catch (err) {
      console.error(err);
      setError(`Import error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchCJ();
  }, []);

  return (
    <AdminGuard>
      <AdminLayout>
        <div>
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">CJ Dropshipping</h1>
          <p className="text-gray-300 mb-4">Import full CJ product payload including images, variants, and descriptions.</p>

          <div className="mb-4">
            <button onClick={fetchCJ} className="bg-[#D4AF37] text-black px-4 py-2 rounded">Refresh CJ feed</button>
          </div>

          {error && <div className="p-3 mb-4 bg-red-800 text-red-100 rounded">{error}</div>}

          {loading ? (
            <p>Loading CJ products...</p>
          ) : !products.length ? (
            <p>No CJ products found.</p>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto">
              {products.map((item) => (
                <div key={item.pid || item.id} className="p-3 bg-[#0F172A] border border-[#1C2233] rounded">
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.productNameEn || item.productName}</p>
                      <p className="text-xs text-gray-400">SKU: {item.productCode || item.pid || "n/a"}</p>
                      <p className="text-sm text-gray-300">${Number(item.sellPrice || item.productPrice || 0).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => importProduct(item)}
                      className="px-3 py-1 text-xs rounded bg-[#D4AF37] text-black"
                    >
                      Import
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
