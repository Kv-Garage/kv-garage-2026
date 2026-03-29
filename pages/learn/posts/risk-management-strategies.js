import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../../lib/timeUtils";

export default function RiskManagementStrategies() {
  const post = {
    title: "Risk Management Strategies for Traders",
    excerpt: "Essential techniques to protect your capital and manage trading risks effectively.",
    category: "Markets",
    readingTime: "11 min read",
    image: "https://images.unsplash.com/photo-1560184897-6a0e5bd907d3?auto=format&fit=crop&w=1200&q=80",
    slug: "risk-management-strategies",
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: 1250
  };

  const enhancedContent = `
    <div class="space-y-8">
      <p>
        Risk management is the cornerstone of successful trading. Without proper risk 
        management, even the most skilled traders will eventually lose their capital. 
        In this comprehensive guide, we'll explore essential techniques to protect your 
        capital and manage trading risks effectively.
      </p>
      
      <p>
        Many people enter trading with dreams of quick riches, but few understand the 
        importance of preserving capital. The difference between successful traders and 
        those who fail is not their ability to pick winning trades, but their ability to 
        survive losing trades. Effective risk management ensures you can trade another day, 
        even after a string of losses.
      </p>
      
      <p>
        The key to risk management lies in having a systematic approach that removes 
        emotional decision-making from your trading. This includes predefined entry and 
        exit criteria, position sizing rules, and stop-loss strategies that protect your 
        capital during adverse market conditions.
      </p>
      
      <p>
        Successful traders understand that losses are an inevitable part of trading. 
        Instead of trying to avoid losses entirely, they focus on managing them effectively. 
        This means accepting small losses quickly while letting winning trades run, and 
        never risking more than a small percentage of your capital on any single trade.
      </p>
      
      <p>
        In this guide, we'll cover the fundamental principles of risk management, explore 
        different techniques for protecting your capital, and provide practical advice on 
        how to implement these strategies in your own trading. Whether you're a beginner 
        or an experienced trader, these principles will help you achieve more consistent 
        results and protect your hard-earned capital.
      </p>
    </div>
  `;

  return (
    <>
      <Head>
        <title>{post.title} | KV Garage Learn</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={buildCanonicalUrl(`/learn/posts/${post.slug}`)} />
        <meta property="og:title" content={`${post.title} | KV Garage Learn`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={buildCanonicalUrl(`/learn/posts/${post.slug}`)} />
        <meta property="og:image" content={post.image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        <article className="mx-auto max-w-5xl px-6 py-16">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
            <Link href="/learn" className="hover:text-[#D4AF37] transition-colors">
              ← Back to Learn
            </Link>
            <span>•</span>
            <Link href="/learn" className="hover:text-[#D4AF37] transition-colors">
              Learning Gallery
            </Link>
            <span>•</span>
            <span className="text-white">{post.category}</span>
          </div>

          {/* Featured Image */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 mb-8 group">
            <Image 
              src={post.image} 
              alt={post.title} 
              width={1200} 
              height={680} 
              className="h-auto w-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Article Header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full font-medium">{post.category}</span>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{formatTimeAgo(post.createdAt)}</span>
                <span>•</span>
                <span>{formatReadingTime(post.wordCount)}</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold leading-tight text-white group-hover:text-[#D4AF37] transition-colors">
              {post.title}
            </h1>
            <p className="text-lg leading-8 text-gray-300 max-w-3xl">{post.excerpt}</p>
          </div>

          {/* Content Area */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-gray-300 leading-relaxed">
              <div
                className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-8 prose-headings:text-white prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8"
                dangerouslySetInnerHTML={{ __html: enhancedContent }}
              />
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Key Takeaways</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Risk management is more important than picking winning trades</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Never risk more than a small percentage of your capital on any single trade</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Use stop-losses to protect your capital automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Accept losses quickly and let winning trades run</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <p className="text-gray-300 mb-4">
                Ready to implement better risk management in your trading? Here are actionable steps to get started.
              </p>
              <div className="space-y-3">
                <Link href="/learn/markets" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Explore More Market Strategies
                </Link>
                <Link href="/trading" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Access Trading Resources
                </Link>
                <Link href="/mentorship" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Get Trading Mentorship
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Protect Your Trading Capital?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Effective risk management is the difference between long-term trading success 
                and blowing up your account. Start implementing these strategies today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/mentorship">
                  <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                    Get Trading Mentorship
                  </button>
                </Link>
                <Link href="/trading">
                  <button className="border border-[#D4AF37]/50 text-[#D4AF37] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                    Explore Trading Division
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">Related Insights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                href="/learn/posts/technical-analysis-fundamentals" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Markets</span>
                  <span className="text-xs text-gray-400">15 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Technical Analysis Fundamentals
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Master the basics of chart reading and technical indicators for better trading decisions.
                </p>
              </Link>
              
              <Link 
                href="/learn/posts/volatility-trading-strategies" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Markets</span>
                  <span className="text-xs text-gray-400">10 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Volatility Trading Strategies
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  How to profit from market volatility while managing risk effectively.
                </p>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}