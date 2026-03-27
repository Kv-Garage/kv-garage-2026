import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminLayout from "./layout";
import AdminGuard from "../components/AdminGuard";
import DashboardModeSwitch from "./components/DashboardModeSwitch";
import CJFeedGrid from "./components/CJFeedGrid";
import ImageUploadManager from "./components/ImageUploadManager";
import DashboardOverview from "./components/DashboardOverview";
import { supabase } from "../lib/supabase";
import { calculatePrice } from "../lib/pricing";
import { DEFAULT_SITE_SETTINGS } from "../lib/siteSettings";
import { autoCategorize, normalizeCategory } from "../lib/categories";
import { deriveTierPrices } from "../lib/serverPricing";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [mode, setMode] = useState("manual");
  const [url, setUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [cjProducts, setCjProducts] = useState([]);
  const [loadingCJ, setLoadingCJ] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cost: "",
    supplier_price: "",
    category: "glass",
    description: "",
    supplier: "cj",
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [users, setUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    stripe: { state: "checking", message: "Checking webhook logs...", timestamp: null },
    cj: { state: "checking", message: "Checking CJ feed...", timestamp: null },
    supabase: { state: "active", message: "Supabase queries responding.", timestamp: new Date().toISOString() },
  });
  const [metrics, setMetrics] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    applications: 0,
  });
  const [subscriberFilter, setSubscriberFilter] = useState("All");
  const [subscribers, setSubscribers] = useState([]);

  const categories = [
    "Watches",
    "Jewelry",
    "Nails & Beauty",
    "Skincare",
    "Sports & Apparel",
    "Glass & Devices",
    "Outdoor",
    "Christian Collection",
    "Essentials",
    "General",
  ];

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const loadOverviewMetrics = async () => {
      try {
        const [
          { data: orders },
          { data: products },
          { data: customers },
          { data: applications },
          { data: settings },
          { data: profiles },
          { data: webhookLogs },
          { data: subscribersData },
        ] = await Promise.all([
          supabase.from("orders").select("total,user_id"),
          supabase.from("products").select("id"),
          supabase.from("profiles").select("id"),
          supabase.from("applications").select("id"),
          supabase.from("site_settings").select("*").order("created_at", { ascending: true }).limit(1).maybeSingle(),
          supabase.from("profiles").select("id,email,full_name,role,created_at"),
          supabase.from("webhook_logs").select("type,error,created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("email_subscribers").select("*").order("subscribed_at", { ascending: false }).limit(100),
        ]);

        const revenue = (orders || []).reduce((sum, order) => sum + Number(order.total || 0), 0);

        setMetrics({
          revenue,
          orders: orders?.length || 0,
          products: products?.length || 0,
          customers: customers?.length || 0,
          applications: applications?.length || 0,
        });

        if (settings) {
          setSiteSettings((prev) => ({ ...prev, ...settings }));
        }

        const spendByUser = (orders || []).reduce((accumulator, order) => {
          const key = order.user_id;
          if (!key) return accumulator;
          accumulator[key] = (accumulator[key] || 0) + Number(order.total || 0);
          return accumulator;
        }, {});

        setUsers(
          (profiles || []).map((profile) => ({
            ...profile,
            is_active: true,
            totalSpend: spendByUser[profile.id] || 0,
          }))
        );
        setSubscribers(subscribersData || []);

        const stripeLog = (webhookLogs || []).find((log) => log.type?.includes("checkout") || log.type?.includes("signature"));
        setSystemStatus({
          stripe: stripeLog
            ? { state: "error", message: stripeLog.error, timestamp: stripeLog.created_at }
            : { state: "active", message: "Stripe webhook is active.", timestamp: new Date().toISOString() },
          cj: { state: "active", message: "CJ feed endpoint ready for imports.", timestamp: new Date().toISOString() },
          supabase: { state: "active", message: "Supabase queries responding.", timestamp: new Date().toISOString() },
        });
      } catch (error) {
        console.error("ADMIN DASHBOARD METRICS ERROR:", error);
      } finally {
        setMetricsLoading(false);
      }
    };

    loadOverviewMetrics();
  }, []);

  const generateSlug = (name) => {
    return name.toLowerCase().replaceAll(" ", "-");
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const previewImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previewImages]);
  };

  const addImageByUrl = (imageUrl) => {
    if (!imageUrl) return;

    setImages((prev) => [...prev, { id: Date.now() + Math.random(), url: imageUrl }]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
  };

  const saveProduct = async (data) => {
    const baseCost = Number(data.cost || data.supplier_price);

    const price = calculatePrice({
      cost: baseCost,
      quantity: 1,
      role: "retail",
      cartTotal: 0,
    });

    const payload = {
      ...data,
      slug: generateSlug(data.name),
      cost: baseCost,
      supplier_price: baseCost,
      price,
      ...deriveTierPrices({ retail_price: price }),
      image: data.image,
      images: data.images || [],
      category: data.category
        ? normalizeCategory(data.category, data.name)
        : autoCategorize(data.name, data.description),
      fulfillment_type: "dropship",
      inventory_count: 0,
      active: true,
    };

    const { error } = await supabase.from("products").insert([payload]);

    return error;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    if (!form.name) {
      setMessage("❌ Product name required");
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setMessage("❌ Add at least 1 image");
      setLoading(false);
      return;
    }

    const error = await saveProduct({
      ...form,
      image: images[0]?.url,
      images: images.map((image) => image.url),
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Product Added");
      setForm({
        name: "",
        cost: "",
        supplier_price: "",
        category: "glass",
        description: "",
        supplier: "cj",
      });
      setImages([]);
    }

    setLoading(false);
  };

  const handleUrlImport = async () => {
    setLoading(true);
    setMessage("");

    if (!url) {
      setMessage("❌ Missing URL");
      setLoading(false);
      return;
    }

    const data = {
      name: "Imported Product",
      description: `Imported from ${url}`,
      supplier: url.includes("dhgate") ? "dhgate" : "cj",
      category: "glass",
      supplier_price: 10,
      image: "https://via.placeholder.com/300",
      images: ["https://via.placeholder.com/300"],
    };

    const error = await saveProduct(data);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ URL Product Imported");
    }

    setLoading(false);
  };

  const handleBulkImport = async () => {
    setLoading(true);
    setMessage("");

    const urls = bulkUrls.split("\n").filter((item) => item.trim());

    for (const item of urls) {
      await saveProduct({
        name: "Bulk Product",
        description: `Imported from ${item}`,
        supplier: item.includes("dhgate") ? "dhgate" : "cj",
        category: "glass",
        supplier_price: 10,
        image: "https://via.placeholder.com/300",
        images: ["https://via.placeholder.com/300"],
      });
    }

    setMessage(`✅ Imported ${urls.length} products`);
    setLoading(false);
  };

  const fetchCJProducts = async () => {
    setLoadingCJ(true);

    const response = await fetch("/api/cj-test");
    const data = await response.json();

    if (data?.data?.list) {
      setCjProducts(data.data.list);
    }

    setLoadingCJ(false);
  };

  const handleImportCJ = async (product) => {
    try {
      setMessage("Importing product...");

      const response = await fetch("/api/cj-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cjProduct: product,
        }),
      });

      const result = await response.json();

      if (result.error) {
        console.error("IMPORT ERROR:", result);
        setMessage("❌ Import failed: " + result.error);
      } else {
        setMessage(`✅ ${result.message || "Imported from CJ Dropshipping successfully!"}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("IMPORT CRASH:", error);
      setMessage("❌ Server error during import");
    }
  };

  const saveSiteSettings = async () => {
    setSettingsSaving(true);
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      const payload = {
        ...siteSettings,
        markup_multiplier: Number(siteSettings.markup_multiplier || 3.2),
        updated_at: new Date().toISOString(),
      };

      const response = existing?.id
        ? await supabase.from("site_settings").update(payload).eq("id", existing.id)
        : await supabase.from("site_settings").insert([payload]);

      if (response.error) throw response.error;
      setMessage("✅ Site settings updated");
    } catch (error) {
      console.error(error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setSettingsSaving(false);
    }
  };

  const updateUser = async (id, updates) => {
    const nextUsers = users.map((user) => (user.id === id ? { ...user, ...updates } : user));
    setUsers(nextUsers);
    const { error } = await supabase.from("profiles").update(updates).eq("id", id);
    if (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const resyncCJCatalog = async () => {
    try {
      setMessage("Re-syncing CJ catalog...");
      await fetchCJProducts();
      setSystemStatus((prev) => ({
        ...prev,
        cj: { state: "active", message: "CJ catalog refreshed from supplier feed.", timestamp: new Date().toISOString() },
      }));
      setMessage("✅ CJ catalog re-sync started");
    } catch (error) {
      console.error(error);
      setSystemStatus((prev) => ({
        ...prev,
        cj: { state: "error", message: error.message, timestamp: new Date().toISOString() },
      }));
      setMessage(`❌ ${error.message}`);
    }
  };

  const updateSubscriber = async (id, updates) => {
    setSubscribers((prev) => prev.map((subscriber) => (subscriber.id === id ? { ...subscriber, ...updates } : subscriber)));
    const { error } = await supabase.from("email_subscribers").update(updates).eq("id", id);
    if (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const exportSubscribersCsv = () => {
    const rows = [["Email", "First Name", "Interest", "Source", "Subscribed", "Active"]];
    filteredSubscribers.forEach((subscriber) => {
      rows.push([
        subscriber.email || "",
        subscriber.first_name || "",
        subscriber.interest || "",
        subscriber.source || "",
        subscriber.subscribed_at || "",
        subscriber.is_active === false ? "false" : "true",
      ]);
    });

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kv-garage-email-subscribers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriberFilter === "All" ? true : subscriber.interest === subscriberFilter
  );

  return (
    <AdminGuard>
      <AdminLayout
        title="Admin Dashboard"
        description="Executive visibility across commerce, catalog, customers, and supplier operations."
      >
        <div className="rounded-[24px] border border-white/10 bg-[#05070D] p-6 text-white shadow-2xl shadow-black/20">
        <DashboardOverview
          metrics={metrics}
          metricsLoading={metricsLoading}
          activeModeLabel={mode === "manual" ? "Manual Add" : mode === "cj" ? "CJ Dropshipping" : mode}
          onOpenCJ={() => {
            setMode("cj");
            fetchCJProducts();
          }}
          onOpenManual={() => setMode("manual")}
        />

        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
              Operations Workspace
            </p>
            <h1 className="mt-2 text-2xl text-[#D4AF37]">KV Product System (CJ Connected)</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#94A3B8]">
              Use this workspace to add products manually, manage supplier imports, and keep catalog execution moving.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[300px]">
            <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Applications</p>
              <p className="mt-1.5 text-xl font-semibold text-white">
                {metricsLoading ? "..." : metrics.applications}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Current Mode</p>
              <p className="mt-1.5 text-xl font-semibold text-white">
                {mode === "manual" ? "Manual Add" : mode === "cj" ? "CJ Feed" : mode}
              </p>
            </div>
          </div>
        </div>

        <DashboardModeSwitch mode={mode} setMode={setMode} />

        {mode === "cj" && (
          <div className="rounded-[22px] border border-white/10 bg-[#0B1020] p-4 shadow-xl shadow-black/20">
            <CJFeedGrid
              loadingCJ={loadingCJ}
              cjProducts={cjProducts}
              onImport={handleImportCJ}
            />
          </div>
        )}

        {mode === "url" && (
          <div className="mb-6 rounded-[22px] border border-white/10 bg-[#0B1020] p-4 shadow-xl shadow-black/20">
            <input
              placeholder="Paste CJ / DHGate URL"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="mb-4 w-full rounded-lg bg-[#111827] p-3"
            />
            <button onClick={handleUrlImport}>Import Product</button>
          </div>
        )}

        {mode === "bulk" && (
          <div className="mb-6 rounded-[22px] border border-white/10 bg-[#0B1020] p-4 shadow-xl shadow-black/20">
            <textarea
              placeholder="Paste URLs (1 per line)"
              value={bulkUrls}
              onChange={(event) => setBulkUrls(event.target.value)}
              className="mb-4 w-full rounded-lg bg-[#111827] p-3"
            />
            <button onClick={handleBulkImport}>Import Bulk</button>
          </div>
        )}

        {mode === "manual" && (
          <div className="rounded-[22px] border border-white/10 bg-[#0B1020] p-4 shadow-xl shadow-black/20">
            <div className="mb-4 flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
                Catalog Creation
              </p>
              <h2 className="text-xl font-semibold text-white">Add products manually</h2>
              <p className="text-sm text-[#94A3B8]">
                Create new catalog entries with supplier pricing, category assignment, and image setup.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="rounded-lg bg-[#111827] px-4 py-3"
              />

              <input
                name="supplier_price"
                placeholder="Supplier Price"
                value={form.supplier_price}
                onChange={handleChange}
                className="rounded-lg bg-[#111827] px-4 py-3"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="rounded-lg bg-[#111827] px-4 py-3"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="col-span-2 rounded-lg bg-[#111827] px-4 py-3"
              />
            </div>
          </div>
        )}

        <ImageUploadManager
          mode={mode}
          handleImageUpload={handleImageUpload}
          addImageByUrl={addImageByUrl}
          images={images}
          removeImage={removeImage}
        />

        {mode === "manual" && (
          <button
            onClick={handleSubmit}
            className="mt-10 rounded-lg bg-[#D4AF37] px-10 py-3 text-black"
          >
            {loading ? "Processing..." : "Add Product"}
          </button>
        )}

        {message && <p className="mt-6">{message}</p>}

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          <div className="rounded-[22px] border border-white/10 bg-[#0B1020] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
              Site Settings
            </p>
            <div className="mt-4 space-y-3">
              <input value={siteSettings.site_name || ""} onChange={(event) => setSiteSettings((prev) => ({ ...prev, site_name: event.target.value }))} placeholder="Site name" className="w-full rounded-lg bg-[#111827] px-4 py-3 text-sm" />
              <input value={siteSettings.tagline || ""} onChange={(event) => setSiteSettings((prev) => ({ ...prev, tagline: event.target.value }))} placeholder="Tagline" className="w-full rounded-lg bg-[#111827] px-4 py-3 text-sm" />
              <input value={siteSettings.logo_url || ""} onChange={(event) => setSiteSettings((prev) => ({ ...prev, logo_url: event.target.value }))} placeholder="Logo URL" className="w-full rounded-lg bg-[#111827] px-4 py-3 text-sm" />
              <div className="grid gap-3 md:grid-cols-2">
                <input value={siteSettings.markup_multiplier || ""} onChange={(event) => setSiteSettings((prev) => ({ ...prev, markup_multiplier: event.target.value }))} placeholder="Markup multiplier" className="w-full rounded-lg bg-[#111827] px-4 py-3 text-sm" />
                <input value={siteSettings.default_currency || ""} onChange={(event) => setSiteSettings((prev) => ({ ...prev, default_currency: event.target.value }))} placeholder="Default currency" className="w-full rounded-lg bg-[#111827] px-4 py-3 text-sm" />
              </div>
              <button onClick={saveSiteSettings} disabled={settingsSaving} className="rounded-lg bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-black">
                {settingsSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[#0B1020] p-5 xl:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
              User Management
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-[#94A3B8]">
                  <tr>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Join Date</th>
                    <th className="pb-3">Total Spend</th>
                    <th className="pb-3">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 12).map((user) => (
                    <tr key={user.id} className="border-t border-white/5">
                      <td className="py-3">
                        <div className="font-medium text-white">{user.full_name || "KV User"}</div>
                        <div className="text-xs text-[#64748B]">{user.email}</div>
                      </td>
                      <td className="py-3">
                        <select value={user.role || "retail"} onChange={(event) => updateUser(user.id, { role: event.target.value })} className="rounded-lg bg-[#111827] px-3 py-2 text-sm">
                          {["retail", "wholesale", "student", "admin"].map((roleOption) => (
                            <option key={roleOption} value={roleOption}>
                              {roleOption}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 text-[#CBD5E1]">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</td>
                      <td className="py-3 text-white">${Number(user.totalSpend || 0).toFixed(2)}</td>
                      <td className="py-3">
                        <label className="inline-flex items-center gap-2 text-sm text-white">
                          <input type="checkbox" checked={user.is_active !== false} onChange={(event) => updateUser(user.id, { is_active: event.target.checked })} />
                          {user.is_active !== false ? "Active" : "Inactive"}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[22px] border border-white/10 bg-[#0B1020] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
                Automated Systems
              </p>
              <p className="mt-2 max-w-2xl text-sm text-[#94A3B8]">
                Monitor core platform connections and re-run supplier synchronization without leaving the command center.
              </p>
            </div>
            <button onClick={resyncCJCatalog} className="rounded-lg bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-black">
              Re-sync CJ Catalog
            </button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {Object.entries(systemStatus).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-white/10 bg-[#111827] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold capitalize text-white">{key}</p>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${value.state === "active" ? "bg-emerald-500/15 text-emerald-300" : value.state === "error" ? "bg-rose-500/15 text-rose-300" : "bg-white/10 text-[#CBD5E1]"}`}>
                    {value.state}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#CBD5E1]">{value.message}</p>
                <p className="mt-2 text-xs text-[#64748B]">
                  {value.timestamp ? new Date(value.timestamp).toLocaleString() : "No timestamp"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[22px] border border-white/10 bg-[#0B1020] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
                Email Subscribers
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Total Subscribers</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{subscribers.length}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={subscriberFilter}
                onChange={(event) => setSubscriberFilter(event.target.value)}
                className="rounded-lg bg-[#111827] px-4 py-3 text-sm text-white"
              >
                {["All", "Wholesale", "Retail Deals", "Mentorship", "All of the Above"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button onClick={exportSubscribersCsv} className="rounded-lg bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-black">
                Export to CSV
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-[#94A3B8]">
                <tr>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">First Name</th>
                  <th className="pb-3">Interest</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Subscribed</th>
                  <th className="pb-3">Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-t border-white/5">
                    <td className="py-3 text-white">{subscriber.email}</td>
                    <td className="py-3 text-[#CBD5E1]">{subscriber.first_name || "—"}</td>
                    <td className="py-3 text-[#CBD5E1]">{subscriber.interest || "All of the Above"}</td>
                    <td className="py-3 text-[#CBD5E1]">{subscriber.source || "footer"}</td>
                    <td className="py-3 text-[#CBD5E1]">
                      {subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3">
                      <label className="inline-flex items-center gap-2 text-sm text-white">
                        <input
                          type="checkbox"
                          checked={subscriber.is_active !== false}
                          onChange={(event) => updateSubscriber(subscriber.id, { is_active: event.target.checked })}
                        />
                        {subscriber.is_active !== false ? "Subscribed" : "Inactive"}
                      </label>
                    </td>
                  </tr>
                ))}
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sm text-[#64748B]">
                      No subscribers in this segment yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
