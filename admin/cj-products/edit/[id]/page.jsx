import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import AdminGuard from "../../../../components/AdminGuard";
import AdminLayout from "../../../layout";
import { supabase } from "../../../../lib/supabase";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
} from "../../../../components/admin/AdminPageShell";

export const dynamic = 'force-dynamic';

export default function AdminCJProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    slug: "",
    active: true,
    top_pick: false,
    images: [],
    cj_product_id: "",
  });

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (fetchError || !data) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        setProduct(data);
        setFormData({
          name: data.name || "",
          price: String(data.price || ""),
          description: data.description || "",
          category: data.category || "",
          slug: data.slug || "",
          active: data.active ?? true,
          top_pick: data.top_pick ?? false,
          images: data.images || [],
          cj_product_id: data.cj_product_id || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field, value) => {
    // Split by comma and trim whitespace
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updates = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        category: formData.category,
        slug: formData.slug,
        active: formData.active,
        top_pick: formData.top_pick,
        images: formData.images,
        cj_product_id: formData.cj_product_id,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("products")
        .update(updates)
        .eq("id", productId);

      if (updateError) throw updateError;

      setSuccess("Product updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) throw deleteError;

      setSuccess("Product deleted successfully!");
      setTimeout(() => {
        router.push("/admin/cj-products");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(`Failed to delete: ${err.message}`);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout title="Edit Product" description="Loading...">
          <AdminLoadingState label="Loading product..." />
        </AdminLayout>
      </AdminGuard>
    );
  }

  if (error && !product) {
    return (
      <AdminGuard>
        <AdminLayout title="Edit Product" description="Error">
          <AdminErrorState message={error} />
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout 
        title="Edit Product" 
        description={`Editing: ${product?.name || "Product"}`}
      >
        <AdminPageShell
          eyebrow="CJ Dropshipping"
          title="Edit Product"
          description="Make changes to product details. All changes are saved to the database."
        >
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 font-semibold">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-300 font-semibold">
              ✅ {success}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  placeholder="0.00"
                />
              </div>

              {/* Category */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  placeholder="e.g., Footwear"
                />
              </div>

              {/* URL Slug */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  placeholder="product-slug"
                />
              </div>

              {/* CJ Product ID */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  CJ Product ID
                </label>
                <input
                  type="text"
                  value={formData.cj_product_id}
                  onChange={(e) => handleInputChange("cj_product_id", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  placeholder="CJ ID"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  placeholder="Enter product description"
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Image URLs (comma-separated)
                </label>
                <textarea
                  value={formData.images.join(', ')}
                  onChange={(e) => handleArrayInput("images", e.target.value)}
                  rows={2}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
                {formData.images.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-12 h-12 object-cover rounded-lg border border-white/10"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Status
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => handleInputChange("active", e.target.checked)}
                      className="w-5 h-5 rounded border-white/20 bg-white/10 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white text-sm">Active (Visible in store)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.top_pick}
                      onChange={(e) => handleInputChange("top_pick", e.target.checked)}
                      className="w-5 h-5 rounded border-white/20 bg-white/10 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white text-sm">Top Pick (Featured)</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg font-semibold hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => router.push("/admin/cj-products")}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-6 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 disabled:opacity-50 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}