import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildCanonicalUrl } from "../lib/seo";
import { PROGRAM_CATALOG } from "../lib/programCatalog";

const LIVE_ACTIVITY_ITEMS = [
  "Marcus from Detroit just applied — 2 min ago",
  "New supplier drop added to the catalog — 14 min ago",
  "Danielle completed onboarding — 1 hr ago",
  "3 new wholesale products imported — 2 hrs ago",
  "Jordan placed first wholesale order — 3 hrs ago",
];

const STUDENT_WINS = [
  {
    quote:
      "Within 60 days I had my first wholesale order placed and my store was generating real revenue.",
    author: "Marcus T.",
    title: "Wholesale Student",
  },
  {
    quote:
      "I went from reselling retail to running three wholesale product lines with supplier access I could not have found on my own.",
    author: "Danielle R.",
    title: "Growth Tier Member",
  },
  {
    quote:
      "This mentorship rewired how I think about inventory. I stopped reselling and started building a real supply chain business.",
    author: "Jordan K.",
    title: "Elite Access Member",
  },
];

const CURRICULUM = [
  {
    number: "01",
    title: "Supplier Access",
    body: "Direct wholesale relationships — verified, tested, exclusive to KV Garage students. No middlemen.",
  },
  {
    number: "02",
    title: "Inventory Systems",
    body: "Source at wholesale cost. Capture retail margins. Build a repeatable fulfillment engine.",
  },
  {
    number: "03",
    title: "Store Architecture",
    body: "Your fully branded e-commerce store with supplier integration, tiered pricing, and conversion systems.",
  },
  {
    number: "04",
    title: "Inventory Trading",
    body: "Trade product like an asset. Buy verified, flip strategically, compound capital every cycle.",
  },
  {
    number: "05",
    title: "Affiliate Architecture",
    body: "Passive income streams woven directly into your business model — not bolted on after the fact.",
  },
  {
    number: "06",
    title: "Live Mentorship",
    body: "Weekly sessions, direct access, real answers. Built entirely around execution — not theory.",
  },
];

const PROCESS = [
  {
    number: "01",
    title: "Apply",
    body: "Submit your application. Tell us where you are and exactly where you want to go.",
  },
  {
    number: "02",
    title: "Strategy Call",
    body: "Accepted applicants schedule a 1-on-1 call to map their roadmap and confirm fit.",
  },
  {
    number: "03",
    title: "Onboarding",
    body: "Immediate access to suppliers, systems, curriculum, and your dedicated mentor.",
  },
  {
    number: "04",
    title: "Execute",
    body: "Follow the system. Move inventory. Build toward your first $10K month with proven support behind every decision.",
  },
];

const PROGRAM_STATS = [
  { label: "Students", value: 500, suffix: "+" },
  { label: "Revenue", value: 2, prefix: "$", suffix: "M+" },
  { label: "Streams Taught", value: 6, suffix: "" },
  { label: "Verified Suppliers", value: 100, suffix: "%" },
];

const TESTIMONIALS = [
  {
    quote:
      "Within 60 days I had my first wholesale order placed and my store was generating real revenue.",
    author: "Marcus T.",
    title: "Wholesale Operator",
  },
  {
    quote:
      "I went from reselling retail to running three wholesale product lines with supplier access I couldn't have found on my own.",
    author: "Danielle R.",
    title: "Growth Student",
  },
  {
    quote:
      "This mentorship rewired how I think about inventory. I stopped reselling and started building a real supply chain business.",
    author: "Jordan K.",
    title: "Elite Member",
  },
];

const DASHBOARD_PRODUCTS = [
  {
    name: "Executive Watch",
    price: "$249.00",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Velvet Perfume",
    price: "$68.00",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Velocity Sneaker",
    price: "$140.00",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Signature Bag",
    price: "$185.00",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=200&q=80",
  },
];

const VIDEO_URL = process.env.NEXT_PUBLIC_MENTORSHIP_VIDEO_URL || "";
const MENTORSHIP_SIGNUP_ID = "mentorship-signup";
const INITIAL_SIGNUP_FORM = {
  name: "",
  email: "",
  phone: "",
  stage: "",
  goal: "",
  question: "",
};

function buildApplicationPayload(form, selectedTierLabel) {
  const notes = [
    form.phone ? `Phone: ${form.phone}` : "",
    form.goal ? `Goal: ${form.goal}` : "",
    form.question ? `Question: ${form.question}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    name: form.name.trim(),
    email: form.email.trim(),
    business_type: "Mentorship Applicant",
    volume: selectedTierLabel || "General mentorship interest",
    sales_channel: form.stage.trim() || "Not provided",
    experience: notes || "No extra notes provided.",
  };
}

function Counter({ target, prefix = "", suffix = "", active }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame;
    let start = 0;
    const duration = 900;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const next = Math.round(start + (target - start) * progress);
      setValue(next);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return `${prefix}${value}${suffix}`;
}

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState("activity");
  const [activeWin, setActiveWin] = useState(0);
  const [activityShift, setActivityShift] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [signupForm, setSignupForm] = useState(INITIAL_SIGNUP_FORM);
  const [selectedTierKey, setSelectedTierKey] = useState(PROGRAM_CATALOG.growth.key);
  const [signupMessage, setSignupMessage] = useState("");
  const [signupState, setSignupState] = useState("idle");
  const [checkoutTierKey, setCheckoutTierKey] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const nodes = document.querySelectorAll(".animate");
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityShift((prev) => (prev + 1) % LIVE_ACTIVITY_ITEMS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWin((prev) => (prev + 1) % STUDENT_WINS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const visibleActivityItems = useMemo(() => {
    return LIVE_ACTIVITY_ITEMS.map((_, index) => LIVE_ACTIVITY_ITEMS[(index + activityShift) % LIVE_ACTIVITY_ITEMS.length]);
  }, [activityShift]);

  const pricingTiers = [
    PROGRAM_CATALOG.starter,
    PROGRAM_CATALOG.growth,
    PROGRAM_CATALOG.elite,
  ];

  const selectedTier = pricingTiers.find((tier) => tier.key === selectedTierKey) || PROGRAM_CATALOG.growth;

  const updateSignupForm = (event) => {
    const { name, value } = event.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToSignup = () => {
    const node = document.getElementById(MENTORSHIP_SIGNUP_ID);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitApplication = async (tierOverride = selectedTier) => {
    const payload = buildApplicationPayload(signupForm, tierOverride?.label);

    const response = await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not save your mentorship application.");
    }

    return data;
  };

  const handleApplicationOnly = async () => {
    if (!signupForm.name.trim() || !signupForm.email.trim()) {
      setSignupState("error");
      setSignupMessage("Add your name and email so we can follow up with you.");
      scrollToSignup();
      return;
    }

    try {
      setSignupState("saving");
      setSignupMessage("");
      await submitApplication(selectedTier);
      setSignupState("success");
      setSignupMessage("Your mentorship application is in. We will follow up with next steps shortly.");
    } catch (error) {
      setSignupState("error");
      setSignupMessage(error.message || "Could not send your application.");
    }
  };

  const handleTierCheckout = async (tier) => {
    setSelectedTierKey(tier.key);

    if (!signupForm.name.trim() || !signupForm.email.trim()) {
      setSignupState("error");
      setSignupMessage("Complete the mentorship form first so Stripe and follow-up are tied together.");
      scrollToSignup();
      return;
    }

    try {
      setCheckoutTierKey(tier.key);
      setSignupState("saving");
      setSignupMessage("");
      await submitApplication(tier);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: tier.stripeType,
          customerEmail: signupForm.email.trim(),
          lead: {
            name: signupForm.name.trim(),
            email: signupForm.email.trim(),
            phone: signupForm.phone.trim(),
            stage: signupForm.stage.trim(),
            goal: signupForm.goal.trim(),
            question: signupForm.question.trim(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not open Stripe checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      setSignupState("error");
      setSignupMessage(error.message || "Could not start checkout.");
      scrollToSignup();
    } finally {
      setCheckoutTierKey("");
    }
  };

  return (
    <>
      <Head>
        <title>Business Mentorship Program | Learn to Build a Profitable Resale Business — KV Garage</title>
        <meta
          name="description"
          content="Work directly with KV Garage to develop your wholesale strategy, supply chain, and business systems. Structured mentorship for serious entrepreneurs."
        />
        <link rel="canonical" href={buildCanonicalUrl("/mentorship")} />
        <meta property="og:title" content="Business Mentorship Program | Learn to Build a Profitable Resale Business — KV Garage" />
        <meta
          property="og:description"
          content="Verified supplier access. Proven supply chain systems. The exact framework serious entrepreneurs use to build real, scalable revenue."
        />
        <meta property="og:url" content={buildCanonicalUrl("/mentorship")} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="relative overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* 🔥 URGENT HEADER BANNER */}
        <div className="bg-gradient-to-r from-red-600/20 via-red-700/20 to-red-800/20 border border-red-500/30 text-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIMITED CAPACITY</span>
              </div>
              <span className="text-sm text-gray-300">Only 15 spots remaining for Q2 mentorship access</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-red-300">TIME LEFT:</span>
              <span className="text-white font-bold">23:45:12</span>
            </div>
          </div>
        </div>

        {/* 🔥 HERO SECTION */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-6 mb-8">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-[#D4AF37]/30">EST. 2022</span>
                  <span className="text-gray-400 text-sm border border-white/20 px-4 py-2 rounded-full">500+ Students</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                    Business Mentorship
                  </span>
                  <br />
                  <span className="text-gray-300">Program</span>
                </h1>

                <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl">
                  Work directly with KV Garage to develop your wholesale strategy, supply chain, and business systems. 
                  Structured mentorship for serious entrepreneurs who are ready to build real, scalable revenue.
                </p>

                <div className="my-8 text-center">
                  <a 
                    href="https://midnight-architect.emergent.host/join?ref=146DA53E&dept=sales_rep" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Apply to Become a Mentor and Earn"
                    className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors duration-300"
                  >
                    Apply to Make Money
                  </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  {PROGRAM_STATS.map((stat, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 p-6 rounded-xl">
                      <div className={`text-3xl font-bold ${index === 1 ? 'text-[#D4AF37]' : 'text-white'}`}>
                        {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                      </div>
                      <div className="text-sm text-gray-300 mt-3">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link href={`#${MENTORSHIP_SIGNUP_ID}`}>
                    <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105">
                      Start Mentorship Setup
                    </button>
                  </Link>
                  
                  <Link href="#live-media">
                    <button className="border border-white/30 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                      Watch How It Works
                    </button>
                  </Link>
                </div>

                <div className="mt-8 text-sm text-gray-400">
                  <div className="flex flex-wrap gap-6">
                    <span>🔒 Limited Spots Available</span>
                    <span>⚡ Applications Reviewed Weekly</span>
                    <span>📈 Proven Results</span>
                    <span>🌐 Global Network</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">500+</div>
                      <div className="text-sm text-gray-300">Students Mentored</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">$2M+</div>
                      <div className="text-sm text-gray-300">Student Revenue</div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">6</div>
                      <div className="text-sm text-gray-300">Business Systems</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/30 p-8 rounded-xl">
                      <div className="text-4xl font-bold text-[#D4AF37] mb-3">100%</div>
                      <div className="text-sm text-gray-300">Verified Suppliers</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 LIVE ACTIVITY SECTION */}
        <section className="py-16 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">What's Happening Now</h2>
              <p className="text-xl text-gray-300">Live updates from our growing community</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-semibold">LIVE ACTIVITY</span>
                </div>
                <div className="space-y-4">
                  {(visibleActivityItems || []).slice(0, 3).map((item, index) => {
                    const [message, time] = item.split(" — ");
                    return (
                      <div key={item} className="flex items-start gap-3 border-b border-white/10 pb-3">
                        <span className="mt-1 inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400"></span>
                        <div>
                          <p className="text-white text-sm">{message}</p>
                          <p className="text-gray-400 text-xs mt-1">{time || "Live now"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 bg-[#D4AF37] rounded-full animate-pulse"></div>
                  <span className="text-[#D4AF37] font-semibold">STUDENT WINS</span>
                </div>
                <div className="space-y-4">
                  {STUDENT_WINS.slice(0, 2).map((testimonial, index) => (
                    <div key={index} className="border-b border-white/10 pb-3">
                      <p className="text-gray-300 text-sm italic mb-3">"{testimonial.quote}"</p>
                      <div className="text-white text-sm font-semibold">{testimonial.author}</div>
                      <div className="text-gray-400 text-xs">{testimonial.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 font-semibold">PROGRAM STATS</span>
                </div>
                <div className="grid gap-4">
                  {PROGRAM_STATS.map((stat, index) => (
                    <div key={index} className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <div className="text-2xl font-bold text-[#D4AF37]">{stat.prefix || ''}{stat.value}{stat.suffix || ''}</div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 THE REALITY SECTION */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-3xl p-16">
              <p className="text-[#D4AF37] font-semibold text-lg mb-6">The Reality</p>
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                Most resellers stay stuck because they're buying retail and selling retail.
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  "No verified supplier access — paying full price, losing margin",
                  "No system — guessing on every sourcing decision",
                  "Margins too thin to reinvest, too slow to scale",
                ].map((item) => (
                  <div key={item} className="bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/30 p-6 rounded-xl">
                    <p className="text-white text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-3xl text-[#D4AF37] font-semibold">
                KV Garage Mentorship exists to solve exactly this.
              </p>
            </div>
          </div>
        </section>

        {/* 🔥 CURRICULUM SECTION */}
        <section className="py-24 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] font-semibold text-lg mb-6">The Curriculum</p>
              <h2 className="text-5xl lg:text-6xl font-bold mb-8">
                Six Systems. <span className="text-[#D4AF37]">One</span> Business.
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {(CURRICULUM || []).map((item) => (
                <div key={item.number} className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">{item.number}</span>
                    <span className="text-[#D4AF37] font-semibold">SYSTEM</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔥 LIVE DASHBOARD SECTION */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <LiveStoreDashboard />
              </div>
              <div>
                <p className="text-[#D4AF37] font-semibold text-lg mb-6">Who We Build With</p>
                <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                  Not a Course.
                  <br />
                  <span className="text-[#D4AF37]">A Mentorship.</span>
                </h2>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  The difference between students who scale and those who stay stuck is not information — it is execution with the right system and the right people behind them.
                </p>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  This mentorship is for the entrepreneur who is done consuming and ready to build. We provide verified supplier access, proven systems, and direct accountability.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    "Building your first product-based business",
                    "Scaling a resale operation into wholesale",
                    "Adding a supply chain revenue stream",
                    "Ready to invest in a proven system",
                    "Done watching — committed to executing",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                      <span className="text-white text-lg">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href={`#${MENTORSHIP_SIGNUP_ID}`}>
                  <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                    Start Your Setup
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 HOW IT WORKS SECTION */}
        <section className="py-24 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[#D4AF37] font-semibold text-lg mb-6">How It Works</p>
            <h2 className="text-5xl lg:text-6xl font-bold mb-12">
              From Application to Revenue
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(PROCESS || []).map((step) => (
                <div key={step.number} className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                  <div className="text-6xl font-bold text-[#D4AF37] mb-4">{step.number}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔥 INVESTMENT SECTION */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] font-semibold text-lg mb-6">The Investment</p>
              <h2 className="text-5xl lg:text-6xl font-bold mb-8">
                Choose Your Level of Access
              </h2>
              <p className="text-gray-300 text-lg italic">
                Every tier includes direct mentorship, supplier access, and a proven system. The level determines the depth.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {pricingTiers.map((tier) => {
                const featured = tier.key === "growth";
                return (
                  <div
                    key={tier.key}
                    className={`bg-gradient-to-br from-white/5 to-transparent border rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500 ${featured ? 'transform hover:scale-105' : ''}`}
                  >
                    {featured ? (
                      <div className="text-center mb-4">
                        <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-[#D4AF37]/30">
                          Most Popular
                        </span>
                      </div>
                    ) : null}
                    
                    <div className="text-center mb-8">
                      <p className={`text-sm font-semibold mb-4 ${featured ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                        {tier.label}
                      </p>
                      <div className={`text-6xl font-bold ${featured ? 'text-[#D4AF37]' : 'text-white'}`}>
                        ${tier.amount}
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {(tier.features || []).map((feature) => (
                        <div key={feature} className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                          <span className="text-white text-lg">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {tier.key === "elite" ? (
                      <div className="border-t border-white/20 pt-4 mb-8">
                        <p className="text-[#D4AF37] text-lg font-semibold">Everything in Growth, plus:</p>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleTierCheckout(tier)}
                      disabled={checkoutTierKey === tier.key}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                        featured 
                          ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:shadow-lg hover:shadow-[#D4AF37]/30' 
                          : 'border border-white/30 text-white hover:bg-white hover:text-black'
                      } ${checkoutTierKey === tier.key ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-105'}`}
                    >
                      {checkoutTierKey === tier.key ? "Opening Stripe..." : `Choose ${tier.label}`}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-400 text-lg italic">
                Fill out the form below once, then any pricing button takes you straight into Stripe checkout for that tier.
              </p>
            </div>
          </div>
        </section>

        {/* 🔥 SIGNUP SECTION */}
        <section id={MENTORSHIP_SIGNUP_ID} className="py-24 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <p className="text-[#D4AF37] font-semibold text-lg mb-6">Mentorship Signup</p>
                <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                  One form.
                  <br />
                  <span className="text-[#D4AF37]">Direct path</span> to checkout and scheduling.
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Share your details, tell us your current stage, and ask anything you need answered. Once this is filled out, your mentorship tier buttons above route straight into Stripe and then into a Calendly popup after payment.
                </p>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        name="name"
                        value={signupForm.name}
                        onChange={updateSignupForm}
                        placeholder="Your name"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={signupForm.email}
                        onChange={updateSignupForm}
                        placeholder="you@example.com"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone (Optional)</label>
                      <input
                        name="phone"
                        value={signupForm.phone}
                        onChange={updateSignupForm}
                        placeholder="Optional"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Stage</label>
                      <select
                        name="stage"
                        value={signupForm.stage}
                        onChange={updateSignupForm}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                      >
                        <option value="">Select where you are</option>
                        <option value="Just getting started">Just getting started</option>
                        <option value="Already selling online">Already selling online</option>
                        <option value="Moving from retail to wholesale">Moving from retail to wholesale</option>
                        <option value="Scaling an existing store">Scaling an existing store</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Main Goal</label>
                    <textarea
                      name="goal"
                      value={signupForm.goal}
                      onChange={updateSignupForm}
                      rows={4}
                      placeholder="What are you trying to build over the next 90 days?"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all duration-300 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Questions</label>
                    <textarea
                      name="question"
                      value={signupForm.question}
                      onChange={updateSignupForm}
                      rows={4}
                      placeholder="Ask anything you want covered before you join."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={handleApplicationOnly}
                      disabled={signupState === "saving" && !checkoutTierKey}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                    >
                      {signupState === "saving" && !checkoutTierKey ? "Sending..." : "Submit Questions Only"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTierCheckout(selectedTier)}
                      disabled={Boolean(checkoutTierKey)}
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-6 py-4 rounded-lg font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
                    >
                      {checkoutTierKey === selectedTier.key ? "Opening Stripe..." : `Continue with ${selectedTier.label}`}
                    </button>
                  </div>

                  {signupMessage ? (
                    <p className={`text-sm ${signupState === "error" ? "text-red-400" : "text-green-400"}`}>
                      {signupMessage}
                    </p>
                  ) : null}
                </form>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
                <p className="text-[#D4AF37] font-semibold text-lg mb-6">Selected Tier</p>
                <h3 className="text-4xl font-bold text-white mb-4">{selectedTier.label}</h3>
                <p className="text-5xl font-bold text-[#D4AF37] mb-8">${selectedTier.amount}</p>
                
                <div className="space-y-4 mb-8">
                  {(selectedTier.features || []).map((feature) => (
                    <div key={feature} className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                      <span className="text-white text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/20 pt-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Checkout flow: mentorship form → Stripe payment → Calendly popup scheduling on the success page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 TESTIMONIALS SECTION */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] font-semibold text-lg mb-6">Student Results</p>
              <h2 className="text-5xl lg:text-6xl font-bold mb-8">
                What Happens When You Execute
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {(TESTIMONIALS || []).map((testimonial) => (
                <div key={testimonial.author} className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                  <div className="text-8xl font-bold text-[#D4AF37]/20 mb-6">"</div>
                  <p className="text-white text-lg italic leading-relaxed mb-8">{testimonial.quote}</p>
                  <div className="border-t border-white/20 pt-6">
                    <p className="text-[#D4AF37] font-semibold text-lg mb-2">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔥 FINAL CTA */}
        <section className="py-24 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-3xl p-16">
              <div className="w-px h-16 bg-[#D4AF37] mx-auto mb-8"></div>
              <h2 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                The System Is Proven.
                <br />
                <span className="text-[#D4AF37]">The Opportunity Is Now.</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                Every week without the right supplier relationships and systems is revenue left on the table. Apply today. Build tomorrow.
              </p>
              <Link href={`#${MENTORSHIP_SIGNUP_ID}`}>
                <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-12 py-5 rounded-xl font-bold text-2xl shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105">
                  Start Mentorship Checkout
                </button>
              </Link>
              <p className="mt-8 text-gray-400 text-lg">
                Limited spots · Reviewed weekly · No obligation
              </p>
              <p className="mt-4 text-gray-500 text-sm">
                KV Garage Mentorship is a private program. Application does not guarantee acceptance.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function LiveStoreDashboard() {
  const [revenue, setRevenue] = useState(4847);
  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [soldIndex, setSoldIndex] = useState(0);
  const [orders, setOrders] = useState([
    { id: 4821, amount: 47, time: "Just now" },
    { id: 4820, amount: 124, time: "2 min ago" },
    { id: 4819, amount: 89, time: "5 min ago" },
    { id: 4818, amount: 200, time: "8 min ago" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSoldIndex((prev) => (prev + 1) % DASHBOARD_PRODUCTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayRevenue((prev) => {
        const next = prev + Math.max(1, Math.ceil((revenue - prev) / 10));
        return next >= revenue ? revenue : next;
      });
    }, 32);
    return () => clearInterval(interval);
  }, [revenue]);

  useEffect(() => {
    const interval = setInterval(() => {
      const amount = Math.floor(Math.random() * 221) + 30;
      setOrders((prev) => {
        const nextId = (prev[0]?.id || 4821) + 1;
        return [{ id: nextId, amount, time: "Just now" }, ...prev.slice(0, 2).map((item) => ({ ...item, time: item.time }))].slice(0, 4);
      });
      setRevenue((prev) => prev + amount);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-semibold text-lg">Live Store Dashboard</span>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-2">Today's Revenue</p>
            <p className="text-3xl font-bold text-[#D4AF37]">
              ${displayRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {DASHBOARD_PRODUCTS.map((product, index) => (
            <div key={product.name} className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6 hover:border-[#D4AF37]/50 transition-all duration-500">
              <div className="relative mb-4">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  soldIndex === index 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  Sold
                </span>
              </div>
              <h3 className="text-white font-semibold mb-2">{product.name}</h3>
              <p className="text-[#D4AF37] font-bold text-lg">{product.price}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-4 font-semibold">Order Feed</p>
          <div className="space-y-4">
            {(orders || []).map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-white font-medium">Order #{order.id}</span>
                </div>
                <div className="text-right">
                  <p className="text-[#D4AF37] font-bold">{order.amount.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Monthly Goal: $48,470 / $120,000</span>
            <span className="text-gray-400">40%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-4">
            <div className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 h-4 rounded-full w-40 transition-all duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}