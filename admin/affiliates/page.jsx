"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

export default function AdminAffiliatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applications");
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch affiliate data from API
  const loadAffiliateData = async () => {
    setLoading(true);
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        console.error("No auth token available");
        setLoading(false);
        return;
      }

      // Fetch applications
      const appsResponse = await fetch("/api/admin/affiliate-applications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        setApplications(appsData);
      }

      // Fetch affiliates (we'll create this endpoint next)
      const affiliatesResponse = await fetch("/api/admin/affiliates", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (affiliatesResponse.ok) {
        const affiliatesData = await affiliatesResponse.json();
        setAffiliates(affiliatesData);
      }
    } catch (err) {
      console.error("Error loading affiliate data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const checkAdmin = async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        router.push("/admin");
      }
    };

    checkAdmin();
    loadAffiliateData();
  }, [user, router]);

  const handleApprove = async (applicationId) => {
    setActionLoading(applicationId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch("/api/admin/affiliate-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId,
          action: "approve"
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to approve application");
      }

      // Reload data
      loadAffiliateData();
    } catch (err) {
      console.error("Error approving application:", err);
      alert("Failed to approve application: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId) => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    
    setActionLoading(applicationId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch("/api/admin/affiliate-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId,
          action: "reject",
          rejectionReason: reason || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reject application");
      }

      // Reload data
      loadAffiliateData();
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Failed to reject application: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-[#05070D] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#05070D] text-white">
      {/* ================= HEADER ================= */}
      <header className="w-full bg-[#05070D] border-b border-[#1C2233] sticky top-0 z-50">

        {/* TOP ROW */}
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="h-8 w-8 md:h-9 md:w-9 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] md:text-base font-semibold tracking-[0.08em] leading-none">
                ADMIN DASHBOARD
              </span>
              <span className="text-[10px] md:text-[11px] text-gray-500 font-normal tracking-[0.06em] uppercase">
                Affiliate Management
              </span>
            </div>
          </div>

          {/* RIGHT SIDE (AUTH + CART) */}
          <div className="flex items-center gap-3">

            <span className="text-xs text-gray-400">
              Welcome, {user?.email}
            </span>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="text-xs border px-3 py-2 rounded hover:border-red-500 transition"
            >
              Logout
            </button>

          </div>

        </div>

        {/* NAV */}
        <div className="w-full border-t border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 py-2.5 md:py-3 flex items-center justify-center overflow-x-auto">
            <nav className="flex gap-6 md:gap-8 text-[13px] md:text-sm font-medium text-gray-400 whitespace-nowrap">
              <a href="/admin">Dashboard</a>
              <a href="/admin/products">Products</a>
              <a href="/admin/orders">Orders</a>
              <a href="/admin/customers">Customers</a>
              <a href="/admin/affiliates" className="text-[#D4AF37]">Affiliates</a>
              <a href="/admin/analytics">Analytics</a>
              <a href="/admin/conversions">Conversions</a>
            </nav>
          </div>
        </div>

      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Affiliate Management</h1>
            <p className="text-gray-400">Manage affiliate applications, approve accounts, and monitor performance</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-900/20 to-transparent border border-orange-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400">Total Applications</h3>
                <span className="text-orange-400">📋</span>
              </div>
              <div className="text-2xl font-bold text-white">{applications.length}</div>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400">Active Affiliates</h3>
                <span className="text-green-400">✅</span>
              </div>
              <div className="text-2xl font-bold text-white">{affiliates.length}</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400">Pending</h3>
                <span className="text-yellow-400">⏳</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {applications.filter(app => app.status === 'pending').length}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400">Total Earnings</h3>
                <span className="text-blue-400">💰</span>
              </div>
              <div className="text-2xl font-bold text-white">
                ${affiliates.reduce((total, aff) => total + (aff.total_earnings || 0), 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-[#333] mb-6">
            <div className="flex space-x-8">
              {[
                { id: "applications", label: "Applications", icon: "📋" },
                { id: "affiliates", label: "Affiliates", icon: "👥" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-lg border border-[#333] overflow-hidden">
                <div className="p-6 border-b border-[#333]">
                  <h3 className="text-lg font-semibold text-white">Affiliate Applications</h3>
                  <p className="text-gray-400 text-sm">Review and approve new affiliate applications</p>
                </div>
                
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading applications...</div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">📋</div>
                      <p>No affiliate applications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="bg-[#0D0D0D] border border-[#333] rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-white font-semibold">{app.name}</h4>
                              <p className="text-gray-400 text-sm">{app.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                app.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                                app.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                                'bg-red-900/30 text-red-400'
                              }`}>
                                {app.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-gray-300 whitespace-pre-line">{app.reason}</p>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApprove(app.id)}
                              disabled={app.status !== 'pending' || actionLoading === app.id}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              {actionLoading === app.id ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              disabled={app.status !== 'pending' || actionLoading === app.id}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              {actionLoading === app.id ? "Processing..." : "Reject"}
                            </button>
                          </div>
                          
                          <div className="mt-4 text-xs text-gray-500">
                            Applied: {new Date(app.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Affiliates Tab */}
            {activeTab === "affiliates" && (
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-lg border border-[#333] overflow-hidden">
                <div className="p-6 border-b border-[#333]">
                  <h3 className="text-lg font-semibold text-white">Active Affiliates</h3>
                  <p className="text-gray-400 text-sm">Manage existing affiliate accounts and view performance</p>
                </div>
                
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading affiliates...</div>
                  ) : affiliates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">👥</div>
                      <p>No affiliates yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#333]">
                            <th className="text-left text-gray-400 text-sm font-semibold pb-4">Name</th>
                            <th className="text-left text-gray-400 text-sm font-semibold pb-4">Email</th>
                            <th className="text-left text-gray-400 text-sm font-semibold pb-4">Referral Code</th>
                            <th className="text-left text-gray-400 text-sm font-semibold pb-4">Total Earnings</th>
                            <th className="text-left text-gray-400 text-sm font-semibold pb-4">Status</th>
                            <th className="text-left text-gray-400 text-sm font-semibold pb-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {affiliates.map((aff) => (
                            <tr key={aff.id} className="border-b border-[#333]">
                              <td className="py-4">
                                <div className="font-semibold text-white">{aff.name}</div>
                              </td>
                              <td className="py-4">
                                <div className="text-gray-300">{aff.email}</div>
                              </td>
                              <td className="py-4">
                                <div className="text-[#D4AF37] font-mono font-semibold">{aff.referral_code}</div>
                              </td>
                              <td className="py-4">
                                <div className="font-semibold text-white">${(aff.total_earnings || 0).toFixed(2)}</div>
                              </td>
                              <td className="py-4">
                                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded font-semibold">Active</span>
                              </td>
                              <td className="py-4">
                                <div className="flex gap-2">
                                  <button className="text-xs bg-[#D4AF37] text-black px-3 py-1 rounded hover:bg-[#E8C96A] transition">
                                    View Details
                                  </button>
                                  <button className="text-xs border border-gray-600 text-gray-300 px-3 py-1 rounded hover:border-[#D4AF37] hover:text-[#D4AF37] transition">
                                    Edit
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}