import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminApplications() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("id,user_id,name,email,business_type,volume,sales_channel,experience,status,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error(err);
      setError("Could not load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const mutateApplication = async (id, status) => {
    try {
      await supabase.from("applications").update({ status }).eq("id", id);

      if (status === "approved") {
        const item = applications.find((a) => a.id === id);
        if (item) {
          await supabase.from("profiles").upsert({
            id: item.user_id,
            email: item.email,
            full_name: item.name,
            role: "wholesale",
            approved: true,
          });
        }
      }
      loadApplications();
    } catch (err) {
      console.error(err);
      setError("Could not update application status.");
    }
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div>
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">Wholesale Applications</h1>
          {error && <div className="mb-4 p-3 bg-red-800 text-red-100 rounded">{error}</div>}

          {loading ? (
            <p>Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="text-gray-300">No applications found.</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="border border-[#1C2233] rounded p-3 bg-[#0F172A]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-white">{app.name} ({app.email})</p>
                      <p className="text-sm text-gray-300">Type: {app.business_type} • Volume: {app.volume}</p>
                      <p className="text-xs text-gray-400">Submitted: {new Date(app.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => mutateApplication(app.id, "approved")} className="px-2 py-1 text-xs rounded bg-green-500 text-black">Approve</button>
                      <button onClick={() => mutateApplication(app.id, "declined")} className="px-2 py-1 text-xs rounded bg-red-500 text-black">Decline</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
