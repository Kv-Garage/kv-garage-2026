import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { buildCanonicalUrl } from '../../lib/seo';
import UrgencyBar from '../../components/UrgencyBar';

export default function DesktopLayout({ children, title, description, image, hideFooter = false }) {
  const { user, signOut } = useAuth();
  const { cart, removeFromCart } = useCart();

  const handleLogout = async () => {
    await signOut();
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
        
        {/* Desktop Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0B0F19] to-[#111827] border-b border-white/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-between flex-wrap">
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

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Home</Link>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Shop</Link>
                <Link href="/shop/private-preview" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Sourcing Desk
                </Link>
                <Link href="/learn" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Learn</Link>
                <Link href="/wholesale" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Wholesale</Link>
                <Link href="/mentorship" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Mentorship</Link>
                <Link href="/affiliate" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Affiliate</Link>
                <Link href="/trade" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Trading</Link>
                <Link href="/deals" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg">Deal</Link>
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