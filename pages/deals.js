import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Deals() {

  const [loading, setLoading] = useState("");

  // 🔥 STRIPE BOOKING (WORKING)
  const handleCheckout = async () => {
    try {
      setLoading("booking");

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "call", // 🔥 make sure your API supports this
        }),
      });

      const data = await res.json();

      if (!data.url) {
        alert("Stripe failed");
        return;
      }

      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      alert("Checkout error");
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <Head>
        <title>Build System | Custom Business Infrastructure — KV Garage</title>
        <meta
          name="description"
          content="Custom-built systems engineered for real business operations. Websites, backend infrastructure, automation pipelines, and payment systems built as one complete operating system."
        />
        <meta name="keywords" content="business infrastructure, custom website development, backend systems, automation pipelines, payment integration, business systems" />
        <link rel="canonical" href="https://kvgarage.com/deals" />
        <meta property="og:title" content="Build System | Custom Business Infrastructure — KV Garage" />
        <meta property="og:description" content="Custom-built systems engineered for real business operations. Websites, backend infrastructure, automation pipelines, and payment systems built as one complete operating system." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kvgarage.com/deals" />
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
              <span className="text-sm text-gray-300">Only 5 custom builds available per quarter</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-red-300">BUILD SLOTS:</span>
              <span className="text-white font-bold">3/5 REMAINING</span>
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-6 mb-8">
                <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-[#D4AF37]/30">CUSTOM ENGINEERING</span>
                <span className="text-gray-400 text-sm border border-white/20 px-4 py-2 rounded-full">EST. 2022</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                  Build Your
                </span>
                <br />
                <span className="text-gray-300">Business Infrastructure</span>
              </h1>

              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-6 leading-relaxed">
                Custom-built systems engineered for real business operations. 
                Websites, backend infrastructure, automation pipelines, and payment systems 
                built as one complete operating system.
              </p>

              <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
                We don't build templates or cookie-cutter solutions. Every system is custom-engineered 
                to solve your specific business challenges and scale with your growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={handleCheckout}
                  className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-12 py-5 rounded-xl font-bold text-lg shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105"
                >
                  {loading === "booking" ? "Redirecting..." : "Reserve Strategy Session — $50"}
                </button>
                
                <Link href="/contact">
                  <button className="border border-white/30 text-white px-12 py-5 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                    Contact Us
                  </button>
                </Link>
              </div>

              <p className="text-sm text-gray-400 mt-4">
                Session fee is credited toward your build if we proceed.
              </p>
            </div>

            {/* TRUST INDICATORS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">50+</div>
                <div className="text-sm text-gray-400">Custom Systems Built</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">97%</div>
                <div className="text-sm text-gray-400">Client Retention Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">24-48 Hours</div>
                <div className="text-sm text-gray-400">Average Delivery Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">15K+</div>
                <div className="text-sm text-gray-400">Businesses Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* FULL SYSTEM INFRASTRUCTURE */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8 text-white">
                  Complete System Integration
                </h2>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Every build includes both frontend and backend systems designed 
                  to operate together — not separate tools. We create unified platforms 
                  that work seamlessly across all your business operations.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Frontend User Experience</h4>
                      <p className="text-gray-400">Intuitive interfaces designed for your specific user base and business goals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Backend Systems + Databases</h4>
                      <p className="text-gray-400">Robust server infrastructure with optimized database architecture</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Payment + Checkout Infrastructure</h4>
                      <p className="text-gray-400">Secure, compliant payment processing with multiple gateway options</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Automation + Workflows</h4>
                      <p className="text-gray-400">Streamlined business processes that eliminate manual work and reduce errors</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" className="rounded-xl w-full h-48 object-cover mb-4" />
                    <h4 className="font-semibold text-white mb-2">E-commerce Platforms</h4>
                    <p className="text-sm text-gray-400">Custom online stores with integrated inventory and order management</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" className="rounded-xl w-full h-48 object-cover mb-4" />
                    <h4 className="font-semibold text-white mb-2">CRM Systems</h4>
                    <p className="text-sm text-gray-400">Customer relationship management tailored to your business model</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                    <img src="https://images.unsplash.com/photo-1551434678-e076c223a692" className="rounded-xl w-full h-48 object-cover mb-4" />
                    <h4 className="font-semibold text-white mb-2">Inventory Management</h4>
                    <p className="text-sm text-gray-400">Real-time tracking and automated restocking systems</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                    <img src="https://images.unsplash.com/photo-1556740749-887f6717d7e4" className="rounded-xl w-full h-48 object-cover mb-4" />
                    <h4 className="font-semibold text-white mb-2">Analytics Dashboards</h4>
                    <p className="text-sm text-gray-400">Real-time business intelligence and performance tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6">Infrastructure Investment</h2>
              <p className="text-xl text-gray-300">Transparent pricing based on system scope and complexity</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* FOUNDATION */}
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Foundation</h3>
                  <div className="text-4xl font-extrabold text-[#D4AF37] mb-2">$1,500+</div>
                  <p className="text-gray-400">Starting investment</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Custom coded website (no templates)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Stripe / payment integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Basic backend setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Mobile responsive design</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                >
                  Start Project
                </button>
              </div>

              {/* GROWTH */}
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105 shadow-2xl shadow-[#D4AF37]/20">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Growth</h3>
                  <div className="text-4xl font-extrabold text-[#D4AF37] mb-2">$3,000 – $4,500</div>
                  <p className="text-gray-400">Most popular choice</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Full custom platform</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Backend database architecture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Automation workflows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">CRM integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Conversion-focused UI</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                >
                  Start Project
                </button>
              </div>

              {/* ENTERPRISE */}
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
                  <div className="text-4xl font-extrabold text-[#D4AF37] mb-2">$5,000+</div>
                  <p className="text-gray-400">Custom enterprise solutions</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Advanced backend systems</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Multi-product infrastructure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Custom dashboards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Full automation pipelines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-gray-300">Scalable architecture design</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                >
                  Start Project
                </button>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-400 text-lg">
                All projects include 30 days of post-launch support and documentation
              </p>
            </div>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section className="py-24 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6">Our Engineering Process</h2>
              <p className="text-xl text-gray-300">How we build systems that work for your business</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-black text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Discovery & Planning</h3>
                <p className="text-gray-400 leading-relaxed">
                  We analyze your business needs, goals, and existing systems to create a comprehensive project plan
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-black text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Design & Architecture</h3>
                <p className="text-gray-400 leading-relaxed">
                  Custom system architecture designed specifically for your requirements and scalability needs
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-black text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Development & Testing</h3>
                <p className="text-gray-400 leading-relaxed">
                  Rigorous development process with continuous testing to ensure quality and performance
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center hover:border-[#D4AF37]/50 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-black text-2xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Launch & Support</h3>
                <p className="text-gray-400 leading-relaxed">
                  Professional deployment with training and 30 days of post-launch support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LIMITED CAPACITY SECTION */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-3xl p-12">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-semibold text-2xl">LIMITED CAPACITY</span>
                <div className="w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              
              <h2 className="text-5xl font-bold mb-8">
                Only <span className="text-[#D4AF37]">5</span> Custom Builds Per Quarter
              </h2>

              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-4xl mx-auto">
                We maintain strict capacity limits to ensure every project receives our full attention 
                and expertise. This allows us to deliver exceptional quality and personalized service 
                for each client.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-10 text-center">
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-3">24-48 Hours</div>
                  <div className="text-sm text-gray-400">Average Delivery Time</div>
                </div>
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-3">97%</div>
                  <div className="text-sm text-gray-400">Client Satisfaction Rate</div>
                </div>
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-3">30 Days</div>
                  <div className="text-sm text-gray-400">Post-Launch Support</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={handleCheckout}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-14 py-5 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Reserve Your Spot
                </button>
                
                <Link href="/contact">
                  <button className="border border-white/30 text-white px-14 py-5 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                    Contact Sales
                  </button>
                </Link>
              </div>

              <div className="mt-8 text-sm text-gray-400">
                <div className="flex flex-wrap justify-center gap-6">
                  <span>🔒 Secure Development Process</span>
                  <span>⚡ Fast Turnaround Times</span>
                  <span>📈 Scalable Solutions</span>
                  <span>🌐 Industry Best Practices</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-bold mb-8">Ready to Build Your System?</h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Don't settle for off-the-shelf solutions that don't fit your business. 
              Let's create a custom system that grows with you and solves your unique challenges.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-12 py-5 rounded-xl font-bold text-lg shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105"
              >
                {loading === "booking" ? "Redirecting..." : "Start Your Project"}
              </button>
              
              <Link href="/contact">
                <button className="border border-white/30 text-white px-12 py-5 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                  Get in Touch
                </button>
              </Link>
            </div>

            <div className="mt-10 text-sm text-gray-400">
              <p>Questions? <Link href="/contact" className="text-[#D4AF37] hover:text-white transition-colors duration-300">Contact our team</Link> for a free consultation</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
