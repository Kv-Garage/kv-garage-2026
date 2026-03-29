import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../lib/timeUtils";

export default function Markets() {
  // Mock recent posts for the markets category
  const recentPosts = [
    {
      title: "Understanding Market Cycles and Timing",
      excerpt: "Learn to identify market phases and position your investments for optimal returns.",
      category: "Markets",
      readingTime: "9 min read",
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
      slug: "market-cycles-timing",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1100
    },
    {
      title: "Risk Management Strategies for Traders",
      excerpt: "Essential techniques to protect your capital and manage trading risks effectively.",
      category: "Markets",
      readingTime: "11 min read",
      image: "https://images.unsplash.com/photo-1560184897-6a0e5bd907d3?auto=format&fit=crop&w=800&q=80",
      slug: "risk-management-strategies",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1250
    },
    {
      title: "Technical Analysis Fundamentals",
      excerpt: "Master the basics of chart reading and technical indicators for better trading decisions.",
      category: "Markets",
      readingTime: "15 min read",
      image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=800&q=80",
      slug: "technical-analysis-fundamentals",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1400
    },
    {
      title: "Futures Trading: Hedging vs Speculation",
      excerpt: "Understanding the difference between hedging and speculation in futures markets.",
      category: "Markets",
      readingTime: "12 min read",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
      slug: "futures-trading-hedging",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1300
    },
    {
      title: "Volatility Trading Strategies",
      excerpt: "How to profit from market volatility while managing risk effectively.",
      category: "Markets",
      readingTime: "10 min read",
      image: "https://images.unsplash.com/photo-1560184897-6a0e5bd907d3?auto=format&fit=crop&w=800&q=80",
      slug: "volatility-trading-strategies",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1150
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Head>
        <title>Markets & Investing | KV Garage Learn</title>
        <meta
          name="description"
          content="Master market analysis, risk management, technical analysis, and trading strategies for consistent profits."
        />
        <link rel="canonical" href={buildCanonicalUrl("/learn/markets")} />
        <meta property="og:title" content="Markets & Investing | KV Garage Learn" />
        <meta property="og:description" content="Understand investing, futures, volatility, risk management, and how markets actually move." />
        <meta property="og:url" content={buildCanonicalUrl("/learn/markets")} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80" />
      </Head>

      {/* HERO */}
      <section className="py-24 text-center max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
              Markets & Investing Mastery
            </h1>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
              Master the art of market analysis, risk management, and strategic trading. 
              Learn to read market signals, identify opportunities, and protect your capital 
              while building consistent, long-term wealth.
            </p>
            <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Market Analysis</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Risk Management</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Trading Strategies</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CONCEPTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* What Is Investing? */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80"
                alt="Investing concept"
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
                What Is Investing?
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Investing is the allocation of capital into assets expected to
                  generate long-term returns through appreciation, dividends,
                  or yield. This requires understanding risk versus reward, time horizons, and the fundamental drivers of value.
                </p>
                <p>
                  Successful investing is not about timing the market perfectly, but about time in the market. 
                  It's about building a diversified portfolio that can weather different economic conditions while 
                  capturing long-term growth.
                </p>
                <p>
                  The key to profitable investing lies in understanding asset valuation, market cycles, and your 
                  own risk tolerance. It's a discipline that combines analytical thinking with emotional control.
                </p>
              </div>
            </div>
          </div>

          {/* What Is Trading? */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560438718-ebfa50dc65e3?auto=format&fit=crop&w=1200&q=80"
                alt="Trading concept"
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
                What Is Trading?
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Trading focuses on shorter-term price movements and requires
                  structured risk management, discipline, and statistical awareness. 
                  Unlike long-term investing, trading aims to profit from market inefficiencies and price fluctuations.
                </p>
                <p>
                  Successful trading requires a systematic approach that removes emotional
                  decision-making. This includes predefined entry and exit criteria, risk-reward ratios,
                  and position sizing rules that protect capital during adverse conditions.
                </p>
                <p>
                  The best traders combine technical analysis with fundamental understanding
                  and maintain strict discipline in their execution. They understand that
                  consistency over time is more important than any single trade.
                </p>
              </div>
            </div>
          </div>

          {/* What Are Futures? */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=1200&q=80"
                alt="Futures concept"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Advanced</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                What Are Futures?
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Futures contracts allow participation in commodities,
                  stock indices, and financial instruments using leverage.
                  These standardized contracts obligate the buyer to purchase
                  and the seller to deliver the underlying asset at a predetermined future date.
                </p>
                <p>
                  Futures trading provides several advantages including leverage,
                  liquidity, and the ability to profit from both rising and falling markets.
                  However, leverage amplifies both gains and losses, making risk management critical.
                </p>
                <p>
                  Understanding futures requires knowledge of contract specifications,
                  margin requirements, and the relationship between spot prices and futures prices.
                  These instruments are used for both hedging existing positions and speculation.
                </p>
              </div>
            </div>
          </div>

          {/* Risk & Volatility */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80"
                alt="Risk & volatility"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Risk Management</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Risk & Volatility
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Markets move because of liquidity, macroeconomic forces,
                  institutional positioning, and global information flow.
                  Understanding these drivers helps you anticipate market movements
                  and position your trades accordingly.
                </p>
                <p>
                  Volatility is not inherently bad—it's the price movement that creates trading opportunities.
                  Effective risk management involves position sizing, stop-loss strategies, and portfolio
                  diversification to protect capital during adverse conditions.
                </p>
                <p>
                  The key to managing volatility is having a systematic approach that removes emotional
                  decision-making. This includes understanding your risk tolerance, setting appropriate
                  position sizes, and maintaining discipline in your trading approach.
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
            <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Market Insights</p>
            <h2 className="mt-3 text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Latest Market Strategies
            </h2>
            <p className="mt-4 text-gray-300 text-lg leading-relaxed">
              Fresh analysis and strategies to help you navigate markets successfully. 
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
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Market Analysis</span>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Risk Management</span>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Trading Strategies</span>
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
              From Analysis to Action
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              Understanding market dynamics is just the beginning. The real value comes from applying 
              this knowledge to make informed decisions that protect and grow your capital.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Start with Education</h3>
              <p className="text-gray-400 leading-relaxed">
                Before risking capital, build a solid foundation of market knowledge. 
                Understand different asset classes, trading strategies, and risk management principles.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Practice with Simulations</h3>
              <p className="text-gray-400 leading-relaxed">
                Use paper trading or demo accounts to test strategies without financial risk. 
                This helps you develop discipline and refine your approach.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Start Small, Scale Gradually</h3>
              <p className="text-gray-400 leading-relaxed">
                Begin with small positions and gradually increase as you gain experience and confidence. 
                Never risk more than you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-black via-[#0B0F19] to-black py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
            Ready to Master the Markets?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
            The markets are waiting, and knowledge is your greatest advantage. 
            Start building your trading skills today and take control of your financial future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/trading">
              <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                Explore Trading Division
              </button>
            </Link>
            <Link href="/learn">
              <button className="border border-[#D4AF37]/50 text-[#D4AF37] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                Continue Learning
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}