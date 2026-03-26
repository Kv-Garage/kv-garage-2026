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

      <main className="relative overflow-hidden bg-[#060606] text-[#F4F2EC]">
        <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.025] mix-blend-screen noise-overlay" />

        <section className="relative flex min-h-screen items-center overflow-hidden border-b border-[#1A1A16]">
          <div className="absolute inset-0 bg-[#060606]" />
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
            alt="KV Garage mentorship"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,6,6,0.96)_40%,rgba(6,6,6,0.5)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(to_top,#060606_0%,transparent_40%)]" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 xl:grid-cols-[minmax(0,640px)_1fr]">
            <div className="animate">
              <div className="inline-flex items-center border border-[#C9A84C]/25 bg-[rgba(201,168,76,0.15)] px-5 py-2 font-['DM_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]">
                ◆ KV Garage Mentorship Program
              </div>
              <h1 className="mt-8 max-w-[640px] font-['Cormorant_Garamond'] text-[52px] font-light leading-[0.92] md:text-[78px] xl:text-[96px]">
                Build the Business
                <br />
                Others Only
                <br />
                <span className="italic text-[#C9A84C]">Talk About.</span>
              </h1>
              <p className="mt-6 max-w-[480px] font-['DM_Sans'] text-[17px] font-light leading-8 text-[#6B6B5E]">
                Verified supplier access. Proven supply chain systems. The exact framework serious entrepreneurs use to build real, scalable revenue.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/apply" className="inline-flex items-center justify-center rounded-[3px] bg-[#C9A84C] px-10 py-4 font-['DM_Sans'] text-base font-medium text-[#060606]">
                  Apply for Mentorship →
                </Link>
                <a href="#live-media" className="inline-flex items-center justify-center rounded-[3px] border border-[#C9A84C]/30 px-10 py-4 font-['DM_Sans'] text-base font-medium text-[#C9A84C]">
                  Watch How It Works ↓
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3 font-['DM_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#8C8C82]">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Limited spots · Applications reviewed weekly
              </div>
            </div>

            <div className="hidden xl:flex xl:items-center xl:justify-end">
              <div className="grid grid-cols-3 gap-8 border border-[#C9A84C]/20 bg-black/35 px-8 py-6 backdrop-blur-sm">
                {[
                  { value: "500+", label: "Students" },
                  { value: "$2M+", label: "Revenue" },
                  { value: "6", label: "Streams" },
                ].map((stat, index) => (
                  <div key={stat.label} className={`min-w-[96px] ${index < 2 ? "border-r border-[#C9A84C]/20 pr-8" : ""}`}>
                    <p className="font-['Cormorant_Garamond'] text-[40px] text-[#C9A84C]">{stat.value}</p>
                    <p className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#6B6B5E]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#C9A84C]/20 bg-[#121212] py-4">
          <div className="overflow-hidden">
            <div className="flex w-max animate-[mentorshipMarquee_40s_linear_infinite] gap-8 whitespace-nowrap px-6 font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#C9A84C] hover:[animation-play-state:paused]">
              {[
                "Verified Supplier Access",
                "Wholesale to Retail Systems",
                "500+ Entrepreneurs Mentored",
                "Six-Figure Student Results",
                "Live Weekly Education",
                "Supply Chain Mastery",
                "Affiliate Income Architecture",
                "Real Revenue. Real Results.",
              ]
                .concat([
                  "Verified Supplier Access",
                  "Wholesale to Retail Systems",
                  "500+ Entrepreneurs Mentored",
                  "Six-Figure Student Results",
                ])
                .map((item, index) => (
                  <span key={`${item}-${index}`}>◆ {item}</span>
                ))}
            </div>
          </div>
        </section>

        <section id="live-media" className="mx-auto max-w-7xl px-6 py-24">
          <div className="animate grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="group relative block aspect-video w-full overflow-hidden rounded-[4px] border border-[#C9A84C]/25 bg-[#0D0D0D] shadow-[0_0_40px_rgba(201,168,76,0.08)]"
              >
                {VIDEO_URL ? (
                  <iframe
                    src={VIDEO_URL}
                    allow="autoplay; fullscreen"
                    frameBorder="0"
                    className="h-full w-full rounded-[4px]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.18),transparent_42%),linear-gradient(135deg,rgba(201,168,76,0.08),transparent_60%),#0D0D0D]">
                    <div className="text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-3xl text-[#C9A84C] transition group-hover:scale-105">
                        ▶
                      </div>
                      <p className="mt-6 font-['Cormorant_Garamond'] text-4xl text-white">The KV Garage Story</p>
                      <p className="mt-2 font-['DM_Sans'] text-sm text-[#8C8C82]">Watch Before You Apply</p>
                    </div>
                  </div>
                )}
              </button>
            </div>

            <div className="rounded-[4px] border border-[#1A1A16] bg-[#0D0D0D]">
              <div className="flex border-b border-[#C9A84C]/25">
                {[
                  ["activity", "📍 What's Happening Now"],
                  ["stats", "📊 Program Stats"],
                  ["wins", "💬 Student Wins"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative flex-1 px-4 py-4 text-left font-['DM_Sans'] text-sm ${activeTab === key ? "text-white" : "text-[#6B6B5E]"}`}
                  >
                    {label}
                    {activeTab === key ? <span className="absolute inset-x-4 bottom-0 h-0.5 bg-[#C9A84C]" /> : null}
                  </button>
                ))}
              </div>

              <div className="min-h-[420px] p-6">
                {activeTab === "activity" ? (
                  <div className="space-y-4">
                    {(visibleActivityItems || []).map((item) => {
                      const [message, time] = item.split(" — ");
                      return (
                        <div key={item} className="flex items-start gap-3 border-b border-white/5 pb-4">
                          <span className="mt-1 inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                          <div>
                            <p className="font-['DM_Sans'] text-[13px] text-white">{message}</p>
                            <p className="mt-1 font-['DM_Mono'] text-[11px] text-[#6B6B5E]">{time || "Live now"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {activeTab === "stats" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {PROGRAM_STATS.map((stat) => (
                      <div key={stat.label} className="border border-[#1A1A16] bg-[#121212] p-6">
                        <p className="font-['Cormorant_Garamond'] text-5xl text-[#C9A84C]">
                          <Counter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} active={activeTab === "stats"} />
                        </p>
                        <p className="mt-2 font-['DM_Mono'] text-[10px] uppercase tracking-[0.22em] text-[#6B6B5E]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeTab === "wins" ? (
                  <div className="relative flex min-h-[320px] flex-col justify-between border border-[#1A1A16] bg-[#121212] p-8">
                    <div className="pointer-events-none absolute left-6 top-0 font-['Cormorant_Garamond'] text-[120px] leading-none text-[#C9A84C]/10">
                      “
                    </div>
                    <div className="relative">
                      <p className="font-['Cormorant_Garamond'] text-[18px] italic leading-8 text-white">
                        {STUDENT_WINS[activeWin].quote}
                      </p>
                      <p className="mt-6 font-['DM_Sans'] text-[13px] text-[#C9A84C]">{STUDENT_WINS[activeWin].author}</p>
                      <p className="mt-1 font-['DM_Sans'] text-[13px] text-[#8C8C82]">{STUDENT_WINS[activeWin].title}</p>
                    </div>
                    <div className="relative mt-8 flex items-center justify-between">
                      <div className="flex gap-2">
                        {STUDENT_WINS.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveWin(index)}
                            className={`h-2.5 w-2.5 rounded-full ${index === activeWin ? "bg-[#C9A84C]" : "bg-[#6B6B5E]/40"}`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2 text-[#C9A84C]">
                        <button onClick={() => setActiveWin((prev) => (prev - 1 + STUDENT_WINS.length) % STUDENT_WINS.length)}>‹</button>
                        <button onClick={() => setActiveWin((prev) => (prev + 1) % STUDENT_WINS.length)}>›</button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="animate mt-8 border border-[#C9A84C]/20 bg-[#121212] px-6 py-5 text-center">
            <p className="font-['DM_Sans'] text-base text-white">Ready to be the next success story? Apply in 2 minutes.</p>
            <Link href="/apply" className="mt-4 inline-flex rounded-[3px] bg-[#C9A84C] px-8 py-3 font-['DM_Sans'] font-medium text-[#060606]">
              Apply Now →
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-6 py-20 text-center">
          <div className="animate">
            <p className="font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#C9A84C]">The Reality</p>
            <h2 className="mt-6 font-['Cormorant_Garamond'] text-[38px] italic leading-tight text-white md:text-[64px]">
              Most resellers stay stuck because they&apos;re buying retail and selling retail.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                "No verified supplier access — paying full price, losing margin",
                "No system — guessing on every sourcing decision",
                "Margins too thin to reinvest, too slow to scale",
              ].map((item) => (
                <div key={item} className="border-l-[3px] border-[rgba(200,60,60,0.6)] bg-[#0D0D0D] px-6 py-7 text-left">
                  <p className="font-['DM_Sans'] text-sm leading-7 text-[#F4F2EC]">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 font-['Cormorant_Garamond'] text-[28px] italic text-[#C9A84C]">
              KV Garage Mentorship exists to solve exactly this.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="animate">
            <p className="font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#C9A84C]">The Curriculum</p>
            <h2 className="mt-5 font-['Cormorant_Garamond'] text-[44px] leading-none text-white md:text-[64px]">
              Six Systems. <span className="italic text-[#C9A84C]">One</span> Business.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {(CURRICULUM || []).map((item) => (
              <div key={item.number} className="animate border border-[#1A1A16] border-t-2 border-t-[#C9A84C] bg-[#0D0D0D] px-9 py-10">
                <p className="font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#C9A84C]">{item.number}</p>
                <h3 className="mt-4 font-['DM_Sans'] text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 font-['DM_Sans'] text-sm leading-8 text-[#6B6B5E]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="animate flex items-center justify-center border-l-4 border-l-[#C9A84C] bg-[#090909] px-6 py-10">
              <LiveStoreDashboard />
            </div>
            <div className="animate bg-[#0D0D0D] px-10 py-16 md:px-16">
              <p className="font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#C9A84C]">Who We Build With</p>
              <h2 className="mt-5 font-['Cormorant_Garamond'] text-[42px] leading-tight text-white md:text-[58px]">
                Not a Course.
                <br />
                <span className="italic text-[#C9A84C]">A Mentorship.</span>
              </h2>
              <p className="mt-6 font-['DM_Sans'] text-sm leading-8 text-[#8C8C82]">
                The difference between students who scale and those who stay stuck is not information — it is execution with the right system and the right people behind them.
              </p>
              <p className="mt-5 font-['DM_Sans'] text-sm leading-8 text-[#8C8C82]">
                This mentorship is for the entrepreneur who is done consuming and ready to build. We provide verified supplier access, proven systems, and direct accountability.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Building your first product-based business",
                  "Scaling a resale operation into wholesale",
                  "Adding a supply chain revenue stream",
                  "Ready to invest in a proven system",
                  "Done watching — committed to executing",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 font-['DM_Sans'] text-sm text-white">
                    <span className="text-[#C9A84C]">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/apply" className="mt-8 inline-flex rounded-[3px] bg-[#C9A84C] px-8 py-3 font-['DM_Sans'] font-medium text-[#060606]">
                Apply Now →
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <div className="animate">
            <p className="font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#C9A84C]">How It Works</p>
            <h2 className="mt-5 font-['Cormorant_Garamond'] text-[44px] text-white md:text-[64px]">
              From Application to Revenue
            </h2>
          </div>
          <div className="relative mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {(PROCESS || []).map((step) => (
              <div key={step.number} className="animate relative border border-[#1A1A16] bg-[#0D0D0D] px-6 py-8 text-left">
                <div className="pointer-events-none absolute right-4 top-0 font-['Cormorant_Garamond'] text-[120px] leading-none text-[#C9A84C]/10">
                  {step.number}
                </div>
                <div className="relative">
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A84C]/40 text-[#C9A84C]">
                    ◌
                  </div>
                  <h3 className="font-['DM_Sans'] text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-4 font-['DM_Sans'] text-sm leading-8 text-[#8C8C82]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="animate text-center">
            <p className="font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#C9A84C]">The Investment</p>
            <h2 className="mt-5 font-['Cormorant_Garamond'] text-[44px] text-white md:text-[64px]">
              Choose Your Level of Access
            </h2>
            <p className="mt-4 font-['DM_Sans'] text-sm italic text-[#8C8C82]">
              Every tier includes direct mentorship, supplier access, and a proven system. The level determines the depth.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => {
              const featured = tier.key === "growth";
              return (
                <div
                  key={tier.key}
                  className={`animate relative border bg-[#0D0D0D] px-8 py-10 ${featured ? "scale-[1.01] border-[#C9A84C]/30 border-t-[3px] border-t-[#C9A84C] shadow-[0_0_80px_rgba(201,168,76,0.07)]" : tier.key === "starter" ? "border-[#1A1A16] border-t-[3px] border-t-[#6B6B5E]" : "border-[#1A1A16] border-t-[3px] border-t-[#9A9A9A]"}`}
                >
                  {featured ? (
                    <div className="absolute -top-3 left-8 rounded-full border border-[#C9A84C]/30 bg-[#121212] px-3 py-1 font-['DM_Mono'] text-[10px] uppercase tracking-[0.24em] text-[#C9A84C]">
                      ◆ Most Popular
                    </div>
                  ) : null}
                  <p className={`font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] ${featured ? "text-[#C9A84C]" : "text-[#8C8C82]"}`}>
                    {tier.label}
                  </p>
                  <p className={`mt-6 font-['Cormorant_Garamond'] text-[72px] leading-none ${featured ? "text-[#C9A84C]" : "text-white"}`}>
                    ${tier.amount}
                  </p>
                  <div className="mt-8 space-y-3">
                    {(tier.features || []).map((feature) => (
                      <div key={feature} className="flex items-start gap-3 font-['DM_Sans'] text-sm text-[#F4F2EC]">
                        <span className="text-[#C9A84C]">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  {tier.key === "elite" ? (
                    <p className="mt-6 border-t border-[#C9A84C]/20 pt-4 font-['DM_Sans'] text-sm text-[#C9A84C]">
                      Everything in Growth, plus:
                    </p>
                  ) : null}
                  <Link
                    href="/apply"
                    className={`mt-8 inline-flex w-full justify-center rounded-[3px] px-6 py-4 font-['DM_Sans'] text-sm font-semibold ${featured ? "bg-[#C9A84C] text-[#060606]" : "border border-[#C9A84C]/30 text-[#C9A84C]"}`}
                  >
                    Apply Now →
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center font-['DM_Sans'] text-sm italic text-[#8C8C82]">
            Unsure which tier fits? Your strategy call will determine the best level for you.
          </p>
        </section>

        <section className="border-y border-[#C9A84C]/20 bg-[#121212] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="animate text-center">
              <p className="font-['DM_Mono'] text-[11px] uppercase tracking-[0.24em] text-[#C9A84C]">Student Results</p>
              <h2 className="mt-5 font-['Cormorant_Garamond'] text-[42px] italic text-white md:text-[56px]">
                What Happens When You Execute
              </h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {(TESTIMONIALS || []).map((testimonial) => (
                <div key={testimonial.author} className="animate relative border border-[#1A1A16] bg-[#0D0D0D] px-10 py-12">
                  <div className="pointer-events-none absolute left-6 top-0 font-['Cormorant_Garamond'] text-[160px] leading-none text-[#C9A84C]/10">
                    “
                  </div>
                  <p className="relative font-['Cormorant_Garamond'] text-[20px] italic leading-[1.65] text-white">
                    {testimonial.quote}
                  </p>
                  <div className="mt-8 h-px w-8 bg-[#C9A84C]" />
                  <p className="mt-5 font-['DM_Sans'] text-sm font-semibold text-[#C9A84C]">{testimonial.author}</p>
                  <p className="mt-1 font-['DM_Sans'] text-xs text-[#8C8C82]">{testimonial.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A84C]/10 blur-[120px]" />
          <div className="animate relative mx-auto max-w-4xl">
            <div className="mx-auto mb-10 h-px w-[120px] bg-[#C9A84C]/30" />
            <h2 className="font-['Cormorant_Garamond'] text-[48px] font-light leading-none text-white md:text-[88px]">
              The System Is Proven.
              <br />
              <span className="italic text-[#C9A84C]">The Opportunity Is Now.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-[440px] font-['DM_Sans'] text-[18px] leading-8 text-[#8C8C82]">
              Every week without the right supplier relationships and systems is revenue left on the table. Apply today. Build tomorrow.
            </p>
            <Link href="/apply" className="mt-10 inline-flex animate-[pulseCta_3s_infinite] rounded-[3px] bg-[#C9A84C] px-16 py-5 font-['DM_Sans'] text-base font-semibold text-[#060606]">
              Apply for KV Garage Mentorship →
            </Link>
            <p className="mt-6 font-['DM_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#8C8C82]">
              ● Limited spots · Reviewed weekly · No obligation
            </p>
            <p className="mt-4 font-['DM_Sans'] text-xs text-[rgba(107,107,94,0.4)]">
              KV Garage Mentorship is a private program. Application does not guarantee acceptance.
            </p>
          </div>
        </section>

        {videoOpen ? (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-6" onClick={() => setVideoOpen(false)}>
            <div className="w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
              <button onClick={() => setVideoOpen(false)} className="mb-3 ml-auto block text-sm text-[#C9A84C]">
                Close
              </button>
              <div className="aspect-video overflow-hidden rounded-[4px] border border-[#C9A84C]/20 bg-[#0D0D0D]">
                {VIDEO_URL ? (
                  <iframe
                    src={VIDEO_URL}
                    allow="autoplay; fullscreen"
                    frameBorder="0"
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.18),transparent_42%),#0D0D0D] text-center">
                    <div>
                      <p className="font-['Cormorant_Garamond'] text-4xl italic text-[#C9A84C]">Mentorship Reel Coming Online</p>
                      <p className="mt-3 font-['DM_Sans'] text-sm text-[#8C8C82]">
                        This space is ready for your hosted video embed the moment it is uploaded.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <style jsx global>{`
          @keyframes mentorshipMarquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes pulseCta {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }

          .noise-overlay {
            background-image:
              radial-gradient(rgba(255,255,255,0.4) 0.7px, transparent 0.7px),
              radial-gradient(rgba(255,255,255,0.2) 0.5px, transparent 0.5px);
            background-position: 0 0, 12px 12px;
            background-size: 24px 24px;
          }

          .animate {
            opacity: 0;
            transform: translateY(32px);
            transition:
              opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .animate.visible {
            opacity: 1;
            transform: translateY(0);
          }

          .animate.visible h2::after {
            width: 48px;
          }
        `}</style>
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
    <div className="w-full max-w-[560px] rounded-xl border border-[#C9A84C]/30 bg-[#0D0D0D] p-6 shadow-[0_0_60px_rgba(201,168,76,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[#22C55E]" />
          <span className="font-['DM_Mono'] text-[10px] uppercase tracking-[0.24em] text-[#F4F2EC]">Live</span>
        </div>
        <div className="text-right">
          <p className="font-['DM_Mono'] text-[10px] uppercase tracking-[0.22em] text-[#6B6B5E]">Today&apos;s Revenue</p>
          <p className="font-['DM_Sans'] text-2xl font-semibold text-[#C9A84C]">
            ${displayRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {DASHBOARD_PRODUCTS.map((product, index) => (
          <div key={product.name} className="rounded-xl border border-[#1A1A16] bg-[#151515] p-3">
            <div className="relative overflow-hidden rounded-lg">
              <Image src={product.image} alt={product.name} width={220} height={140} className="h-28 w-full object-cover" />
              <span className={`absolute right-2 top-2 rounded-full bg-[#22C55E]/15 px-2 py-1 text-[10px] font-semibold uppercase text-[#22C55E] transition-opacity duration-500 ${soldIndex === index ? "opacity-100" : "opacity-30"}`}>
                Sold
              </span>
            </div>
            <p className="mt-3 truncate font-['DM_Sans'] text-xs text-white">{product.name}</p>
            <p className="mt-1 font-['DM_Sans'] text-sm font-bold text-[#C9A84C]">{product.price}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-[#1A1A16] bg-[#151515] p-4">
        <p className="font-['DM_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#6B6B5E]">Order Feed</p>
        <div className="mt-3 space-y-3">
          {(orders || []).map((order) => (
            <div key={order.id} className="flex items-center justify-between border-b border-white/5 pb-3 text-sm last:border-b-0 last:pb-0">
              <p className="font-['DM_Sans'] text-white">✓ Order #{order.id}</p>
              <p className="font-['DM_Sans'] text-[#C9A84C]">${order.amount.toFixed(2)}</p>
              <p className="font-['DM_Mono'] text-[11px] text-[#6B6B5E]">{order.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between font-['DM_Mono'] text-[11px] text-[#F4F2EC]">
          <span>Monthly Goal: $48,470 / $120,000</span>
          <span className="text-[#6B6B5E]">40%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-[40%] rounded-full bg-[#C9A84C] transition-all duration-1000" />
        </div>
      </div>
    </div>
  );
}
