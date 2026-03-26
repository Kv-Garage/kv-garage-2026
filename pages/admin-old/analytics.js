import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: products }, { data: orders }, { data: visits }] = await Promise.all([
          supabase.from("products").select("id,views,top_pick,supplier"),
          supabase.from("orders").select("id,total,cost,status,created_at"),
          supabase.from("traffic").select("id,hit_date").order("hit_date", { ascending: false }),
        ]);

        const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total || 0), 0);
        const totalCost = (orders || []).reduce((sum, o) => sum + Number(o.cost || 0), 0);
        const totalProfit = totalRevenue - totalCost;

        const orders30 = (orders || []).filter((o) => {
          if (!o.created_at) return false;
          return new Date(o.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        });
        const revenue30 = orders30.reduce((sum, o) => sum + Number(o.total || 0), 0);

        setMetrics({
          products: products?.length || 0,
          orders: orders?.length || 0,
          revenue: totalRevenue,
          profit: totalProfit,
          traffic: visits?.length || 0,
          revenue30,
          topProducts: (products || []).sort((a, b) => (Number(b.views || 0) - Number(a.views || 0))).slice(0, 5),
        });
      } catch (err) {
        console.error(err);
        setError("Could not load analytics.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading metrics...</div>;

  return (
    <AdminGuard>
      <AdminLayout>
        <div>
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">Analytics</h1>
          {error && <div className="mb-4 p-3 bg-red-800 text-red-100 rounded">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            <Stat label="Products" value={metrics.products} />
            <Stat label="Orders" value={metrics.orders} />
            <Stat label="Traffic Hits" value={metrics.traffic} />
            <Stat label="Revenue" value={`$${metrics.revenue?.toFixed(2) || "0.00"}`} />
            <Stat label="Profit" value={`$${metrics.profit?.toFixed(2) || "0.00"}`} />
            <Stat label="30d Revenue" value={`$${metrics.revenue30?.toFixed(2) || "0.00"}`} />
          </div>

          <div className="bg-[#111827] border border-[#1C2233] rounded-lg p-4">
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-3">Top Product Views</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              {(metrics.topProducts || []).map((product) => (
                <li key={product.id}>
                  {product.name || "Unnamed"} • {product.views || 0} views
                </li>
              ))}
            </ol>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-[#0F172A] p-4 rounded-lg border border-[#1C2233]">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
