import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../../lib/timeUtils";

export default function WholesaleBusinessModels() {
  const post = {
    title: "The Complete Guide to Wholesale Business Models",
    excerpt: "Understanding the different approaches to wholesale and how to choose the right one for your goals.",
    category: "Business",
    readingTime: "8 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    slug: "wholesale-business-models",
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: 950
  };

  const enhancedContent = `
    <div class="space-y-8">
      <p>
        Welcome to the comprehensive guide on wholesale business models. In this article, 
        we'll explore the different approaches to wholesale and help you choose the right one 
        for your goals. Whether you're just starting out or looking to optimize your existing 
        wholesale operation, this guide provides the insights you need to succeed.
      </p>
      
      <p>
        Wholesale is one of the most established and profitable business models in the world. 
        It involves buying products in bulk from manufacturers or distributors and selling them 
        to retailers or other businesses at a markup. The key to success in wholesale lies in 
        understanding the different models available and choosing the one that best fits your 
        resources, goals, and market conditions.
      </p>
      
      <p>
        The wholesale industry has evolved significantly in recent years, with new models 
        emerging alongside traditional approaches. From dropshipping to private labeling, 
        from B2B marketplaces to direct-from-manufacturer relationships, there are more 
        opportunities than ever to build a successful wholesale business.
      </p>
      
      <p>
        However, with more opportunities come more complexities. Choosing the wrong model 
        can lead to cash flow problems, inventory issues, and ultimately business failure. 
        That's why it's crucial to understand the strengths and weaknesses of each approach 
        before making your decision.
      </p>
      
      <p>
        In this guide, we'll break down the most popular wholesale business models, examine 
        their pros and cons, and provide practical advice on how to implement each one 
        successfully. By the end, you'll have a clear understanding of which model is right 
        for your situation and how to get started on the path to wholesale success.
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
                  <span>Understanding different wholesale models helps you choose the right approach</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Each model has unique advantages and challenges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Start with a model that matches your resources and goals</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Scale and diversify as you gain experience and capital</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <p className="text-gray-300 mb-4">
                Ready to implement your wholesale strategy? Here are actionable steps to get started.
              </p>
              <div className="space-y-3">
                <Link href="/learn/business" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Explore More Business Strategies
                </Link>
                <Link href="/shop" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Find Verified Wholesale Inventory
                </Link>
                <Link href="/mentorship" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Get Personalized Business Guidance
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Wholesale Journey?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                The knowledge you've gained here is powerful, but it's only the beginning. 
                True transformation happens when you take action and apply these principles to your own business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/mentorship">
                  <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                    Get Business Mentorship
                  </button>
                </Link>
                <Link href="/shop">
                  <button className="border border-[#D4AF37]/50 text-[#D4AF37] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                    Explore Wholesale Inventory
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
                href="/learn/posts/inventory-management-systems" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Business</span>
                  <span className="text-xs text-gray-400">10 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Inventory Management Systems
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  How to track, organize, and optimize your inventory for maximum efficiency and profit.
                </p>
              </Link>
              
              <Link 
                href="/learn/posts/margin-analysis-profit-optimization" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Business</span>
                  <span className="text-xs text-gray-400">12 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Margin Analysis and Profit Optimization
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Deep dive into understanding your costs and maximizing your profit margins.
                </p>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}