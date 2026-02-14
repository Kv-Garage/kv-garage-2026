import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-softwhite text-gray-900">

      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-extrabold text-royal tracking-wider">
              KV GARAGE
            </h1>
            <div className="w-12 h-[2px] bg-gold my-1"></div>
            <p className="text-xs text-gray-400 tracking-[0.3em]">
              VERIFIED SUPPLIES
            </p>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
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

