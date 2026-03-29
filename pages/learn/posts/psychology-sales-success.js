import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../../lib/timeUtils";

export default function PsychologySalesSuccess() {
  const post = {
    title: "The Psychology of Sales Success",
    excerpt: "Understanding buyer behavior and mastering the mental game of selling.",
    category: "Psychology",
    readingTime: "8 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71b?auto=format&fit=crop&w=1200&q=80",
    slug: "psychology-sales-success",
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: 1000
  };

  const enhancedContent = `
    <div class="space-y-8">
      <p>
        The psychology of sales success goes far beyond product knowledge and closing 
        techniques. It's about understanding human behavior, building genuine connections, 
        and mastering the mental game of selling. In this comprehensive guide, we'll 
        explore the psychological principles that drive successful sales.
      </p>
      
      <p>
        Sales is fundamentally about human interaction. The most successful salespeople 
        understand that people don't buy products or services - they buy solutions to 
        their problems, improvements to their lives, and the feeling of making a good 
        decision. Understanding this fundamental truth is the first step toward sales mastery.
      </p>
      
      <p>
        The key to sales success lies in developing emotional intelligence, active 
        listening skills, and the ability to build rapport quickly. It's about asking 
        the right questions, understanding unspoken needs, and presenting solutions 
        in a way that resonates with the buyer's values and priorities.
      </p>
      
      <p>
        Effective sales requires managing your own psychology as much as understanding 
        your customer's. This means developing resilience in the face of rejection, 
        maintaining confidence during challenging periods, and staying motivated even 
        when results don't come immediately.
      </p>
      
      <p>
        In this guide, we'll explore the psychological principles behind successful 
        selling, practical techniques for building rapport and trust, and strategies 
        for managing the mental challenges that come with a career in sales. Whether 
        you're new to sales or looking to improve your existing skills, these insights 
        will help you achieve greater success.
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
                  <span>Sales is about solving problems, not just selling products</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Building rapport and trust is more important than product knowledge</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Active listening reveals more than talking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Managing your own psychology is crucial for sales success</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <p className="text-gray-300 mb-4">
                Ready to master the psychology of sales? Here are actionable steps to get started.
              </p>
              <div className="space-y-3">
                <Link href="/learn/psychology" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Explore More Psychology Strategies
                </Link>
                <Link href="/mentorship" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Get Sales Coaching
                </Link>
                <Link href="/learn" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Continue Learning
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Master Sales Psychology?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Understanding the psychology of sales can transform your results and 
                make selling more enjoyable and effective. Start implementing these 
                principles today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/mentorship">
                  <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                    Get Sales Coaching
                  </button>
                </Link>
                <Link href="/learn/psychology">
                  <button className="border border-[#D4AF37]/50 text-[#D4AF37] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                    Continue Learning Psychology
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
                href="/learn/posts/building-discipline" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Psychology</span>
                  <span className="text-xs text-gray-400">12 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Building Unshakeable Discipline
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Practical techniques to develop the discipline needed for business and personal success.
                </p>
              </Link>
              
              <Link 
                href="/learn/posts/decision-making-pressure" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Psychology</span>
                  <span className="text-xs text-gray-400">9 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Decision Making Under Pressure
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  How to make clear, rational decisions when the stakes are high and time is limited.
                </p>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}