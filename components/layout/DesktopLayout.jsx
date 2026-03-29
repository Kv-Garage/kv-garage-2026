import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { buildCanonicalUrl } from '../../lib/seo';

export default function DesktopLayout({ children, title, description, image, hideFooter = false }) {
  const { user, logout } = useAuth();
  const { cart, removeFromCart } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* Desktop Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0B0F19] to-[#111827] border-b border-white/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-4 group">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-xl transform rotate-45 group-hover:rotate-12 transition-transform duration-300"></div>
                  <div className="absolute inset-1 bg-[#0B0F19] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">KV</span>
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                  KV Garage
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Home</Link>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Shop</Link>
                <Link href="/learn" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Learn</Link>
                <Link href="/wholesale" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Wholesale</Link>
                <Link href="/mentorship" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Mentorship</Link>
                <Link href="/affiliate" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Affiliate</Link>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Contact</Link>
              </div>

              {/* Desktop Actions */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link href="/admin" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/signup" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                      Sign Up
                    </Link>
                    <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
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
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                  <div className="text-right hidden lg:block">
                    <div className="text-sm text-gray-400">Cart</div>
                    <div className="text-lg font-bold text-[#D4AF37]">${cartTotal.toFixed(2)}</div>
                  </div>
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
          <footer className="bg-gradient-to-br from-[#0B0F19] to-[#111827] border-t border-white/20">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-4 mb-6">
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
                  <p className="text-gray-400 mb-6 max-w-md">
                    Premium business education and wholesale opportunities for serious entrepreneurs. 
                    Build real, scalable revenue with proven systems and verified supplier relationships.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04a13.073 13.073 0 0 0 7.05 2.04c8.017 0 12.404-6.73 12.404-12.402 0-.195-.004-.39-.012-.583a8.894 8.894 0 0 0 2.164-2.2z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link href="/shop" className="hover:text-white transition-colors duration-200">Shop</Link></li>
                    <li><Link href="/learn" className="hover:text-white transition-colors duration-200">Learn</Link></li>
                    <li><Link href="/wholesale" className="hover:text-white transition-colors duration-200">Wholesale</Link></li>
                    <li><Link href="/mentorship" className="hover:text-white transition-colors duration-200">Mentorship</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold mb-4">Support</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li>
                    <li><Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
                    <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors duration-200">Terms</Link></li>
                    <li><Link href="/shipping-policy" className="hover:text-white transition-colors duration-200">Shipping</Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} KV Garage. All rights reserved.</p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}