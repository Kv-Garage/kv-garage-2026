import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminMarketing() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState("campaign");

  useEffect(() => {
    loadMarketingData();
  }, []);

  const loadMarketingData = async () => {
    try {
      // Mock data for campaigns and discounts
      const mockCampaigns = [
        {
          id: "1",
          name: "Summer Sale 2024",
          type: "seasonal",
          status: "active",
          start_date: "2024-06-01",
          end_date: "2024-08-31",
          budget: 5000,
          spent: 2340,
          impressions: 45000,
          clicks: 1200,
          conversions: 89,
          description: "Summer promotion for automotive parts"
        },
        {
          id: "2",
          name: "New Customer Welcome",
          type: "acquisition",
          status: "active",
          start_date: "2024-01-01",
          end_date: null,
          budget: null,
          spent: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          description: "Welcome series for new customers"
        }
      ];

      const mockDiscounts = [
        {
          id: "1",
          code: "WELCOME10",
          type: "percentage",
          value: 10,
          min_order: 50,
          max_uses: 1000,
          used_count: 234,
          status: "active",
          expires_at: "2024-12-31",
          description: "10% off welcome discount"
        },
        {
          id: "2",
          code: "FLASH50",
          type: "fixed",
          value: 50,
          min_order: 200,
          max_uses: 50,
          used_count: 12,
          status: "active",
          expires_at: "2024-03-31",
          description: "Flash sale - $50 off orders over $200"
        }
      ];

      setCampaigns(mockCampaigns);
      setDiscounts(mockDiscounts);
    } catch (err) {
      console.error(err);
      setError("Could not load marketing data.");
    } finally {
      setLoading(false);
    }
  };

  const MarketingModal = ({ item, type, onClose }) => {
    const [formData, setFormData] = useState({
      name: item?.name || "",
      code: item?.code || "",
      type: item?.type || (type === "campaign" ? "seasonal" : "percentage"),
      value: item?.value || 0,
      description: item?.description || "",
      start_date: item?.start_date || "",
      end_date: item?.end_date || "",
      expires_at: item?.expires_at || "",
      budget: item?.budget || "",
      min_order: item?.min_order || 0,
      max_uses: item?.max_uses || "",
      status: item?.status || "active",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (type === "campaign") {
          if (item) {
            setCampaigns(prev => prev.map(c =>
              c.id === item.id ? { ...c, ...formData } : c
            ));
          } else {
            const newCampaign = {
              id: Date.now().toString(),
              ...formData,
              spent: 0,
              impressions: 0,
              clicks: 0,
              conversions: 0,
            };
            setCampaigns(prev => [newCampaign, ...prev]);
          }
        } else {
          if (item) {
            setDiscounts(prev => prev.map(d =>
              d.id === item.id ? { ...d, ...formData } : d
            ));
          } else {
            const newDiscount = {
              id: Date.now().toString(),
              ...formData,
              used_count: 0,
            };
            setDiscounts(prev => [newDiscount, ...prev]);
          }
        }
        onClose();
      } catch (err) {
        setError("Could not save marketing item.");
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6 w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {item ? `Edit ${type}` : `Create ${type}`}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === "campaign" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    >
                      <option value="seasonal">Seasonal</option>
                      <option value="acquisition">Acquisition</option>
                      <option value="retention">Retention</option>
                      <option value="awareness">Awareness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget ($)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    placeholder="Optional"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Discount Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {formData.type === "percentage" ? "Percentage (%)" : "Amount ($)"}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Order ($)</label>
                    <input
                      type="number"
                      value={formData.min_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_order: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Uses</label>
                    <input
                      type="number"
                      value={formData.max_uses}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                      placeholder="Unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expires</label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                      className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#1A2132] text-gray-300 rounded-lg hover:bg-[#2A3441] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
              >
                {item ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "draft": return "bg-yellow-500/20 text-yellow-400";
      case "paused": return "bg-orange-500/20 text-orange-400";
      case "completed": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCampaignTypeColor = (type) => {
    switch (type) {
      case "seasonal": return "bg-purple-500/20 text-purple-400";
      case "acquisition": return "bg-blue-500/20 text-blue-400";
      case "retention": return "bg-green-500/20 text-green-400";
      case "awareness": return "bg-orange-500/20 text-orange-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Marketing</h1>
              <p className="text-gray-400">Manage campaigns, discounts, and promotions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setModalType("discount");
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 bg-[#1A2132] text-gray-300 rounded-lg hover:bg-[#2A3441] transition-colors text-sm"
              >
                New Discount
              </button>
              <button
                onClick={() => {
                  setModalType("campaign");
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors text-sm font-medium"
              >
                New Campaign
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-1">
            <div className="flex">
              <button
                onClick={() => setActiveTab("campaigns")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "campaigns"
                    ? "bg-[#D4AF37] text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Campaigns ({campaigns.length})
              </button>
              <button
                onClick={() => setActiveTab("discounts")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "discounts"
                    ? "bg-[#D4AF37] text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Discounts ({discounts.length})
              </button>
            </div>
          </div>

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1A2132] border-b border-[#2A3441]">
                    <tr>
                      <th className="px-4 py-3">Campaign</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Budget</th>
                      <th className="px-4 py-3">Performance</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-[#2A3441] hover:bg-[#1A2132]">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-white">{campaign.name}</p>
                            <p className="text-xs text-gray-400">{campaign.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCampaignTypeColor(campaign.type)}`}>
                            {campaign.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            {campaign.budget ? (
                              <>
                                <p className="text-white">${campaign.budget.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">
                                  ${campaign.spent?.toLocaleString() || 0} spent
                                </p>
                              </>
                            ) : (
                              <span className="text-gray-400">No budget</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <p className="text-white">{campaign.impressions?.toLocaleString() || 0} impressions</p>
                            <p className="text-gray-400">{campaign.clicks?.toLocaleString() || 0} clicks</p>
                            <p className="text-[#D4AF37]">{campaign.conversions || 0} conversions</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setEditingItem(campaign);
                              setModalType("campaign");
                            }}
                            className="text-[#D4AF37] hover:text-[#B8941F] text-sm"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Discounts Tab */}
          {activeTab === "discounts" && (
            <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1A2132] border-b border-[#2A3441]">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Usage</th>
                      <th className="px-4 py-3">Expires</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map((discount) => (
                      <tr key={discount.id} className="border-b border-[#2A3441] hover:bg-[#1A2132]">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-white font-mono">{discount.code}</p>
                            <p className="text-xs text-gray-400">{discount.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-300 capitalize">{discount.type}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white font-medium">
                            {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                          </p>
                          {discount.min_order > 0 && (
                            <p className="text-xs text-gray-400">Min: ${discount.min_order}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white">{discount.used_count || 0} used</p>
                            {discount.max_uses && (
                              <p className="text-xs text-gray-400">of {discount.max_uses}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-300">
                            {discount.expires_at ? new Date(discount.expires_at).toLocaleDateString() : "Never"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(discount.status)}`}>
                            {discount.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setEditingItem(discount);
                              setModalType("discount");
                            }}
                            className="text-[#D4AF37] hover:text-[#B8941F] text-sm"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modals */}
          {showCreateModal && (
            <MarketingModal
              type={modalType}
              onClose={() => {
                setShowCreateModal(false);
                setModalType("campaign");
              }}
            />
          )}

          {editingItem && (
            <MarketingModal
              item={editingItem}
              type={modalType}
              onClose={() => {
                setEditingItem(null);
                setModalType("campaign");
              }}
            />
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}