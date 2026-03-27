import { useEffect, useState } from "react";
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
import {
  AdminDataTable,
  AdminSectionHeader,
  AdminStatGrid,
  AdminStatusBadge,
} from "../../components/admin/AdminPrimitives";

export const dynamic = 'force-dynamic';

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const page = Math.max(1, Number(searchParams?.get('page')) || 1);
  const pageSize = 20;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error: queryError, count } = await supabase
          .from("orders")
          .select("id,customer_name,customer_email,total,status,tracking_number,created_at", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (queryError) throw queryError;
        setOrders(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error(err);
        setError("Could not load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [page]);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const openOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
  const shippedOrders = orders.filter((order) => order.status === "shipped").length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const updateOrder = async (orderId, patch) => {
    const currentOrders = [...orders];
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, ...patch } : order)));

    const { error: updateError } = await supabase
      .from("orders")
      .update(patch)
      .eq("id", orderId);

    if (updateError) {
      setOrders(currentOrders);
      setError("Could not update order.");
    }
  };

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());
    router.push(`${router.pathname}?${params.toString()}`);
  };

  return (
    <AdminGuard>
      <AdminLayout title="Orders" description="Operational visibility for order flow, shipping, and revenue.">
        <AdminPageShell
          eyebrow="Operations"
          title="Orders"
          description="Monitor order flow, shipping activity, and customer purchase volume from a single enterprise workspace."
        >
          {error ? <AdminErrorState message={error} /> : null}

          {loading ? (
            <AdminLoadingState label="Loading orders..." />
          ) : orders.length === 0 ? (
            <AdminEmptyState
              title="No orders yet"
              description="Orders will appear here as soon as customers begin checking out."
            />
          ) : (
            <>
              <AdminStatGrid>
                <AdminMetricCard label="Total Orders" value={orders.length} hint="All-time order count" />
                <AdminMetricCard label="Revenue" value={`$${totalRevenue.toFixed(2)}`} hint="Gross order revenue" />
                <AdminMetricCard label="Open Orders" value={openOrders} hint="Needs fulfillment attention" />
                <AdminMetricCard label="Shipped" value={shippedOrders} hint="Orders already dispatched" />
              </AdminStatGrid>

              <AdminTableCard>
                <AdminSectionHeader
                  title="Recent orders"
                  description="A focused live view of the latest order records from the `orders` table."
                />
                <AdminDataTable columns={["Order ID", "Customer", "Status", "Tracking", "Total", "Placed"]}>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-white/5">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{order.customer_name || "Customer"}</div>
                        <div className="mt-1 text-xs text-[#64748B]">{order.customer_email || "No email"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status || "processing"}
                          onChange={(event) => updateOrder(order.id, { status: event.target.value })}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                        >
                          {["processing", "shipped", "delivered", "cancelled"].map((status) => (
                            <option key={status} value={status} className="bg-[#111827]">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={order.tracking_number || ""}
                          onChange={(event) => updateOrder(order.id, { tracking_number: event.target.value })}
                          placeholder="Add tracking"
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                        />
                      </td>
                      <td className="px-6 py-4 text-white">${Number(order.total || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </AdminDataTable>
                {totalPages > 1 ? (
                  <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-sm text-[#94A3B8]">
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => goToPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => goToPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40"
                      >
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
