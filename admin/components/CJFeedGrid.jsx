import { normalizeCJProduct } from "../../lib/cjProduct";

export default function CJFeedGrid({ loadingCJ, cjProducts, onImport }) {
  return (
    <div>
      <h2 className="mb-6 text-xl">CJ Product Feed</h2>

      {loadingCJ && <p>Loading CJ Products...</p>}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {cjProducts.map((product, index) => {
          const normalized = normalizeCJProduct(product);

          return (
          <div key={index} className="rounded-xl bg-[#111827] p-4">
            <img src={product.productImage} className="mb-3 h-40 w-full object-cover" />

            <p className="mb-2 text-sm line-clamp-2">
              {product.productNameEn || product.productName}
            </p>

            <p className="text-xs text-gray-400">
              Cost: ${Number(normalized.supplier_cost || 0).toFixed(2)}
            </p>
            <p className="mb-3 text-[#D4AF37]">
              Sell: ${Number(normalized.price || 0).toFixed(2)}
            </p>

            <button
              onClick={() => onImport(product)}
              className="w-full rounded bg-[#D4AF37] py-2 text-black"
            >
              Import
            </button>
          </div>
        )})}
      </div>
    </div>
  );
}
