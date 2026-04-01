import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getProductByHandle, getProducts } from '../../lib/shopify';
import { buildCanonicalUrl } from '../../lib/seo';

/**
 * Shopify Product Detail Page
 * Displays a single product from Shopify with full details
 */
export default function ShopifyProductPage({ product, relatedProducts }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-8">This Shopify product may have been removed.</p>
          <Link href="/shop">
            <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const displayPrice = product.price;
  const compareAtPrice = product.compareAtPrice || null;
  const discount = compareAtPrice && displayPrice < compareAtPrice
    ? Math.round(((compareAtPrice - displayPrice) / compareAtPrice) * 100)
    : null;

  const handleAddToCart = () => {
    setIsAddingToCart(true);

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === product.id || item.variantId === selectedVariant?.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          variantId: selectedVariant?.id || product.variantId,
          title: product.title,
          price: displayPrice,
          quantity: quantity,
          image: images[0]?.url || '/placeholder.jpg',
          handle: product.handle,
          variantTitle: selectedVariant?.title,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      setAddedToCart(true);
      window.dispatchEvent(new Event('cartUpdated'));

      setTimeout(() => {
        setAddedToCart(false);
        setIsAddingToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <Head>
        <title>{product.title} | KV Garage Shopify</title>
        <meta name="description" content={product.description?.substring(0, 160) || ''} />
        <link rel="canonical" href={buildCanonicalUrl(`/shopify/${product.handle}`)} />
        <meta property="og:title" content={`${product.title} | KV Garage`} />
        <meta property="og:description" content={product.description?.substring(0, 160) || ''} />
        <meta property="og:type" content="product" />
        <meta property="og:price:amount" content={displayPrice} />
        <meta property="og:price:currency" content="USD" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-300 truncate max-w-xs">{product.title}</span>
          </nav>
        </div>

        {/* Main Product Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-6">
                <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl overflow-hidden relative">
                  {discount && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        -{discount}% OFF
                      </span>
                    </div>
                  )}
                  
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage].url}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => window.open(images[selectedImage].url, '_blank')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <span className="text-6xl">📦</span>
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index
                            ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                      {product.productType || 'Product'}
                    </span>
                    {product.vendor && (
                      <span className="text-gray-400 text-sm border border-white/20 px-3 py-1 rounded-full">
                        {product.vendor}
                      </span>
                    )}
                    {!product.availableForSale && (
                      <span className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-1 rounded-full text-sm font-semibold">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">{product.title}</h1>

                  <div className="flex items-center gap-6">
                    <p className="text-4xl font-bold text-[#D4AF37]">
                      ${displayPrice.toFixed(2)}
                    </p>
                    {compareAtPrice && compareAtPrice > displayPrice && (
                      <>
                        <p className="text-2xl text-gray-500 line-through">
                          ${compareAtPrice.toFixed(2)}
                        </p>
                        <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Save {discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Variant Selection */}
                {product.variants && product.variants.length > 1 && (
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-300">
                      Select Option
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={!variant.available}
                          className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
                            selectedVariant?.id === variant.id
                              ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                              : variant.available
                              ? 'border-white/20 hover:border-white/40'
                              : 'border-white/10 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="font-medium">{variant.title}</div>
                          {variant.price !== displayPrice && (
                            <div className="text-sm text-gray-400">${variant.price.toFixed(2)}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                  <div
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description || '' }}
                  />
                </div>

                {/* Availability */}
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    product.availableForSale
                      ? 'bg-green-900/20 border border-green-500/30 text-green-400'
                      : 'bg-red-900/20 border border-red-500/30 text-red-400'
                  }`}>
                    {product.availableForSale
                      ? selectedVariant?.available !== false
                        ? 'In Stock'
                        : 'Out of Stock'
                      : 'Sold Out'}
                  </div>
                  {selectedVariant?.quantity !== undefined && selectedVariant.quantity > 0 && (
                    <span className="text-sm text-gray-400">
                      {selectedVariant.quantity} available
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                {product.availableForSale && (
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-300">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        max={selectedVariant?.quantity || 99}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                      <span className="text-sm text-gray-400">
                        Max: {selectedVariant?.quantity || 99} units
                      </span>
                    </div>
                  </div>
                )}

                {/* Add to Cart */}
                {product.availableForSale && (
                  <div className="space-y-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className={`w-full py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                        addedToCart
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:shadow-lg hover:shadow-[#D4AF37]/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      {isAddingToCart ? 'Adding...' : addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/shop">
                        <button className="w-full py-4 px-6 rounded-xl font-semibold border border-white/30 hover:bg-white hover:text-black transition-all duration-300">
                          Continue Shopping
                        </button>
                      </Link>
                      <Link href="/cart">
                        <button className="w-full py-4 px-6 rounded-xl font-semibold border border-white/30 hover:bg-white hover:text-black transition-all duration-300">
                          View Cart
                        </button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
          <section className="py-16 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/shopify/${p.handle}`}
                    className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-white/10">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl text-gray-500">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                        {p.title}
                      </h3>
                      <p className="text-xl font-bold text-[#D4AF37] mt-2">
                        ${p.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

// Server-side data fetching
export async function getStaticPaths() {
  let products = [];
  
  try {
    products = await getProducts(50);
  } catch (error) {
    console.error('Error fetching products for paths:', error);
  }

  const paths = products.map((product) => ({
    params: { handle: product.handle },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  let product = null;
  let relatedProducts = [];

  try {
    product = await getProductByHandle(params.handle);
    
    if (product) {
      // Fetch related products (same product type or vendor)
      const allProducts = await getProducts(20);
      relatedProducts = allProducts.filter(
        (p) => p.id !== product.id && 
        (p.productType === product.productType || p.vendor === product.vendor)
      );
    }
  } catch (error) {
    console.error(`Error fetching product ${params.handle}:`, error);
  }

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
      relatedProducts,
    },
    revalidate: 300,
  };
}