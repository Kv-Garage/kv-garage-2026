import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminCustomers() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id,email,full_name,role,approved,created_at,phone,company")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load customers.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-500";
      case "wholesale": return "bg-blue-500";
      case "student": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#D4AF37] mb-2">Customers</h1>
            <p className="text-gray-300">Manage user accounts and customer profiles</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-800 text-red-100 rounded">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading customers...</div>
            </div>
          ) : (
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1A2132] border-b border-[#1C2233]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Customer</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Company</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b border-[#1C2233] hover:bg-[#1A2132]">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">
                              {customer.full_name || "No name"}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="text-gray-500 text-xs">
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getRoleColor(customer.role)}`}>
                            {customer.role || "retail"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            customer.approved
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}>
                            {customer.approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {customer.company || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {customers.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No customers found
                </div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}