import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { buildCanonicalUrl } from "../../lib/seo";

export default function AffiliateLoginPage() {
  const { user } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const itemCount = cart.length;
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Use the main Supabase auth system
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw new Error("Login failed: " + authError.message);
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }

      // Check if user has affiliate role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, approved, email")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        throw new Error("Profile error: " + profileError.message);
      }

      if (!profile) {
        await supabase.auth.signOut();
        throw new Error("Profile not found for user ID: " + data.user.id);
      }

      if (profile.role !== "affiliate" || !profile.approved) {
        await supabase.auth.signOut();
        throw new Error("Your affiliate account is not approved yet. Role: " + profile.role + ", Approved: " + profile.approved + ". Please wait for admin approval.");
      }

      // Store affiliate session
      localStorage.setItem("affiliate_session", JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: profile.role,
      }));
      
      router.push("/affiliate/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // If user is already logged in, redirect
  if (user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#05070D] text-white">
        <Head>
          <title>Affiliate Login | KV Garage</title>
        </Head>

        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Already Logged In</h1>
            <p className="text-gray-400 mb-8">You're already logged in as {user.email}</p>
            <Link href="/affiliate/dashboard">
              <span className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#E8C96A] transition">
                Go to Affiliate Dashboard
              </span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#05070D] text-white">
      <Head>
        <title>Affiliate Login | KV Garage</title>
        <meta name="description" content="Login to your affiliate account to access your dashboard, track earnings, and manage your affiliate program." />
        <link rel="canonical" href={buildCanonicalUrl(router.asPath.split("?")[0])} />
      </Head>

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
            <Link href="/login">
              <span className="text-sm border px-3 py-2 rounded cursor-pointer hover:border-[#D4AF37] transition">
                Customer Login
              </span>
            </Link>

            <Link href="/signup">
              <span className="text-sm bg-[#D4AF37] text-black px-3 py-2 rounded cursor-pointer">
                Sign Up
              </span>
            </Link>

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
              <Link href="/">Home</Link>
              <Link href="/wholesale">Wholesale</Link>
              <Link href="/shop">Retail</Link>
              <Link href="/private-preview">Private Preview</Link>
              <Link href="/mentorship">Mentorship</Link>
              <Link href="/affiliate">Affiliate</Link>
              <Link href="/trading">Trading</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/deals">Deals</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </div>

      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Affiliate Login</h1>
            <p className="text-gray-400">Access your affiliate dashboard and track your earnings</p>
          </div>

          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-8 rounded-lg border border-[#333]">
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 p-3 rounded mb-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                  placeholder="Enter your affiliate email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                  placeholder="Enter your password"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#E8C96A] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/affiliate">
                <span className="text-gray-400 hover:text-white text-sm">
                  Don't have an affiliate account? Apply here
                </span>
              </Link>
              <div className="border-t border-[#333] pt-4">
                <p className="text-xs text-gray-500">
                  Test affiliate account: testaffiliate@example.com / Test1234!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#05070D] border-t border-[#1C2233] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
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
            <div>
              <h5 className="font-semibold mb-4">Core</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/wholesale">Wholesale</Link></li>
                <li><Link href="/shop">Retail</Link></li>
                <li><Link href="/deals">Build System</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Systems</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/mentorship">Mentorship</Link></li>
                <li><Link href="/trading">Trading</Link></li>
                <li><Link href="/learn">Learn</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#333] mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 KV Garage LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}