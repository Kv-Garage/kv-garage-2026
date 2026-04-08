import Link from 'next/link';
import Image from 'next/image';
import UrgencyBar from '../../components/UrgencyBar';
import MegaMenu from './MegaMenu';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { buildCanonicalUrl } from '../../lib/seo';

export default function DesktopLayoutMega({ children, title, description, image, hideFooter = false }) {
  const { user, signOut } = useAuth();
  const { cart, removeFromCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#111827] to-[#0F0F0F] text-white">
        <UrgencyBar />
        
        {/* Desktop Navigation with Mega Menu */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-gradient-to-r from-[#0F0F0F]/95 to-[#111827]/95 backdrop-blur-xl border-b border-white/10" 
            : "bg-gradient-to-r from-[#0F0F0F] to-[#111827] border-b border-transparent"
        }`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-4 group">
                <div className="relative w-12 h-12">
                  <Image
                    src="/logo/Kv garage icon.png"
                    alt="KV Garage Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                  KV Garage
                </span>
              </Link>

              {/* Mega Menu Navigation */}
              <MegaMenu />

              {/* Right Actions */}
              <div className="flex items-center space-x-4">
                <Link href="/track-order" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Track Order
                </Link>
                
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </Link>

                {user ? (
                  <Link href="/admin" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm">
                      Sign Up
                    </Link>
                    <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm">
                      Login
                    </Link>
                  </>
                )}

                {/* Cart */}
                <Link href="/cart" className="relative flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Cart</div>
                    <div className="text-lg font-bold text-[#D4AF37]">${cartTotal.toFixed(2)}</div>
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-20">
          {children}
        </main>

        {/* Footer */}
        {!hideFooter && (
          <footer className="bg-gradient-to-br from-[#0F0F0F] to-[#111827] border-t border-white/20 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Shop */}
                <div>
                  <h3 className="font-bold mb-4 text-[#D4AF37]">Shop</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link href="/shop?category=garage-storage" className="hover:text-white transition-colors duration-200">Garage Storage</Link></li>
                    <li><Link href="/shop?category=workbenches" className="hover:text-white transition-colors duration-200">Workbenches</Link></li>
                    <li><Link href="/shop?category=wall-organization" className="hover:text-white transition-colors duration-200">Wall Organization</Link></li>
                    <li><Link href="/shop?category=home-furniture" className="hover:text-white transition-colors duration-200">Home Furniture</Link></li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3 className="font-bold mb-4">Company</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link href="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
                    <li><Link href="/reviews" className="hover:text-white transition-colors duration-200">Reviews</Link></li>
                    <li><Link href="/affiliate" className="hover:text-white transition-colors duration-200">Affiliate</Link></li>
                    <li><Link href="/wholesale" className="hover:text-white transition-colors duration-200">Wholesale</Link></li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="font-bold mb-4">Support</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link href="/track-order" className="hover:text-white transition-colors duration-200">Track Order</Link></li>
                    <li><Link href="/shipping-policy" className="hover:text-white transition-colors duration-200">Shipping</Link></li>
                    <li><Link href="/returns" className="hover:text-white transition-colors duration-200">Returns</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
                  </ul>
                </div>

                {/* Newsletter */}
                <div>
                  <h3 className="font-bold mb-4">Newsletter</h3>
                  <p className="text-gray-400 text-sm mb-4">Get the latest updates and exclusive offers.</p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="border-t border-white/20 mt-8 pt-8 text-center space-y-2">
                <p className="text-gray-400">Grand Rapids, Michigan, United States</p>
                <p className="text-gray-400">&copy; {new Date().getFullYear()} KV Garage. All rights reserved.</p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}