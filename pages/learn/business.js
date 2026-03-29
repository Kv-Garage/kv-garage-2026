import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../lib/timeUtils";

export default function Business() {
  // Mock recent posts for the business category
  const recentPosts = [
    {
      title: "The Complete Guide to Wholesale Business Models",
      excerpt: "Understanding the different approaches to wholesale and how to choose the right one for your goals.",
      category: "Business",
      readingTime: "8 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      slug: "wholesale-business-models",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 950
    },
    {
      title: "Inventory Management Systems for Resellers",
      excerpt: "How to track, organize, and optimize your inventory for maximum efficiency and profit.",
      category: "Business",
      readingTime: "10 min read",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
      slug: "inventory-management-systems",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1100
    },
    {
      title: "Margin Analysis and Profit Optimization",
      excerpt: "Deep dive into understanding your costs and maximizing your profit margins.",
      category: "Business",
      readingTime: "12 min read",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      slug: "margin-analysis-profit-optimization",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1250
    },
    {
      title: "Supplier Negotiation Strategies for Better Margins",
      excerpt: "Learn proven techniques to negotiate better terms and pricing with your suppliers.",
      category: "Business",
      readingTime: "9 min read",
      image: "https://images.unsplash.com/photo-1560438718-ebfa50dc65e3?auto=format&fit=crop&w=800&q=80",
      slug: "supplier-negotiation-strategies",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1050
    },
    {
      title: "Scaling Your Reselling Business: From Side Hustle to Full-Time",
      excerpt: "Step-by-step guide to growing your reselling operation into a sustainable business.",
      category: "Business",
      readingTime: "15 min read",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      slug: "scaling-reselling-business",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1400
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Head>
        <title>Business & Reselling | KV Garage Learn</title>
        <meta
          name="description"
          content="Master wholesale, margins, inventory systems, and structured income strategies for business success."
        />
        <link rel="canonical" href={buildCanonicalUrl("/learn/business")} />
        <meta property="og:title" content="Business & Reselling | KV Garage Learn" />
        <meta property="og:description" content="Learn how products move, how margins work, and how structured systems create scalable income." />
        <meta property="og:url" content={buildCanonicalUrl("/learn/business")} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80" />
      </Head>

      {/* HERO */}
      <section className="py-24 text-center max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
              Business & Reselling Mastery
            </h1>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
              Transform your understanding of how products move through markets, 
              how margins are built, and how structured systems create scalable, 
              sustainable income streams. This is where theory meets practical application.
            </p>
            <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Wholesale Strategies</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Margin Optimization</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Scaling Systems</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CONCEPTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* What Is Wholesale? */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                alt="Wholesale concept"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Core Concept</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                What Is Wholesale?
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Wholesale involves purchasing products in bulk directly from suppliers and distributing them at a margin. 
                  This model removes the retail markup and allows you to access products at significantly lower costs.
                </p>
                <p>
                  The key to successful wholesale is understanding the supply chain, identifying reliable suppliers, 
                  and building relationships that provide consistent access to quality products at competitive prices.
                </p>
                <p>
                  Unlike retail arbitrage, wholesale requires more upfront capital but offers greater control over 
                  product selection, pricing strategy, and long-term business sustainability.
                </p>
              </div>
            </div>
          </div>

          {/* Retail & Arbitrage */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560438718-ebfa50dc65e3?auto=format&fit=crop&w=1200&q=80"
                alt="Retail arbitrage"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Strategy</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Retail & Arbitrage
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Retail arbitrage focuses on identifying pricing inefficiencies and reselling products for structured profit. 
                  This involves finding products priced below market value and selling them at a markup.
                </p>
                <p>
                  Success in arbitrage requires keen market awareness, understanding of product demand cycles, 
                  and the ability to quickly identify opportunities before they're discovered by larger players.
                </p>
                <p>
                  While arbitrage can be started with minimal capital, it requires constant hunting for deals 
                  and adapting to market changes as opportunities become more competitive.
                </p>
              </div>
            </div>
          </div>

          {/* Margins & Cost Structure */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
                alt="Profit margins"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Profitability</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Margins & Cost Structure
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Understanding cost of goods, operating expenses, and profit margins determines business sustainability. 
                  Every business decision should be evaluated through the lens of how it affects your bottom line.
                </p>
                <p>
                  Successful businesses maintain healthy margins by controlling costs, optimizing operations, 
                  and pricing strategically. Understanding your break-even point and target profit margins 
                  is essential for long-term success.
                </p>
                <p>
                  Regular margin analysis helps identify areas for improvement, optimize pricing strategies, 
                  and make informed decisions about product selection and business expansion.
                </p>
              </div>
            </div>
          </div>

          {/* Systems & Scaling */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
                alt="Business systems"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Growth</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Systems & Scaling
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Inventory systems, supplier relationships, and logistics allow businesses to scale beyond manual effort. 
                  Systems create predictability, reduce errors, and enable growth without proportional increases in workload.
                </p>
                <p>
                  Effective systems include inventory management, order processing, customer service protocols, 
                  and financial tracking. Each system should be documented, repeatable, and improvable over time.
                </p>
                <p>
                  Scaling requires investing in systems before you think you need them. Proactive system development 
                  prevents bottlenecks and maintains quality as volume increases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT PUBLICATIONS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Business Insights</p>
            <h2 className="mt-3 text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Latest Business Strategies
            </h2>
            <p className="mt-4 text-gray-300 text-lg leading-relaxed">
              Fresh insights and strategies to help you build and scale your business effectively. 
              Each article provides actionable guidance you can implement immediately.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Updated Daily</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <span>{recentPosts.length} strategies available</span>
          </div>
        </div>

        <div className="grid gap-8">
          {recentPosts.map((post, index) => (
            <Link 
              key={post.slug} 
              href={`/learn/posts/${post.slug}`}
              className="group grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 md:grid-cols-[280px_minmax(0,1fr)] hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/20"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  width={520} 
                  height={340} 
                  className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  loading="lazy" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">{formatTimeAgo(post.createdAt)}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">{formatReadingTime(post.wordCount)}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full font-medium">{post.category}</span>
                  <span className="text-xs text-gray-400">Just published</span>
                </div>
                <h3 className="text-3xl font-semibold leading-tight text-white group-hover:text-[#D4AF37] transition-colors mb-4">
                  {post.title}
                </h3>
                <p className="text-sm leading-7 text-gray-400 mb-6 line-clamp-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Business Strategy</span>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Profit Optimization</span>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Scaling Systems</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRACTICAL APPLICATION */}
      <section className="bg-gradient-to-br from-[#111827] to-[#0B0F19] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              From Knowledge to Action
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              Understanding these concepts is just the beginning. The real value comes from applying 
              this knowledge to build systems that generate consistent, scalable income.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Start Small, Think Big</h3>
              <p className="text-gray-400 leading-relaxed">
                Begin with a focused approach. Choose one product category or strategy and master it 
                before expanding. Depth of knowledge creates competitive advantage.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Build Systems Early</h3>
              <p className="text-gray-400 leading-relaxed">
                Don't wait until you're overwhelmed to create systems. Document processes as you go 
                and implement tools that scale with your growth.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Measure Everything</h3>
              <p className="text-gray-400 leading-relaxed">
                Track your margins, conversion rates, and time investments. Data-driven decisions 
                lead to better outcomes and faster growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-black via-[#0B0F19] to-black py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
            Ready to Build Your Business?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
            The knowledge is here. The strategies are proven. Now it's time to take action 
            and build the business you've been envisioning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/mentorship">
              <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                Get Personalized Guidance
              </button>
            </Link>
            <Link href="/shop">
              <button className="border border-[#D4AF37]/50 text-[#D4AF37] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                Explore Verified Inventory
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
