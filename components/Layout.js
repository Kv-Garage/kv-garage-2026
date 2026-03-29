import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { buildCanonicalUrl } from "../lib/seo";
import AffiliateTracker from "./AffiliateTracker";

const SEO_BY_PATH = {
  "/": {
    title: "KV Garage — Verified Wholesale Supplier | Retail, Mentorship & Trade Education",
    description:
      "KV Garage is your premier source for verified wholesale products, retail inventory, supplier sourcing, trade education, and business mentorship. Build your supply chain from the ground up.",
  },
  "/wholesale": {
    title: "Wholesale Products | Bulk Inventory Sourcing — KV Garage",
    description:
      "Access wholesale-priced inventory with verified supplier relationships. Ideal for resellers, retailers, and business owners ready to scale their supply chain.",
  },
  "/shop": {
    title: "Shop Retail Inventory | Ready-to-Ship Products — KV Garage",
    description:
      "Browse ready-to-ship retail products sourced for quality and resale potential. Single-unit and bulk purchasing available with tiered pricing.",
  },
  "/mentorship": {
    title: "Business Mentorship Program | Learn to Build a Profitable Resale Business — KV Garage",
    description:
      "Work directly with KV Garage to develop your wholesale strategy, supply chain, and business systems. Structured mentorship for serious entrepreneurs.",
  },
  "/trading": {
    title: "Trading Education | Inventory Trading Strategies — KV Garage",
    description:
      "Learn how to trade inventory, maximize margins, and build a repeatable trading system. Practical education for resellers and entrepreneurs.",
  },
  "/affiliate": {
    title: "Affiliate Program | Earn Commissions with KV Garage",
    description:
      "Join the KV Garage affiliate program and earn commissions by referring wholesale buyers, retail customers, and mentorship students.",
  },
  "/private-preview": {
    title: "Private Preview | Early Access to Verified Inventory — KV Garage",
    description:
      "Get early access to new wholesale drops and exclusive inventory before they go public. Private preview access for verified KV Garage members.",
  },
};

export default function Layout({ children }) {
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [captureForm, setCaptureForm] = useState({
    firstName: "",
    email: "",
    interest: "All of the Above",
  });
  const [captureLoading, setCaptureLoading] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [captureError, setCaptureError] = useState("");

  const itemCount = cart.length;
  const seo = SEO_BY_PATH[router.pathname];

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  //  LOGOUT
  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  useEffect(() => {
    let isMounted = true;

    const loadAdminState = async () => {
      if (!user?.id) {
        if (isMounted) setIsAdmin(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!isMounted) return;

      if (error) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(profile?.role === "admin");
    };

    loadAdminState();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch("/api/traffic-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user?.id || null,
            page: router.asPath,
            event_type: "page_view",
          }),
        });
      } catch (error) {
        console.error("Traffic event failed:", error);
      }
    };

    if (router.isReady) {
      trackPageView();
    }
  }, [router.isReady, router.asPath, user?.id]);

  const submitEmailCapture = async (event) => {
    event.preventDefault();
    setCaptureError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(captureForm.email || "").trim())) {
      setCaptureError("Please enter a valid email address.");
      return;
    }

    setCaptureLoading(true);

    try {
      const response = await fetch("/api/email-capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...captureForm,
          source: "footer",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Something went wrong. Please try again.");
      }

      setCaptureSuccess(true);
    } catch (error) {
      setCaptureError(error.message || "Something went wrong. Please try again.");
    } finally {
      setCaptureLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
      {seo ? (
        <Head>
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
          <link rel="canonical" href={buildCanonicalUrl(router.asPath.split("?")[0])} />
          <meta property="og:title" content={seo.title} />
          <meta property="og:description" content={seo.description} />
          <meta property="og:url" content={buildCanonicalUrl(router.asPath.split("?")[0])} />
          <meta property="og:image" content={buildCanonicalUrl("/logo/Kv%20garage%20icon.png")} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.title} />
          <meta name="twitter:description" content={seo.description} />
        </Head>
      ) : null}

      {/* ================= HEADER ================= */}
      <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-br from-white/5 to-transparent border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        
        {/* TOP ROW */}
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex justify-between items-center">
          
          {/* LOGO */}
          <Link href="/" aria-label="Go to homepage" className="flex items-center gap-4 group cursor-pointer">
            <div className="relative w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-2xl p-3 shadow-lg shadow-[#D4AF37]/30 group-hover:shadow-[#D4AF37]/50 transition-all duration-300 transform group-hover:scale-110">
              <Image 
                src="/logo/Kv%20garage%20icon.png" 
                alt="KV Garage Logo" 
                fill
                className="object-contain"
                priority={router.pathname === "/"} 
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                  KV GARAGE
                </span>
                <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
                  EST. 2022
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium tracking-wide">
                Verified Wholesale Supplier
              </p>
            </div>
          </Link>

          {/* 🔥 RIGHT SIDE (AUTH + CART) */}
          <div className="flex items-center gap-4">
            
            {/* AUTH */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <span className="text-sm border border-white/30 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 hover:border-[#D4AF37] transition-all duration-300">
                    Login
                  </span>
                </Link>

                <Link href="/signup">
                  <span className="text-sm bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                    Sign Up
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-400 bg-white/5 border border-white/20 px-3 py-2 rounded-lg">
                  {user?.email}
                </div>

                {isAdmin && (
                  <Link href="/admin">
                    <span className="text-xs border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F3D46A] px-3 py-2 rounded-lg hover:bg-[#D4AF37]/20 transition-all duration-300">
                      Admin Dashboard
                    </span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-sm border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            )}

            {/* CART */}
            <Link href="/cart">
              <div className="cursor-pointer bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-3 hover:border-[#D4AF37]/50 transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-xl p-2 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-300">Cart</div>
                    <div className="text-lg font-bold text-[#D4AF37]">
                      {itemCount} • ${totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

          </div>

        </div>

        {/* NAV */}
        <div className="w-full border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="flex flex-wrap gap-6 md:gap-8 justify-center text-sm font-medium">
              {[
                { name: "Home", href: "/" },
                { name: "Wholesale", href: "/wholesale" },
                { name: "Retail", href: "/shop" },
                { name: "Private Preview", href: "/private-preview" },
                { name: "Mentorship", href: "/mentorship" },
                { name: "Affiliate", href: "/affiliate" },
                { name: "Trading", href: "/trading" },
                { name: "Learn", href: "/learn" },
                { name: "Deals", href: "/deals" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    router.pathname === item.href
                      ? "bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-semibold shadow-lg shadow-[#D4AF37]/30"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

      </header>

      {/* CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/20 bg-gradient-to-br from-white/5 to-transparent">
        
        {/* Email Capture Section */}
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">INSIDER ACCESS</span>
                  <span className="text-gray-400 text-sm">EST. 2022</span>
                </div>
                
                <h3 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                    Get Wholesale Drops,
                  </span>
                  <br />
                  <span className="text-gray-300">Supplier Alerts &</span>
                  <br />
                  <span className="text-[#D4AF37]">Exclusive Deals First</span>
                </h3>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl">
                  Join thousands of entrepreneurs getting early access to verified inventory, wholesale pricing updates,
                  mentorship spots, and profit opportunities before anyone else.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                    <div className="text-3xl mb-4">📦</div>
                    <h4 className="font-semibold mb-2">Early Access</h4>
                    <p className="text-sm text-gray-400">New wholesale drops before they go public</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                    <div className="text-3xl mb-4">📈</div>
                    <h4 className="font-semibold mb-2">Exclusive Deals</h4>
                    <p className="text-sm text-gray-400">Special pricing and volume discounts</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                    <div className="text-3xl mb-4">🎯</div>
                    <h4 className="font-semibold mb-2">Supplier Alerts</h4>
                    <p className="text-sm text-gray-400">Margin tips and sourcing opportunities</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 shadow-xl">
                {captureSuccess ? (
                  <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                    <div className="text-8xl mb-6">✓</div>
                    <h4 className="text-3xl font-bold text-[#D4AF37] mb-4">You're In!</h4>
                    <p className="text-gray-300 text-lg max-w-md">
                      Check your inbox. Your first insider drop is on its way.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submitEmailCapture} className="space-y-6">
                    <div>
                      <h4 className="text-2xl font-bold mb-2">Join the Inside Track</h4>
                      <p className="text-gray-400">No spam. No noise. Just verified opportunities and real business intelligence.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        value={captureForm.firstName}
                        onChange={(event) => setCaptureForm((prev) => ({ ...prev, firstName: event.target.value }))}
                        placeholder="First Name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                      <input
                        type="email"
                        value={captureForm.email}
                        onChange={(event) => setCaptureForm((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="Email Address"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </div>

                    <select
                      value={captureForm.interest}
                      onChange={(event) => setCaptureForm((prev) => ({ ...prev, interest: event.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                    >
                      {["Wholesale", "Retail Deals", "Mentorship", "All of the Above"].map((option) => (
                        <option key={option} value={option} className="bg-gradient-to-br from-white/5 to-transparent">
                          {option}
                        </option>
                      ))}
                    </select>

                    {captureError && (
                      <p className="text-red-400 text-sm">{captureError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={captureLoading}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {captureLoading ? "Submitting..." : "Get Insider Access →"}
                    </button>
                    
                    <p className="text-xs text-gray-400 text-center">
                      Zero spam. Unsubscribe anytime. Your information is never sold or shared.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-6 group">
                <div className="relative w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-2xl p-3 shadow-lg shadow-[#D4AF37]/30 group-hover:shadow-[#D4AF37]/50 transition-all duration-300 transform group-hover:scale-110">
                  <Image src="/logo/Kv%20garage%20icon.png" alt="KV Garage Logo" fill className="object-contain" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#D4AF37] mb-1">KV GARAGE</h4>
                  <p className="text-gray-400">Verified Wholesale Supplier</p>
                </div>
              </Link>

              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Verified wholesale supplier access, retail inventory, dropshipping pathways, trade education, and business mentorship for operators building a stronger resale business.
              </p>

              <div className="mt-8 flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#D4AF37]">15K+</div>
                  <div className="text-sm text-gray-400">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#D4AF37]">45+</div>
                  <div className="text-sm text-gray-400">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#D4AF37]">2022</div>
                  <div className="text-sm text-gray-400">Est. Year</div>
                </div>
              </div>
            </div>

            <FooterCol title="Core" links={[
              { name: "Wholesale", href: "/wholesale" },
              { name: "Retail", href: "/shop" },
              { name: "Build System", href: "/deals" },
            ]} />

            <FooterCol title="Systems" links={[
              { name: "Mentorship", href: "/mentorship" },
              { name: "Trading", href: "/trading" },
              { name: "Learn", href: "/learn" },
            ]} />

            <FooterCol title="Network" links={[
              { name: "Affiliate", href: "/affiliate" },
              { name: "Private Preview", href: "/private-preview" },
            ]} />

          </div>

          <div className="border-t border-white/20 mt-12 pt-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-300 text-lg max-w-3xl">
                  KV Garage helps buyers, resellers, and students source verified products, unlock wholesale supplier relationships, improve profit margins, and build repeatable systems around retail inventory and supply chain growth.
                </p>
                <div className="mt-6 text-gray-400">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#D4AF37]">✉️</span>
                    <span>kvgarage@kvgarage.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">📍</span>
                    <span>Grand Rapids, Michigan • United States</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-lg">Quick Links</h5>
                <div className="grid grid-cols-2 gap-2 text-gray-400">
                  <Link href="/about" className="hover:text-white transition-colors duration-300">About</Link>
                  <Link href="/contact" className="hover:text-white transition-colors duration-300">Contact</Link>
                  <Link href="/track-order" className="hover:text-white transition-colors duration-300">Track Order</Link>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
                  <Link href="/terms-and-conditions" className="hover:text-white transition-colors duration-300">Terms</Link>
                  <Link href="/refund-policy" className="hover:text-white transition-colors duration-300">Refund Policy</Link>
                  <Link href="/shipping-policy" className="hover:text-white transition-colors duration-300">Shipping</Link>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 mt-10 pt-8 text-center text-gray-400">
              <p className="text-lg font-semibold text-[#D4AF37] mb-2">Trusted by 15,000+ Operators Worldwide</p>
              <p className="text-sm">© 2026 KV Garage LLC. All rights reserved.</p>
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <Link href={href} className="hover:text-[#D4AF37] transition">
      {children}
    </Link>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h5 className="font-semibold text-lg mb-6">{title}</h5>
      <ul className="space-y-3 text-gray-400">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="hover:text-white transition-colors duration-300">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}