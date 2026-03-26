import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../layout";
import { supabase } from "../../lib/supabase";
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

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from("applications")
          .select("id,name,email,business_type,volume,sales_channel,experience,status,created_at")
          .order("created_at", { ascending: false });

        if (queryError) throw queryError;
        setApplications(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load applications.");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const approved = applications.filter((application) => application.status === "approved").length;
  const pending = applications.filter((application) => !application.status || application.status === "pending").length;
  const declined = applications.filter((application) => application.status === "declined").length;

  return (
    <AdminGuard>
      <AdminLayout title="Applications" description="Submission review and partner approval pipeline.">
        <AdminPageShell
          eyebrow="Pipeline"
          title="Applications"
          description="Review incoming applications, business intent, and decision status with the structure expected in a high-volume admin workflow."
        >
          {error ? <AdminErrorState message={error} /> : null}

          {loading ? (
            <AdminLoadingState label="Loading applications..." />
          ) : applications.length === 0 ? (
            <AdminEmptyState
              title="No applications submitted"
              description="Application entries from the `applications` table will appear here once users begin applying."
            />
          ) : (
            <>
              <AdminStatGrid>
                <AdminMetricCard label="Total Applications" value={applications.length} hint="All submissions received" />
                <AdminMetricCard label="Pending Review" value={pending} hint="Awaiting a decision" />
                <AdminMetricCard label="Approved" value={approved} hint="Accepted applications" />
                <AdminMetricCard label="Declined" value={declined} hint="Applications not approved" />
              </AdminStatGrid>

              <AdminTableCard>
                <AdminSectionHeader
                  title="Application queue"
                  description="A dedicated view of `applications` records with only the fields this page needs."
                />
                <AdminDataTable columns={["Applicant", "Business Type", "Sales Channel", "Volume", "Status", "Submitted"]}>
                  {applications.map((application) => (
                    <tr key={application.id} className="border-t border-white/5">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{application.name || "Unknown applicant"}</div>
                        <div className="mt-1 text-xs text-[#94A3B8]">{application.email || "No email"}</div>
                        {application.experience ? (
                          <div className="mt-2 max-w-md text-xs text-[#64748B]">{application.experience}</div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4">{application.business_type || "-"}</td>
                      <td className="px-6 py-4">{application.sales_channel || "-"}</td>
                      <td className="px-6 py-4">{application.volume || "-"}</td>
                      <td className="px-6 py-4">
                        <AdminStatusBadge>{application.status || "pending"}</AdminStatusBadge>
                      </td>
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {application.created_at ? new Date(application.created_at).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </AdminDataTable>
              </AdminTableCard>
            </>
          )}
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}
