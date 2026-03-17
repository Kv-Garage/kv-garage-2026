import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Layout({ children }) {

  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const itemCount = cart.length;

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* 🔥 STICKY HEADER */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">

          {/* LOGO */}
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold cursor-pointer">
              KV GARAGE
            </h1>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">

            <Link href="/">Home</Link>
            <Link href="/shop">Retail</Link>
            <Link href="/wholesale">Wholesale</Link>
            <Link href="/trading">Trading</Link>

            {/* 🔥 CORE MONEY PAGES */}
            <Link href="/learn">Learn</Link>
            <Link href="/mentorship">Mentorship</Link>
            <Link href="/affiliate">Affiliate</Link>

            <Link href="/deals">Deals</Link>
            <Link href="/contact">Contact</Link>

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4">

            {/* CART */}
            <Link href="/cart">
              <div className="cursor-pointer bg-gray-100 px-3 py-2 rounded-md text-sm">
                🛒 {itemCount} (${totalPrice.toFixed(2)})
              </div>
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

          </div>

        </div>

        {/* 🔥 MOBILE NAV */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">

            <div className="flex flex-col px-6 py-4 space-y-4 text-gray-700">

              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)}>Retail</Link>
              <Link href="/wholesale" onClick={() => setMenuOpen(false)}>Wholesale</Link>
              <Link href="/trading" onClick={() => setMenuOpen(false)}>Trading</Link>

              <Link href="/learn" onClick={() => setMenuOpen(false)}>Learn</Link>
              <Link href="/mentorship" onClick={() => setMenuOpen(false)}>Mentorship</Link>
              <Link href="/affiliate" onClick={() => setMenuOpen(false)}>Affiliate</Link>

              <Link href="/deals" onClick={() => setMenuOpen(false)}>Deals</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

            </div>

          </div>
        )}

      </header>

      {/* PAGE CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

    </div>
  );
}