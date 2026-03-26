import { useState } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../layout";
import {
  AdminErrorState,
  AdminPageShell,
  AdminTableCard,
} from "../../components/admin/AdminPageShell";
import { AdminSectionHeader } from "../../components/admin/AdminPrimitives";

export default function AdminBulkImportPage() {
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleImport = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const parsed = JSON.parse(payload || "[]");
      const products = Array.isArray(parsed) ? parsed : [parsed];

      const response = await fetch("/api/bulk-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bulk import failed");
      }

      setResult(data);
    } catch (error) {
      setError(error.message || "Bulk import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Bulk Import" description="High-volume import workflow with CJ-aware detail fetching and visible failure handling.">
        <AdminPageShell
          eyebrow="Importer"
          title="Bulk Import"
          description="Paste an array of manual product objects or CJ records with `pid` / `cjProductId`. The importer now handles CJ detail hydration, pricing safety, and clear error output."
        >
          {error ? <AdminErrorState message={error} /> : null}
          <AdminTableCard>
            <AdminSectionHeader title="Import Payload" description='Example: [{"pid":"123456"}] or manual product objects with name, images, and price fields.' />
            <div className="p-6">
              <textarea
                value={payload}
                onChange={(event) => setPayload(event.target.value)}
                rows={18}
                className="w-full rounded-2xl border border-white/10 bg-[#0B1020] p-4 font-mono text-sm text-white"
                placeholder='[{"pid":"CJ12345"}]'
              />
              <div className="mt-4 flex items-center gap-3">
                <button onClick={handleImport} disabled={loading} className="rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50">
                  {loading ? "Importing..." : "Run Bulk Import"}
                </button>
                {loading ? <span className="text-sm text-[#94A3B8]">Progress: validating and importing records...</span> : null}
              </div>
            </div>
          </AdminTableCard>

          {result ? (
            <AdminTableCard>
              <AdminSectionHeader title="Import Summary" />
              <div className="space-y-3 p-6 text-sm text-white">
                <p>{result.summary}</p>
                <p>Total: {result.total}</p>
                <p>Imported: {result.successCount}</p>
                <p>Skipped: {result.skippedCount}</p>
                <p>Errors: {result.errorCount}</p>
                {result.errors?.length ? (
                  <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100">
                    {result.errors.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            </AdminTableCard>
          ) : null}
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}
