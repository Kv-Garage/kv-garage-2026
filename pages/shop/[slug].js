import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { buildCanonicalUrl } from '../../lib/seo';
import { useCart } from '../../context/CartContext';
import ReplicaDisclaimerModal from '../../components/product/ReplicaDisclaimerModal';
import { getProductByHandle } from '../../lib/shopify';

// Helper function to check if product is from Shopify
const isShopifyProduct = (slug) => slug.startsWith('shopify_');

// Server-side data fetching
export async function getServerSideProps({ params, req }) {
  const protocol = process.env.NODE_ENV === 'development' 
    ? 'http' 
    : 'https';
  const host = req.headers.host || process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;
  
  try {
    // Check if this is a Shopify product
    if (isShopifyProduct(params.slug)) {
      const handle = params.slug.replace('shopify_', '');
      const shopifyProduct = await getProductByHandle(handle);
      
      if (!shopifyProduct) {
        return { notFound: true };
      }
      
      // Transform Shopify product to match the expected format
      const product = {
        id: shopifyProduct.id,
        name: shopifyProduct.title,
        slug: `shopify_${shopifyProduct.handle}`,
        description: shopifyProduct.description || '',
        price: shopifyProduct.price || 0,
        display_price: shopifyProduct.price || 0,
        compareAtPrice: shopifyProduct.compareAtPrice || null,
        category: shopifyProduct.productType || 'Shopify',
        image: shopifyProduct.image || '/placeholder.jpg',
        images: shopifyProduct.images && shopifyProduct.images.length > 0 
          ? shopifyProduct.images.map(img => img.url) 
          : ['/placeholder.jpg'],
        tags: shopifyProduct.tags || [],
        top_pick: false,
        inventory: shopifyProduct.availableForSale ? 99 : 0,
        availableForSale: shopifyProduct.availableForSale,
        vendor: shopifyProduct.vendor || '',
        source: 'shopify',
        handle: shopifyProduct.handle,
        variantId: shopifyProduct.variantId || null,
        variants: shopifyProduct.variants || [],
      };
      
      return {
        props: {
          product,
          source: 'shopify',
        },
      };
    }
    
    // Regular database product
    const response = await fetch(`${baseUrl}/api/product-by-slug?slug=${params.slug}`);
    const data = await response.json();
    
    if (!response.ok || !data.product) {
      return { notFound: true };
    }
    
    return {
      props: {
        product: data.product,
        source: data.source || 'database',
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}

// Helper function to check if product is a watch (replica)
const isWatchProduct = (product) => {
  if (!product) return false;
  const category = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const tags = (product.tags || []).map(t => t.toLowerCase());
  
  // Check if it's in the watches category
  if (category.includes('watch') || category.includes('iced out')) {
    return true;
  }
  
  // Check if name contains watch brands or "iced out"
  const watchBrands = ['rolex', 'audemars', 'patek philippe', 'cartier', 'richard mille', 
                       'omega', 'tag heuer', 'breitling', 'hublot', 'panerai'];
  if (name.includes('watch') || name.includes('iced out')) {
    return true;
  }
  
  // Check if any brand name is in the product name
  if (watchBrands.some(brand => name.includes(brand))) {
    return true;
  }
  
  // Check tags
  if (tags.some(tag => tag.includes('watch') || tag.includes('iced'))) {
    return true;
  }
  
  return false;
};

export default function ProductPage({ product, source }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showReplicaModal, setShowReplicaModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);
  
  // Check if this is a watch product (needs replica disclaimer)
  const needsReplicaDisclaimer = isWatchProduct(product);

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
          <p className="text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop">
            <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // If this is a watch product, show the replica disclaimer modal
    if (needsReplicaDisclaimer && !localStorage.getItem('replicaDisclaimerAccepted')) {
      setPendingCartItem({
        id: product.id,
        name: product.name,
        price: displayPrice,
        quantity: quantity,
        image: images[0] || '/placeholder.jpg',
        category: product.category || 'general',
        slug: product.slug,
      });
      setShowReplicaModal(true);
      return;
    }
    
    // If disclaimer already accepted or not a watch, add directly
    addToCartDirectly();
  };
  
  const addToCartDirectly = () => {
    setIsAddingToCart(true);
    
    try {
      // Use CartContext's addToCart function
      addToCart({
        id: product.id,
        name: product.name,
        price: displayPrice,
        quantity: quantity,
        image: images[0] || '/placeholder.jpg',
        category: product.category || 'general',
        slug: product.slug,
        // Include Shopify-specific fields if applicable
        shopifyId: product.source === 'shopify' ? product.id : null,
        shopifyVariantId: product.variantId || null,
        variantId: product.variantId || null,
        isShopify: product.source === 'shopify',
      });
      
      setAddedToCart(true);
      
      setTimeout(() => {
        setAddedToCart(false);
        setIsAddingToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };
  
  const handleReplicaModalAccept = () => {
    // Mark disclaimer as accepted
    localStorage.setItem('replicaDisclaimerAccepted', 'true');
    setShowReplicaModal(false);
    
    // Add the pending item to cart using CartContext
    if (pendingCartItem) {
      addToCart(pendingCartItem);
      setAddedToCart(true);
      setPendingCartItem(null);
      
      setTimeout(() => {
        setAddedToCart(false);
        setIsAddingToCart(false);
      }, 2000);
    }
  };
  
  const handleReplicaModalClose = () => {
    setShowReplicaModal(false);
    setPendingCartItem(null);
  };

  const images = product.images || [];
  const displayPrice = product.display_price || product.price;

  return (
    <>
      <Head>
        <title>{product.name} | KV Garage</title>
        <meta name="description" content={product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || ''} />
        <link rel="canonical" href={buildCanonicalUrl(`/shop/${product.slug}`)} />
        <meta property="og:title" content={`${product.name} | KV Garage`} />
        <meta property="og:description" content={product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || ''} />
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
            <span className="text-gray-300">{product.name}</span>
          </nav>
        </div>

        {/* Main Product Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-6">
                <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => window.open(images[selectedImage], '_blank')}
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
                          src={image}
                          alt={`${product.name} ${index + 1}`}
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
                      {product.category || 'Uncategorized'}
                    </span>
                    {product.top_pick && (
                      <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        TOP PICK
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>
                  
                  <div className="flex items-center gap-6">
                    <p className="text-4xl font-bold text-[#D4AF37]">
                      ${Number(displayPrice).toFixed(2)}
                    </p>
                    {product.price_note && (
                      <p className="text-sm text-[#B78B16]">{product.price_note}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                  <div
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description || '' }}
                  />
                </div>

                {/* Inventory */}
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    product.inventory > 0
                      ? 'bg-green-900/20 border border-green-500/30 text-green-400'
                      : 'bg-red-900/20 border border-red-500/30 text-red-400'
                  }`}>
                    {product.inventory > 0
                      ? `In Stock: ${product.inventory} units`
                      : 'Out of Stock'}
                  </div>
                  {source === 'database' && (
                    <div className="text-xs text-gray-500">Live inventory</div>
                  )}
                </div>

                {/* Variant Selection (for Shopify products with options) */}
                {source === 'shopify' && product.variants && product.variants.length > 1 && (
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

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-300">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      max={product.inventory || 99}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                    />
                    <span className="text-sm text-gray-400">
                      Max: {product.inventory || 99} units
                    </span>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.inventory === 0}
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

        {/* Trust Badges */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-semibold mb-1">Fast Shipping</h3>
                <p className="text-sm text-gray-400">48-hour dispatch</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-semibold mb-1">Verified Quality</h3>
                <p className="text-sm text-gray-400">All items inspected</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="font-semibold mb-1">30-Day Returns</h3>
                <p className="text-sm text-gray-400">Hassle-free returns</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-semibold mb-1">24/7 Support</h3>
                <p className="text-sm text-gray-400">Always here to help</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Replica Disclaimer Modal - Only for watch products */}
      {needsReplicaDisclaimer && (
        <ReplicaDisclaimerModal
          isOpen={showReplicaModal}
          onClose={handleReplicaModalClose}
          onAccept={handleReplicaModalAccept}
          productName={product.name}
        />
      )}
    </>
  );
}
