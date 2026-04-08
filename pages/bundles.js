import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { buildCanonicalUrl } from "../lib/seo";
import UrgencyBar from "../components/UrgencyBar";
import { getProducts as getShopifyProducts } from "../lib/shopify";
import { calculatePrice } from "../lib/pricing";
import { getPrimaryProductImage } from "../lib/productFields";
import { supabase } from "../lib/supabase";

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function BundlesPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch database products
      const response = await fetch("/api/public-products?limit=200", {
        headers: await getAuthHeaders(),
      });
      const payload = await response.json();
      let dbProds = [];
      
      if (response.ok) {
        dbProds = payload.products || [];
      }

      // Fetch Shopify products (same logic as shop page)
      let shopifyProds = [];
      try {
        const sp = await getShopifyProducts(50);
        shopifyProds = sp.map(s => {
          // Extract image URLs from Shopify's nested structure
          const imageUrlArray = s.images && s.images.length > 0
            ? s.images.map(img => img.url).filter(Boolean)
            : [];
          
          return {
            ...s,
            id: `shopify_${s.id}`,
            name: s.title,
            slug: `shopify_${s.handle}`,
            display_price: s.price,
            price: s.price,
            category: s.productType || 'Health & Beauty',
            source: 'shopify',
            image: s.image || (imageUrlArray.length > 0 ? imageUrlArray[0] : '/placeholder.jpg'),
            images: imageUrlArray,
            retail_price: calculatePrice({ cost: s.price || 0, role: 'retail' }),
            student_price: calculatePrice({ cost: s.price || 0, role: 'student' }),
            wholesale_price: calculatePrice({ cost: s.price || 0, role: 'wholesale', approved: true }),
          };
        });
      } catch (shopifyError) {
        console.error('Shopify products fetch error:', shopifyError);
      }

      // Combine both sources
      const combined = [...dbProds, ...shopifyProds];
      setProducts(combined);
      setLoading(false);
    } catch (error) {
      console.error("Products fetch error:", error);
      setLoading(false);
    }
  };

  const getPrice = (p) => {
    if (p?.display_price != null) {
      return p.display_price;
    }
    return p.retail_price || p.price;
  };

  // Helper to find products by category/keyword
  const findProductsByCategory = (category, keywords = [], count = 3) => {
    const categoryProducts = products.filter(p => 
      p.category && (
        p.category.toLowerCase().includes(category.toLowerCase()) ||
        keywords.some(kw => p.name.toLowerCase().includes(kw.toLowerCase()))
      )
    );
    return categoryProducts.slice(0, count);
  };

  // Create dynamic bundles from real products
  const garageStorageProducts = findProductsByCategory('garage', ['storage', 'shelving', 'cabinet', 'rack'], 3);
  const workbenchProducts = findProductsByCategory('workbench', ['work', 'bench', 'desk', 'table'], 3);
  const wallProducts = findProductsByCategory('wall', ['pegboard', 'hook', 'organize', 'slat'], 4);

  // Build bundles from real products
  const bundles = [
    {
      id: "starter-garage-setup",
      name: "Starter Garage Setup",
      description: "Everything you need to get your garage organized and functional.",
      items: garageStorageProducts.length > 0 ? garageStorageProducts : [
        { id: 'shelving-1', name: 'Heavy-Duty Shelving Unit', price: 199.99, image: '/placeholder.jpg', category: 'garage-storage' },
        { id: 'hooks-1', name: 'Wall-Mounted Hooks Set', price: 49.99, image: '/placeholder.jpg', category: 'garage-storage' },
        { id: 'bins-1', name: 'Storage Bins (Set of 4)', price: 79.99, image: '/placeholder.jpg', category: 'garage-storage' }
      ],
      category: "garage-storage"
    },
    {
      id: "pro-workspace-kit",
      name: "Pro Workspace Kit",
      description: "Professional-grade workbench setup for serious projects.",
      items: workbenchProducts.length > 0 ? workbenchProducts : [
        { id: 'bench-1', name: 'Industrial Workbench', price: 499.99, image: '/placeholder.jpg', category: 'workbenches' },
        { id: 'pegboard-1', name: 'Heavy-Duty Pegboard', price: 129.99, image: '/placeholder.jpg', category: 'workbenches' },
        { id: 'lighting-1', name: 'LED Workshop Lighting', price: 89.99, image: '/placeholder.jpg', category: 'workbenches' }
      ],
      category: "workbenches"
    },
    {
      id: "full-garage-upgrade",
      name: "Full Garage Upgrade",
      description: "Complete transformation for maximum storage and functionality.",
      items: wallProducts.length > 0 ? wallProducts : [
        { id: 'cabinets-1', name: 'Garage Cabinets (Set of 3)', price: 799.99, image: '/placeholder.jpg', category: 'wall-organization' },
        { id: 'overhead-1', name: 'Overhead Storage Rack', price: 299.99, image: '/placeholder.jpg', category: 'wall-organization' },
        { id: 'shelving-2', name: 'Heavy-Duty Shelving System', price: 399.99, image: '/placeholder.jpg', category: 'wall-organization' },
        { id: 'wall-org-1', name: 'Wall Organization Kit', price: 199.99, image: '/placeholder.jpg', category: 'wall-organization' }
      ],
      category: "wall-organization"
    }
  ];

  // Calculate bundle pricing
  const calculatedBundles = bundles.map(bundle => {
    const originalPrice = bundle.items.reduce((sum, item) => sum + (getPrice(item) || item.price || 0), 0);
    const saveAmount = Math.round(originalPrice * 0.15); // 15% bundle discount
    const bundlePrice = originalPrice - saveAmount;
    
    return {
      ...bundle,
      originalPrice,
      saveAmount,
      bundlePrice,
      savePercentage: Math.round((saveAmount / originalPrice) * 100)
    };
  });

  const handleAddBundleToCart = (bundle) => {
    bundle.items.forEach(item => {
      addToCart({
        id: `${bundle.id}-${item.id || item.name}`,
        name: item.name,
        price: getPrice(item) || item.price,
        quantity: 1,
        image: getPrimaryProductImage(item) || item.image,
        category: bundle.category,
        slug: item.slug || item.id,
        isBundleItem: true,
        bundleId: bundle.id
      });
    });
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Garage Storage Bundles | Save Up to 30% - KV Garage</title>
          <meta name="description" content="Save big with our expertly curated garage storage bundles." />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading bundles...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Garage Storage Bundles | Save Up to 30% - KV Garage</title>
        <meta
          name="description"
          content="Save big with our expertly curated garage storage bundles. Get everything you need for your workspace at discounted prices with professional-grade quality."
        />
        <link rel="canonical" href={buildCanonicalUrl("/bundles")} />
        <meta property="og:title" content="Garage Storage Bundles | Save Up to 30% - KV Garage" />
        <meta
          property="og:description"
          content="Save big with our expertly curated garage storage bundles. Get everything you need for your workspace at discounted prices with professional-grade quality."
        />
        <meta property="og:url" content={buildCanonicalUrl("/bundles")} />
        <meta property="og:type" content="product.group" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        <UrgencyBar />

        {/* Hero Section */}
        <section className="py-20 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm font-semibold">BUNDLE & SAVE</span>
              <span className="text-gray-400 text-sm">EST. 2022</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                Garage Storage Bundles
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Get everything you need to transform your garage into a professional workspace. 
              Our expertly curated bundles save you up to 30% compared to buying items individually, 
              with professional-grade quality and industrial durability.
            </p>

            {/* Savings Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="text-xl font-bold mb-2">Save Up to 30%</h3>
                <p className="text-gray-400 text-sm">Bundle pricing saves you hundreds</p>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="text-xl font-bold mb-2">Everything Included</h3>
                <p className="text-gray-400 text-sm">Complete setups, no guesswork</p>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-2">🔧</div>
                <h3 className="text-xl font-bold mb-2">Professional Quality</h3>
                <p className="text-gray-400 text-sm">Industrial-grade durability</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bundle Showcase */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {calculatedBundles.map((bundle, index) => (
                <div key={bundle.id} className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                  {/* Bundle Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">SAVE ${bundle.saveAmount.toFixed(2)}</span>
                      <h3 className="text-2xl font-bold mt-2 group-hover:text-[#D4AF37] transition-colors duration-300">{bundle.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 line-through">${bundle.originalPrice.toFixed(2)}</p>
                      <p className="text-3xl font-bold text-[#D4AF37]">${bundle.bundlePrice.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Bundle Description */}
                  <p className="text-gray-300 mb-8 leading-relaxed">{bundle.description}</p>

                  {/* Included Items */}
                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-lg mb-4">What's Included:</h4>
                    {bundle.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                            <img
                              src={getPrimaryProductImage(item) || item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <h5 className="font-medium">{item.name}</h5>
                            <p className="text-sm text-gray-400">Professional grade</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 line-through">${(getPrice(item) || item.price).toFixed(2)}</p>
                          <p className="text-green-400 font-semibold">Included</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bundle Value */}
                  <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-400 font-semibold">Bundle Value</p>
                        <p className="text-xs text-gray-400">You save ${bundle.saveAmount.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">{bundle.savePercentage}% OFF</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-4">
                    <button
                      onClick={() => handleAddBundleToCart(bundle)}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-lg font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Add Bundle to Cart - ${bundle.bundlePrice.toFixed(2)}
                    </button>
                    
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                      <span>✅ Free Shipping</span>
                      <span>✅ 1-Year Warranty</span>
                      <span>✅ Easy Returns</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Bundles Section */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose Our Bundles?</h2>
              <p className="text-gray-300 text-lg">Expertly designed for maximum value and functionality</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Perfect Match</h3>
                <p className="text-gray-400">All components work together seamlessly for optimal garage organization</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-3">Maximum Savings</h3>
                <p className="text-gray-400">Bundle pricing saves you significantly compared to individual purchases</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-3">Quick Setup</h3>
                <p className="text-gray-400">Everything you need in one package - no research or guesswork required</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold mb-3">Professional Quality</h3>
                <p className="text-gray-400">Industrial-grade materials built to last in demanding environments</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-300">Join thousands of satisfied customers who've transformed their garages</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center text-black font-bold">JD</div>
                  <div>
                    <h4 className="font-bold">John D.</h4>
                    <p className="text-sm text-gray-400">Auto Enthusiast</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"The Pro Workspace Kit completely transformed my garage. Everything fits perfectly and the quality is outstanding. Saved me hours of research and hundreds of dollars!"</p>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center text-black font-bold">MW</div>
                  <div>
                    <h4 className="font-bold">Mike W.</h4>
                    <p className="text-sm text-gray-400">Woodworker</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"I've been using the Starter Garage Setup for 6 months now and it's held up perfectly. The workbench is rock solid and the storage keeps everything organized."</p>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center text-black font-bold">SR</div>
                  <div>
                    <h4 className="font-bold">Sarah R.</h4>
                    <p className="text-sm text-gray-400">Home Organizer</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"The Full Garage Upgrade was worth every penny. My garage went from cluttered mess to organized workspace in one weekend. The cabinets are especially impressive."</p>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-white/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Garage?</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Don't miss out on these incredible bundle savings. Limited quantities available - 
              once they're gone, they're gone!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-2xl mb-2">🚚</div>
                <h3 className="font-bold mb-2">Fast Shipping</h3>
                <p className="text-sm text-gray-400">48-hour dispatch</p>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-2xl mb-2">🛡️</div>
                <h3 className="font-bold mb-2">1-Year Warranty</h3>
                <p className="text-sm text-gray-400">Peace of mind guaranteed</p>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-2xl mb-2">🔄</div>
                <h3 className="font-bold mb-2">30-Day Returns</h3>
                <p className="text-sm text-gray-400">Hassle-free returns</p>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/shop">
                <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-8 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                  Browse All Bundles
                </button>
              </Link>
              <p className="text-sm text-gray-400">Questions? <Link href="/contact" className="text-[#D4AF37] hover:text-yellow-400">Contact our team</Link></p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}