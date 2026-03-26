import { useState, useEffect } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState("all");
  const [selectedContent, setSelectedContent] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // For now, we'll simulate content data since we don't have a content table
      // In a real implementation, this would fetch from a content/pages table
      const mockContent = [
        {
          id: "1",
          title: "About Us",
          type: "page",
          status: "published",
          author: "Admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          slug: "about",
          excerpt: "Learn about our company and mission"
        },
        {
          id: "2",
          title: "Welcome to KV Garage",
          type: "post",
          status: "published",
          author: "Admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          slug: "welcome-post",
          excerpt: "Your premier destination for automotive excellence"
        },
        {
          id: "3",
          title: "Privacy Policy",
          type: "page",
          status: "draft",
          author: "Admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          slug: "privacy-policy",
          excerpt: "Our privacy and data protection policies"
        }
      ];

      setContent(mockContent);
    } catch (err) {
      console.error(err);
      setError("Could not load content.");
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = contentType === "all" || item.type === contentType;
    return matchesSearch && matchesType;
  });

  const toggleContentSelection = (contentId) => {
    setSelectedContent(prev =>
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const toggleAllContent = () => {
    if (selectedContent.length === filteredContent.length) {
      setSelectedContent([]);
    } else {
      setSelectedContent(filteredContent.map(item => item.id));
    }
  };

  const bulkDelete = async () => {
    if (selectedContent.length === 0) return;
    if (!confirm(`Delete ${selectedContent.length} item(s)? This action cannot be undone.`)) return;

    try {
      // In a real implementation, this would delete from the database
      setContent(prev => prev.filter(item => !selectedContent.includes(item.id)));
      setSelectedContent([]);
      setError("");
    } catch (err) {
      setError("Could not delete content.");
    }
  };

  const updateContentStatus = async (contentId, newStatus) => {
    try {
      // In a real implementation, this would update the database
      setContent(prev => prev.map(item =>
        item.id === contentId ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      setError("Could not update content status.");
    }
  };

  const ContentModal = ({ content: item, onClose }) => {
    const [formData, setFormData] = useState({
      title: item?.title || "",
      type: item?.type || "page",
      status: item?.status || "draft",
      slug: item?.slug || "",
      excerpt: item?.excerpt || "",
      content: item?.content || "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (item) {
          // Update existing
          setContent(prev => prev.map(c =>
            c.id === item.id ? { ...c, ...formData, updated_at: new Date().toISOString() } : c
          ));
        } else {
          // Create new
          const newContent = {
            id: Date.now().toString(),
            ...formData,
            author: "Admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setContent(prev => [newContent, ...prev]);
        }
        onClose();
      } catch (err) {
        setError("Could not save content.");
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {item ? "Edit Content" : "Create New Content"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                  <option value="page">Page</option>
                  <option value="post">Blog Post</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                  placeholder="url-friendly-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
              <input
                type="text"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                placeholder="Write your content here..."
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
      case "published": return "bg-green-500/20 text-green-400";
      case "draft": return "bg-yellow-500/20 text-yellow-400";
      case "archived": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "page": return "bg-blue-500/20 text-blue-400";
      case "post": return "bg-purple-500/20 text-purple-400";
      case "announcement": return "bg-orange-500/20 text-orange-400";
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
              <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
              <p className="text-gray-400">Manage pages, blog posts, and other content</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors text-sm font-medium"
            >
              Create Content
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-[#0F172A] rounded-lg border border-[#1C2233] p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full bg-[#1A2132] border border-[#2A3441] text-white px-3 py-2 rounded-lg"
                >
                  <option value="all">All Types</option>
                  <option value="page">Pages</option>
                  <option value="post">Blog Posts</option>
                  <option value="announcement">Announcements</option>
                </select>
              </div>
              <div className="flex items-end">
                {selectedContent.length > 0 && (
                  <button
                    onClick={bulkDelete}
                    className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Delete Selected ({selectedContent.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading content...</div>
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
                          checked={selectedContent.length === filteredContent.length && filteredContent.length > 0}
                          onChange={toggleAllContent}
                          className="rounded border-gray-600"
                        />
                      </th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Author</th>
                      <th className="px-4 py-3">Last Modified</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContent.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                          No content found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredContent.map((item) => (
                        <tr key={item.id} className="border-b border-[#2A3441] hover:bg-[#1A2132]">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedContent.includes(item.id)}
                              onChange={() => toggleContentSelection(item.id)}
                              className="rounded border-gray-600"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-white">{item.title}</p>
                              <p className="text-xs text-gray-400">{item.excerpt}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(item.type)}`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={item.status}
                              onChange={(e) => updateContentStatus(item.id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)} border-0 bg-transparent`}
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-300">{item.author}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-300">
                              {new Date(item.updated_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setEditingContent(item)}
                              className="text-[#D4AF37] hover:text-[#B8941F] text-sm"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modals */}
          {showCreateModal && (
            <ContentModal
              onClose={() => setShowCreateModal(false)}
            />
          )}

          {editingContent && (
            <ContentModal
              content={editingContent}
              onClose={() => setEditingContent(null)}
            />
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}