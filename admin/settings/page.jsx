import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { getSiteSettingsAdmin, updateSiteSettings } from "../../lib/siteSettings";
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

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const siteSettings = await getSiteSettingsAdmin();
      setSettings(siteSettings);
    } catch (err) {
      console.error("Could not load settings:", err);
      setError("Could not load site settings.");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateSiteSettings(settings);
      
      if (result.success) {
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(result.error || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      setError("Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'admin-settings-backup.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings({ ...settings, ...importedSettings });
          setSuccess("Settings imported successfully!");
          setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
          setError("Invalid settings file.");
        }
      };
      reader.readAsText(file);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout title="Settings" description="Configure your ecommerce platform">
          <AdminPageShell
            eyebrow="System"
            title="Settings"
            description="Configure your ecommerce platform"
          >
            <AdminLoadingState label="Loading settings..." />
          </AdminPageShell>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout title="Settings" description="Configure your ecommerce platform">
        <AdminPageShell
          eyebrow="System"
          title="Settings"
          description="Configure your ecommerce platform"
        >
          {error && <AdminErrorState message={error} />}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.site_name || ""}
                    onChange={(e) => updateSetting("site_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline || ""}
                    onChange={(e) => updateSetting("tagline", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={settings.business_name || ""}
                    onChange={(e) => updateSetting("business_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <textarea
                    value={settings.business_address || ""}
                    onChange={(e) => updateSetting("business_address", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                  <input
                    type="tel"
                    value={settings.business_phone || ""}
                    onChange={(e) => updateSetting("business_phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                  <input
                    type="text"
                    value={settings.business_hours || ""}
                    onChange={(e) => updateSetting("business_hours", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact Settings */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => updateSetting("contact_email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={settings.support_email || ""}
                    onChange={(e) => updateSetting("support_email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sales Email</label>
                  <input
                    type="email"
                    value={settings.sales_email || ""}
                    onChange={(e) => updateSetting("sales_email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Billing Email</label>
                  <input
                    type="email"
                    value={settings.billing_email || ""}
                    onChange={(e) => updateSetting("billing_email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={settings.meta_title || ""}
                    onChange={(e) => updateSetting("meta_title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    value={settings.meta_description || ""}
                    onChange={(e) => updateSetting("meta_description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    value={settings.meta_keywords || ""}
                    onChange={(e) => updateSetting("meta_keywords", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Author</label>
                  <input
                    type="text"
                    value={settings.meta_author || ""}
                    onChange={(e) => updateSetting("meta_author", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Commerce Settings */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commerce</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select
                    value={settings.default_currency || "USD"}
                    onChange={(e) => updateSetting("default_currency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currency_symbol || "$"}
                    onChange={(e) => updateSetting("currency_symbol", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.tax_rate || 0}
                    onChange={(e) => updateSetting("tax_rate", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.shipping_fee || 0}
                    onChange={(e) => updateSetting("shipping_fee", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.free_shipping_threshold || 0}
                    onChange={(e) => updateSetting("free_shipping_threshold", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.timezone || "America/New_York"}
                    onChange={(e) => updateSetting("timezone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <p className="text-xs text-gray-500">Temporarily disable the site for maintenance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenance_mode || false}
                      onChange={(e) => updateSetting("maintenance_mode", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allow Registration</label>
                    <p className="text-xs text-gray-500">Allow new users to create accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allow_registration !== false}
                      onChange={(e) => updateSetting("allow_registration", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Verification</label>
                    <p className="text-xs text-gray-500">Require email verification for new accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.require_email_verification !== false}
                      onChange={(e) => updateSetting("require_email_verification", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">SSL Enabled</label>
                    <p className="text-xs text-gray-500">Force HTTPS connections</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.ssl_enabled !== false}
                      onChange={(e) => updateSetting("ssl_enabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cookie Consent</label>
                    <p className="text-xs text-gray-500">Show cookie consent banner</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.cookie_consent_enabled !== false}
                      onChange={(e) => updateSetting("cookie_consent_enabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Integration Settings */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    value={settings.google_analytics_id || ""}
                    onChange={(e) => updateSetting("google_analytics_id", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Tag Manager ID</label>
                  <input
                    type="text"
                    value={settings.google_tag_manager_id || ""}
                    onChange={(e) => updateSetting("google_tag_manager_id", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                  <input
                    type="text"
                    value={settings.facebook_pixel_id || ""}
                    onChange={(e) => updateSetting("facebook_pixel_id", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="XXXXXXXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mailchimp API Key</label>
                  <input
                    type="password"
                    value={settings.mailchimp_api_key || ""}
                    onChange={(e) => updateSetting("mailchimp_api_key", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mailchimp List ID</label>
                  <input
                    type="text"
                    value={settings.mailchimp_list_id || ""}
                    onChange={(e) => updateSetting("mailchimp_list_id", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={exportSettings}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold"
            >
              Export
            </button>
            <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
            </label>
          </div>
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}