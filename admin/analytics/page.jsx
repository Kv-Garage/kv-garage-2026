import { useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../layout";
import { supabase } from "../../lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminMetricCard,
  AdminPageShell,
  AdminTableCard,
} from "../../components/admin/AdminPageShell";
import { AdminSectionHeader, AdminStatGrid } from "../../components/admin/AdminPrimitives";

function groupRecordsBy(records, key, mode = "day") {
  const grouped = {};

  records.forEach((record) => {
    const value = record?.[key];
    if (!value) return;

    const date = new Date(value);
    const label =
      mode === "week"
        ? `${date.getFullYear()}-W${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`
        : date.toISOString().slice(0, 10);

    grouped[label] = (grouped[label] || 0) + Number(record.total || 1);
  });

  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}

function SimpleLineChart({ data }) {
  if (!data.length) return <p className="text-sm text-[#94A3B8]">No chart data available.</p>;

  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const points = data
    .map((point, index) => {
      const x = data.length === 1 ? 0 : (index / (data.length - 1)) * 100;
      const y = 100 - (point.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible">
      <polyline
        fill="none"
        stroke="#D4AF37"
        strokeWidth="2.5"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SimpleBarChart({ data }) {
  if (!data.length) return <p className="text-sm text-[#94A3B8]">No chart data available.</p>;

  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const barWidth = 100 / Math.max(data.length, 1);

  return (
    <svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible">
      {data.map((point, index) => {
        const height = (point.value / maxValue) * 100;
        const x = index * barWidth + 2;
        const width = Math.max(barWidth - 4, 2);

        return (
          <rect
            key={point.label}
            x={x}
            y={100 - height}
            width={width}
            height={height}
            rx="2"
            fill="#D4AF37"
          />
        );
      })}
    </svg>
  );
}

export const dynamic = 'force-dynamic';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [grouping, setGrouping] = useState("day");
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [studentSpend, setStudentSpend] = useState([]);
  const [studentCategory, setStudentCategory] = useState("all");
  const [studentDateFrom, setStudentDateFrom] = useState("");
  const [studentDateTo, setStudentDateTo] = useState("");
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const page = Math.max(1, Number(searchParams?.get('page')) || 1);
  const pageSize = 20;

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const [
          { data: orders, error: ordersError },
          { data: customers, error: customersError },
          { data: trafficEvents, error: trafficError },
          { data: pagedOrders, error: pagedOrdersError, count },
          { data: studentSpendRows, error: studentSpendError },
          { data: profiles, error: profilesError },
        ] = await Promise.all([
          supabase.from("orders").select("id,order_number,customer_email,total,status,created_at,user_id"),
          supabase.from("orders").select("user_id"),
          supabase
            .from("traffic_events")
            .select("page,event_type,timestamp")
            .gte("timestamp", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
          supabase
            .from("orders")
            .select("order_number,customer_email,total,status,created_at", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to),
          supabase.from("student_spend").select("user_id,amount,category,created_at,order_id"),
          supabase.from("profiles").select("id,email,full_name"),
        ]);

        if (ordersError || customersError || trafficError || pagedOrdersError || studentSpendError || profilesError) {
          throw ordersError || customersError || trafficError || pagedOrdersError || studentSpendError || profilesError;
        }

        const uniqueCustomers = new Set(
          (customers || []).map((order) => order.user_id).filter(Boolean)
        ).size;

        const pageViews = (trafficEvents || []).filter((event) => event.event_type === "page_view");
        const productViews = (trafficEvents || []).filter((event) => event.event_type === "product_view");
        const conversions = (trafficEvents || []).filter((event) => event.event_type === "conversion");

        const topPages = Object.entries(
          pageViews.reduce((accumulator, event) => {
            accumulator[event.page] = (accumulator[event.page] || 0) + 1;
            return accumulator;
          }, {})
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const topProducts = Object.entries(
          productViews.reduce((accumulator, event) => {
            accumulator[event.page] = (accumulator[event.page] || 0) + 1;
            return accumulator;
          }, {})
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        setMetrics({
          totalRevenue: (orders || []).reduce((sum, order) => sum + Number(order.total || 0), 0),
          totalOrders: orders?.length || 0,
          totalCustomers: uniqueCustomers,
          revenuePoints: groupRecordsBy(orders || [], "created_at", grouping),
          orderPoints: groupRecordsBy(
            (orders || []).map((order) => ({ ...order, total: 1 })),
            "created_at",
            grouping
          ),
          totalPageViews30d: pageViews.length,
          totalConversions30d: conversions.length,
          topPages,
          topProducts,
        });

        setRecentOrders(pagedOrders || []);
        setTotalOrdersCount(count || 0);

        const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]));
        const groupedStudentSpend = Object.values(
          (studentSpendRows || []).reduce((accumulator, row) => {
            const key = row.user_id || row.order_id || `unknown-${Math.random()}`;
            const existing =
              accumulator[key] ||
              {
                user_id: row.user_id,
                total_spent: 0,
                orders: 0,
                categorySet: new Set(),
                latest_created_at: row.created_at,
                profile: profileMap.get(row.user_id) || null,
              };

            existing.total_spent += Number(row.amount || 0);
            existing.orders += 1;
            if (row.category) existing.categorySet.add(row.category);
            if (!existing.latest_created_at || new Date(row.created_at) > new Date(existing.latest_created_at)) {
              existing.latest_created_at = row.created_at;
            }

            accumulator[key] = existing;
            return accumulator;
          }, {})
        ).map((row) => ({
          ...row,
          categories: Array.from(row.categorySet || []),
          currentTier:
            row.orders >= 10
              ? "Platinum"
              : row.orders >= 5
                ? "Gold"
                : row.orders >= 3
                  ? "Silver"
                  : row.total_spent >= 500
                    ? "Gold"
                    : "Bronze",
          effectiveDiscount:
            row.orders >= 10
              ? 15
              : row.orders >= 5
                ? 10
                : row.total_spent >= 500
                  ? 12
                  : row.orders >= 3
                    ? 5
                    : 0,
        }));

        setStudentSpend(groupedStudentSpend);
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [grouping, page]);

  const totalPages = Math.max(1, Math.ceil(totalOrdersCount / pageSize));

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());
    router.push(`${router.pathname}?${params.toString()}`);
  };

  const topPages = useMemo(() => metrics?.topPages || [], [metrics]);
  const topProducts = useMemo(() => metrics?.topProducts || [], [metrics]);
  const spendCategories = useMemo(
    () =>
      Array.from(
        new Set(studentSpend.flatMap((row) => row.categories || []).filter(Boolean))
      ).sort(),
    [studentSpend]
  );
  const filteredStudentSpend = useMemo(
    () =>
      studentSpend.filter((row) => {
        const matchesCategory =
          studentCategory === "all" || (row.categories || []).includes(studentCategory);
        const matchesStart =
          !studentDateFrom || new Date(row.latest_created_at) >= new Date(studentDateFrom);
        const matchesEnd =
          !studentDateTo || new Date(row.latest_created_at) <= new Date(`${studentDateTo}T23:59:59`);
        return matchesCategory && matchesStart && matchesEnd;
      }),
    [studentSpend, studentCategory, studentDateFrom, studentDateTo]
  );

  const exportStudentSpend = () => {
    const rows = filteredStudentSpend.map((row) => ({
      name: row.profile?.full_name || "",
      email: row.profile?.email || "",
      total_spent: Number(row.total_spent || 0).toFixed(2),
      orders: row.orders,
      categories: (row.categories || []).join(", "),
      latest_created_at: row.latest_created_at || "",
    }));

    const header = Object.keys(rows[0] || {
      name: "",
      email: "",
      total_spent: "",
      orders: "",
      categories: "",
      latest_created_at: "",
    });
    const csv = [
      header.join(","),
      ...rows.map((row) =>
        header
          .map((key) => `"${String(row[key] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-spend.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminGuard>
      <AdminLayout title="Analytics" description="Commerce, traffic, and order performance from Supabase.">
        <AdminPageShell
          eyebrow="Insights"
          title="Analytics"
          description="Revenue, orders, customers, traffic, and recent order activity grouped directly from production data."
          actions={
            <div className="flex gap-2">
              {["day", "week"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setGrouping(mode)}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    grouping === mode ? "bg-[#D4AF37] text-black" : "bg-white/5 text-white"
                  }`}
                >
                  {mode === "day" ? "By Day" : "By Week"}
                </button>
              ))}
            </div>
          }
        >
          {error ? <AdminErrorState message={error} /> : null}

          {loading ? (
            <AdminLoadingState label="Loading analytics..." />
          ) : !metrics ? (
            <AdminEmptyState title="No analytics available" description="Analytics will appear once orders and traffic events exist." />
          ) : (
            <>
              <AdminStatGrid columns="xl:grid-cols-5">
                <AdminMetricCard label="Total Revenue" value={`$${metrics.totalRevenue.toFixed(2)}`} hint="Sum of orders.total" />
                <AdminMetricCard label="Total Orders" value={metrics.totalOrders} hint="All order records" />
                <AdminMetricCard label="Total Customers" value={metrics.totalCustomers} hint="Distinct order user_ids" />
                <AdminMetricCard label="Page Views (30d)" value={metrics.totalPageViews30d} hint="Traffic events in last 30 days" />
                <AdminMetricCard label="Conversions (30d)" value={metrics.totalConversions30d} hint="Tracked checkout success events" />
              </AdminStatGrid>

              <div className="grid gap-6 xl:grid-cols-2">
                <AdminTableCard>
                  <AdminSectionHeader title="Revenue over time" />
                  <div className="p-6">
                    <SimpleLineChart data={metrics.revenuePoints} />
                  </div>
                </AdminTableCard>

                <AdminTableCard>
                  <AdminSectionHeader title="Orders over time" />
                  <div className="p-6">
                    <SimpleBarChart data={metrics.orderPoints} />
                  </div>
                </AdminTableCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <AdminTableCard>
                  <AdminSectionHeader title="Top Pages (30d)" />
                  <div className="space-y-3 p-6">
                    {topPages.map(([pageName, count]) => (
                      <div key={pageName} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <span>{pageName}</span>
                        <span className="font-semibold text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </AdminTableCard>

                <AdminTableCard>
                  <AdminSectionHeader title="Top Products (30d)" />
                  <div className="space-y-3 p-6">
                    {topProducts.map(([pageName, count]) => (
                      <div key={pageName} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <span>{pageName}</span>
                        <span className="font-semibold text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </AdminTableCard>
              </div>

              <AdminTableCard>
                <AdminSectionHeader
                  title="Student Spend"
                  description="Admin-only reporting for student account purchase volume by user, category, and date range."
                />
                <div className="flex flex-wrap gap-3 border-b border-white/10 px-6 py-4">
                  <select
                    value={studentCategory}
                    onChange={(event) => setStudentCategory(event.target.value)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  >
                    <option value="all">All Categories</option>
                    {spendCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={studentDateFrom}
                    onChange={(event) => setStudentDateFrom(event.target.value)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  />
                  <input
                    type="date"
                    value={studentDateTo}
                    onChange={(event) => setStudentDateTo(event.target.value)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  />
                  <button
                    onClick={exportStudentSpend}
                    className="rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-semibold text-black"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/[0.02] text-left text-[#94A3B8]">
                      <tr>
                        <th className="px-6 py-4 font-medium">Student</th>
                        <th className="px-6 py-4 font-medium">Total Spent</th>
                        <th className="px-6 py-4 font-medium">Orders</th>
                        <th className="px-6 py-4 font-medium">Categories</th>
                        <th className="px-6 py-4 font-medium">Tier</th>
                        <th className="px-6 py-4 font-medium">Last Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudentSpend.map((row) => (
                        <tr key={row.user_id || row.latest_created_at} className="border-t border-white/5">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{row.profile?.full_name || "Student Account"}</div>
                            <div className="mt-1 text-xs text-[#64748B]">{row.profile?.email || "No email"}</div>
                          </td>
                          <td className="px-6 py-4 text-white">${Number(row.total_spent || 0).toFixed(2)}</td>
                          <td className="px-6 py-4">{row.orders}</td>
                          <td className="px-6 py-4">{(row.categories || []).join(", ") || "general"}</td>
                          <td className="px-6 py-4">{row.currentTier} ({row.effectiveDiscount}% off)</td>
                          <td className="px-6 py-4">{row.latest_created_at ? new Date(row.latest_created_at).toLocaleDateString() : "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AdminTableCard>

              <AdminTableCard>
                <AdminSectionHeader title="Recent orders" description="Latest paid orders, paginated at 20 rows per page." />
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-[#CBD5E1]">
                    <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
                      <tr>
                        {["Order Number", "Customer Email", "Total", "Status", "Created"].map((column) => (
                          <th key={column} className="px-6 py-4 font-medium">{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={`${order.order_number}-${order.created_at}`} className="border-t border-white/5">
                          <td className="px-6 py-4 text-white">{order.order_number || "-"}</td>
                          <td className="px-6 py-4">{order.customer_email || "-"}</td>
                          <td className="px-6 py-4">${Number(order.total || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 capitalize">{order.status || "pending"}</td>
                          <td className="px-6 py-4 text-[#94A3B8]">
                            {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 ? (
                  <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-sm text-[#94A3B8]">
                    <span>Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                      <button onClick={() => goToPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40">
                        Previous
                      </button>
                      <button onClick={() => goToPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40">
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}
              </AdminTableCard>
            </>
          )}
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}
