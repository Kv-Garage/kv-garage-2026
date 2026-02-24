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
    <div className="min-h-screen flex flex-col bg-softwhite text-gray-900">

      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

          {/* LEFT SIDE LOGO */}
          <div>
            <h1 className="text-2xl font-extrabold text-royal tracking-wider">
              KV GARAGE
            </h1>
            <div className="w-12 h-[2px] bg-gold my-1"></div>
            <p className="text-xs text-gray-400 tracking-[0.3em]">
              VERIFIED SUPPLIES
            </p>
          </div>

          {/* NAV + CART */}
          <div className="flex items-center space-x-10">

            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700 whitespace-nowrap">
              <Link href="/">Home</Link>
              <Link href="/wholesale">Wholesale</Link>
              <Link href="/shop">Retail</Link>
              <Link href="/private-preview" className="whitespace-nowrap">
                Private Preview
              </Link>
              <Link href="/mentorship">Mentorship</Link>
              <Link href="/affiliate">Affiliate</Link>
              <Link href="/trading">Trading</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/deals">Deals</Link>
              <Link href="/contact">Contact</Link>
            </nav>

            {/* CART DISPLAY */}
            <Link href="/cart">
              <div className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-semibold transition flex items-center space-x-2">

                <span>🛒</span>

                <span>{itemCount} items</span>

                <span className="text-orange-600">
                  ${totalPrice.toFixed(2)}
                </span>

              </div>
            </Link>

          </div>

        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-20 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-5 gap-12">

          <div>
            <h4 className="font-bold text-royal text-xl mb-4">
              KV GARAGE
            </h4>
            <div className="w-12 h-[2px] bg-gold mb-4"></div>
            <p className="text-gray-500 text-sm">
              Structured wholesale supply and scalable product infrastructure built for serious operators.
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Core</h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/wholesale">Wholesale</Link></li>
              <li><Link href="/shop">Retail</Link></li>
              <li><Link href="/deals">Deals</Link></li>
            </ul>
          </div>

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

          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/contact">Contact</Link></li>
              <li>support@kvgarage.com</li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>Established 2022</li>
              <li>Updated 2026</li>
              <li>United States</li>
            </ul>
          </div>

        </div>

        <div className="text-center text-gray-400 text-xs mt-16">
          © 2026 KV Garage. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}