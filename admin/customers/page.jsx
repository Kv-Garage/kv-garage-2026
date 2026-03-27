import { useEffect, useState } from "react";
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

export default function AdminCustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const page = Math.max(1, Number(searchParams?.get('page')) || 1);
  const pageSize = 20;

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error: queryError, count } = await supabase
          .from("profiles")
          .select("id,email,full_name,role,approved,company,created_at", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (queryError) throw queryError;
        setCustomers(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error(err);
        setError("Could not load customers.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [page]);

  const approvedCustomers = customers.filter((customer) => customer.approved).length;
  const wholesaleCustomers = customers.filter((customer) => customer.role === "wholesale").length;
  const adminAccounts = customers.filter((customer) => customer.role === "admin").length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());
    router.push(`${router.pathname}?${params.toString()}`);
  };

  return (
    <AdminGuard>
      <AdminLayout title="Customers" description="Customer accounts, roles, and approval workflows.">
        <AdminPageShell
          eyebrow="People"
          title="Customers"
          description="A high-clarity view of customer profiles, approval status, and account roles from the `profiles` table."
        >
          {error ? <AdminErrorState message={error} /> : null}

          {loading ? (
            <AdminLoadingState label="Loading customers..." />
          ) : customers.length === 0 ? (
            <AdminEmptyState
              title="No customers found"
              description="Customer profiles will appear here after users sign up and profiles are created."
            />
          ) : (
            <>
              <AdminStatGrid>
                <AdminMetricCard label="Total Profiles" value={customers.length} hint="All customer accounts" />
                <AdminMetricCard label="Approved" value={approvedCustomers} hint="Profiles approved for access" />
                <AdminMetricCard label="Wholesale" value={wholesaleCustomers} hint="Wholesale customer accounts" />
                <AdminMetricCard label="Admin Users" value={adminAccounts} hint="Internal admin seats" />
              </AdminStatGrid>

              <AdminTableCard>
                <AdminSectionHeader
                  title="Customer directory"
                  description="Customer records with role and approval context, built specifically from the `profiles` table."
                />
                <AdminDataTable columns={["Customer", "Role", "Approval", "Company", "Joined"]}>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-t border-white/5">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{customer.full_name || "No name provided"}</div>
                        <div className="mt-1 text-xs text-[#94A3B8]">{customer.email || "No email"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <AdminStatusBadge>{customer.role || "retail"}</AdminStatusBadge>
                      </td>
                      <td className="px-6 py-4">
                        <AdminStatusBadge tone={customer.approved ? "success" : "warning"}>
                          {customer.approved ? "Approved" : "Pending"}
                        </AdminStatusBadge>
                      </td>
                      <td className="px-6 py-4">{customer.company || "-"}</td>
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "-"}
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
