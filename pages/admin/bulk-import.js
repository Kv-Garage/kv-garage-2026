import { useState } from "react";
import { useRouter } from "next/router";

export default function BulkImport() {
  const router = useRouter();
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Check for admin auth
  if (typeof window !== 'undefined') {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    
    const auth = getCookie('adminAuth');
    if (auth !== "true") {
      router.push("/admin-login");
      return null;
    }
  }

  const handleImport = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Parse JSON
      let products;
      try {
        products = JSON.parse(jsonInput);
      } catch (parseError) {
        throw new Error("Invalid JSON format");
      }

      if (!Array.isArray(products)) {
        throw new Error("Products must be an array");
      }

      // Send to API
      const res = await fetch("/api/bulk-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleData = `[
  {
    "name": "Sample Product 1",
    "slug": "sample-product-1",
    "price": 29.99,
    "description": "<p>This is a sample product description with HTML formatting.</p>",
    "images": "https://example.com/image1.jpg, https://example.com/image2.jpg",
    "category": "electronics",
    "sku": "SAMPLE001"
  },
  {
    "name": "Sample Product 2", 
    "price": 19.99,
    "description": "Another sample product",
    "images": ["https://example.com/image3.jpg"]
  }
]`;

  return (
    <>
      <title>Bulk Import | KV Garage Admin</title>
      
      <div className="min-h-screen bg-[#05070D] text-white p-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/admin")}
              className="text-sm text-gray-400 hover:text-white mb-4 inline-block"
            >
              ← Back to Admin
            </button>
            <h1 className="text-3xl font-bold mb-2">Bulk Product Import</h1>
            <p className="text-gray-400">
              Import multiple products at once using JSON format
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-[#111827] rounded-xl p-6 border border-[#1C2233] mb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#D4AF37]">Instructions</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Paste your product data as a JSON array in the format below</p>
              <p>• Required fields: <code className="bg-gray-800 px-2 py-1 rounded">name</code>, <code className="bg-gray-800 px-2 py-1 rounded">price</code></p>
              <p>• Optional fields: <code className="bg-gray-800 px-2 py-1 rounded">slug</code>, <code className="bg-gray-800 px-2 py-1 rounded">description</code>, <code className="bg-gray-800 px-2 py-1 rounded">images</code>, <code className="bg-gray-800 px-2 py-1 rounded">category</code>, <code className="bg-gray-800 px-2 py-1 rounded">sku</code></p>
              <p>• Images can be an array or comma-separated string</p>
              <p>• Duplicate slugs will be automatically skipped</p>
            </div>
          </div>

          {/* Sample Data */}
          <div className="bg-[#111827] rounded-xl p-6 border border-[#1C2233] mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#D4AF37]">Sample Format</h2>
              <button
                onClick={() => setJsonInput(sampleData)}
                className="bg-[#D4AF37] text-black px-4 py-2 rounded text-sm font-medium hover:bg-[#B8941F]"
              >
                Use Sample Data
              </button>
            </div>
            <pre className="text-xs text-gray-400 overflow-x-auto">
              {sampleData}
            </pre>
          </div>

          {/* JSON Input */}
          <div className="bg-[#111827] rounded-xl p-6 border border-[#1C2233] mb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#D4AF37]">Product Data (JSON)</h2>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON array here..."
              className="w-full h-64 bg-[#05070D] border border-[#1C2233] rounded-lg text-white font-mono text-sm p-4 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={loading || !jsonInput.trim()}
            className="w-full bg-[#D4AF37] text-black font-semibold py-4 px-6 rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Importing Products..." : "Import Products"}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 font-medium">Error:</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="mt-6 bg-green-900/20 border border-green-500 rounded-lg p-6">
              <h3 className="text-green-400 font-semibold text-lg mb-4">Import Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{result.successCount}</div>
                  <div className="text-sm text-gray-400">Imported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{result.skippedCount}</div>
                  <div className="text-sm text-gray-400">Skipped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{result.errorCount}</div>
                  <div className="text-sm text-gray-400">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{result.total}</div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="mt-4">
                  <p className="text-yellow-400 font-medium mb-2">Sample Errors:</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    {result.errors.map((error, index) => (
                      <div key={index} className="bg-black/30 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
