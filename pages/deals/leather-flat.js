import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trackEvent, EVENT_TYPES } from "../../lib/analytics";

const AFFILIATE_LINK = "https://www.dhgate.com/product/women-s-soft-leather-flat-new-hot-casual/1058688770.html?f=bm%7Caff%7Cyfaf%7C2849490%7C2849490_2851396_500165%7CL69cabecbe4b08e20d015241a%7C";
const PRODUCT_IMAGE = "https://www.dhresource.com/f3/albu/bw/l/30/d67e641e-16aa-4be4-9454-eae599682426.jpg";
const COUPON_VALUE = 50;

export default function LeatherFlatDeal() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Track affiliate product view
    trackEvent(EVENT_TYPES.VIEWED_PRODUCT, {
      product_id: 'dhgate-leather-flat',
      product_name: "Women's Soft Leather Flat",
      source: 'affiliate',
      platform: 'DHGate'
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

  const handleAffiliateClick = () => {
    // Track affiliate click
    trackEvent('Affiliate Click', {
      product_id: 'dhgate-leather-flat',
      product_name: "Women's Soft Leather Flat",
      destination: 'DHGate',
      coupon_value: COUPON_VALUE
    });
    
    // Open affiliate link in new tab
    window.open(AFFILIATE_LINK, '_blank');
  };

  return (
    <>
      <Head>
        <title>Women's Soft Leather Flat - Exclusive Deal | KV Garage</title>
        <meta name="description" content="Get $50 off Women's Soft Leather Flat - New Hot Casual Square Toe Single Shoes. Limited time affiliate deal with exclusive coupon." />
        <meta property="og:title" content="Women's Soft Leather Flat - $50 OFF | KV Garage" />
        <meta property="og:description" content="Exclusive deal: Women's Soft Leather Flat with $50 coupon. Limited time offer!" />
        <meta property="og:image" content={PRODUCT_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* 🔥 URGENT HEADER */}
        <div className="bg-gradient-to-r from-green-600/20 via-green-700/20 to-green-800/20 border border-green-500/30 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIMITED TIME DEAL</span>
              </div>
              <span className="text-sm text-gray-300">Exclusive affiliate offer - save $50 today only!</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-green-300">EXPIRES:</span>
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
                      src={PRODUCT_IMAGE} 
                      alt="Women's Soft Leather Flat" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-xl font-bold text-center text-xl">
                      $50 OFF
                    </div>
                    <div className="flex-1 border border-white/30 py-4 px-6 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Coupon</div>
                      <div className="text-lg font-semibold">SAVE $50</div>
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
                      AFFILIATE DEAL
                    </span>
                    <span className="text-green-400 text-sm font-semibold">● In Stock</span>
                  </div>
                  
                  <h1 className="text-5xl font-bold mb-6 leading-tight">
                    Women's Soft Leather Flat
                  </h1>
                  
                  <p className="text-xl text-gray-300 leading-relaxed">
                    New Hot Casual Square Toe Single Shoes For Spring & Autumn. 
                    Premium quality leather flats perfect for everyday wear.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Original Price</p>
                      <p className="text-2xl text-gray-500 line-through">$199.99</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-2">With Coupon</p>
                      <p className="text-4xl font-bold text-[#D4AF37]">$149.99</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎫</div>
                      <div>
                        <p className="font-semibold text-green-300">Exclusive $50 Coupon</p>
                        <p className="text-sm text-gray-300">Applied automatically at checkout</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAffiliateClick}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-6 px-8 rounded-xl font-bold text-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Deal & Save $50
                  </button>
                  
                  <p className="text-xs text-gray-400 text-center mt-4">
                    You'll be redirected to DHGate to complete your purchase
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">4.8★</div>
                    <div className="text-sm text-gray-300">Customer Rating</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">2,500+</div>
                    <div className="text-sm text-gray-300">Sold</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 FEATURES */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Why This Deal?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="text-5xl mb-6">💰</div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Save $50 Today</h3>
                <p className="text-gray-300 leading-relaxed">
                  Exclusive affiliate coupon saves you $50 on this premium leather flat. 
                  Limited time offer available only through our link.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="text-5xl mb-6">✨</div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Premium Quality</h3>
                <p className="text-gray-300 leading-relaxed">
                  Soft genuine leather construction with comfortable square toe design. 
                  Perfect for spring and autumn wear with versatile styling.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 text-center hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="text-5xl mb-6">🚚</div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Fast Shipping</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ships worldwide from DHGate with tracking. 
                  Buyer protection included for secure shopping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 CALL TO ACTION */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl p-12">
              <h2 className="text-5xl font-bold mb-6">Don't Miss This Deal!</h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                This exclusive $50 discount won't last long. Click below to claim your coupon 
                and complete your purchase on DHGate.
              </p>
              
              <button
                onClick={handleAffiliateClick}
                className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-16 py-6 rounded-xl font-bold text-2xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
              >
                Claim $50 Off Now
              </button>
              
              <p className="text-sm text-gray-400 mt-6">
                By clicking, you support our site at no extra cost to you
              </p>
            </div>
          </div>
        </section>

        {/* 🔥 DISCLAIMER */}
        <section className="py-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-400 leading-relaxed">
              <strong>Disclosure:</strong> This is an affiliate link. When you make a purchase through this link, 
              we may earn a commission at no additional cost to you. The $50 discount is provided by the merchant 
              and applied automatically at checkout. Prices and availability subject to change.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}