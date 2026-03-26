import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../layout";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminMetricCard,
  AdminPageShell,
  AdminTableCard,
} from "../../components/admin/AdminPageShell";
import { AdminSectionHeader, AdminStatGrid } from "../../components/admin/AdminPrimitives";
import { normalizeCJProduct } from "../../lib/cjProduct";

export default function AdminCJPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCJProducts = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/cj-test");
      const payload = await response.json();
      setProducts(payload?.data?.list || []);
    } catch (err) {
      console.error(err);
      setError("Could not load CJ feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCJProducts();
  }, []);

  const importProduct = async (cjProduct) => {
    setMessage("");

    try {
      const response = await fetch("/api/cj-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cjProduct }),
      });

      const payload = await response.json();

      if (payload.error) {
        throw new Error(payload.error);
      }

      setMessage(payload.message || "Imported from CJ Dropshipping successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Import failed.");
    }
  };

  return (
    <AdminGuard>
      <AdminLayout title="CJ Import" description="Supplier feed intake and product import workflow.">
        <AdminPageShell
          eyebrow="Sourcing"
          title="CJ Import"
          description="Keep supplier intake organized with a polished feed view designed for high-volume dropshipping operations."
          actions={
            <button
              onClick={fetchCJProducts}
              className="inline-flex items-center justify-center rounded-2xl bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Refresh Feed
            </button>
          }
        >
          {error ? <AdminErrorState message={error} /> : null}
          {message ? (
            <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
              {message}
            </div>
          ) : null}

          {loading ? (
            <AdminLoadingState label="Loading CJ products..." />
          ) : products.length === 0 ? (
            <AdminEmptyState
              title="No CJ products available"
              description="The CJ feed is currently empty. Refresh the feed to try again."
            />
          ) : (
            <>
              <AdminStatGrid>
                <AdminMetricCard label="Feed Items" value={products.length} hint="Products returned by CJ API" />
                <AdminMetricCard
                  label="Average Price"
                  value={`$${(products.reduce((sum, item) => sum + Number(item.sellPrice || item.productPrice || 0), 0) / Math.max(products.length, 1)).toFixed(2)}`}
                  hint="Average supplier sell price"
                />
                <AdminMetricCard
                  label="Image Ready"
                  value={products.filter((item) => item.productImage).length}
                  hint="Products with a primary image"
                />
                <AdminMetricCard
                  label="Variants Visible"
                  value={products.filter((item) => item.variantsNum || item.variantKey).length}
                  hint="Products with visible variant metadata"
                />
              </AdminStatGrid>

              <div className="grid gap-5 xl:grid-cols-2">
                {products.map((item) => (
                  <AdminTableCard key={item.pid || item.id || item.productCode}>
                    {(() => {
                      const normalized = normalizeCJProduct(item);

                      return (
                        <>
                    <AdminSectionHeader
                      title="CJ catalog item"
                      description="Supplier feed detail optimized for quick import review."
                    />
                    <div className="flex flex-col gap-5 p-6 sm:flex-row">
                      <div className="h-36 w-full overflow-hidden rounded-2xl bg-white/5 sm:w-36">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productNameEn || item.productName || "CJ Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-[#64748B]">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <h2 className="text-lg font-semibold text-white">
                              {item.productNameEn || item.productName || "Untitled CJ product"}
                            </h2>
                            <p className="mt-2 text-sm text-[#94A3B8]">
                              SKU: {item.productCode || item.pid || "Unavailable"}
                            </p>
                          </div>
                          <div className="text-left lg:text-right">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Sell Price</p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                              ${Number(normalized.price || 0).toFixed(2)}
                            </p>
                            <p className="mt-2 text-sm text-[#94A3B8]">
                              Cost: ${Number(normalized.supplier_cost || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm text-[#CBD5E1] sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            Category: {item.categoryName || "N/A"}
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            Variants: {item.variantsNum || item.variantKey || "N/A"}
                          </div>
                        </div>

                        <div className="mt-5">
                          <button
                            onClick={() => importProduct(item)}
                            className="inline-flex items-center justify-center rounded-2xl bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
                          >
                            Import Product
                          </button>
                        </div>
                      </div>
                    </div>
                        </>
                      );
                    })()}
                  </AdminTableCard>
                ))}
              </div>
            </>
          )}
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}
