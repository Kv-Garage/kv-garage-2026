import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * ProductCard Component
 * Displays a single product from Shopify with image, title, price, and Add to Cart button
 */
export default function ProductCard({ product, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const {
    id,
    title,
    handle,
    image,
    price,
    priceFormatted,
    variantId,
    availableForSale,
    compareAtPrice,
  } = product;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!availableForSale || isAdding) return;

    setIsAdding(true);

    try {
      // If custom handler provided, use it
      if (onAddToCart) {
        await onAddToCart(product);
      } else {
        // Default: add to localStorage cart
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === id || item.variantId === variantId);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: id,
            variantId: variantId,
            title: title,
            price: price,
            quantity: 1,
            image: image,
            handle: handle,
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
      }

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Calculate discount percentage if there's a compare at price
  const discount = compareAtPrice && price < compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null;

  return (
    <Link 
      href={`/shopify/${handle}`} 
      className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#D4AF37]/20"
    >
      {/* Discount Badge */}
      {discount && discount > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -{discount}%
          </span>
        </div>
      )}

      {/* Sold Out Badge */}
      {!availableForSale && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gray-800/90 text-gray-300 text-xs font-bold px-3 py-1 rounded-full border border-gray-600">
            Sold Out
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-square w-full overflow-hidden bg-white/10 relative">
        {image && !imageError ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
            <span className="text-6xl text-gray-500">📦</span>
          </div>
        )}

        {/* Quick Add Button (shown on hover) */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!availableForSale || isAdding}
            className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black p-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isAdded ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-[#D4AF37]">
              {priceFormatted || `$${(price || 0).toFixed(2)}`}
            </p>
            {compareAtPrice && compareAtPrice > price && (
              <p className="text-sm text-gray-500 line-through">
                ${compareAtPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* Add to Cart Button (Mobile/Always Visible) */}
          <button
            onClick={handleAddToCart}
            disabled={!availableForSale || isAdding}
            className="lg:hidden bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : isAdded ? '✓ Added' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}