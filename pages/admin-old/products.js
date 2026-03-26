import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id,name,slug,category,price,cost,inventory_count,top_pick,active,supplier,supplier_price")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggleTopPick = async (id, current) => {
    await supabase.from("products").update({ top_pick: !current }).eq("id", id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, top_pick: !current } : p)));
  };

  const toggleActive = async (id, current) => {
    await supabase.from("products").update({ active: !current }).eq("id", id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !current } : p)));
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div>
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">Products</h1>
          {error && <div className="mb-4 p-3 bg-red-800 text-red-100 rounded">{error}</div>}
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="overflow-auto rounded-lg border border-[#1C2233]">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#0F172A] border-b border-[#1C2233]">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Inventory</th>
                    <th className="px-3 py-2">CJ</th>
                    <th className="px-3 py-2">Top Pick</th>
                    <th className="px-3 py-2">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-[#1C2233]">
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2">{p.category}</td>
                      <td className="px-3 py-2">${Number(p.price || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">{p.inventory_count ?? "N/A"}</td>
                      <td className="px-3 py-2">{p.supplier}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => toggleTopPick(p.id, p.top_pick)}
                          className={`px-2 py-1 rounded text-xs ${p.top_pick ? "bg-green-500 text-black" : "bg-gray-600"}`}>
                          {p.top_pick ? "Top Pick" : "Set"}
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => toggleActive(p.id, p.active)}
                          className={`px-2 py-1 rounded text-xs ${p.active ? "bg-green-500 text-black" : "bg-red-500"}`}>
                          {p.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
