import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../../lib/timeUtils";

export default function DecisionMakingPressure() {
  const post = {
    title: "Decision Making Under Pressure",
    excerpt: "How to make clear, rational decisions when the stakes are high and time is limited.",
    category: "Psychology",
    readingTime: "9 min read",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    slug: "decision-making-pressure",
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: 1100
  };

  const enhancedContent = `
    <div class="space-y-8">
      <p>
        Decision making under pressure is one of the most challenging skills to master, 
        yet it's essential for success in business, leadership, and life. When the 
        stakes are high and time is limited, your ability to make clear, rational 
        decisions can mean the difference between success and failure.
      </p>
      
      <p>
        Pressure can cloud judgment, trigger emotional responses, and lead to poor 
        decision-making. The key is developing mental frameworks and techniques that 
        allow you to maintain clarity and objectivity even in the most stressful situations.
      </p>
      
      <p>
        Effective decision-making under pressure involves having predefined criteria 
        for what constitutes a good decision, trusting your preparation and experience, 
        and avoiding analysis paralysis when time is limited. It's about making the 
        best decision possible with the information available, rather than waiting 
        for perfect information that may never come.
      </p>
      
      <p>
        The best decision-makers develop mental models and frameworks they can rely 
        on when stress levels are high. They also learn to distinguish between what's 
        urgent and what's important, focusing their energy on the factors they can 
        actually control rather than worrying about things outside their influence.
      </p>
      
      <p>
        In this guide, we'll explore practical techniques for making better decisions 
        under pressure, from mental frameworks to stress management strategies. Whether 
        you're facing business decisions, personal challenges, or emergency situations, 
        these principles will help you maintain your composure and make sound choices.
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
                  <span>Pressure clouds judgment - develop frameworks to maintain clarity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Make the best decision with available information, not perfect information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Focus on what you can control, not what you can't</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Trust your preparation and experience when time is limited</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <p className="text-gray-300 mb-4">
                Ready to improve your decision-making under pressure? Here are actionable steps to get started.
              </p>
              <div className="space-y-3">
                <Link href="/learn/psychology" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Explore More Psychology Strategies
                </Link>
                <Link href="/mentorship" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Get Decision-Making Coaching
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
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Master Decision Making Under Pressure?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Your ability to make good decisions under pressure is a skill that can 
                be developed. Start practicing these techniques to improve your 
                decision-making in high-stress situations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/mentorship">
                  <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                    Get Decision-Making Coaching
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
                href="/learn/posts/psychology-sales-success" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Psychology</span>
                  <span className="text-xs text-gray-400">8 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Psychology of Sales Success
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Understanding buyer behavior and mastering the mental game of selling.
                </p>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}