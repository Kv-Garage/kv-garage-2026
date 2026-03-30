import Image from 'next/image';
import UrgencyBar from '../../components/UrgencyBar';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { buildCanonicalUrl } from '../../lib/seo';

export default function MobileLayout({ children, title, description, image, hideFooter = false }) {
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
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* Urgency Bar */}
        <UrgencyBar />
        
        {/* Mobile Navigation Bar */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-gradient-to-r from-[#0B0F19]/95 to-[#111827]/95 backdrop-blur-md border-b border-white/10" 
            : "bg-gradient-to-r from-[#0B0F19] to-[#111827] border-b border-transparent"
        }`}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative w-10 h-10">
                  <Image
                    src="/logo/Kv garage icon.png"
                    alt="KV Garage Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                  KV Garage
                </span>
              </Link>

              {/* Right Actions */}
              <div className="flex items-center space-x-3">
                {/* Cart */}
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
                
                {/* Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  <div className="hamburger" data-active={isMenuOpen}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96 border-t border-white/10" : "max-h-0"
          }`}>
            <div className="px-4 py-4 space-y-3 bg-gradient-to-br from-[#0B0F19]/95 to-[#111827]/95">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Home</Link>
              <Link href="/shop" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Shop</Link>
              <Link href="/learn" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Learn</Link>
              <Link href="/wholesale" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Wholesale</Link>
              <Link href="/mentorship" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Mentorship</Link>
              <Link href="/affiliate" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Affiliate</Link>
              <Link href="/trade" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Trading</Link>
              <Link href="/deals" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Deals</Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/10">Contact</Link>
              
              <div className="border-t border-white/10 pt-4 space-y-3">
                {user ? (
                  <>
                    <Link href="/admin" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-300 hover:text-white transition-colors duration-200 py-3"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/signup" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3">
                      Sign Up
                    </Link>
                    <Link href="/login" className="block text-gray-300 hover:text-white transition-colors duration-200 py-3">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Cart Sidebar */}
        <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-br from-[#0B0F19] to-[#111827] shadow-xl p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                        <p className="text-sm text-gray-400">${item.price}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Link 
                    href="/cart" 
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-3 px-4 rounded-lg font-bold text-center hover:shadow-lg transition-shadow duration-200 block"
                    onClick={() => setIsCartOpen(false)}
                  >
                    View Cart
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="pt-16 pb-20">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B0F19] to-[#111827] border-t border-white/20 z-50">
          <div className="grid grid-cols-6 gap-1 px-2 py-2">
            <Link href="/" className="flex flex-col items-center py-2 px-1 text-center group">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-200 mt-1">Home</span>
            </Link>
            
            <Link href="/shop" className="flex flex-col items-center py-2 px-1 text-center group">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-200 mt-1">Shop</span>
            </Link>
            
            <Link href="/learn" className="flex flex-col items-center py-2 px-1 text-center group">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-200 mt-1">Learn</span>
            </Link>
            
            <Link href="/wholesale" className="flex flex-col items-center py-2 px-1 text-center group">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2v4m0 0h-2m-4-4v4m-2-4v.01" />
              </svg>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-200 mt-1">Wholesale</span>
            </Link>
            
            <Link href="/trade" className="flex flex-col items-center py-2 px-1 text-center group">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-200 mt-1">Trading</span>
            </Link>
            
            <Link href="/deals" className="flex flex-col items-center py-2 px-1 text-center group">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-200 mt-1">Deals</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        {!hideFooter && (
          <footer className="bg-gradient-to-br from-[#0B0F19] to-[#111827] border-t border-white/20 mt-8">
            <div className="container-responsive py-8">
              <div className="space-y-6">
                {/* Logo and Description */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-xl transform rotate-45"></div>
                      <div className="absolute inset-1 bg-[#0B0F19] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">KV</span>
                      </div>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                      KV Garage
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm max-w-md mx-auto">
                    Premium business education and wholesale opportunities for serious entrepreneurs. 
                    Build real, scalable revenue with proven systems and verified supplier relationships.
                  </p>
                </div>

                {/* Social Links */}
                <div className="footer-social">
                  <a href="https://www.instagram.com/kave.steele/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                    <span className="w-6 h-6 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">IG</span>
                    Instagram
                  </a>
                  <a href="https://www.facebook.com/kavion.wilson.3" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                    <span className="w-6 h-6 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">FB</span>
                    Facebook
                  </a>
                  <a href="https://www.ebay.com/usr/kvgarage" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                    <span className="w-6 h-6 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">EB</span>
                    eBay
                  </a>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <h3 className="font-bold text-sm mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-xs text-gray-400">
                      <li><Link href="/shop" className="hover:text-white transition-colors duration-200">Shop</Link></li>
                      <li><Link href="/learn" className="hover:text-white transition-colors duration-200">Learn</Link></li>
                      <li><Link href="/wholesale" className="hover:text-white transition-colors duration-200">Wholesale</Link></li>
                      <li><Link href="/mentorship" className="hover:text-white transition-colors duration-200">Mentorship</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Support</h3>
                    <ul className="space-y-1 text-xs text-gray-400">
                      <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li>
                      <li><Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
                      <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors duration-200">Terms</Link></li>
                      <li><Link href="/shipping-policy" className="hover:text-white transition-colors duration-200">Shipping</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Location & Copyright */}
                <div className="border-t border-white/20 pt-4 text-center space-y-2">
                  <p className="text-xs text-gray-400">Grand Rapids, Michigan, United States</p>
                  <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} KV Garage. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}