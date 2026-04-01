import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "../../context/CartContext";
import { trackEvent, EVENT_TYPES } from "../../lib/analytics";
import { normalizeCJProduct } from "../../lib/cjProduct";

const CJ_PRODUCT_ID = "1058688770"; // The product ID from the DHGate link

export default function CJLeatherFlat() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Track product view
    trackEvent(EVENT_TYPES.VIEWED_PRODUCT, {
      product_id: 'cj-leather-flat',
      product_name: "Women's Soft Leather Flat",
      source: 'cj',
      platform: 'CJ Dropshipping'
    });
  }, []);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft("00:00:00");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCJProduct = async () => {
      setLoading(true);
      setError("");
      
      try {
        // Fetch product from CJ API
        const response = await fetch(`/api/cj/products/${CJ_PRODUCT_ID}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not fetch product from CJ");
        }

        // Normalize the CJ product data
        const normalizedProduct = normalizeCJProduct(data.product, {
          markupMultiplier: 1.5 // 50% markup for retail
        });

        setProduct(normalizedProduct);
      } catch (err) {
        console.error("Error fetching CJ product:", err);
        setError("Unable to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCJProduct();
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id || product.cj_product_id || 'cj-leather-flat',
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category || "Footwear",
      fulfillment_type: "dropship",
      supplier: "cj"
    });

    // Track add to cart event
    trackEvent(EVENT_TYPES.ADD_TO_CART, {
      product_id: product.id || product.cj_product_id,
      product_name: product.name,
      price: product.price,
      fulfillment_type: "dropship",
      supplier: "cj"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading product from CJ Dropshipping...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-4xl font-bold mb-4">Product Unavailable</h1>
          <p className="text-gray-300 mb-8">{error}</p>
          <div className="space-y-4">
            <Link href="/shop">
              <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                Browse Other Products
              </button>
            </Link>
            <Link href="/wholesale">
              <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300 ml-4">
                Explore Wholesale
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">📦</div>
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-300 mb-8">This product is no longer available in our CJ Dropshipping catalog.</p>
          <div className="space-y-4">
            <Link href="/shop">
              <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                Browse Other Products
              </button>
            </Link>
            <Link href="/wholesale">
              <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300 ml-4">
                Explore Wholesale
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} - CJ Dropshipping | KV Garage</title>
        <meta name="description" content={product.description || `${product.name} - Dropshipped directly from CJ. No inventory needed.`} />
        <meta property="og:title" content={`${product.name} - CJ Dropshipping | KV Garage`} />
        <meta property="og:description" content={product.description || "Dropshipped directly from CJ. No inventory needed."} />
        <meta property="og:image" content={product.image || "/placeholder.jpg"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* 🔥 URGENT HEADER */}
        <div className="bg-gradient-to-r from-green-600/20 via-green-700/20 to-green-800/20 border border-green-500/30 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">CJ DROPSHIP</span>
              </div>
              <span className="text-sm text-gray-300">No inventory needed - shipped directly from supplier</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-green-300">TIME LEFT:</span>
              <span className="text-white font-bold">{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* 🔥 PRODUCT HERO */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Product Image */}
              <div className="relative">
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-white/10 mb-6">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-xl font-bold text-center text-xl">
                      DROP SHIP
                    </div>
                    <div className="flex-1 border border-white/30 py-4 px-6 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Fulfillment</div>
                      <div className="text-lg font-semibold">CJ Direct</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#D4AF37]/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-500/20 rounded-full blur-2xl"></div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-semibold">
                      CJ DROPSHIP
                    </span>
                    <span className="text-green-400 text-sm font-semibold">● Ready to Ship</span>
                  </div>
                  
                  <h1 className="text-5xl font-bold mb-6 leading-tight">
                    {product.name}
                  </h1>
                  
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {product.description || "Premium quality product available through CJ Dropshipping. No inventory required - shipped directly from supplier."}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Your Price</p>
                      <p className="text-4xl font-bold text-[#D4AF37]">${Number(product.price || 0).toFixed(2)}</p>
                    </div>
                    {product.compare_price && (
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-2">Market Price</p>
                        <p className="text-2xl text-gray-500 line-through">${Number(product.compare_price).toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📦</div>
                      <div>
                        <p className="font-semibold text-green-300">CJ Dropshipping</p>
                        <p className="text-sm text-gray-300">No inventory needed - automatic fulfillment</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-6 px-8 rounded-xl font-bold text-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                    <Link href="/cart">
                      <button className="border border-white/30 text-white px-8 py-6 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                        View Cart
                      </button>
                    </Link>
                  </div>
                  
                  <p className="text-xs text-gray-400 text-center mt-4">
                    Product will be shipped directly from CJ Dropshipping
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">📦</div>
                    <div className="text-sm text-gray-300">Dropship</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">⚡</div>
                    <div className="text-sm text-gray-300">Fast Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 PRODUCT DETAILS */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Product Details</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">About This Product</h3>
                  <p className="text-gray-300 leading-relaxed">
                    This product is available through CJ Dropshipping, allowing you to sell without holding inventory. 
                    When a customer places an order, it's automatically fulfilled and shipped directly from the supplier.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Key Features</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                      No upfront inventory costs
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                      Automatic order fulfillment
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                      Global shipping available
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                      Real-time inventory updates
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">How It Works</h3>
                  <ol className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                      <div>
                        <strong>Customer Orders:</strong> Customer adds to cart and checks out
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                      <div>
                        <strong>Order Processed:</strong> Order details sent to CJ automatically
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                      <div>
                        <strong>Supplier Ships:</strong> CJ fulfills and ships directly to customer
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                      <div>
                        <strong>Track & Deliver:</strong> Customer receives tracking info and package
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 CALL TO ACTION */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl p-12">
              <h2 className="text-5xl font-bold mb-6">Ready to Start Dropshipping?</h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Add this product to your cart and experience CJ Dropshipping fulfillment. 
                No inventory, no hassle - just pure profit potential.
              </p>
              
              <div className="flex gap-6 justify-center">
                <button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-16 py-6 rounded-xl font-bold text-2xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                >
                  Add to Cart
                </button>
                <Link href="/shop">
                  <button className="border border-white/30 text-white px-12 py-6 rounded-xl font-semibold text-xl hover:bg-white hover:text-black transition-all duration-300">
                    Browse Products
                  </button>
                </Link>
              </div>
              
              <p className="text-sm text-gray-400 mt-6">
                Orders are automatically fulfilled through CJ Dropshipping
              </p>
            </div>
          </div>
        </section>

        {/* 🔥 DISCLAIMER */}
        <section className="py-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-400 leading-relaxed">
              <strong>Dropshipping:</strong> This product is fulfilled through CJ Dropshipping. 
              When you purchase, the order is automatically sent to CJ for fulfillment and shipping. 
              Shipping times and tracking will be provided by the supplier.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}