import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "../../context/CartContext";
import { buildCanonicalUrl } from "../../lib/seo";

export default function AffiliateDashboard() {
  const { cart } = useCart();
  const router = useRouter();
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [payoutForm, setPayoutForm] = useState({
    amount: "",
    paymentMethod: "PayPal",
    paymentDetails: ""
  });
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutError, setPayoutError] = useState("");

  const itemCount = cart.length;
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const checkAuth = async () => {
      const session = localStorage.getItem("affiliate_session");
      if (!session) {
        router.push("/affiliate/login");
        return;
      }

      try {
        const affiliateData = JSON.parse(session);
        setAffiliate(affiliateData);
      } catch (err) {
        router.push("/affiliate/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("affiliate_session");
    router.push("/affiliate/login");
  };

  const handlePayoutRequest = async (e) => {
    e.preventDefault();
    setPayoutError("");
    setPayoutSuccess(false);

    try {
      const response = await fetch("/api/affiliate/payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          affiliateId: affiliate.id,
          amount: parseFloat(payoutForm.amount),
          paymentMethod: payoutForm.paymentMethod,
          paymentDetails: payoutForm.paymentDetails
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payout request failed");
      }

      setPayoutSuccess(true);
      setPayoutForm({ amount: "", paymentMethod: "PayPal", paymentDetails: "" });
      
      // Refresh affiliate data
      const session = localStorage.getItem("affiliate_session");
      if (session) {
        const updatedSession = { ...JSON.parse(session), pending_earnings: data.pending_earnings };
        localStorage.setItem("affiliate_session", JSON.stringify(updatedSession));
        setAffiliate(updatedSession);
      }
    } catch (err) {
      setPayoutError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070D]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!affiliate) {
    return null;
  }

  const referralUrl = `${process.env.NEXT_PUBLIC_BASE_URL}?ref=${affiliate.referral_code}`;

  return (
    <div className="min-h-screen bg-[#05070D] text-white">
      <Head>
        <title>Affiliate Dashboard | KV Garage</title>
        <meta name="description" content="Your affiliate dashboard - track earnings, generate referral links, and manage your affiliate program." />
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
            <span className="text-xs text-gray-400">
              Welcome, {affiliate.name}
            </span>

            <Link href="/admin">
              <span className="text-xs border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F3D46A] px-3 py-2 rounded cursor-pointer hover:bg-[#D4AF37]/15 transition">
                Admin Dashboard
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs border px-3 py-2 rounded hover:border-red-500 transition"
            >
              Logout
            </button>

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
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Affiliate Dashboard</h1>
            <p className="text-gray-400">Welcome back, {affiliate.name} • Referral Code: <span className="text-[#D4AF37] font-semibold">{affiliate.referral_code}</span></p>
          </div>

          {/* Earnings Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400">Total Earnings</h3>
                <span className="text-green-400">💰</span>
              </div>
              <div className="text-3xl font-bold text-white">${(affiliate.total_earnings || 0).toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-2">All-time earnings</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400">Pending Earnings</h3>
                <span className="text-yellow-400">⏳</span>
              </div>
              <div className="text-3xl font-bold text-white">${(affiliate.pending_earnings || 0).toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-2">Awaiting payout</div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400">Paid Earnings</h3>
                <span className="text-blue-400">✅</span>
              </div>
              <div className="text-3xl font-bold text-white">${(affiliate.paid_earnings || 0).toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-2">Already paid out</div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-[#333] mb-6">
            <div className="flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: "📊" },
                { id: "referrals", label: "Referrals", icon: "🔗" },
                { id: "payouts", label: "Payouts", icon: "💳" },
                { id: "settings", label: "Settings", icon: "⚙️" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Referral Link Generator */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Referral Link</h3>
                  <div className="space-y-4">
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#333]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Share this link:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(referralUrl);
                            // Simple toast feedback
                            const btn = document.getElementById('copy-btn');
                            btn.textContent = 'Copied!';
                            setTimeout(() => btn.textContent = 'Copy Link', 2000);
                          }}
                          className="text-sm bg-[#D4AF37] text-black px-3 py-1 rounded hover:bg-[#E8C96A] transition"
                          id="copy-btn"
                        >
                          Copy Link
                        </button>
                      </div>
                      <div className="text-sm text-gray-300 font-mono bg-black p-2 rounded break-all">
                        {referralUrl}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">0</div>
                        <div className="text-xs text-gray-400">Total Clicks</div>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">0</div>
                        <div className="text-xs text-gray-400">Conversions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
                  <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p>Performance chart coming soon</p>
                      <p className="text-sm text-gray-400 mt-2">Track your clicks, conversions, and earnings over time</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Referrals Tab */}
            {activeTab === "referrals" && (
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-lg border border-[#333]">
                <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">🔗</div>
                    <p>No referral activity yet</p>
                    <p className="text-sm text-gray-400 mt-2">Start sharing your referral link to track activity</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payouts Tab */}
            {activeTab === "payouts" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payout Request Form */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-lg font-semibold text-white mb-4">Request Payout</h3>
                  {payoutSuccess && (
                    <div className="bg-green-900/20 border border-green-500/50 p-3 rounded mb-4 text-green-400 text-sm">
                      Payout request submitted successfully!
                    </div>
                  )}
                  {payoutError && (
                    <div className="bg-red-900/20 border border-red-500/50 p-3 rounded mb-4 text-red-400 text-sm">
                      {payoutError}
                    </div>
                  )}
                  
                  <form onSubmit={handlePayoutRequest} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Request</label>
                      <input
                        type="number"
                        step="0.01"
                        min="10"
                        max={affiliate.pending_earnings || 0}
                        value={payoutForm.amount}
                        onChange={(e) => setPayoutForm({...payoutForm, amount: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                        placeholder={`Max: $${(affiliate.pending_earnings || 0).toFixed(2)}`}
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum payout: $10</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                      <select
                        value={payoutForm.paymentMethod}
                        onChange={(e) => setPayoutForm({...payoutForm, paymentMethod: e.target.value})}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                      >
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Payment Details</label>
                      <input
                        type="text"
                        value={payoutForm.paymentDetails}
                        onChange={(e) => setPayoutForm({...payoutForm, paymentDetails: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                        placeholder="PayPal email or bank account details"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-[#D4AF37] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#E8C96A] transition"
                    >
                      Request Payout
                    </button>
                  </form>
                </div>

                {/* Payout History */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-lg font-semibold text-white mb-6">Payout History</h3>
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-4">💳</div>
                      <p>No payout history yet</p>
                      <p className="text-sm text-gray-400 mt-2">Submit your first payout request above</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Account Information */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-lg font-semibold text-white mb-6">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{affiliate.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{affiliate.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 text-sm rounded">Approved</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Referral Code:</span>
                      <span className="text-[#D4AF37] font-semibold">{affiliate.referral_code}</span>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-lg font-semibold text-white mb-6">Change Password</h3>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                    />
                    <button className="w-full bg-[#D4AF37] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#E8C96A] transition">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
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