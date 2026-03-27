import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
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
import { ADMIN_PRODUCT_FIELDS, getPrimaryProductImage, isProductVisible } from "../../lib/productFields";
import { autoCategorize, CATEGORY_ORDER, normalizeCategory } from "../../lib/categories";
import { deriveTierPrices } from "../../lib/serverPricing";

function buildEmptyProduct() {
  return {
    name: "",
    slug: "",
    price: "",
    retail_price: "",
    wholesale_price: "",
    student_price: "",
    compare_price: "",
    supplier_cost: "",
    description: "",
    images: [],
    variants: [],
    category: "",
    top_pick: false,
    active: true,
    meta_title: "",
    meta_description: "",
    supplier: "manual",
    inventory_count: 0,
  };
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [draft, setDraft] = useState(buildEmptyProduct());
  const [newImageUrl, setNewImageUrl] = useState("");
  const page = Math.max(1, Number(searchParams?.get('page')) || 1);
  const pageSize = 20;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error: queryError, count } = await supabase
          .from("products")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (queryError) throw queryError;
        setProducts(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error(err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page]);

  const activeProducts = products.filter((product) => isProductVisible(product)).length;
  const topPicks = products.filter((product) => product.top_pick).length;
  const lowInventory = products.filter((product) => Number(product.inventory_count || 0) <= 5).length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const toggleTopPick = async (productId, currentValue) => {
    const nextValue = !currentValue;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, top_pick: nextValue } : product
      )
    );

    const { error: updateError } = await supabase
      .from("products")
      .update({ top_pick: nextValue })
      .eq("id", productId);

    if (updateError) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, top_pick: currentValue } : product
        )
      );
      setError("Could not update top pick.");
    }
  };

  const openCreatePanel = () => {
    setEditingProductId(null);
    setDraft(buildEmptyProduct());
    setPanelOpen(true);
    setError("");
  };

  const openEditPanel = async (productId) => {
    setError("");
    setLoading(true);
    
    try {
      const { data, error: loadError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (loadError || !data) {
        setError("Could not load product details.");
        return;
      }

      setEditingProductId(productId);
      setDraft({
        ...buildEmptyProduct(),
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        variants: Array.isArray(data.variants) ? data.variants : [],
        is_active: typeof data.is_active === "boolean" ? data.is_active : data.active !== false,
        active: data.active !== false,
      });
      setPanelOpen(true);
    } catch (error) {
      console.error("Error loading product:", error);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...draft,
        slug: draft.slug || slugify(draft.name),
        price: Number(draft.price || 0),
        retail_price: Number(draft.retail_price || draft.price || 0),
        wholesale_price: draft.wholesale_price ? Number(draft.wholesale_price) : null,
        student_price: draft.student_price ? Number(draft.student_price) : null,
        compare_price: draft.compare_price ? Number(draft.compare_price) : null,
        supplier_cost: draft.supplier_cost ? Number(draft.supplier_cost) : null,
        image: draft.images?.[0] || null,
        images: draft.images || [],
        variants: draft.variants || [],
        category: draft.category
          ? normalizeCategory(draft.category, draft.name)
          : autoCategorize(draft.name, draft.description),
        active: Boolean(draft.is_active),
        inventory_count: Number(draft.inventory_count || 0),
      };

      const tierPrices = deriveTierPrices(payload);
      payload.retail_price = tierPrices.retail_price;
      payload.wholesale_price = payload.wholesale_price || tierPrices.wholesale_price;
      payload.student_price = payload.student_price || tierPrices.student_price;
      payload.price = payload.retail_price;

      const attemptSave = async (nextPayload) => {
        if (editingProductId) {
          return supabase.from("products").update(nextPayload).eq("id", editingProductId).select("id").single();
        }
        return supabase.from("products").insert([nextPayload]).select("id").single();
      };

      let response = await attemptSave(payload);

      while (response.error) {
        const missingColumn = String(response.error.message || "").match(/Could not find the '([^']+)' column/i)?.[1];
        if (!missingColumn || payload[missingColumn] === undefined) {
          break;
        }
        delete payload[missingColumn];
        response = await attemptSave(payload);
      }

      if (response.error) throw response.error;

      // Success: Close panel and reset state
      setPanelOpen(false);
      setEditingProductId(null);
      setDraft(buildEmptyProduct());
      setNewImageUrl("");
      
      // Refresh data with optimistic update
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, count } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
      setProducts(data || []);
      setTotalCount(count || 0);
      
      // Trigger frontend revalidation for product pages
      if (editingProductId) {
        try {
          await fetch(`/api/revalidate-product?productId=${editingProductId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (revalError) {
          console.warn('Product revalidation failed:', revalError);
        }
      }
      
      // Show success message
      setError("Product saved successfully!");
      setTimeout(() => setError(""), 3000);
    } catch (saveError) {
      console.error(saveError);
      setError(saveError.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  // Add cancel function to properly reset state
  const cancelEdit = () => {
    setPanelOpen(false);
    setEditingProductId(null);
    setDraft(buildEmptyProduct());
    setNewImageUrl("");
    setError("");
  };

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());
    router.push(`${router.pathname}?${params.toString()}`);
  };

  const stockStatusLabel = (inventoryCount) => {
    const value = Number(inventoryCount || 0);
    if (value <= 0) return "Out of Stock";
    if (value <= 5) return "Low Stock";
    return "In Stock";
  };

  const updateVariant = (index, key, value) => {
    setDraft((prev) => {
      const nextVariants = [...prev.variants];
      nextVariants[index] = { ...nextVariants[index], [key]: value };
      return { ...prev, variants: nextVariants };
    });
  };

  const retailMargin = draft.retail_price && draft.supplier_cost
    ? (((Number(draft.retail_price) - Number(draft.supplier_cost)) / Number(draft.retail_price)) * 100).toFixed(1)
    : null;
  const wholesaleMargin = draft.wholesale_price && draft.supplier_cost
    ? (((Number(draft.wholesale_price) - Number(draft.supplier_cost)) / Number(draft.wholesale_price)) * 100).toFixed(1)
    : null;
  const studentMargin = draft.student_price && draft.supplier_cost
    ? (((Number(draft.student_price) - Number(draft.supplier_cost)) / Number(draft.student_price)) * 100).toFixed(1)
    : null;

  return (
    <AdminGuard>
      <AdminLayout title="Products" description="Catalog operations, merchandising, inventory visibility, and direct editing.">
        <AdminPageShell
          eyebrow="Catalog"
          title="Products"
          description="Review the live product catalog, manage merchandising status, and edit full product records without leaving the panel."
          actions={
            <button
              onClick={openCreatePanel}
              className="rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black"
            >
              New Product
            </button>
          }
        >
          {error ? <AdminErrorState message={error} /> : null}

          {loading ? (
            <AdminLoadingState label="Loading products..." />
          ) : products.length === 0 ? (
            <AdminEmptyState
              title="No products found"
              description="Products from the `products` table will populate here once they are available in the catalog."
            />
          ) : (
            <>
              <AdminStatGrid>
                <AdminMetricCard label="Catalog Size" value={products.length} hint="Total products in current page" />
                <AdminMetricCard label="Active Products" value={activeProducts} hint="Currently visible inventory" />
                <AdminMetricCard label="Top Picks" value={topPicks} hint="Merchandising highlights" />
                <AdminMetricCard label="Low Inventory" value={lowInventory} hint="Products at or below 5 units" />
              </AdminStatGrid>

              <AdminTableCard>
                <AdminSectionHeader
                  title="Catalog overview"
                  description="Product records scoped only to the `products` table with editable tier pricing and visibility controls."
                />
                <AdminDataTable columns={["Product", "Retail", "Wholesale", "Student", "Supplier Cost", "Category", "Status", "Edit"]}>
                  {products.map((product) => {
                    const image = getPrimaryProductImage(product);
                    const visible = isProductVisible(product);
                    const retail = Number(product.retail_price || product.price || 0);
                    const wholesale = Number(product.wholesale_price || retail * 0.7 || 0);
                    const student = Number(product.student_price || retail * 0.8 || 0);
                    const supplierCost = Number(product.supplier_cost || 0);
                    const margin = retail > 0 && supplierCost > 0 ? (((retail - supplierCost) / retail) * 100).toFixed(1) : null;
                    return (
                      <tr key={product.id} className={`border-t border-white/5 ${visible ? "" : "opacity-55"}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {image && image !== "/placeholder.jpg" ? (
                              <img
                                src={image}
                                alt={product.name || "Product"}
                                className="h-10 w-10 rounded-xl object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xs text-[#94A3B8]">
                                IMG
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-white">{product.name || "Untitled product"}</div>
                              <div className="mt-1 text-xs text-[#64748B]">{product.category || "Uncategorized"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">${retail.toFixed(2)}</td>
                        <td className="px-6 py-4 text-white">${wholesale.toFixed(2)}</td>
                        <td className="px-6 py-4 text-white">${student.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="text-red-300">${supplierCost.toFixed(2)}</div>
                          <div className="mt-1 text-xs text-[#64748B]">{margin ? `${margin}% margin` : "No cost set"}</div>
                        </td>
                        <td className="px-6 py-4">{product.category || "General"}</td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <AdminStatusBadge tone={visible ? "success" : "muted"}>
                              {visible ? "Visible" : "Hidden"}
                            </AdminStatusBadge>
                            <button
                              onClick={() => toggleTopPick(product.id, Boolean(product.top_pick))}
                              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                product.top_pick ? "bg-[#D4AF37] text-black" : "bg-white/5 text-white"
                              }`}
                            >
                              {product.top_pick ? "Top Pick On" : "Top Pick Off"}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openEditPanel(product.id)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </AdminDataTable>
                {totalPages > 1 ? (
                  <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-sm text-[#94A3B8]">
                    <span>Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                      <button onClick={() => goToPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40">
                        Previous
                      </button>
                      <button onClick={() => goToPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40">
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}
              </AdminTableCard>
            </>
          )}
        </AdminPageShell>

        {panelOpen ? (
          <div className="fixed inset-0 z-[120] bg-black/60 p-4">
            <div className="mx-auto h-[calc(100vh-2rem)] max-w-6xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0F172A] p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
                    {editingProductId ? "Edit Product" : "Create Product"}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {draft.name || "Product Editor"}
                  </h2>
                </div>
                <button onClick={() => setPanelOpen(false)} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white">
                  Close
                </button>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="space-y-4">
                  <label className="block text-sm">
                    <span className="mb-2 block text-[#CBD5E1]">Name</span>
                    <input 
                      value={draft.name || ""} 
                      onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} 
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Retail Price — public customers</span>
                      <input 
                        type="number" 
                        value={draft.retail_price || draft.price || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, retail_price: event.target.value, price: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Wholesale Price — account holders</span>
                      <input 
                        type="number" 
                        value={draft.wholesale_price || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, wholesale_price: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Student Price — enrolled students</span>
                      <input 
                        type="number" 
                        value={draft.student_price || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, student_price: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Compare At Price — shown as crossed-out original price</span>
                      <input 
                        type="number" 
                        value={draft.compare_price || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, compare_price: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Supplier Cost — INTERNAL ONLY, never shown to customers</span>
                      <input 
                        type="number" 
                        value={draft.supplier_cost || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, supplier_cost: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#F8E8A6]">
                    <span>Retail Margin: {retailMargin ? `${retailMargin}%` : "N/A"}</span>
                    <span>|</span>
                    <span>Wholesale Margin: {wholesaleMargin ? `${wholesaleMargin}%` : "N/A"}</span>
                    <span>|</span>
                    <span>Student Margin: {studentMargin ? `${studentMargin}%` : "N/A"}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const tiers = deriveTierPrices({
                          retail_price: Number(draft.retail_price || draft.price || 0),
                        });
                        setDraft((prev) => ({
                          ...prev,
                          price: tiers.retail_price,
                          retail_price: tiers.retail_price,
                          wholesale_price: tiers.wholesale_price,
                          student_price: tiers.student_price,
                        }));
                      }}
                      className="rounded-lg bg-[#D4AF37] px-3 py-1.5 text-xs font-semibold text-black"
                    >
                      Auto-Calculate Tiers
                    </button>
                  </div>
                  <label className="block text-sm">
                    <span className="mb-2 block text-[#CBD5E1]">Description (HTML supported)</span>
                    <textarea 
                      value={draft.description || ""} 
                      onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))} 
                      rows={8} 
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Category</span>
                      <select 
                        value={draft.category || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                      >
                        <option value="">General</option>
                        {CATEGORY_ORDER.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Slug</span>
                      <input 
                        value={draft.slug || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Meta Title</span>
                      <input 
                        value={draft.meta_title || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, meta_title: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Meta Description</span>
                      <input 
                        value={draft.meta_description || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, meta_description: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                      <input 
                        type="checkbox" 
                        checked={Boolean(draft.top_pick)} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, top_pick: event.target.checked }))} 
                      />
                      Top Pick
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                      <input 
                        type="checkbox" 
                        checked={Boolean(draft.is_active)} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, is_active: event.target.checked, active: event.target.checked }))} 
                      />
                      Visible on Storefront
                    </label>
                    <label className="block text-sm">
                      <span className="mb-2 block text-[#CBD5E1]">Inventory Count</span>
                      <input 
                        type="number" 
                        value={draft.inventory_count || ""} 
                        onChange={(event) => setDraft((prev) => ({ ...prev, inventory_count: event.target.value }))} 
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" 
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Images</h3>
                      <div className="flex gap-2">
                        <input 
                          value={newImageUrl} 
                          onChange={(event) => setNewImageUrl(event.target.value)} 
                          placeholder="Paste image URL" 
                          className="rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-white" 
                        />
                        <button
                          onClick={() => {
                            if (!newImageUrl.trim()) return;
                            setDraft((prev) => ({ ...prev, images: [...(prev.images || []), newImageUrl.trim()] }));
                            setNewImageUrl("");
                          }}
                          className="rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="mb-4 p-4 border border-white/20 rounded-lg bg-white/5">
                      <p className="text-sm text-gray-300 mb-2">Upload Images</p>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(event) => {
                            const files = Array.from(event.target.files || []);
                            if (files.length > 0) {
                              // For now, just show a message since we don't have a file upload endpoint
                              alert("File upload would require a server endpoint. For now, please use the URL input above to add images.");
                            }
                          }}
                          className="text-sm text-gray-300"
                        />
                        <button
                          onClick={() => {
                            alert("File upload would require a server endpoint. For now, please use the URL input above to add images.");
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                        >
                          Upload
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Tip: Upload images to your preferred hosting service (Cloudinary, S3, etc.) and paste the URLs above.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {(draft.images || []).map((image, index) => (
                        <div key={`${image}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1020] p-3">
                          <img src={image} alt={`Product ${index + 1}`} className="h-12 w-12 rounded-xl object-cover" />
                          <input
                            value={image || ""}
                            onChange={(event) =>
                              setDraft((prev) => {
                                const nextImages = [...(prev.images || [])];
                                nextImages[index] = event.target.value;
                                return { ...prev, images: nextImages };
                              })
                            }
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setDraft((prev) => {
                                  const nextImages = [...(prev.images || [])];
                                  if (index > 0) {
                                    [nextImages[index - 1], nextImages[index]] = [nextImages[index], nextImages[index - 1]];
                                  }
                                  return { ...prev, images: nextImages };
                                })
                              }
                              className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() =>
                                setDraft((prev) => {
                                  const nextImages = [...(prev.images || [])];
                                  if (index < nextImages.length - 1) {
                                    [nextImages[index + 1], nextImages[index]] = [nextImages[index], nextImages[index + 1]];
                                  }
                                  return { ...prev, images: nextImages };
                                })
                              }
                              className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() =>
                                setDraft((prev) => ({
                                  ...prev,
                                  images: (prev.images || []).filter((_, imageIndex) => imageIndex !== index),
                                }))
                              }
                              className="rounded-lg border border-red-400/30 px-2 py-1 text-xs text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Variants</h3>
                      <button
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            variants: [...(prev.variants || []), { option1: "", option2: "", sku: "", price: "" }],
                          }))
                        }
                        className="rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black"
                      >
                        Add Variant
                      </button>
                    </div>
                  <div className="space-y-3">
                    {(draft.variants || []).map((variant, index) => (
                      <div key={`${variant.sku || "variant"}-${index}`} className="grid gap-3 rounded-xl border border-white/10 bg-[#0B1020] p-3 md:grid-cols-5">
                        <input 
                          value={variant.option1 || ""} 
                          onChange={(event) => updateVariant(index, "option1", event.target.value)} 
                          placeholder="Size / Option" 
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" 
                        />
                        <input 
                          value={variant.option2 || ""} 
                          onChange={(event) => updateVariant(index, "option2", event.target.value)} 
                          placeholder="Color / Option" 
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" 
                        />
                        <input 
                          value={variant.sku || ""} 
                          onChange={(event) => updateVariant(index, "sku", event.target.value)} 
                          placeholder="SKU" 
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" 
                        />
                        <input 
                          value={variant.price || ""} 
                          onChange={(event) => updateVariant(index, "price", event.target.value)} 
                          placeholder="Price" 
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" 
                        />
                        <button
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              variants: (prev.variants || []).filter((_, variantIndex) => variantIndex !== index),
                            }))
                          }
                          className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={cancelEdit} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white">
                  Cancel
                </button>
                <button onClick={saveProduct} disabled={saving} className="rounded-xl bg-[#D4AF37] px-5 py-2 text-sm font-semibold text-black disabled:opacity-50">
                  {saving ? "Saving..." : editingProductId ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </AdminLayout>
    </AdminGuard>
  );
}
