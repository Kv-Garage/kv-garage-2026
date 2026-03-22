import Link from "next/link";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const { cart } = useCart();

  const itemCount = cart.length;

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 🔥 USER STATE (ADDED)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // 🔄 Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070D] text-white">

      {/* ================= HEADER ================= */}
      <header className="w-full bg-[#05070D] border-b border-[#1C2233] sticky top-0 z-50">

        {/* TOP ROW */}
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>

            <h1 className="text-xl md:text-2xl font-bold tracking-wider">
              KV GARAGE
            </h1>
          </div>

          {/* 🔥 RIGHT SIDE (AUTH + CART) */}
          <div className="flex items-center gap-4">

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
                  {user.email}
                </span>

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
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center overflow-x-auto">

            <nav className="flex gap-6 text-sm font-medium text-gray-300 whitespace-nowrap">

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

              <Link href="/admin-login">
                <span className="text-xs text-[#D4AF37] border border-[#D4AF37] px-3 py-1 rounded cursor-pointer hover:bg-[#D4AF37] hover:text-black transition">
                  Admin
                </span>
              </Link>

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

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10">

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">
              KV GARAGE
            </h4>

            <p className="text-gray-400 text-sm leading-relaxed">
              A structured ecosystem for supply, retail, systems, and revenue generation.
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
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Terms & Conditions", href: "/terms-and-conditions" },
            { name: "Refund Policy", href: "/refund-policy" },
            { name: "Shipping Policy", href: "/shipping-policy" },
          ]} />

        </div>

        <div className="text-center text-gray-500 text-xs mt-12 space-y-2">
          <p>kvgarage@kvgarage.com</p>
          <p>616-404-0751</p>
          <p className="mt-4">
            © 2026 KV Garage LLC. All rights reserved.
          </p>
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