import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../../lib/timeUtils";

export default function InventoryManagementSystems() {
  const post = {
    title: "Inventory Management Systems: Track, Organize, Optimize",
    excerpt: "How to track, organize, and optimize your inventory for maximum efficiency and profit.",
    category: "Business",
    readingTime: "10 min read",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    slug: "inventory-management-systems",
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: 1200
  };

  const enhancedContent = `
    <div class="space-y-8">
      <p>
        Effective inventory management is the backbone of any successful wholesale business. 
        It's the difference between thriving and struggling, between satisfied customers and 
        lost sales. In this comprehensive guide, we'll explore how to track, organize, and 
        optimize your inventory for maximum efficiency and profit.
      </p>
      
      <p>
        Poor inventory management can lead to a host of problems: overstocking ties up 
        valuable capital, understocking leads to lost sales and unhappy customers, and 
        disorganized inventory makes operations inefficient and error-prone. On the other 
        hand, excellent inventory management ensures you have the right products in the 
        right quantities at the right time.
      </p>
      
      <p>
        The key to successful inventory management lies in implementing the right systems 
        and processes. This involves choosing appropriate tracking methods, organizing your 
        physical space efficiently, and using data to make informed decisions about 
        purchasing and sales strategies.
      </p>
      
      <p>
        Modern technology has revolutionized inventory management, making it easier than 
        ever to maintain accurate records, forecast demand, and automate many aspects of 
        the process. However, technology is only as good as the processes and people behind it.
      </p>
      
      <p>
        In this guide, we'll cover the essential principles of inventory management, 
        explore different tracking systems, and provide practical advice on how to 
        implement these strategies in your own business. Whether you're managing a small 
        operation or a large warehouse, these principles will help you achieve better 
        results and higher profits.
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
                  <span>Inventory management directly impacts your bottom line</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Choose tracking systems that match your business size and complexity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Organization is key to operational efficiency</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Use data to make informed inventory decisions</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <p className="text-gray-300 mb-4">
                Ready to optimize your inventory management? Here are actionable steps to get started.
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
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Optimize Your Inventory?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Efficient inventory management can transform your business operations and 
                significantly improve your profitability. Start implementing these strategies today.
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
                href="/learn/posts/wholesale-business-models" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Business</span>
                  <span className="text-xs text-gray-400">8 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Wholesale Business Models
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Understanding the different approaches to wholesale and how to choose the right one.
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