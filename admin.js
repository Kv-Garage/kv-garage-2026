import { useState, useEffect } from "react";
import AdminGuard from "../components/AdminGuard";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30d");
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    topProducts: [],
    recentOrders: [],
    revenueByDay: [],
    orderStatusBreakdown: {},
    customerGrowth: [],
    pendingTasks: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

      // Get date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const [
        { data: allOrders },
        { data: periodOrders },
        { data: products },
        { data: customers },
        { data: applications },
        { data: recentOrders },
        { data: topProducts }
      ] = await Promise.all([
        supabase.from("orders").select("id,total,status,created_at,cost"),
        supabase.from("orders").select("id,total,status,created_at,cost").gte("created_at", startDate.toISOString()),
        supabase.from("products").select("id,name,views,supplier,active"),
        supabase.from("profiles").select("id,created_at"),
        supabase.from("applications").select("id,status"),
        supabase.from("orders").select("id,total,status,customer_email,created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("products").select("id,name,views,sales_count").order("views", { ascending: false }).limit(5),
      ]);

      // Calculate metrics
      const totalRevenue = (allOrders || []).reduce((acc, order) => acc + Number(order.total || 0), 0);
      const periodRevenue = (periodOrders || []).reduce((acc, order) => acc + Number(order.total || 0), 0);
      const periodOrderCount = periodOrders?.length || 0;
      const avgOrderValue = periodOrderCount > 0 ? periodRevenue / periodOrderCount : 0;

      // Revenue by day (last 30 days)
      const revenueByDay = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayOrders = (periodOrders || []).filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= dayStart && orderDate <= dayEnd;
        });

        const dayRevenue = dayOrders.reduce((acc, order) => acc + Number(order.total || 0), 0);
        revenueByDay.push({
          date: date.toISOString().split('T')[0],
          revenue: dayRevenue,
          orders: dayOrders.length
        });
      }

      // Order status breakdown
      const orderStatusBreakdown = {};
      (allOrders || []).forEach(order => {
        const status = order.status || 'new';
        orderStatusBreakdown[status] = (orderStatusBreakdown[status] || 0) + 1;
      });

      // Pending tasks
      const pendingApplications = (applications || []).filter(a => a.status === 'pending').length;
      const lowStockProducts = (products || []).filter(p => (p.inventory_count || 0) < 10).length;
      const newOrders = (allOrders || []).filter(o => o.status === 'new').length;

      setMetrics({
        totalRevenue,
        totalOrders: allOrders?.length || 0,
        totalProducts: products?.length || 0,
        totalCustomers: customers?.length || 0,
        avgOrderValue,
        conversionRate: 0, // Would need traffic data
        topProducts: topProducts || [],
        recentOrders: recentOrders || [],
        revenueByDay,
        orderStatusBreakdown,
        customerGrowth: [], // Would need historical data
        pendingTasks: [
          { id: 1, type: 'applications', count: pendingApplications, label: 'Pending Applications', urgent: pendingApplications > 0 },
          { id: 2, type: 'orders', count: newOrders, label: 'New Orders', urgent: newOrders > 0 },
          { id: 3, type: 'inventory', count: lowStockProducts, label: 'Low Stock Items', urgent: lowStockProducts > 0 },
        ].filter(task => task.count > 0),
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data. Please verify your Supabase schema and permissions.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading dashboard...</div>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Monitor your business performance and key metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-[#0F172A] border border-[#1C2233] text-gray-300 px-3 py-2 rounded-lg text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toLocaleString()}`}
              change="+12.5%"
              icon="💰"
              color="text-green-400"
            />
            <MetricCard
              title="Orders"
              value={metrics.totalOrders.toLocaleString()}
              change="+8.2%"
              icon="📦"
              color="text-blue-400"
            />
            <MetricCard
              title="Avg Order Value"
              value={`$${metrics.avgOrderValue.toFixed(2)}`}
              change="+5.1%"
              icon="📊"
              color="text-purple-400"
            />
            <MetricCard
              title="Customers"
              value={metrics.totalCustomers.toLocaleString()}
              change="+15.3%"
              icon="👥"
              color="text-yellow-400"
            />
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Last {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"} days</span>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-1">
                {metrics.revenueByDay.map((day, index) => {
                  const maxRevenue = Math.max(...metrics.revenueByDay.map(d => d.revenue));
                  const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-[#1A2132] rounded-t relative" style={{ height: `${Math.max(height, 2)}%` }}>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                          ${day.revenue.toFixed(0)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pending Tasks</h3>
              <div className="space-y-3">
                {metrics.pendingTasks.length === 0 ? (
                  <p className="text-gray-400 text-sm">All caught up! 🎉</p>
                ) : (
                  metrics.pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-[#1A2132] rounded-lg">
                      <div>
                        <p className="text-white font-medium text-sm">{task.label}</p>
                        <p className="text-gray-400 text-xs">{task.count} items</p>
                      </div>
                      {task.urgent && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                <a href="/admin/orders" className="text-[#D4AF37] text-sm hover:text-[#B8941F] transition-colors">
                  View all →
                </a>
              </div>
              <div className="space-y-3">
                {metrics.recentOrders.length === 0 ? (
                  <p className="text-gray-400 text-sm">No recent orders</p>
                ) : (
                  metrics.recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-[#1A2132] rounded-lg">
                      <div>
                        <p className="text-white font-medium">Order #{order.id.slice(-8)}</p>
                        <p className="text-gray-400 text-sm">
                          {order.customer_email || "Unknown customer"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${Number(order.total || 0).toFixed(2)}</p>
                        <p className={`text-xs px-2 py-1 rounded capitalize ${
                          order.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                          order.status === "shipped" ? "bg-blue-500/20 text-blue-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {order.status || "new"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Top Products</h3>
                <a href="/admin/products" className="text-[#D4AF37] text-sm hover:text-[#B8941F] transition-colors">
                  View all →
                </a>
              </div>
              <div className="space-y-3">
                {metrics.topProducts.length === 0 ? (
                  <p className="text-gray-400 text-sm">No product data</p>
                ) : (
                  metrics.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-[#1A2132] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium truncate max-w-32">
                            {product.name || "Unnamed Product"}
                          </p>
                          <p className="text-gray-400 text-xs">{product.views || 0} views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{product.sales_count || 0} sold</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/admin/products"
                className="flex flex-col items-center p-4 bg-[#1A2132] rounded-lg hover:bg-[#2A3441] transition-colors"
              >
                <span className="text-2xl mb-2">🛍️</span>
                <span className="text-white text-sm font-medium">Add Product</span>
              </a>
              <a
                href="/admin/cj"
                className="flex flex-col items-center p-4 bg-[#1A2132] rounded-lg hover:bg-[#2A3441] transition-colors"
              >
                <span className="text-2xl mb-2">🚚</span>
                <span className="text-white text-sm font-medium">Import CJ</span>
              </a>
              <a
                href="/admin/applications"
                className="flex flex-col items-center p-4 bg-[#1A2132] rounded-lg hover:bg-[#2A3441] transition-colors"
              >
                <span className="text-2xl mb-2">📋</span>
                <span className="text-white text-sm font-medium">Review Apps</span>
              </a>
              <a
                href="/admin/analytics"
                className="flex flex-col items-center p-4 bg-[#1A2132] rounded-lg hover:bg-[#2A3441] transition-colors"
              >
                <span className="text-2xl mb-2">📊</span>
                <span className="text-white text-sm font-medium">View Reports</span>
              </a>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

function MetricCard({ title, value, change, icon, color = "text-gray-400" }) {
  return (
    <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className="text-green-400 text-sm font-medium mt-1">{change} vs last period</p>
          )}
        </div>
        <div className={`text-3xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
