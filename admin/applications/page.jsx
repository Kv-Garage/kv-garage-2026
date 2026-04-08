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
  const [affiliateApplications, setAffiliateApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        // Load regular applications
        const { data: appsData, error: appsError } = await supabase
          .from("applications")
          .select("id,name,email,business_type,volume,sales_channel,experience,status,created_at")
          .order("created_at", { ascending: false });

        if (appsError) throw appsError;
        setApplications(appsData || []);

        // Load affiliate applications
        const { data: affiliateData, error: affiliateError } = await supabase
          .from("affiliate_applications")
          .select("id,name,email,reason,status,created_at")
          .order("created_at", { ascending: false });

        if (affiliateError) {
          console.error("Error loading affiliate applications:", affiliateError);
          // Don't throw, just log - we can still show regular applications
        }
        setAffiliateApplications(affiliateData || []);
      } catch (err) {
        console.error(err);
        setError("Could not load applications.");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  // Combine applications based on active tab
  const getFilteredApplications = () => {
    if (activeTab === "all") {
      return [
        ...applications.map(app => ({ ...app, type: 'business' })),
        ...affiliateApplications.map(app => ({ ...app, type: 'affiliate' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (activeTab === "business") {
      return applications.map(app => ({ ...app, type: 'business' }));
    } else if (activeTab === "affiliate") {
      return affiliateApplications.map(app => ({ ...app, type: 'affiliate' }));
    }
    return [];
  };

  const filteredApplications = getFilteredApplications();
  const approved = filteredApplications.filter((app) => app.status === "approved").length;
  const pending = filteredApplications.filter((app) => !app.status || app.status === "pending").length;
  const declined = filteredApplications.filter((app) => app.status === "declined" || app.status === "rejected").length;

  const handleApproveAffiliate = async (appId) => {
    try {
      // First, get the application to find the email
      const { data: application, error: fetchError } = await supabase
        .from("affiliate_applications")
        .select("email")
        .eq("id", appId)
        .single();

      if (fetchError || !application) {
        alert("Application not found: " + (fetchError?.message || ""));
        return;
      }

      // Update the affiliate application status
      const { error: appError } = await supabase
        .from("affiliate_applications")
        .update({ status: "approved" })
        .eq("id", appId);

      if (appError) {
        console.error("Error updating application:", appError);
        alert("Failed to update application status: " + appError.message);
        return;
      }

      // Try to find the user by email in auth.users via RPC
      // First, let's try to update the profile directly
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          approved: true,
          role: 'affiliate'
        })
        .eq("email", application.email);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        // Try alternative: use the approve_affiliate function if it exists
        const { error: rpcError } = await supabase.rpc('approve_affiliate', { affiliate_email: application.email });
        
        if (rpcError) {
          console.error("RPC error:", rpcError);
          alert(`Application approved, but profile update failed. User may not be able to login yet.
          
Application status: approved
Profile update error: ${profileError.message}

Please manually update the user's profile in Supabase:
- Set role = 'affiliate'
- Set approved = true
For user with email: ${application.email}`);
        }
      }

      // Update local state
      setAffiliateApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: "approved" } : app)
      );

      alert("Affiliate application approved! Status: approved\n\nNote: If the user still can't login, you may need to manually update their profile in Supabase to set role='affiliate' and approved=true.");
    } catch (err) {
      console.error("Error approving application:", err);
      alert("Failed to approve application: " + err.message);
    }
  };

  const handleRejectAffiliate = async (appId) => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    try {
      const { error } = await supabase
        .from("affiliate_applications")
        .update({ status: "rejected", reason: reason || null })
        .eq("id", appId);

      if (error) throw error;

      // Update local state
      setAffiliateApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: "rejected" } : app)
      );
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Failed to reject application");
    }
  };

  const handleApproveBusiness = async (appId) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "approved" })
        .eq("id", appId);

      if (error) throw error;

      // Update local state
      setApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: "approved" } : app)
      );
    } catch (err) {
      console.error("Error approving application:", err);
      alert("Failed to approve application");
    }
  };

  const handleRejectBusiness = async (appId) => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "declined", reason: reason || null })
        .eq("id", appId);

      if (error) throw error;

      // Update local state
      setApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: "declined" } : app)
      );
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Failed to reject application");
    }
  };

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
          ) : applications.length === 0 && affiliateApplications.length === 0 ? (
            <AdminEmptyState
              title="No applications submitted"
              description="Application entries from the `applications` and `affiliate_applications` tables will appear here once users begin applying."
            />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === "all" 
                      ? "bg-[#D4AF37] text-black" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  All Applications ({applications.length + affiliateApplications.length})
                </button>
                <button
                  onClick={() => setActiveTab("business")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === "business" 
                      ? "bg-[#D4AF37] text-black" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Business ({applications.length})
                </button>
                <button
                  onClick={() => setActiveTab("affiliate")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === "affiliate" 
                      ? "bg-[#D4AF37] text-black" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Affiliate ({affiliateApplications.length})
                </button>
              </div>

              <AdminStatGrid>
                <AdminMetricCard label="Total Applications" value={filteredApplications.length} hint="All submissions received" />
                <AdminMetricCard label="Pending Review" value={pending} hint="Awaiting a decision" />
                <AdminMetricCard label="Approved" value={approved} hint="Accepted applications" />
                <AdminMetricCard label="Declined" value={declined} hint="Applications not approved" />
              </AdminStatGrid>

              <AdminTableCard>
                <AdminSectionHeader
                  title="Application queue"
                  description="A dedicated view of application records with only the fields this page needs."
                />
                <AdminDataTable columns={["Applicant", activeTab === "affiliate" ? "Platform/Reason" : activeTab === "business" ? "Business Type" : "Type", activeTab === "affiliate" ? "" : "Details", "Status", "Submitted", "Actions"]}>
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="border-t border-white/5">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{application.name || "Unknown applicant"}</div>
                        <div className="mt-1 text-xs text-[#94A3B8]">{application.email || "No email"}</div>
                        {application.experience ? (
                          <div className="mt-2 max-w-md text-xs text-[#64748B]">{application.experience}</div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4">
                        {application.type === "affiliate" ? (
                          <div className="max-w-md text-sm text-gray-300 whitespace-pre-line">
                            {application.reason || "No reason provided"}
                          </div>
                        ) : (
                          <div>{application.business_type || "-"}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {application.type === "business" ? (
                          <div className="text-sm">
                            <div className="text-gray-300">Channel: {application.sales_channel || "-"}</div>
                            <div className="text-gray-300">Volume: {application.volume || "-"}</div>
                          </div>
                        ) : (
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded font-semibold">Affiliate</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <AdminStatusBadge>{application.status || "pending"}</AdminStatusBadge>
                      </td>
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {application.created_at ? new Date(application.created_at).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {application.type === "affiliate" && application.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveAffiliate(application.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectAffiliate(application.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {application.type === "affiliate" && application.status !== "pending" && (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                        {application.type === "business" && application.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveBusiness(application.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectBusiness(application.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {application.type === "business" && application.status !== "pending" && (
                          <span className="text-xs text-gray-500">-</span>
                        )}
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