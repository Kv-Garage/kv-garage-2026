import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(20);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          customer_id,
          customer_email,
          total,
          cost,
          status,
          tracking_number,
          order_number,
          shipping_address,
          created_at,
          updated_at,
          profiles:customer_id (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        (order.customer_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.order_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.id || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setDate(now.getDate() - 1);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(order => new Date(order.created_at) >= filterDate);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "total" || sortBy === "cost") {
        aVal = Number(aVal || 0);
        bVal = Number(bVal || 0);
      } else if (sortBy.includes("_at")) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
    setSelectedOrders([]);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));
    } catch (err) {
      console.error(err);
      setError("Could not update order status.");
    }
  };

  const bulkUpdateStatus = async (newStatus) => {
    if (selectedOrders.length === 0) return;

    try {
      await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .in("id", selectedOrders);

      setOrders(prev => prev.map(order =>
        selectedOrders.includes(order.id)
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));
      setSelectedOrders([]);
    } catch (err) {
      console.error(err);
      setError("Could not update selected orders.");
    }
  };

  const exportOrders = () => {
    const csvData = filteredOrders.map(order => ({
      "Order ID": order.id,
      "Order Number": order.order_number || order.id,
      "Customer Email": order.customer_email || "",
      "Total": order.total || 0,
      "Status": order.status || "new",
      "Tracking": order.tracking_number || "",
      "Created": new Date(order.created_at).toLocaleDateString(),
    }));

    const csvString = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(order => order.id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-500/20 text-green-400";
      case "processing": return "bg-blue-500/20 text-blue-400";
      case "shipped": return "bg-purple-500/20 text-purple-400";
      case "delivered": return "bg-emerald-500/20 text-emerald-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-yellow-500/20 text-yellow-400";
    }
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
              <p className="text-gray-400">Manage and track all customer orders</p>
            </div>
            <button
              onClick={exportOrders}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors text-sm font-medium"
            >
              Export CSV
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Order ID, email, or order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 3 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={`${sortBy}_${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('_');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg text-sm"
                >
                  <option value="created_at_desc">Newest First</option>
                  <option value="created_at_asc">Oldest First</option>
                  <option value="total_desc">Highest Value</option>
                  <option value="total_asc">Lowest Value</option>
                  <option value="status_asc">Status A-Z</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-[#1A2132] rounded-lg">
                <span className="text-sm text-gray-300">
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => bulkUpdateStatus("confirmed")}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => bulkUpdateStatus("processing")}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                  >
                    Process
                  </button>
                  <button
                    onClick={() => bulkUpdateStatus("shipped")}
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm hover:bg-purple-500/30"
                  >
                    Ship
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading orders...</div>
            </div>
          ) : (
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1A2132] border-b border-[#2A3441]">
                    <tr>
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                          onChange={toggleAllOrders}
                          className="rounded border-gray-600"
                        />
                      </th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                          No orders found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      currentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-[#2A3441] hover:bg-[#1A2132]">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => toggleOrderSelection(order.id)}
                              className="rounded border-gray-600"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-white">#{order.order_number || order.id.slice(-8)}</p>
                              <p className="text-xs text-gray-400">{order.id.slice(-8)}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white">{order.customer_email || "Unknown"}</p>
                              {order.profiles?.full_name && (
                                <p className="text-xs text-gray-400">{order.profiles.full_name}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-[#D4AF37]">
                              ${Number(order.total || 0).toFixed(2)}
                            </p>
                            {order.cost && (
                              <p className="text-xs text-gray-400">
                                Cost: ${Number(order.cost).toFixed(2)}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status || 'new')}`}>
                              {order.status || 'new'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.created_at).toLocaleTimeString()}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status || "new"}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-[#2A3441] border border-[#3A4551] text-white px-2 py-1 rounded text-xs"
                            >
                              <option value="new">New</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-[#1A2132] border-t border-[#2A3441]">
                  <div className="text-sm text-gray-400">
                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-[#2A3441] text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A4551]"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 rounded ${
                            currentPage === pageNum
                              ? "bg-[#D4AF37] text-black"
                              : "bg-[#2A3441] text-gray-300 hover:bg-[#3A4551]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-[#2A3441] text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A4551]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
