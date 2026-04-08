import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DesktopLayoutMega from '../../../components/layout/DesktopLayoutMega';
import MobileLayout from '../../../components/layout/MobileLayout';

// Mock data for categories
const categoryData = {
  'garage-storage': {
    name: 'Garage Storage',
    description: 'Professional-grade storage solutions for your garage. Heavy-duty shelving, cabinets, and organization systems built to last.',
    color: 'orange',
    image: '/placeholder.jpg',
    products: [
      {
        id: 1,
        name: 'Heavy-Duty Shelving Unit',
        price: 299.99,
        comparePrice: 399.99,
        image: '/placeholder.jpg',
        category: 'garage-storage',
        subcategory: 'shelving',
        rating: 4.8,
        reviews: 127,
        badge: 'Best Seller',
        features: ['1000lb capacity', 'Adjustable shelves', 'Powder-coated steel']
      },
      {
        id: 2,
        name: 'Garage Cabinet Set',
        price: 799.99,
        comparePrice: 999.99,
        image: '/placeholder.jpg',
        category: 'garage-storage',
        subcategory: 'cabinets',
        rating: 4.9,
        reviews: 89,
        badge: 'New',
        features: ['Lockable doors', 'Heavy-duty construction', 'Multiple sizes']
      },
      {
        id: 3,
        name: 'Tool Chest with Wheels',
        price: 449.99,
        comparePrice: 549.99,
        image: '/placeholder.jpg',
        category: 'garage-storage',
        subcategory: 'tool-chests',
        rating: 4.7,
        reviews: 156,
        badge: 'Pro Choice',
        features: ['Rolling design', 'Multiple drawers', 'Lockable']
      }
    ]
  },
  'workbenches': {
    name: 'Workbenches',
    description: 'Industrial-grade workbenches and workstation solutions for serious projects and professional use.',
    color: 'blue',
    image: '/placeholder.jpg',
    products: [
      {
        id: 4,
        name: 'Pro Workbench 6ft',
        price: 499.99,
        comparePrice: 699.99,
        image: '/placeholder.jpg',
        category: 'workbenches',
        subcategory: 'benches',
        rating: 4.9,
        reviews: 203,
        badge: 'Pro Choice',
        features: ['6ft workspace', 'Heavy-duty steel', 'Adjustable height']
      },
      {
        id: 5,
        name: 'Ergonomic Office Chair',
        price: 349.99,
        comparePrice: 449.99,
        image: '/placeholder.jpg',
        category: 'workbenches',
        subcategory: 'chairs',
        rating: 4.6,
        reviews: 98,
        badge: 'Hot',
        features: ['Lumbar support', 'Adjustable height', 'Breathable mesh']
      }
    ]
  },
  'wall-organization': {
    name: 'Wall Organization',
    description: 'Maximize your garage space with our comprehensive wall organization systems.',
    color: 'yellow',
    image: '/placeholder.jpg',
    products: [
      {
        id: 6,
        name: 'Pegboard Kit',
        price: 129.99,
        comparePrice: 179.99,
        image: '/placeholder.jpg',
        category: 'wall-organization',
        subcategory: 'pegboards',
        rating: 4.5,
        reviews: 187,
        badge: 'Complete Kit',
        features: ['Complete mounting kit', 'Heavy-duty hooks', 'Easy installation']
      },
      {
        id: 7,
        name: 'Slatwall System',
        price: 249.99,
        comparePrice: 349.99,
        image: '/placeholder.jpg',
        category: 'wall-organization',
        subcategory: 'slatwall',
        rating: 4.7,
        reviews: 145,
        badge: 'Modular',
        features: ['Modular design', 'Heavy-duty mounting', 'Multiple accessories']
      }
    ]
  },
  'home-furniture': {
    name: 'Home Furniture',
    description: 'Premium furniture solutions for your home and office spaces.',
    color: 'neutral',
    image: '/placeholder.jpg',
    products: [
      {
        id: 8,
        name: 'Modern Sofa',
        price: 899.99,
        comparePrice: 1299.99,
        image: '/placeholder.jpg',
        category: 'home-furniture',
        subcategory: 'sofas',
        rating: 4.8,
        reviews: 234,
        badge: 'Premium',
        features: ['Premium fabric', 'Comfortable seating', 'Modern design']
      },
      {
        id: 9,
        name: 'Coffee Table Set',
        price: 399.99,
        comparePrice: 599.99,
        image: '/placeholder.jpg',
        category: 'home-furniture',
        subcategory: 'tables',
        rating: 4.4,
        reviews: 167,
        badge: 'Set',
        features: ['Complete set', 'Durable construction', 'Modern style']
      }
    ]
  }
};

const colorClasses = {
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-500",
    hover: "hover:text-orange-500",
    light: "bg-orange-500/10",
    badge: "bg-orange-500"
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-500",
    hover: "hover:text-blue-500",
    light: "bg-blue-500/10",
    badge: "bg-blue-500"
  },
  yellow: {
    bg: "bg-yellow-500",
    text: "text-yellow-500",
    border: "border-yellow-500",
    hover: "hover:text-yellow-500",
    light: "bg-yellow-500/10",
    badge: "bg-yellow-500"
  },
  neutral: {
    bg: "bg-gray-500",
    text: "text-gray-500",
    border: "border-gray-500",
    hover: "hover:text-gray-500",
    light: "bg-gray-500/10",
    badge: "bg-gray-500"
  }
};

export default function CategoryPage({ params }) {
  const { category } = params;
  const [filters, setFilters] = useState({
    subcategory: 'all',
    priceRange: 'all',
    sortBy: 'featured'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryInfo = categoryData[category];
  
  if (!categoryInfo) {
    return (
      <DesktopLayoutMega title="Category Not Found | KV Garage">
        <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#111827] to-[#0F0F0F] text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <p className="text-gray-400 mb-8">The category you're looking for doesn't exist.</p>
            <Link href="/shop" className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold">
              Browse All Products
            </Link>
          </div>
        </div>
      </DesktopLayoutMega>
    );
  }

  const colors = colorClasses[categoryInfo.color];

  // Filter products based on selected filters
  const filteredProducts = categoryInfo.products.filter(product => {
    const matchesSubcategory = filters.subcategory === 'all' || product.subcategory === filters.subcategory;
    const matchesPrice = filters.priceRange === 'all' || (
      filters.priceRange === 'under-300' && product.price < 300 ||
      filters.priceRange === '300-600' && product.price >= 300 && product.price <= 600 ||
      filters.priceRange === 'over-600' && product.price > 600
    );
    return matchesSubcategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

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

  return (
    <DesktopLayoutMega title={`${categoryInfo.name} | KV Garage`}>
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#111827] to-[#0F0F0F] text-white">
        {/* Category Hero */}
        <section className="py-20 border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className={`bg-${categoryInfo.color}-500 text-black px-4 py-2 rounded-full text-sm font-semibold`}>
                    {categoryInfo.name}
                  </span>
                  <span className="text-gray-400 text-sm">EST. 2022</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                  <span className={`bg-gradient-to-r from-white via-${categoryInfo.color}-500 to-white bg-clip-text text-transparent`}>
                    {categoryInfo.name}
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {categoryInfo.description}
                </p>
                <div className="flex items-center gap-6">
                  <Link 
                    href="/shop" 
                    className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                  >
                    Browse All Categories
                  </Link>
                  <div className="text-sm text-gray-400">
                    {categoryInfo.products.length} products available
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br from-${categoryInfo.color}-500/20 to-transparent rounded-2xl transform rotate-6`}></div>
                <img
                  src={categoryInfo.image}
                  alt={categoryInfo.name}
                  className="relative w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-12 border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Filters
                </button>
                
                <div className="hidden lg:flex gap-2">
                  {Object.keys(categoryData).map(catKey => (
                    <Link
                      key={catKey}
                      href={`/shop?category=${catKey}`}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        catKey === category 
                          ? colorClasses[categoryData[catKey].color].bg + ' text-black' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {categoryData[catKey].name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <div className="lg:hidden mt-6 space-y-6 bg-white/5 border border-white/20 rounded-xl p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subcategory</label>
                  <select
                    value={filters.subcategory}
                    onChange={(e) => setFilters({...filters, subcategory: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Subcategories</option>
                    <option value="shelving">Shelving</option>
                    <option value="cabinets">Cabinets</option>
                    <option value="benches">Workbenches</option>
                    <option value="chairs">Chairs</option>
                    <option value="pegboards">Pegboards</option>
                    <option value="slatwall">Slatwall</option>
                    <option value="sofas">Sofas</option>
                    <option value="tables">Tables</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-300">Under $300</option>
                    <option value="300-600">$300 - $600</option>
                    <option value="over-600">Over $600</option>
                  </select>
                </div>
              </div>
            )}

            {/* Desktop Filters */}
            <div className="hidden lg:grid grid-cols-4 gap-6 mt-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-300">Subcategory</h4>
                <div className="space-y-2">
                  {['all', 'shelving', 'cabinets', 'benches', 'chairs', 'pegboards', 'slatwall', 'sofas', 'tables'].map(sub => (
                    <label key={sub} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subcategory"
                        value={sub}
                        checked={filters.subcategory === sub}
                        onChange={(e) => setFilters({...filters, subcategory: e.target.value})}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-400 capitalize">{sub === 'all' ? 'All' : sub}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-300">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'under-300', label: 'Under $300' },
                    { value: '300-600', label: '$300 - $600' },
                    { value: 'over-600', label: 'Over $600' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={filters.priceRange === range.value}
                        onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-400">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Products</h2>
              <div className="text-sm text-gray-400">
                Showing {sortedProducts.length} of {categoryInfo.products.length} products
              </div>
            </div>
            
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No products found matching your criteria.</p>
                <button
                  onClick={() => setFilters({ subcategory: 'all', priceRange: 'all', sortBy: 'featured' })}
                  className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-2 px-4 rounded-lg font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.badge && (
                        <div className={`absolute top-4 left-4 bg-${categoryInfo.color}-500 text-black px-2 py-1 rounded-full text-xs font-bold`}>
                          {product.badge}
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg text-sm">
                        {getStarRating(product.rating)} ({product.reviews})
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                          <span className="text-xl font-bold text-[#D4AF37]">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-4">
                        Save {formatPrice(product.comparePrice - product.price)} ({Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%)
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-4">
                        <Link
                          href={`/shop/demo/${product.id}`}
                          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                        >
                          View Details
                        </Link>
                        <button className="bg-white/10 border border-white/20 px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Category Benefits */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our {categoryInfo.name}?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold mb-2">Professional Quality</h3>
                <p className="text-gray-400">Industrial-grade materials built to last in demanding environments</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Easy Installation</h3>
                <p className="text-gray-400">Quick setup with comprehensive instructions and mounting hardware</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold mb-2">Lifetime Warranty</h3>
                <p className="text-gray-400">Peace of mind with our comprehensive warranty coverage</p>
              </div>
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