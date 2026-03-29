import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getProductBySlug } from '../../lib/products';
import { buildCanonicalUrl } from '../../lib/seo';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const productData = await getProductBySlug(slug);
          setProduct(productData);
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] flex items-center justify-center">
        <div className="text-white">Product not found</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    });
  };

  const isInCart = cart.some(item => item.id === product.id);

  return (
    <>
      <div className="bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] min-h-screen">
        {/* Product Images Carousel */}
        <div className="relative bg-black">
          <div className="relative h-96 bg-gradient-to-br from-[#1f2937] to-[#0b0f19]">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1f2937] to-[#0b0f19] flex items-center justify-center">
                <div className="text-gray-400">No image available</div>
              </div>
            )}
          </div>
          
          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 p-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-[#D4AF37] scale-105' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="px-4 py-6 space-y-6">
          {/* Product Info */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">{product.name}</h1>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-[#D4AF37]">${product.price}</span>
              <span className="text-sm text-gray-400">In stock</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Product Details</h2>
            <div className="text-gray-300 leading-relaxed">
              {product.description || 'Premium quality product with excellent craftsmanship.'}
            </div>
          </div>

          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3 text-gray-300">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">Quantity</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-3 text-center bg-transparent border-x border-white/20 text-white focus:outline-none"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-400">
                Total: ${(product.price * quantity).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                  isInCart
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:shadow-lg hover:shadow-[#D4AF37]/30 transform hover:scale-105'
                }`}
              >
                {isInCart ? 'Already in Cart' : 'Add to Cart'}
              </button>
              
              {user && (
                <Link href="/cart" className="w-full py-4 px-6 bg-gradient-to-r from-[#1f2937] to-[#0b0f19] border border-white/20 text-white rounded-xl font-bold text-lg text-center hover:border-[#D4AF37] transition-all duration-200">
                  View Cart
                </Link>
              )}
            </div>

            <div className="text-xs text-gray-400 text-center">
              Free shipping on orders over $50 • 30-day return policy
            </div>
          </div>

          {/* Product Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Specifications</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs uppercase tracking-wide">{key}</div>
                    <div className="text-white font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-20 left-4 right-4">
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-2xl ${
            isInCart
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:shadow-lg hover:shadow-[#D4AF37]/50 transform hover:scale-105'
          }`}
        >
          {isInCart ? 'Already in Cart' : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
        </button>
      </div>
    </>
  );
}