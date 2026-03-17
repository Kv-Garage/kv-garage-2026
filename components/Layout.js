import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Layout({ children }) {
  const { cart } = useCart();

  const itemCount = cart.length;
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#05070D] text-white relative overflow-hidden">

      {/* 🔥 GLOBAL GLOW SYSTEM */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#D4AF37]/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full"></div>

      {/* ================= HEADER ================= */}
      <header className="w-full border-b border-[#1C2233] bg-[#05070D]/80 backdrop-blur sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          {/* LOGO */}
          <Link href="/">
            <div className="cursor-pointer">

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse"></div>

                <h1 className="text-2xl font-bold tracking-wide">
                  KV GARAGE
                </h1>
              </div>

              <div className="w-12 h-[2px] bg-[#D4AF37] mt-1"></div>

            </div>
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-300 whitespace-nowrap">

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

          {/* CART */}
          <Link href="/cart">
            <div className="cursor-pointer bg-[#111827] px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:border hover:border-[#D4AF37] transition">
              <span>🛒</span>
              <span>{itemCount}</span>
              <span className="text-[#D4AF37]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </Link>

        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#1C2233] pt-20 pb-12 mt-20 relative z-10">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-12">

          {/* BRAND */}
          <div>
            <h4 className="font-bold text-xl mb-4">
              KV GARAGE
            </h4>

            <div className="w-12 h-[2px] bg-[#D4AF37] mb-4"></div>

            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Structured supply, retail execution, and scalable business systems.
            </p>

            <p className="text-gray-400 text-sm">
              kvgarage@kvgarage.com
            </p>

            <p className="text-gray-400 text-sm">
              616-404-0751
            </p>
          </div>

          {/* CORE */}
          <div>
            <h5 className="font-semibold mb-4">Core</h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/wholesale">Wholesale</Link></li>
              <li><Link href="/shop">Retail</Link></li>
              <li><Link href="/deals">Deals</Link></li>
            </ul>
          </div>

          {/* ECOSYSTEM */}
          <div>
            <h5 className="font-semibold mb-4">Ecosystem</h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/private-preview">Private Preview</Link></li>
              <li><Link href="/mentorship">Mentorship</Link></li>
              <li><Link href="/affiliate">Affiliate</Link></li>
              <li><Link href="/trading">Trading</Link></li>
              <li><Link href="/learn">Learn</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
              <li><Link href="/shipping-policy">Shipping</Link></li>
            </ul>
          </div>

        </div>

        <div className="text-center text-gray-600 text-xs mt-16">
          © 2026 KV Garage LLC. All Rights Reserved.
        </div>

      </footer>

    </div>
  );
}