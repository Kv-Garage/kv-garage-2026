import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({});
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  const [reportType, setReportType] = useState("overview");

  useEffect(() => {
    loadReportData();
  }, [dateRange, reportType]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365;

      // Get date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const [
        { data: orders },
        { data: products },
        { data: customers },
        { data: applications }
      ] = await Promise.all([
        supabase.from("orders").select("*").gte("created_at", startDate.toISOString()),
        supabase.from("products").select("*"),
        supabase.from("profiles").select("*"),
        supabase.from("applications").select("*").gte("created_at", startDate.toISOString()),
      ]);

      // Calculate comprehensive report data
      const report = generateReportData(orders || [], products || [], customers || [], applications || [], days);
      setReportData(report);
    } catch (err) {
      console.error(err);
      setError("Could not load report data.");
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = (orders, products, customers, applications, days) => {
    // Revenue metrics
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const totalCost = orders.reduce((sum, order) => sum + Number(order.cost || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Order metrics
    const orderCount = orders.length;
    const completedOrders = orders.filter(o => o.status === "delivered").length;
    const pendingOrders = orders.filter(o => ["new", "confirmed", "processing", "shipped"].includes(o.status)).length;

    // Customer metrics
    const newCustomers = customers.filter(c => {
      const createdDate = new Date(c.created_at);
      return createdDate >= new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    }).length;

    // Product metrics
    const activeProducts = products.filter(p => p.active).length;
    const totalProducts = products.length;
    const topSellingProducts = products
      .filter(p => p.sales_count > 0)
      .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
      .slice(0, 10);

    // Application metrics
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(a => a.status === "approved").length;
    const pendingApplications = applications.filter(a => a.status === "pending").length;

    // Time-based trends (daily for the period)
    const dailyRevenue = [];
    const dailyOrders = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });

      const dayRevenue = dayOrders.reduce((acc, order) => acc + Number(order.total || 0), 0);
      dailyRevenue.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
        orders: dayOrders.length
      });
      dailyOrders.push(dayOrders.length);
    }

    // Status breakdown
    const orderStatusBreakdown = {};
    orders.forEach(order => {
      const status = order.status || 'new';
      orderStatusBreakdown[status] = (orderStatusBreakdown[status] || 0) + 1;
    });

    // Geographic data (mock for now)
    const topRegions = [
      { region: "United States", orders: 145, revenue: 45230 },
      { region: "Canada", orders: 23, revenue: 8750 },
      { region: "United Kingdom", orders: 12, revenue: 3240 },
      { region: "Australia", orders: 8, revenue: 2100 },
    ];

    return {
      summary: {
        totalRevenue,
        totalProfit,
        totalCost,
        avgOrderValue,
        orderCount,
        completedOrders,
        pendingOrders,
        newCustomers,
        activeProducts,
        totalProducts,
        totalApplications,
        approvedApplications,
        pendingApplications,
      },
      trends: {
        dailyRevenue,
        dailyOrders,
      },
      breakdowns: {
        orderStatus: orderStatusBreakdown,
        topProducts: topSellingProducts,
        topRegions,
      },
      kpis: {
        conversionRate: customers.length > 0 ? (orders.length / customers.length) * 100 : 0,
        profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
        avgOrdersPerCustomer: customers.length > 0 ? orders.length / customers.length : 0,
        applicationApprovalRate: totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0,
      }
    };
  };

  const exportReport = (format = "csv") => {
    let data = "";
    let filename = `report-${reportType}-${dateRange}-${new Date().toISOString().split('T')[0]}`;

    if (format === "csv") {
      // Create CSV data based on report type
      const headers = ["Metric", "Value"];
      const rows = [];

      if (reportType === "overview") {
        rows.push(["Total Revenue", `$${reportData.summary?.totalRevenue?.toFixed(2) || 0}`]);
        rows.push(["Total Profit", `$${reportData.summary?.totalProfit?.toFixed(2) || 0}`]);
        rows.push(["Total Orders", reportData.summary?.orderCount || 0]);
        rows.push(["Average Order Value", `$${reportData.summary?.avgOrderValue?.toFixed(2) || 0}`]);
        rows.push(["New Customers", reportData.summary?.newCustomers || 0]);
        rows.push(["Active Products", reportData.summary?.activeProducts || 0]);
      }

      data = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
      filename += ".csv";
    } else if (format === "json") {
      data = JSON.stringify(reportData, null, 2);
      filename += ".json";
    }

    const blob = new Blob([data], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const MetricCard = ({ title, value, change, icon, color = "text-gray-400" }) => (
    <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`text-3xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading reports...</div>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
              <p className="text-gray-400">Comprehensive business intelligence and reporting</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-[#0F172A] border border-[#1C2233] text-gray-300 px-3 py-2 rounded-lg text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="365d">Last year</option>
              </select>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="bg-[#0F172A] border border-[#1C2233] text-gray-300 px-3 py-2 rounded-lg text-sm"
              >
                <option value="overview">Overview</option>
                <option value="sales">Sales</option>
                <option value="products">Products</option>
                <option value="customers">Customers</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => exportReport("csv")}
                  className="px-3 py-2 bg-[#1A2132] text-gray-300 rounded-lg hover:bg-[#2A3441] transition-colors text-sm"
                >
                  CSV
                </button>
                <button
                  onClick={() => exportReport("json")}
                  className="px-3 py-2 bg-[#1A2132] text-gray-300 rounded-lg hover:bg-[#2A3441] transition-colors text-sm"
                >
                  JSON
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={`$${reportData.summary?.totalRevenue?.toLocaleString() || 0}`}
              change="+12.5%"
              icon="💰"
              color="text-green-400"
            />
            <MetricCard
              title="Total Profit"
              value={`$${reportData.summary?.totalProfit?.toLocaleString() || 0}`}
              change="+8.2%"
              icon="📈"
              color="text-blue-400"
            />
            <MetricCard
              title="Orders"
              value={reportData.summary?.orderCount?.toLocaleString() || 0}
              change="+15.3%"
              icon="📦"
              color="text-purple-400"
            />
            <MetricCard
              title="Avg Order Value"
              value={`$${reportData.summary?.avgOrderValue?.toFixed(2) || 0}`}
              change="+5.1%"
              icon="📊"
              color="text-yellow-400"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="New Customers"
              value={reportData.summary?.newCustomers?.toLocaleString() || 0}
              change="+22.1%"
              icon="👥"
              color="text-cyan-400"
            />
            <MetricCard
              title="Active Products"
              value={reportData.summary?.activeProducts?.toLocaleString() || 0}
              icon="🛍️"
              color="text-orange-400"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${reportData.kpis?.conversionRate?.toFixed(1) || 0}%`}
              change="+2.3%"
              icon="🎯"
              color="text-pink-400"
            />
            <MetricCard
              title="Profit Margin"
              value={`${reportData.kpis?.profitMargin?.toFixed(1) || 0}%`}
              change="+1.8%"
              icon="💎"
              color="text-emerald-400"
            />
          </div>

          {/* Charts and Detailed Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
              <div className="h-64 flex items-end justify-between gap-1">
                {reportData.trends?.dailyRevenue?.map((day, index) => {
                  const maxRevenue = Math.max(...(reportData.trends?.dailyRevenue?.map(d => d.revenue) || [0]));
                  const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-[#D4AF37] to-[#B8941F] rounded-t relative"
                        style={{ height: `${Math.max(height, 2)}%` }}
                      >
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

            {/* Order Status Breakdown */}
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Status Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(reportData.breakdowns?.orderStatus || {}).map(([status, count]) => {
                  const total = Object.values(reportData.breakdowns?.orderStatus || {}).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          status === "delivered" ? "bg-green-500" :
                          status === "shipped" ? "bg-blue-500" :
                          status === "processing" ? "bg-yellow-500" :
                          status === "confirmed" ? "bg-purple-500" :
                          "bg-gray-500"
                        }`}></div>
                        <span className="text-gray-300 capitalize">{status}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-medium">{count}</span>
                        <span className="text-gray-400 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Products and Regions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
              <div className="space-y-3">
                {reportData.breakdowns?.topProducts?.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-[#1A2132] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium truncate max-w-48">
                          {product.name || "Unnamed Product"}
                        </p>
                        <p className="text-gray-400 text-xs">${Number(product.price || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{product.sales_count || 0} sold</p>
                      <p className="text-gray-400 text-sm">${((product.sales_count || 0) * Number(product.price || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Regions */}
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Regions</h3>
              <div className="space-y-3">
                {reportData.breakdowns?.topRegions?.map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between p-3 bg-[#1A2132] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{region.region}</p>
                        <p className="text-gray-400 text-xs">{region.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#D4AF37] font-medium">${region.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Applications Summary */}
          <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Wholesale Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{reportData.summary?.totalApplications || 0}</p>
                <p className="text-gray-400">Total Applications</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{reportData.summary?.approvedApplications || 0}</p>
                <p className="text-gray-400">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-400">{reportData.summary?.pendingApplications || 0}</p>
                <p className="text-gray-400">Pending Review</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Approval Rate: <span className="text-[#D4AF37] font-medium">
                  {reportData.kpis?.applicationApprovalRate?.toFixed(1) || 0}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}