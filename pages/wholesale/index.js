import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import { PUBLIC_PRODUCT_FIELDS, getPrimaryProductImage } from "../../lib/productFields";
import { buildCanonicalUrl } from "../../lib/seo";

export default function WholesalePage() {
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchProfile();
    
    // Countdown timer for urgency
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

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select(PUBLIC_PRODUCT_FIELDS)
      .or("is_active.eq.true,is_active.is.null")
      .limit(8);

    setProducts(data || []);
  };

  const fetchProfile = async () => {
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.user.id)
      .single();

    setProfile(data);
  };

  const role = profile?.role || "retail";
  const approved = profile?.approved || false;

  const testimonials = [
    {
      name: "Marcus Thompson",
      title: "E-commerce Entrepreneur",
      company: "Thompson Retail Group",
      quote: "Within 60 days I had my first wholesale order placed and my store was generating real revenue. The supplier relationships alone were worth the investment.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Sarah Chen",
      title: "Retail Store Owner",
      company: "Urban Style Boutique",
      quote: "I went from reselling retail to running three wholesale product lines with supplier access I could not have found on my own.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "James Rodriguez",
      title: "Supply Chain Manager",
      company: "Metro Distribution Co.",
      quote: "The volume pricing and consistent inventory flow has transformed our business model. We're now scaling at 3x our previous growth rate.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  ];

  const stats = [
    { label: "Verified Suppliers", value: "200+", highlight: true },
    { label: "Average Margin", value: "45-65%", highlight: true },
    { label: "Products Available", value: "1,000+", highlight: false },
    { label: "Global Reach", value: "45+ Countries", highlight: false }
  ];

  return (
    <>
      <Head>
        <title>Wholesale Supply Network | Premium B2B Inventory Access — KV Garage</title>
        <meta
          name="description"
          content="Access premium wholesale inventory with verified supplier relationships. Exclusive access for qualified resellers, retailers, and volume buyers. Limited capacity available."
        />
        <meta name="keywords" content="wholesale supply, B2B inventory, verified suppliers, volume pricing, reseller network, bulk purchasing" />
        <link rel="canonical" href={buildCanonicalUrl("/wholesale")} />
        <meta property="og:title" content="Wholesale Supply Network | Premium B2B Inventory Access — KV Garage" />
        <meta property="og:description" content="Access premium wholesale inventory with verified supplier relationships. Exclusive access for qualified resellers, retailers, and volume buyers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl("/wholesale")} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* 🔥 URGENT HEADER BANNER */}
        <div className="bg-gradient-to-r from-red-600/20 via-red-700/20 to-red-800/20 border border-red-500/30 text-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIMITED CAPACITY</span>
              </div>
              <span className="text-sm text-gray-300">Only 15 spots remaining for Q2 wholesale access</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-red-300">TIME LEFT:</span>
              <span className="text-white font-bold">{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* 🔥 HERO SECTION */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-6 mb-8">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-[#D4AF37]/30">INSTITUTIONAL GRADE</span>
                  <span className="text-gray-400 text-sm border border-white/20 px-4 py-2 rounded-full">EST. 2022</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                    Premium Wholesale
                  </span>
                  <br />
                  <span className="text-gray-300">Supply Network</span>
                </h1>

                <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl">
                  Access verified global suppliers, institutional pricing, and scalable inventory systems 
                  designed for serious operators. This is not retail arbitrage — this is professional supply chain access.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 p-6 rounded-xl">
                      <div className={`text-3xl font-bold ${stat.highlight ? 'text-[#D4AF37]' : 'text-white'}`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-300 mt-3">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/apply">
                    <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105">
                      Apply for Access
                    </button>
                  </Link>
                  
                  <Link href="/signup">
                    <button className="border border-white/30 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                      Create Account
                    </button>
                  </Link>
                </div>

                <div className="mt-8 text-sm text-gray-400">
                  <div className="flex flex-wrap gap-6">
                    <span>🔒 Secure Application Process</span>
                    <span>⚡ 24-48 Hour Review</span>
                    <span>📈 Volume-Based Pricing</span>
                    <span>🌐 Global Supplier Access</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">$2.1M</div>
                      <div className="text-sm text-gray-300">Monthly Volume Processed</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">97%</div>
                      <div className="text-sm text-gray-300">On-Time Delivery Rate</div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">45 Days</div>
                      <div className="text-sm text-gray-300">Average Payment Terms</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">24/7</div>
                      <div className="text-sm text-gray-300">Dedicated Support</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 ACCESS CONTROL MESSAGES */}
        {role === "retail" && (
          <section className="py-16 bg-gradient-to-r from-red-900/10 to-transparent border-t border-red-500/20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/30 p-10 rounded-2xl">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-semibold text-xl">RESTRICTED ACCESS</span>
                  <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-3xl font-bold mb-6">Wholesale Access Required</h3>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                  This is a professional supply network for verified businesses and serious operators. 
                  Access is restricted to maintain quality and exclusivity.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-8 text-sm text-gray-400">
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="font-semibold text-white mb-3 text-lg">Business Verification</div>
                    <div className="text-gray-300">Company registration or tax documentation required</div>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="font-semibold text-white mb-3 text-lg">Volume Commitment</div>
                    <div className="text-gray-300">Minimum order requirements apply</div>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="font-semibold text-white mb-3 text-lg">Credit Terms</div>
                    <div className="text-gray-300">Net 30-45 payment terms available</div>
                  </div>
                </div>
                <Link href="/signup">
                  <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105">
                    Start Application Process
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {role === "student" && !approved && (
          <section className="py-16 bg-gradient-to-r from-yellow-900/10 to-transparent border-t border-yellow-500/20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/30 p-10 rounded-2xl">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 font-semibold text-xl">PREVIEW MODE ACTIVE</span>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-3xl font-bold mb-6">Unlock Full Access</h3>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                  You're viewing limited inventory. Complete your application to access 
                  full wholesale pricing, volume discounts, and verified supplier relationships.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-8 text-sm text-gray-400">
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="font-semibold text-white mb-3 text-lg">Full Product Catalog</div>
                    <div className="text-gray-300">Access to 1,000+ wholesale products</div>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="font-semibold text-white mb-3 text-lg">Volume Pricing</div>
                    <div className="text-gray-300">Discounts scale with order size</div>
                  </div>
                </div>
                <Link href="/apply">
                  <button className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black px-12 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 transform hover:scale-105">
                    Complete Application
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 🔥 INVENTORY PREVIEW */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">Premium Inventory Preview</h2>
              <p className="text-xl text-gray-300">Curated products from verified global suppliers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p, index) => (
                <div key={p.id} className="group bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                  <div className="relative aspect-square overflow-hidden bg-gray-900">
                    {p.image && (
                      <Image 
                        src={getPrimaryProductImage(p)} 
                        alt={p.name} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-[#D4AF37]/30">WHOLESALE</span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="font-semibold text-xl mb-3 line-clamp-2">{p.name}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">{p.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {role === "wholesale" && approved ? (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Wholesale Price</div>
                            <div className="text-3xl font-bold text-[#D4AF37]">${p.price}</div>
                            <div className="text-sm text-gray-500">MOQ: {p.moq || '10 units'}</div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Access Required</div>
                            <div className="text-xl font-semibold text-gray-300">Login to View</div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Category</div>
                        <div className="text-base font-medium text-white capitalize">{p.category || 'General'}</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <Link href={`/wholesale/${p.category || 'general'}/${p.slug}`}>
                        <button className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <p className="text-gray-400 text-lg mb-8">This is just a preview of our full catalog</p>
              <Link href="/apply">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
                  Apply for Full Access
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 🔥 TESTIMONIALS */}
        <section className="py-24 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6">Trusted by Industry Leaders</h2>
              <p className="text-xl text-gray-300">Hear from businesses that have transformed their supply chain</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-10 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative w-20 h-20">
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-2xl text-white mb-2">{testimonial.name}</div>
                      <div className="text-lg text-gray-400 mb-1">{testimonial.title}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                  <blockquote className="text-gray-300 text-lg italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔥 FINAL CTA WITH URGENCY */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-3xl p-16 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-semibold text-2xl">FINAL OPPORTUNITY</span>
                <div className="w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              
              <h2 className="text-6xl font-bold mb-8">
                Join the <span className="text-[#D4AF37]">Premium</span> Supply Network
              </h2>

              <p className="text-2xl text-gray-300 mb-10 leading-relaxed max-w-4xl mx-auto">
                We're accepting our final 15 wholesale partners for Q2. Once these spots are filled, 
                applications will close until Q3. This network is designed for serious operators 
                who are ready to scale their supply chain and business operations.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-10 text-center">
                <div className="bg-white/10 p-8 rounded-xl border border-white/20 hover:border-[#D4AF37]/50 transition-all duration-300">
                  <div className="text-4xl font-bold text-[#D4AF37] mb-3">24-48 Hours</div>
                  <div className="text-sm text-gray-400">Application Review</div>
                </div>
                <div className="bg-white/10 p-8 rounded-xl border border-white/20 hover:border-[#D4AF37]/50 transition-all duration-300">
                  <div className="text-4xl font-bold text-[#D4AF37] mb-3">Net 30-45</div>
                  <div className="text-sm text-gray-400">Payment Terms</div>
                </div>
                <div className="bg-white/10 p-8 rounded-xl border border-white/20 hover:border-[#D4AF37]/50 transition-all duration-300">
                  <div className="text-4xl font-bold text-[#D4AF37] mb-3">Volume-Based</div>
                  <div className="text-sm text-gray-400">Pricing Structure</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/apply">
                  <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-14 py-5 rounded-xl font-bold text-2xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105">
                    Apply Now
                  </button>
                </Link>
                
                <Link href="/signup">
                  <button className="border border-white/30 text-white px-14 py-5 rounded-xl font-semibold text-xl hover:bg-white hover:text-black transition-all duration-300">
                    Create Account
                  </button>
                </Link>
              </div>

              <div className="mt-10 text-lg text-gray-400">
                <div className="flex flex-wrap justify-center gap-8">
                  <span>🔒 Secure & Confidential</span>
                  <span>⚡ Fast Approval Process</span>
                  <span>📈 Professional Network</span>
                  <span>🌐 Global Supplier Access</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                <p className="text-red-300 text-lg">
                  ⚠️ Warning: This is not a retail or dropshipping opportunity. 
                  We require serious business operators with volume purchasing capability.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}