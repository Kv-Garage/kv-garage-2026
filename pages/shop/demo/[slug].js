import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DesktopLayoutMega from '../../../components/layout/DesktopLayoutMega';

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Heavy-Duty Shelving Unit',
  price: 299.99,
  comparePrice: 399.99,
  category: 'garage-storage',
  subcategory: 'shelving',
  rating: 4.8,
  reviews: 127,
  badge: 'Best Seller',
  images: [
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg'
  ],
  description: 'Professional-grade heavy-duty shelving unit built for serious garage organization. Features 1000lb capacity per shelf with adjustable height settings.',
  benefits: [
    {
      icon: '🔧',
      title: 'Industrial Strength',
      description: '1000lb capacity per shelf with powder-coated steel construction'
    },
    {
      icon: '⚡',
      title: 'Quick Assembly',
      description: 'Tool-free assembly in under 30 minutes'
    },
    {
      icon: '🛡️',
      title: 'Lifetime Warranty',
      description: 'Comprehensive coverage for peace of mind'
    },
    {
      icon: '📏',
      title: 'Adjustable Design',
      description: 'Shelves adjustable in 1-inch increments'
    }
  ],
  specifications: [
    { label: 'Material', value: 'Powder-coated steel' },
    { label: 'Dimensions', value: '72" H x 36" W x 18" D' },
    { label: 'Weight Capacity', value: '1000 lbs per shelf' },
    { label: 'Shelf Count', value: '4 adjustable shelves' },
    { label: 'Color', value: 'Industrial Gray' },
    { label: 'Assembly Time', value: '30 minutes' }
  ],
  shipping: {
    cost: 'FREE',
    delivery: '3-5 business days',
    returns: '30-day returns'
  },
  trustBadges: [
    { icon: '🔒', text: 'Secure Checkout' },
    { icon: '🚚', text: 'Free Shipping' },
    { icon: '🛡️', text: 'Lifetime Warranty' },
    { icon: '🔄', text: '30-Day Returns' }
  ],
  reviews: [
    {
      name: 'Mike R.',
      rating: 5,
      date: 'April 5, 2026',
      comment: 'Excellent quality! Much sturdier than I expected. Perfect for my workshop.',
      verified: true
    },
    {
      name: 'Sarah L.',
      rating: 5,
      date: 'April 3, 2026',
      comment: 'Easy to assemble and very sturdy. Great value for the price.',
      verified: true
    }
  ],
  relatedProducts: [
    {
      id: 2,
      name: 'Garage Cabinet Set',
      price: 799.99,
      comparePrice: 999.99,
      image: '/placeholder.jpg',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: 'Tool Chest with Wheels',
      price: 449.99,
      comparePrice: 549.99,
      image: '/placeholder.jpg',
      rating: 4.7,
      reviews: 156
    }
  ],
  frequentlyBoughtTogether: [
    {
      id: 4,
      name: 'Wall-Mounted Hooks Set',
      price: 49.99,
      image: '/placeholder.jpg',
      savings: 10.00
    },
    {
      id: 5,
      name: 'Storage Bins (Set of 4)',
      price: 79.99,
      image: '/placeholder.jpg',
      savings: 15.00
    }
  ]
};

export default function ProductPage({ params }) {
  const { slug } = params;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push('★');
      } else if (i < rating) {
        stars.push('★'); // Half star could be added here
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  const handleAddToCart = () => {
    setIsInCart(true);
    // Simulate API call
    setTimeout(() => {
      setIsInCart(false);
    }, 2000);
  };

  const totalSavings = mockProduct.comparePrice - mockProduct.price;
  const savingsPercentage = Math.round((totalSavings / mockProduct.comparePrice) * 100);

  return (
    <DesktopLayoutMega title={`${mockProduct.name} | KV Garage`}>
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#111827] to-[#0F0F0F] text-white">
        {/* Breadcrumb */}
        <nav className="py-4 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-sm text-gray-400">
              <Link href="/" className="hover:text-white">Home</Link> {' > '}
              <Link href="/shop" className="hover:text-white">Shop</Link> {' > '}
              <Link href="/shop?category=garage-storage" className="hover:text-white">Garage Storage</Link> {' > '}
              <span className="text-white">{mockProduct.name}</span>
            </div>
          </div>
        </nav>

        {/* Product Hero */}
        <section className="py-12 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative bg-white/5 border border-white/20 rounded-2xl overflow-hidden">
                  <Image
                    src={mockProduct.images[selectedImage]}
                    alt={mockProduct.name}
                    width={600}
                    height={600}
                    className="w-full h-96 object-cover"
                  />
                  {mockProduct.badge && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      {mockProduct.badge}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                    {getStarRating(mockProduct.rating)} ({mockProduct.reviews})
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-4">
                  {mockProduct.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative bg-white/10 border rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 ${
                        selectedImage === index ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-white/20'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${mockProduct.name} ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      Garage Storage
                    </span>
                    <span className="text-gray-400 text-sm">EST. 2022</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">{mockProduct.name}</h1>
                  <p className="text-gray-300 text-lg leading-relaxed">{mockProduct.description}</p>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(mockProduct.price)}</span>
                      <span className="text-gray-400 line-through ml-2">{formatPrice(mockProduct.comparePrice)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-400 font-semibold">SAVE {formatPrice(totalSavings)}</div>
                      <div className="text-xs text-gray-400">{savingsPercentage}% OFF</div>
                    </div>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {mockProduct.trustBadges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="text-lg">{badge.icon}</span>
                        {badge.text}
                      </div>
                    ))}
                  </div>

                  {/* Quantity & Add to Cart */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-white/10 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center bg-transparent border-0 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-white/10 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAddToCart}
                      disabled={isInCart}
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-3 px-6 rounded-lg font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isInCart ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-black border-t-[#D4AF37] rounded-full animate-spin"></div>
                          <span>Adding to Cart...</span>
                        </div>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>

                  {/* Shipping Info */}
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 border-t border-white/20 pt-4">
                    <div>
                      <span className="block font-semibold">Shipping</span>
                      <span>{mockProduct.shipping.cost}</span>
                    </div>
                    <div>
                      <span className="block font-semibold">Delivery</span>
                      <span>{mockProduct.shipping.delivery}</span>
                    </div>
                    <div>
                      <span className="block font-semibold">Returns</span>
                      <span>{mockProduct.shipping.returns}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Why This Product?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mockProduct.benefits.map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockProduct.specifications.map((spec, index) => (
                <div key={index} className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-4">
                  <span className="text-sm text-gray-400">{spec.label}</span>
                  <div className="font-semibold mt-1">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Customer Reviews</h2>
              <div className="text-sm text-gray-400">
                {getStarRating(mockProduct.rating)} ({mockProduct.reviews} reviews)
              </div>
            </div>
            
            <div className="space-y-6">
              {mockProduct.reviews.map((review, index) => (
                <div key={index} className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.name}</span>
                        {review.verified && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Verified Buyer</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{review.date}</div>
                    </div>
                    <div className="text-yellow-400">{getStarRating(review.rating)}</div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Frequently Bought Together */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Frequently Bought Together</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {mockProduct.frequentlyBoughtTogether.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-400">Add to cart for extra savings</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#D4AF37]">{formatPrice(item.price)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-400 font-semibold">Save {formatPrice(item.savings)}</div>
                      <label className="flex items-center space-x-2 cursor-pointer mt-2">
                        <input type="checkbox" className="text-orange-500 focus:ring-orange-500" />
                        <span className="text-sm">Add to cart</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                Add All to Cart - Save {formatPrice(mockProduct.frequentlyBoughtTogether.reduce((sum, item) => sum + item.savings, 0))}
              </button>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {mockProduct.relatedProducts.map((product) => (
                <div key={product.id} className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all duration-300">
                  <div className="flex items-center gap-6 p-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                        <span className="text-xl font-bold text-[#D4AF37]">{formatPrice(product.price)}</span>
                      </div>
                      <div className="text-sm text-gray-400 mb-4">
                        {getStarRating(product.rating)} ({product.reviews} reviews)
                      </div>
                      <Link
                        href={`/shop/demo/${product.id}`}
                        className="inline-block bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DesktopLayoutMega>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      params
    }
  };
}