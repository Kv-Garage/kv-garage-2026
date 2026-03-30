import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const navItems = [
  { label: "Dashboard", href: "/admin", shortLabel: "DB" },
  { label: "Orders", href: "/admin/orders", shortLabel: "OR" },
  { label: "Products", href: "/admin/products", shortLabel: "PR" },
  { label: "Customers", href: "/admin/customers", shortLabel: "CU" },
  { label: "Applications", href: "/admin/applications", shortLabel: "AP" },
  { label: "CJ Import", href: "/admin/cj", shortLabel: "CJ" },
  { label: "Analytics", href: "/admin/analytics", shortLabel: "AN" },
];

const opsItems = [
  { label: "Marketing Tracking", shortLabel: "MT", href: "/admin/marketing-tracking" },
  { label: "Manual Ops", shortLabel: "MO", href: "/admin/manual-ops" },
];

export default function AdminLayout({
  children,
  title = "Admin Dashboard",
  description = "Enterprise control center",
}) {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("admin@kvgarage.com");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerHeightClass = "h-[72px]";
  const shellPaddingTopClass = "pt-[72px]";

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

  useEffect(() => {
    // Only close mobile menu on larger screens, keep it open on mobile for better UX
    if (window.innerWidth >= 1024) {
      setMobileMenuOpen(false);
    }
  }, [router.pathname]);

  const renderPrimaryLinks = () =>
    navItems.map((item) => {
      const isActive = router.pathname === item.href;

      return (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`flex min-h-[44px] items-center gap-2.5 rounded-[16px] px-3 py-2 text-[13px] font-medium transition-all ${
              isActive
                ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                : "border border-transparent text-[#CBD5E1] hover:border-white/10 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-[9px] font-semibold tracking-[0.14em] ${
                isActive
                  ? "border-black/10 bg-black/10 text-black"
                  : "border-white/10 bg-white/5 text-[#94A3B8]"
              }`}
            >
              {item.shortLabel}
            </span>
            <span className="leading-none">{item.label}</span>
          </Link>
        </li>
      );
    });

  const renderOpsLinks = () =>
    opsItems.map((item) => (
      <Link
        key={item.label}
        href={item.href}
        className={`flex min-h-[44px] items-center gap-2.5 rounded-[16px] border px-3 py-2 transition-all ${
          router.pathname === item.href
            ? "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-white"
            : "border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.05]"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[9px] font-semibold tracking-[0.14em] text-[#94A3B8]">
          {item.shortLabel}
        </span>
        <div>
          <p className="text-[12px] font-medium text-white">{item.label}</p>
        </div>
      </Link>
    ));

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <header className={`fixed top-0 z-[100] w-full border-b border-white/10 bg-[#0B1020]/95 backdrop-blur ${headerHeightClass}`}>
        <div className="flex h-full flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
              aria-label="Toggle admin menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="text-lg leading-none">{mobileMenuOpen ? "×" : "≡"}</span>
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">
                Enterprise Admin
              </p>
              <h1 className="mt-1 text-base font-semibold text-white sm:text-lg">{title}</h1>
              <p className="mt-0.5 hidden text-xs text-[#94A3B8] sm:block">{description}</p>
              <p className="mt-0.5 hidden text-xs text-[#64748B] sm:block">{adminEmail}</p>
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center self-start rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 sm:self-auto"
          >
            Back to Profile
          </Link>
        </div>
      </header>

      <div className={shellPaddingTopClass}>
        <div className="flex h-[calc(100vh-72px)] flex-row">
          {mobileMenuOpen ? (
            <button
              type="button"
              aria-label="Close admin menu"
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          ) : null}

          <aside
            className={`fixed left-0 top-[72px] z-50 h-[calc(100vh-72px)] w-[min(88vw,260px)] overflow-y-auto border-r border-white/10 bg-[#0F172A] transition-transform duration-200 lg:hidden ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="border-b border-white/10 px-4 py-4">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4AF37] text-[11px] font-bold text-black shadow-lg shadow-[#D4AF37]/20">
                  KV
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#94A3B8]">
                    Admin Suite
                  </p>
                  <h2 className="text-[13px] font-semibold text-white">KV Garage</h2>
                </div>
              </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-2.5 py-3">
              <div className="flex min-h-full flex-col rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="px-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                    Navigation
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-[#94A3B8]">
                    Commerce, customers, supplier intake, and reporting.
                  </p>
                </div>

                <ul className="mt-3 space-y-1.5">{renderPrimaryLinks()}</ul>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="px-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                      Operations
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-[#94A3B8]">
                      Attribution and manual workflow control.
                    </p>
                  </div>

                  <div className="mt-3 space-y-1.5">{renderOpsLinks()}</div>
                </div>

                <div className="mt-auto pt-4">
                  <div className="rounded-[16px] border border-[#D4AF37]/20 bg-[#D4AF37]/8 p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#AE8E24]">
                      Command State
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-white">System Active</p>
                    <p className="mt-1 text-[10px] leading-4 text-[#C7CEDD]">
                      Catalog, supplier, and manual ops aligned.
                    </p>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          <aside className="hidden h-screen w-[260px] min-w-[260px] flex-shrink-0 overflow-y-auto border-r border-white/10 bg-[#0F172A] lg:flex lg:flex-col">
            <div className="border-b border-white/10 px-4 py-4">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4AF37] text-[11px] font-bold text-black shadow-lg shadow-[#D4AF37]/20">
                  KV
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#94A3B8]">
                    Admin Suite
                  </p>
                  <h2 className="text-[13px] font-semibold text-white">KV Garage</h2>
                </div>
              </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-2.5 py-3">
              <div className="flex min-h-full flex-col rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="px-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                    Navigation
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-[#94A3B8]">
                    Commerce, customers, supplier intake, and reporting.
                  </p>
                </div>

                <ul className="mt-3 space-y-1.5">{renderPrimaryLinks()}</ul>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="px-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                      Operations
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-[#94A3B8]">
                      Attribution and manual workflow control.
                    </p>
                  </div>

                  <div className="mt-3 space-y-1.5">{renderOpsLinks()}</div>
                </div>

                <div className="mt-auto pt-4">
                  <div className="rounded-[16px] border border-[#D4AF37]/20 bg-[#D4AF37]/8 p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#AE8E24]">
                      Command State
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-white">System Active</p>
                    <p className="mt-1 text-[10px] leading-4 text-[#C7CEDD]">
                      Catalog, supplier, and manual ops aligned.
                    </p>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          <main className="flex-1 min-w-0 overflow-y-auto">
            <div className="px-3 py-4 sm:px-4 lg:px-6 lg:py-5">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
