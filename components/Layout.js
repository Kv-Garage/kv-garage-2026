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
    <div className="min-h-screen flex flex-col bg-softwhite text-gray-900">

      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div>
            <Link href="/">
              <h1 className="text-xl md:text-2xl font-extrabold text-royal tracking-wider cursor-pointer">
                KV GARAGE
              </h1>
            </Link>

            <div className="w-10 h-[2px] bg-gold my-1"></div>

            <p className="text-[10px] md:text-xs text-gray-400 tracking-[0.3em]">
              VERIFIED SUPPLIES
            </p>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">

            <Link href="/">Home</Link>
            <Link href="/wholesale">Wholesale</Link>
            <Link href="/shop">Retail</Link>
            <Link href="/trading">Trading</Link>
            <Link href="/deals">Deals</Link>
            <Link href="/contact">Contact</Link>

          </nav>

          {/* CART + MOBILE MENU */}
          <div className="flex items-center space-x-4">

            {/* CART */}
            <Link href="/cart">
              <div className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 md:px-4 py-2 rounded-md text-sm font-semibold transition flex items-center space-x-2">
                <span>🛒</span>
                <span className="hidden sm:inline">{itemCount}</span>
                <span className="text-orange-600">
                  ${totalPrice.toFixed(2)}
                </span>
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

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">

            <div className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">

              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/wholesale" onClick={() => setMenuOpen(false)}>Wholesale</Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)}>Retail</Link>
              <Link href="/trading" onClick={() => setMenuOpen(false)}>Trading</Link>
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


      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-10 mt-20">

        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

          <div>
            <h4 className="font-bold text-royal text-xl mb-3">
              KV GARAGE
            </h4>
            <div className="w-12 h-[2px] bg-gold mb-4"></div>

            <p className="text-gray-500 text-sm">
              Structured wholesale supply and scalable digital infrastructure
              built for serious operators.
            </p>
          </div>


          <div>
            <h5 className="font-semibold mb-3">Navigation</h5>

            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Retail</Link></li>
              <li><Link href="/wholesale">Wholesale</Link></li>
              <li><Link href="/trading">Trading</Link></li>
              <li><Link href="/deals">Deals</Link></li>
            </ul>
          </div>


          <div>
            <h5 className="font-semibold mb-3">Support</h5>

            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
            </ul>
          </div>


          <div>
            <h5 className="font-semibold mb-3">Company</h5>

            <ul className="space-y-2 text-sm text-gray-500">
              <li>KV Garage LLC</li>
              <li>Established 2022</li>
              <li>United States</li>
            </ul>
          </div>

        </div>

        <div className="text-center text-gray-400 text-xs mt-12">
          © 2026 KV Garage LLC. All Rights Reserved.
        </div>

      </footer>

    </div>
  );
}