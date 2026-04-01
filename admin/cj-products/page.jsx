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

export const dynamic = 'force-dynamic';

export default function AdminCJProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
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
          .eq("supplier", "cj")
          .order("created_at", { ascending: false })
          .range(from, to);

        if (queryError) throw queryError;
        setProducts(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error(err);
        setError("Could not load CJ products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page]);

  const activeProducts = products.filter(p => p.active).length;
  const hiddenProducts = products.filter(p => !p.active).length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const updateProduct = async (productId, updates, actionName = "update") => {
    setActionLoading(true);
    const currentProducts = [...products];
    
    try {
      // Optimistic update
      setProducts((prev) => prev.map((product) => 
        product.id === productId ? { ...product, ...updates } : product
      ));

      const { error: updateError } = await supabase
        .from("products")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", productId);

      if (updateError) {
        setProducts(currentProducts);
        setError(`Failed to ${actionName} product: ${updateError.message}`);
        return false;
      }

      setSuccess(`Product successfully ${actionName}!`);
      setTimeout(() => setSuccess(""), 3000);
      return true;
    } catch (err) {
      setProducts(currentProducts);
      setError(`Error: ${err.message}`);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    setConfirmDialog({
      type: 'delete',
      productId,
      productName,
      message: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
    });
  };

  const confirmDelete = async () => {
    if (!confirmDialog || confirmDialog.type !== 'delete') return;
    
    setActionLoading(true);
    const productId = confirmDialog.productId;
    const currentProducts = [...products];
    
    try {
      setProducts((prev) => prev.filter(p => p.id !== productId));

      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) {
        setProducts(currentProducts);
        setError(`Failed to delete product: ${deleteError.message}`);
        return;
      }

      setSuccess("Product successfully deleted!");
      setTimeout(() => setSuccess(""), 3000);
      setConfirmDialog(null);
    } catch (err) {
      setProducts(currentProducts);
      setError(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHideShow = async (productId, productName, currentStatus) => {
    const action = currentStatus ? "hide" : "show";
    setConfirmDialog({
      type: action,
      productId,
      productName,
      message: `Are you sure you want to ${action} "${productName}"? The product will be ${currentStatus ? "hidden from the store" : "visible in the store"}.`,
    });
  };

  const confirmHideShow = async () => {
    if (!confirmDialog || (confirmDialog.type !== 'hide' && confirmDialog.type !== 'show')) return;
    
    const productId = confirmDialog.productId;
    const newStatus = confirmDialog.type === 'hide' ? false : true;
    await updateProduct(productId, { active: newStatus }, confirmDialog.type === 'hide' ? 'hidden' : 'shown');
    setConfirmDialog(null);
  };

  const handlePriceUpdate = async (productId, productName, currentPrice) => {
    const newPrice = prompt(`Enter new price for "${productName}":`, String(currentPrice || ""));
    if (newPrice === null) return;
    
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      setError("Please enter a valid price.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setConfirmDialog({
      type: 'price',
      productId,
      productName,
      message: `Change price from $${Number(currentPrice || 0).toFixed(2)} to $${price.toFixed(2)}?`,
      updates: { price },
    });
  };

  const confirmPriceUpdate = async () => {
    if (!confirmDialog || confirmDialog.type !== 'price') return;
    await updateProduct(confirmDialog.productId, confirmDialog.updates, 'price updated');
    setConfirmDialog(null);
  };

  const handleDescriptionUpdate = async (productId, productName, currentDescription) => {
    const newDescription = prompt(`Enter new description for "${productName}":`, currentDescription || "");
    if (newDescription === null) return;

    setConfirmDialog({
      type: 'description',
      productId,
      productName,
      message: `Update description for "${productName}"?`,
      updates: { description: newDescription },
    });
  };

  const confirmDescriptionUpdate = async () => {
    if (!confirmDialog || confirmDialog.type !== 'description') return;
    await updateProduct(confirmDialog.productId, confirmDialog.updates, 'description updated');
    setConfirmDialog(null);
  };

  const cancelDialog = () => {
    setConfirmDialog(null);
  };

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());
    router.push(`${router.pathname}?${params.toString()}`);
  };

  return (
    <AdminGuard>
      <AdminLayout title="CJ Products" description="Manage CJ Dropshipping products with full backend control">
        <AdminPageShell
          eyebrow="CJ Dropshipping"
          title="Product Management"
          description="Full backend control for CJ products. Add, edit, hide, and manage all product details including titles, descriptions, prices, and images."
        >
          {error && <AdminErrorState message={error} />}
          {success && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-300 font-semibold">
              ✅ {success}
            </div>
          )}

          {loading ? (
            <AdminLoadingState label="Loading CJ products..." />
          ) : products.length === 0 ? (
            <AdminEmptyState
              title="No CJ Products"
              description="No CJ Dropshipping products found. Use the CLI tool to add products."
            />
          ) : (
            <>
              <AdminStatGrid>
                <AdminMetricCard label="Total CJ Products" value={totalCount} hint="All CJ products in catalog" />
                <AdminMetricCard label="Active Products" value={activeProducts} hint="Visible in store" />
                <AdminMetricCard label="Hidden Products" value={hiddenProducts} hint="Hidden from store" />
                <AdminMetricCard label="Dropship Ready" value="100%" hint="All products fulfill automatically" />
              </AdminStatGrid>

              <AdminTableCard>
                <AdminSectionHeader
                  title="CJ Products"
                  description="Complete backend control for CJ Dropshipping products. Manage visibility, pricing, descriptions, and all product details."
                />
                <AdminDataTable columns={["Product", "Status", "Price", "Category", "CJ ID", "Actions"]}>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-white/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden">
                            <img 
                              src={product.images?.[0] || "/placeholder.jpg"} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">{product.name}</div>
                            <div className="text-sm text-gray-400">{product.slug}</div>
                            {product.description && (
                              <div className="text-sm text-gray-300 mt-1 line-clamp-2">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <AdminStatusBadge status={product.active ? 'active' : 'hidden'} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">${Number(product.price || 0).toFixed(2)}</div>
                        {product.supplier_price && (
                          <div className="text-sm text-gray-400">
                            Cost: ${Number(product.supplier_price).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white">{product.category || "General"}</td>
                      <td className="px-6 py-4 text-[#94A3B8]">{product.cj_product_id || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/admin/cj-products/edit/${product.id}`)}
                            className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-sm font-semibold hover:bg-[#D4AF37]/30"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleHideShow(product.id, product.name, product.active)}
                            disabled={actionLoading}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                              product.active 
                                ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30" 
                                : "bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                            } disabled:opacity-50`}
                          >
                            {product.active ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-red-600/20 text-red-300 border border-red-600/30 rounded-lg text-sm font-semibold hover:bg-red-600/30 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AdminDataTable>
                {totalPages > 1 ? (
                  <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-sm text-[#94A3B8]">
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => goToPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => goToPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}
              </AdminTableCard>

              {/* Confirmation Dialog */}
              {confirmDialog && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#1a1a2e] border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">
                      {confirmDialog.type === 'delete' && '⚠️ Delete Product'}
                      {confirmDialog.type === 'hide' && '🙈 Hide Product'}
                      {confirmDialog.type === 'show' && '👁️ Show Product'}
                      {confirmDialog.type === 'price' && '💰 Update Price'}
                      {confirmDialog.type === 'description' && '📝 Update Description'}
                    </h3>
                    
                    <p className="text-gray-300 mb-6">{confirmDialog.message}</p>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          if (confirmDialog.type === 'delete') confirmDelete();
                          else if (confirmDialog.type === 'hide' || confirmDialog.type === 'show') confirmHideShow();
                          else if (confirmDialog.type === 'price') confirmPriceUpdate();
                          else if (confirmDialog.type === 'description') confirmDescriptionUpdate();
                        }}
                        disabled={actionLoading}
                        className="flex-1 px-6 py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg font-semibold hover:bg-green-500/30 disabled:opacity-50"
                      >
                        {actionLoading ? 'Processing...' : 'Confirm'}
                      </button>
                      <button
                        onClick={cancelDialog}
                        disabled={actionLoading}
                        className="flex-1 px-6 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CLI Instructions */}
              <div className="mt-8 bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">CJ Product Management CLI</h3>
                <p className="text-gray-300 mb-6">Use these commands to manage CJ products from the command line:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="font-semibold mb-3 text-[#D4AF37]">Product Management</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div><span className="text-green-400">node scripts/cj-product-manager.cjs add 12345</span> - Add new product</div>
                      <div><span className="text-green-400">node scripts/cj-product-manager.cjs update 12345</span> - Update from API</div>
                      <div><span className="text-green-400">node scripts/cj-product-manager.cjs remove 12345</span> - Remove product</div>
                      <div><span className="text-green-400">node scripts/cj-product-manager.cjs hide 12345</span> - Hide product</div>
                      <div><span className="text-green-400">node scripts/cj-product-manager.cjs show 12345</span> - Show product</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="font-semibold mb-3 text-[#D4AF37]">Information & Updates</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div><span className="text-green-400">node scripts/cj-product-manager.cjs list</span> - List all CJ products</div>
                      <div><span className="text-green-400">node scripts/cj-product-manager.cjs update-details 12345 name "New Name"</span> - Update field</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}