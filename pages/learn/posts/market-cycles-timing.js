import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../../lib/timeUtils";

export default function MarketCyclesTiming() {
  const post = {
    title: "Understanding Market Cycles and Timing",
    excerpt: "Learn to identify market phases and position your investments for optimal returns.",
    category: "Markets",
    readingTime: "9 min read",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
    slug: "market-cycles-timing",
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: 1100
  };

  const enhancedContent = `
    <div class="space-y-8">
      <p>
        Understanding market cycles and timing is one of the most crucial skills for any 
        investor or trader. Markets don't move in straight lines - they move in cycles, 
        and learning to identify these cycles can significantly improve your investment 
        returns and reduce your risk.
      </p>
      
      <p>
        Market cycles are recurring patterns of price movements that occur over time. 
        These cycles can be driven by a variety of factors including economic conditions, 
        investor psychology, monetary policy, and geopolitical events. By understanding 
        these cycles, you can position yourself to buy when others are fearful and sell 
        when others are greedy.
      </p>
      
      <p>
        The key to successful market timing lies in recognizing the different phases of 
        market cycles and understanding the characteristics of each phase. This requires 
        both technical analysis skills and an understanding of market psychology. While 
        perfect timing is impossible, understanding cycles can help you make better 
        decisions about when to enter and exit positions.
      </p>
      
      <p>
        Market cycles typically consist of four main phases: accumulation, markup, 
        distribution, and markdown. Each phase has distinct characteristics in terms of 
        price action, volume, and investor sentiment. Recognizing which phase the market 
        is in can help you adjust your strategy accordingly.
      </p>
      
      <p>
        In this guide, we'll explore the different types of market cycles, how to identify 
        them, and practical strategies for positioning your investments to take advantage 
        of these cyclical movements. Whether you're a long-term investor or a short-term 
        trader, understanding market cycles will give you a significant edge in the markets.
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
                  <span>Markets move in predictable cycles with distinct phases</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Understanding cycles helps with better entry and exit timing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Each cycle phase has unique characteristics to identify</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Cycle analysis combines technical and fundamental analysis</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <p className="text-gray-300 mb-4">
                Ready to master market cycles? Here are actionable steps to get started.
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
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Master Market Cycles?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Understanding market cycles gives you a significant edge in investing and trading. 
                Start implementing these strategies to improve your timing and returns.
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
                href="/learn/posts/risk-management-strategies" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Markets</span>
                  <span className="text-xs text-gray-400">11 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Risk Management Strategies
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Essential techniques to protect your capital and manage trading risks effectively.
                </p>
              </Link>
              
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
            </div>
          </div>
        </article>
      </main>
    </>
  );
}