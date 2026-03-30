import Head from "next/head";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { buildCanonicalUrl } from "../lib/seo";
import AffiliateTracker from "./AffiliateTracker";
import { useDevice } from "../hooks/useDevice";
import MobileLayout from "./layout/MobileLayout";
import DesktopLayout from "./layout/DesktopLayout";
import UrgencyBar from "./UrgencyBar";
import { initAnalytics, trackEmailSubscription, EVENT_TYPES } from "../lib/analytics";

const SEO_BY_PATH = {
  "/": {
    title: "KV Garage — Verified Wholesale Supplier | Retail, Mentorship & Trade Education",
    description:
      "KV Garage is your premier source for verified wholesale products, retail inventory, supplier sourcing, trade education, and business mentorship. Build your supply chain from the ground up.",
  },
  "/wholesale": {
    title: "Wholesale Products | Bulk Inventory Sourcing — KV Garage",
    description:
      "Access wholesale-priced inventory with verified supplier relationships. Ideal for resellers, retailers, and business owners ready to scale their supply chain.",
  },
  "/shop": {
    title: "Shop Retail Inventory | Ready-to-Ship Products — KV Garage",
    description:
      "Browse ready-to-ship retail products sourced for quality and resale potential. Single-unit and bulk purchasing available with tiered pricing.",
  },
  "/mentorship": {
    title: "Business Mentorship Program | Learn to Build a Profitable Resale Business — KV Garage",
    description:
      "Work directly with KV Garage to develop your wholesale strategy, supply chain, and business systems. Structured mentorship for serious entrepreneurs.",
  },
  "/trading": {
    title: "Trading Education | Inventory Trading Strategies — KV Garage",
    description:
      "Learn how to trade inventory, maximize margins, and build a repeatable trading system. Practical education for resellers and entrepreneurs.",
  },
  "/affiliate": {
    title: "Affiliate Program | Earn Commissions with KV Garage",
    description:
      "Join the KV Garage affiliate program and earn commissions by referring wholesale buyers, retail customers, and mentorship students.",
  },
  "/private-preview": {
    title: "Private Preview | Early Access to Verified Inventory — KV Garage",
    description:
      "Get early access to new wholesale drops and exclusive inventory before they go public. Private preview access for verified KV Garage members.",
  },
};

export default function Layout({ children }) {
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [captureForm, setCaptureForm] = useState({
    firstName: "",
    email: "",
    interest: "All of the Above",
  });
  const [captureLoading, setCaptureLoading] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [captureError, setCaptureError] = useState("");
  const { isMobile } = useDevice();

  const itemCount = cart.length;
  const seo = SEO_BY_PATH[router.pathname];

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  //  LOGOUT
  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  useEffect(() => {
    let isMounted = true;

    const loadAdminState = async () => {
      if (!user?.id) {
        if (isMounted) setIsAdmin(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!isMounted) return;

      if (error) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(profile?.role === "admin");
    };

    loadAdminState();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Initialize analytics tracking
  useEffect(() => {
    if (!router.isReady) return;
    
    // Initialize analytics with heartbeat
    const cleanup = initAnalytics(router.asPath, user);
    
    return cleanup;
  }, [router.isReady, router.asPath, user]);

  const submitEmailCapture = async (event) => {
    event.preventDefault();
    setCaptureError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(captureForm.email || "").trim())) {
      setCaptureError("Please enter a valid email address.");
      return;
    }

    setCaptureLoading(true);

    try {
      const response = await fetch("/api/email-capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...captureForm,
          source: "footer",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Something went wrong. Please try again.");
      }

      // Track email subscription in analytics
      await trackEmailSubscription(captureForm.email, "footer", user);

      setCaptureSuccess(true);
    } catch (error) {
      setCaptureError(error.message || "Something went wrong. Please try again.");
    } finally {
      setCaptureLoading(false);
    }
  };

  // Use the appropriate layout component based on device
  if (isMobile) {
    return (
      <>
        <Head>
          {seo ? (
            <>
              <title>{seo.title}</title>
              <meta name="description" content={seo.description} />
              <link rel="canonical" href={buildCanonicalUrl(router.asPath.split("?")[0])} />
              <meta property="og:title" content={seo.title} />
              <meta property="og:description" content={seo.description} />
              <meta property="og:url" content={buildCanonicalUrl(router.asPath.split("?")[0])} />
              <meta property="og:image" content={buildCanonicalUrl("/logo/Kv%20garage%20icon.png")} />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={seo.title} />
              <meta name="twitter:description" content={seo.description} />
            </>
          ) : null}
        </Head>
        <AffiliateTracker />
        <MobileLayout>
          {children}
        </MobileLayout>
      </>
    );
  } else {
    return (
      <>
        <Head>
          {seo ? (
            <>
              <title>{seo.title}</title>
              <meta name="description" content={seo.description} />
              <link rel="canonical" href={buildCanonicalUrl(router.asPath.split("?")[0])} />
              <meta property="og:title" content={seo.title} />
              <meta property="og:description" content={seo.description} />
              <meta property="og:url" content={buildCanonicalUrl(router.asPath.split("?")[0])} />
              <meta property="og:image" content={buildCanonicalUrl("/logo/Kv%20garage%20icon.png")} />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={seo.title} />
              <meta name="twitter:description" content={seo.description} />
            </>
          ) : null}
        </Head>
        <AffiliateTracker />
        <DesktopLayout>
          {children}
        </DesktopLayout>
      </>
    );
  }
}