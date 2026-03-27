import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { getConversionMetrics, getFunnelAnalysis, getAbltResults, getConversionReport } from "../../lib/conversions";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminMetricCard,
  AdminPageShell,
  AdminTableCard,
} from "../../components/admin/AdminPageShell";
import {
  AdminDataTable,
  AdminSectionHeader,
  AdminStatGrid,
  AdminStatusBadge,
} from "../../components/admin/AdminPrimitives";

export default function AdminConversionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [abTests, setAbTests] = useState([]);
  const [timeframe, setTimeframe] = useState("7d");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  useEffect(() => {
    loadConversionData();
  }, [timeframe]);

  const loadConversionData = async () => {
    try {
      setLoading(true);
      setError("");

      const [metricsData, funnelData, abTestsData] = await Promise.all([
        getConversionMetrics(timeframe),
        getFunnelAnalysis(),
        getAbltResults()
      ]);

      setMetrics(metricsData);
      setFunnel(funnelData);
      setAbTests(abTestsData);
    } catch (err) {
      console.error("Error loading conversion data:", err);
      setError("Could not load conversion data.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const report = await getConversionReport(dateRange.start, dateRange.end);
      
      // Download report as CSV
      const csvContent = convertToCSV(report);
      downloadCSV(csvContent, `conversion-report-${dateRange.start.toISOString()}-${dateRange.end.toISOString()}.csv`);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Could not generate report.");
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (data) => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Events', data.metrics.total_events],
      ['Unique Visitors', data.metrics.unique_visitors],
      ['Product Views', data.metrics.product_views],
      ['Add to Carts', data.metrics.add_to_carts],
      ['Checkouts', data.metrics.checkouts],
      ['Purchases', data.metrics.purchases],
      ['Add to Cart Rate', `${data.metrics.add_to_cart_rate.toFixed(2)}%`],
      ['Checkout Rate', `${data.metrics.checkout_rate.toFixed(2)}%`],
      ['Purchase Rate', `${data.metrics.purchase_rate.toFixed(2)}%`],
      ['Overall Conversion Rate', `${data.metrics.overall_conversion_rate.toFixed(2)}%`],
      ['Average Order Value', `$${data.metrics.average_order_value.toFixed(2)}`]
    ];

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFunnelColor = (rate) => {
    if (rate >= 50) return 'text-green-600';
    if (rate >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAbTestStatus = (test) => {
    if (test.winner) return 'completed';
    if (test.running) return 'running';
    return 'pending';
  };

  if (loading && !metrics) {
    return (
      <AdminGuard>
        <AdminLayout title="Conversions" description="Track and optimize your conversion metrics">
          <AdminPageShell
            eyebrow="Analytics"
            title="Conversions"
            description="Track and optimize your conversion metrics"
          >
            <AdminLoadingState label="Loading conversion data..." />
          </AdminPageShell>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout title="Conversions" description="Track and optimize your conversion metrics">
        <AdminPageShell
          eyebrow="Analytics"
          title="Conversions"
          description="Track and optimize your conversion metrics"
        >
          {error && <AdminErrorState message={error} />}

          {/* Timeframe Selector */}
          <div className="bg-white rounded-lg border border-white/10 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                {['1d', '7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      timeframe === period
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {period === '1d' ? 'Last 24h' : 
                     period === '7d' ? 'Last 7 days' : 
                     period === '30d' ? 'Last 30 days' : 'Last 90 days'}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={dateRange.start.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={dateRange.end.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={generateReport}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <AdminMetricCard
                label="Unique Visitors"
                value={metrics.unique_visitors}
                hint="Total unique visitors in selected timeframe"
              />
              <AdminMetricCard
                label="Conversion Rate"
                value={`${metrics.overall_conversion_rate.toFixed(2)}%`}
                hint="Overall conversion rate from product views to purchases"
                trend={metrics.overall_conversion_rate > 2 ? 'up' : 'down'}
              />
              <AdminMetricCard
                label="Average Order Value"
                value={`$${metrics.average_order_value.toFixed(2)}`}
                hint="Average value of completed purchases"
              />
              <AdminMetricCard
                label="Total Revenue"
                value={`$${(metrics.purchases * metrics.average_order_value).toFixed(2)}`}
                hint="Estimated total revenue from purchases"
              />
            </div>
          )}

          {/* Conversion Funnel */}
          {funnel && (
            <div className="bg-white rounded-lg border border-white/10 p-6 mb-8">
              <AdminSectionHeader
                title="Conversion Funnel"
                description="Track user progression through your conversion funnel"
              />
              <div className="space-y-4">
                {funnel.steps.map((step, index) => (
                  <div key={step.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{step.name}</h4>
                        <p className="text-sm text-gray-600">{step.count.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getFunnelColor(step.conversion_rate)}`}>
                        {step.conversion_rate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">Conversion rate</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Abandonment Rates */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-red-900 mb-2">Checkout Abandonment</h5>
                  <p className="text-2xl font-bold text-red-600">
                    {funnel.abandonment_rates.checkout_abandonment.toFixed(1)}%
                  </p>
                  <p className="text-xs text-red-600">Users who added to cart but didn't checkout</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-900 mb-2">Purchase Abandonment</h5>
                  <p className="text-2xl font-bold text-yellow-600">
                    {funnel.abandonment_rates.purchase_abandonment.toFixed(1)}%
                  </p>
                  <p className="text-xs text-yellow-600">Users who started checkout but didn't purchase</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-orange-900 mb-2">Overall Abandonment</h5>
                  <p className="text-2xl font-bold text-orange-600">
                    {funnel.abandonment_rates.overall_abandonment.toFixed(1)}%
                  </p>
                  <p className="text-xs text-orange-600">Users who viewed products but didn't purchase</p>
                </div>
              </div>
            </div>
          )}

          {/* A/B Test Results */}
          {abTests.length > 0 && (
            <div className="bg-white rounded-lg border border-white/10 p-6 mb-8">
              <AdminSectionHeader
                title="A/B Test Results"
                description="Performance of your ongoing and completed A/B tests"
              />
              <AdminDataTable columns={["Test Name", "Status", "Variants", "Conversion Rate", "Winner"]}>
                {abTests.map((test) => (
                  <tr key={test.id} className="border-t border-white/5">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{test.name}</div>
                      <div className="text-sm text-gray-500">{test.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminStatusBadge status={getAbTestStatus(test)}>
                        {getAbTestStatus(test)}
                      </AdminStatusBadge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{test.variants?.length || 0} variants</td>
                    <td className="px-6 py-4 text-gray-600">
                      {test.results?.best_conversion_rate?.toFixed(2) || 'N/A'}%
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {test.winner || 'N/A'}
                    </td>
                  </tr>
                ))}
              </AdminDataTable>
            </div>
          )}

          {/* Conversion Tips */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Conversion Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Product Pages</h4>
                <ul className="space-y-1 text-orange-100">
                  <li>• High-quality images</li>
                  <li>• Clear product descriptions</li>
                  <li>• Customer reviews</li>
                  <li>• Trust badges</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Checkout Flow</h4>
                <ul className="space-y-1 text-orange-100">
                  <li>• Guest checkout option</li>
                  <li>• Progress indicators</li>
                  <li>• Multiple payment methods</li>
                  <li>• Clear shipping costs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Site Performance</h4>
                <ul className="space-y-1 text-orange-100">
                  <li>• Fast page load times</li>
                  <li>• Mobile optimization</li>
                  <li>• Clear navigation</li>
                  <li>• Search functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Trust & Security</h4>
                <ul className="space-y-1 text-orange-100">
                  <li>• SSL certificate</li>
                  <li>• Secure payment icons</li>
                  <li>• Return policy</li>
                  <li>• Contact information</li>
                </ul>
              </div>
            </div>
          </div>
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}