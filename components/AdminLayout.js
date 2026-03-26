import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", shortLabel: "DB" },
  { label: "Orders", href: "/admin/orders", shortLabel: "OR" },
  { label: "Products", href: "/admin/products", shortLabel: "PR" },
  { label: "Customers", href: "/admin/customers", shortLabel: "CU" },
  { label: "Applications", href: "/admin/applications", shortLabel: "AP" },
  { label: "CJ Import", href: "/admin/cj", shortLabel: "CJ" },
  { label: "Analytics", href: "/admin/analytics", shortLabel: "AN" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("admin@kvgarage.com");

  useEffect(() => {
    const getAdminEmail = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", session.session.user.id)
          .single();
        if (profile?.email) {
          setAdminEmail(profile.email);
        } else if (session.session.user.email) {
          setAdminEmail(session.session.user.email);
        }
      }
    };
    getAdminEmail();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#0F172A] lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/20">
              KV
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#94A3B8]">
                Admin Suite
              </p>
              <h2 className="text-lg font-semibold text-white">KV Garage</h2>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#64748B]">
            Navigation
          </p>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                        : "text-[#CBD5E1] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border text-[11px] font-semibold tracking-[0.18em] ${
                        isActive
                          ? "border-black/10 bg-black/10 text-black"
                          : "border-white/10 bg-white/5 text-[#94A3B8]"
                      }`}
                    >
                      {item.shortLabel}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1020]/95 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#94A3B8]">
                Enterprise Admin
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-[#94A3B8]">{adminEmail}</p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Back to Profile
            </Link>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
