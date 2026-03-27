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
    <div className="min-h-screen flex flex-col bg-[#05070D] text-white">
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
      <header className="w-full bg-[#05070D] border-b border-[#1C2233] sticky top-0 z-50">

        {/* TOP ROW */}
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex justify-between items-center">

          {/* LOGO */}
          <Link href="/" aria-label="Go to homepage" className="flex items-center gap-2.5 cursor-pointer">
            <Image src="/logo/Kv%20garage%20icon.png" alt="" width={36} height={36} className="h-8 w-8 md:h-9 md:w-9 object-contain flex-shrink-0" priority={router.pathname === "/"} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] md:text-base font-semibold tracking-[0.08em] leading-none">
                KV GARAGE
              </span>
              <span className="text-[10px] md:text-[11px] text-gray-500 font-normal tracking-[0.06em] uppercase">
                Verified Supplies
              </span>
            </div>
          </Link>

          {/* 🔥 RIGHT SIDE (AUTH + CART) */}
          <div className="flex items-center gap-3">

            {/* AUTH */}
            {!user ? (
              <>
                <Link href="/login">
                  <span className="text-sm border px-3 py-2 rounded cursor-pointer hover:border-[#D4AF37] transition">
                    Login
                  </span>
                </Link>

                <Link href="/signup">
                  <span className="text-sm bg-[#D4AF37] text-black px-3 py-2 rounded cursor-pointer">
                    Sign Up
                  </span>
                </Link>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-400 hidden md:block">
                  {user?.email}
                </span>

                {isAdmin && (
                  <Link href="/admin">
                    <span className="text-xs border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F3D46A] px-3 py-2 rounded cursor-pointer hover:bg-[#D4AF37]/15 transition">
                      Admin Dashboard
                    </span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-xs border px-3 py-2 rounded hover:border-red-500 transition"
                >
                  Logout
                </button>
              </>
            )}

            {/* CART */}
            <Link href="/cart">
              <div className="cursor-pointer bg-[#111827] hover:bg-[#1A2235] px-4 py-2 rounded-md text-sm flex items-center gap-2 transition">
                <span>🛒</span>
                <span>{itemCount}</span>
                <span className="text-[#D4AF37]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </Link>

          </div>

        </div>

        {/* NAV */}
        <div className="w-full border-t border-[#1C2233]">
          <div className="max-w-7xl mx-auto px-6 py-2.5 md:py-3 flex items-center justify-center overflow-x-auto">
            <nav className="flex gap-6 md:gap-8 text-[13px] md:text-sm font-medium text-gray-400 whitespace-nowrap">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/wholesale">Wholesale</NavLink>
              <NavLink href="/shop">Retail</NavLink>
              <NavLink href="/private-preview">Private Preview</NavLink>
              <NavLink href="/mentorship">Mentorship</NavLink>
              <NavLink href="/affiliate">Affiliate</NavLink>
              <NavLink href="/trading">Trading</NavLink>
              <NavLink href="/learn">Learn</NavLink>
              <NavLink href="/deals">Deals</NavLink>
              <NavLink href="/contact">Contact</NavLink>

            </nav>
          </div>
        </div>

      </header>

      {/* CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#05070D] border-t border-[#1C2233] pt-16 pb-10 mt-20">
        <div className="border-t border-[#C9A84C]/30 bg-[#0D0D0D]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_440px]">
            <div>
              <p className="font-['DM_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]">
                Insider Access
              </p>
              <h3 className="mt-4 max-w-xl font-['Cormorant_Garamond'] text-4xl font-light leading-[1.05] text-[#F4F2EC] md:text-5xl">
                Get Wholesale Drops,
                <br />
                Supplier Alerts &
                <br />
                <span className="italic text-[#C9A84C]">Exclusive Deals First.</span>
              </h3>
              <p className="mt-5 max-w-md font-['DM_Sans'] text-sm leading-7 text-[#8C8C82]">
                Join thousands of entrepreneurs getting early access to verified inventory, wholesale pricing updates,
                mentorship spots, and profit opportunities before anyone else.
              </p>
              <div className="mt-6 space-y-3 font-['DM_Sans'] text-sm text-[#F4F2EC]">
                {[
                  "Early access to new wholesale drops",
                  "Exclusive mentorship enrollment windows",
                  "Supplier alerts + margin tips",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-[#C9A84C]">◆</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[4px] border border-[#C9A84C]/30 bg-[#121212] p-8 shadow-[0_0_40px_rgba(201,168,76,0.05)]">
              {captureSuccess ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <p className="font-['Cormorant_Garamond'] text-4xl italic text-[#C9A84C]">✓ You&apos;re In.</p>
                  <p className="mt-4 max-w-sm font-['DM_Sans'] text-sm leading-7 text-[#8C8C82]">
                    Check your inbox. Your first insider drop is on its way.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitEmailCapture}>
                  <h4 className="font-['DM_Sans'] text-lg font-semibold text-white">
                    You&apos;re One Step From the Inside Track.
                  </h4>
                  <p className="mt-2 font-['DM_Sans'] text-sm leading-6 text-[#8C8C82]">
                    No spam. No noise. Just verified opportunities and real business intelligence.
                  </p>

                  <div className="mt-6 space-y-4">
                    <input
                      value={captureForm.firstName}
                      onChange={(event) => setCaptureForm((prev) => ({ ...prev, firstName: event.target.value }))}
                      placeholder="First Name"
                      className="w-full rounded-[3px] border border-[#1A1A16] bg-white/5 px-4 py-3 font-['DM_Sans'] text-sm text-white outline-none transition focus:border-[#C9A84C]"
                    />
                    <input
                      type="email"
                      value={captureForm.email}
                      onChange={(event) => setCaptureForm((prev) => ({ ...prev, email: event.target.value }))}
                      placeholder="Email Address"
                      className="w-full rounded-[3px] border border-[#1A1A16] bg-white/5 px-4 py-3 font-['DM_Sans'] text-sm text-white outline-none transition focus:border-[#C9A84C]"
                    />
                    <select
                      value={captureForm.interest}
                      onChange={(event) => setCaptureForm((prev) => ({ ...prev, interest: event.target.value }))}
                      className="w-full rounded-[3px] border border-[#1A1A16] bg-white/5 px-4 py-3 font-['DM_Sans'] text-sm text-white outline-none transition focus:border-[#C9A84C]"
                    >
                      {["Wholesale", "Retail Deals", "Mentorship", "All of the Above"].map((option) => (
                        <option key={option} value={option} className="bg-[#121212]">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {captureError ? (
                    <p className="mt-4 font-['DM_Sans'] text-sm text-rose-300">{captureError}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={captureLoading}
                    className="mt-5 w-full rounded-[3px] bg-[#C9A84C] px-4 py-4 font-['DM_Sans'] text-sm font-semibold text-[#060606] transition hover:-translate-y-0.5 hover:bg-[#E8C96A] disabled:opacity-70"
                  >
                    {captureLoading ? "Submitting..." : "Get Insider Access →"}
                  </button>
                  <p className="mt-4 text-center font-['DM_Sans'] text-[11px] text-[#8C8C82]">
                    Zero spam. Unsubscribe anytime. Your information is never sold or shared.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10">

          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo/Kv%20garage%20icon.png" alt="" width={32} height={32} className="h-8 w-8 object-contain opacity-80" loading="lazy" />
              <h4 className="text-lg font-semibold text-[#D4AF37]">
                KV GARAGE
              </h4>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              Verified wholesale supplier access, retail inventory, dropshipping pathways, trade education, and business mentorship for operators building a stronger resale business.
            </p>
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

          <FooterCol title="Company" links={[
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Track Your Order", href: "/track-order" },
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Terms & Conditions", href: "/terms-and-conditions" },
            { name: "Refund Policy", href: "/refund-policy" },
            { name: "Shipping Policy", href: "/shipping-policy" },
          ]} />

        </div>

        <div className="text-center text-gray-500 text-xs mt-12 space-y-2">
          <p className="mx-auto max-w-3xl px-6 text-sm text-gray-400">
            KV Garage helps buyers, resellers, and students source verified products, unlock wholesale supplier relationships, improve profit margins, and build repeatable systems around retail inventory and supply chain growth.
          </p>
          <p>kvgarage@kvgarage.com</p>
          <p className="mt-4">
            © 2026 KV Garage LLC. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Grand Rapids, Michigan • United States
          </p>
          
          {/* Small Map */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Our Location</h4>
                <div className="w-full h-40 bg-gradient-to-br from-blue-900 to-green-800 rounded relative overflow-hidden">
                  {/* Simple map representation */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                  <div className="absolute top-8 left-12 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute top-16 left-8 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute bottom-8 right-8 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute bottom-4 left-16 w-2 h-2 bg-white rounded-full"></div>
                  
                  {/* State outline */}
                  <div className="absolute inset-0 border-2 border-gray-600 rounded opacity-20"></div>
                  
                  {/* Label */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    Grand Rapids, MI
                  </div>
                </div>
              </div>
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
      <h5 className="font-semibold mb-4">{title}</h5>
      <ul className="space-y-2 text-sm text-gray-400">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
