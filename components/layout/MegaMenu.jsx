import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const categories = [
  {
    name: "Garage Storage",
    href: "/shop?category=garage-storage",
    color: "orange",
    subcategories: [
      { name: "Shelving Units", href: "/shop?category=garage-storage&subcategory=shelving" },
      { name: "Storage Cabinets", href: "/shop?category=garage-storage&subcategory=cabinets" },
      { name: "Garage Systems", href: "/shop?category=garage-storage&subcategory=systems" },
      { name: "Tool Chests", href: "/shop?category=garage-storage&subcategory=tool-chests" },
    ],
    featured: [
      { name: "Heavy-Duty Shelving", price: "$299.99", image: "/placeholder.jpg", badge: "Best Seller" },
      { name: "Garage Cabinet Set", price: "$799.99", image: "/placeholder.jpg", badge: "New" },
    ]
  },
  {
    name: "Workbenches",
    href: "/shop?category=workbenches",
    color: "blue",
    subcategories: [
      { name: "Office Chairs", href: "/shop?category=workbenches&subcategory=chairs" },
      { name: "Work Desks", href: "/shop?category=workbenches&subcategory=desks" },
      { name: "Heavy Duty Benches", href: "/shop?category=workbenches&subcategory=heavy-duty" },
      { name: "Workstation Accessories", href: "/shop?category=workbenches&subcategory=accessories" },
    ],
    featured: [
      { name: "Pro Workbench 6ft", price: "$499.99", image: "/placeholder.jpg", badge: "Pro Choice" },
      { name: "Ergonomic Chair", price: "$349.99", image: "/placeholder.jpg", badge: "Hot" },
    ]
  },
  {
    name: "Wall Organization",
    href: "/shop?category=wall-organization",
    color: "yellow",
    subcategories: [
      { name: "Pegboards", href: "/shop?category=wall-organization&subcategory=pegboards" },
      { name: "Hooks", href: "/shop?category=wall-organization&subcategory=hooks" },
      { name: "Tool Panels", href: "/shop?category=wall-organization&subcategory=tool-panels" },
      { name: "Slatwall", href: "/shop?category=wall-organization&subcategory=slatwall" },
    ],
    featured: [
      { name: "Pegboard Kit", price: "$129.99", image: "/placeholder.jpg", badge: "Complete Kit" },
      { name: "Slatwall System", price: "$249.99", image: "/placeholder.jpg", badge: "Modular" },
    ]
  },
  {
    name: "Home Furniture",
    href: "/shop?category=home-furniture",
    color: "neutral",
    subcategories: [
      { name: "Beds", href: "/shop?category=home-furniture&subcategory=beds" },
      { name: "Sofas", href: "/shop?category=home-furniture&subcategory=sofas" },
      { name: "Coffee Tables", href: "/shop?category=home-furniture&subcategory=tables" },
      { name: "Storage Solutions", href: "/shop?category=home-furniture&subcategory=storage" },
    ],
    featured: [
      { name: "Modern Sofa", price: "$899.99", image: "/placeholder.jpg", badge: "Premium" },
      { name: "Coffee Table Set", price: "$399.99", image: "/placeholder.jpg", badge: "Set" },
    ]
  }
];

const colorClasses = {
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-500",
    hover: "hover:text-orange-500",
    light: "bg-orange-500/10",
    badge: "bg-orange-500"
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-500",
    hover: "hover:text-blue-500",
    light: "bg-blue-500/10",
    badge: "bg-blue-500"
  },
  yellow: {
    bg: "bg-yellow-500",
    text: "text-yellow-500",
    border: "border-yellow-500",
    hover: "hover:text-yellow-500",
    light: "bg-yellow-500/10",
    badge: "bg-yellow-500"
  },
  neutral: {
    bg: "bg-gray-500",
    text: "text-gray-500",
    border: "border-gray-500",
    hover: "hover:text-gray-500",
    light: "bg-gray-500/10",
    badge: "bg-gray-500"
  }
};

export default function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (categoryName) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveCategory(categoryName);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className="hidden lg:block">
      <nav className="flex items-center space-x-8">
        {categories.map((category) => {
          const colors = colorClasses[category.color];
          const isActive = activeCategory === category.name;

          return (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={category.href}
                className={`flex items-center gap-2 py-6 text-sm font-medium transition-colors duration-200 ${
                  isActive ? colors.text : "text-gray-300 hover:text-white"
                }`}
              >
                {category.name}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Mega Menu Dropdown */}
              {isOpen && isActive && (
                <div className="absolute left-0 top-full z-50 w-[700px] bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down">
                  <div className="grid grid-cols-2 gap-0">
                    {/* Left: Subcategories */}
                    <div className="p-8 border-r border-white/10">
                      <h3 className={`text-lg font-bold mb-6 ${colors.text}`}>
                        {category.name}
                      </h3>
                      <div className="space-y-3">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                              colors.light
                            } ${colors.hover} hover:bg-white/5`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{sub.name}</span>
                              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10">
                        <Link
                          href={category.href}
                          className={`flex items-center gap-2 ${colors.text} font-semibold hover:gap-3 transition-all duration-200`}
                        >
                          View All {category.name}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Right: Featured Products */}
                    <div className="p-8 bg-white/5">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                        Featured Products
                      </h3>
                      <div className="space-y-4">
                        {category.featured.map((product, idx) => (
                          <Link
                            key={idx}
                            href="/shop/demo/featured"
                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold ${colors.text} px-2 py-0.5 rounded-full ${colors.light}`}>
                                  {product.badge}
                                </span>
                              </div>
                              <h4 className="font-medium text-white truncate">
                                {product.name}
                              </h4>
                              <p className={`text-sm font-bold ${colors.text}`}>
                                {product.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold">Quick Info</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Free shipping on orders over $199 • 30-day returns • Professional installation available
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}