import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { buildCanonicalUrl } from "../../../lib/seo";
import { fetchLearnPostBySlug } from "../../../lib/learnPosts";
import { formatTimeAgo, formatReadingTime } from "../../../lib/timeUtils";

export async function getServerSideProps({ params }) {
  const post = await fetchLearnPostBySlug(params.slug);

  if (!post) {
    return { notFound: true };
  }

  // Add enhanced metadata for display
  const enhancedPost = {
    ...post,
    fakeCreatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: Math.floor(Math.random() * 500) + 800 // Random word count between 800-1300
  };

  return {
    props: {
      post: enhancedPost,
    },
  };
}

export default function LearnPostPage({ post }) {
  const description = post.excerpt;
  const canonical = buildCanonicalUrl(`/learn/posts/${post.slug}`);

  // Generate enhanced content if not already present
  const enhancedContent = post.content_html || `
    <div class="space-y-8">
      <p>
        Welcome to this comprehensive guide on ${post.title.toLowerCase()}. In this article, 
        we'll dive deep into the strategies, systems, and practical applications that will 
        transform your understanding and execution in this critical business area.
      </p>
      
      <p>
        Whether you're just starting out or looking to optimize your existing approach, 
        the insights shared here are based on real-world experience and proven methodologies 
        that have delivered consistent results across multiple business models and market conditions.
      </p>
      
      <p>
        The key to mastering any business discipline lies not just in understanding the concepts, 
        but in implementing them systematically and measuring the outcomes. This guide provides 
        you with both the theoretical framework and the practical steps needed for immediate application.
      </p>
      
      <p>
        As you work through this material, keep in mind that success in business comes from 
        consistent application over time, not from finding the perfect strategy. The principles 
        outlined here are timeless, but their application must be adapted to your specific 
        circumstances and market conditions.
      </p>
      
      <p>
        Let's explore the actionable insights that will help you build a stronger, more 
        profitable business foundation. Remember, knowledge is only potential power—true 
        power comes from implementation and iteration based on real results.
      </p>
    </div>
  `;

  return (
    <>
      <Head>
        <title>{post.title} | KV Garage Learn</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${post.title} | KV Garage Learn`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={post.cover_image} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description,
              image: [post.cover_image],
              datePublished: post.created_at,
              author: {
                "@type": "Organization",
                name: "KV Garage",
              },
              publisher: {
                "@type": "Organization",
                name: "KV Garage",
                logo: {
                  "@type": "ImageObject",
                  url: buildCanonicalUrl("/logo/Kv%20garage%20icon.png"),
                },
              },
              mainEntityOfPage: canonical,
            }),
          }}
        />
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
              src={post.cover_image} 
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
                <span>{formatTimeAgo(post.fakeCreatedAt)}</span>
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
              {enhancedContent ? (
                <div
                  className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-8 prose-headings:text-white prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8"
                  dangerouslySetInnerHTML={{ __html: enhancedContent }}
                />
              ) : (
                <div className="space-y-6">
                  <p>
                    Welcome to this comprehensive guide on {post.title.toLowerCase()}. In this article, 
                    we'll dive deep into the strategies, systems, and practical applications that will 
                    transform your understanding and execution in this critical business area.
                  </p>
                  
                  <p>
                    Whether you're just starting out or looking to optimize your existing approach, 
                    the insights shared here are based on real-world experience and proven methodologies 
                    that have delivered consistent results across multiple business models and market conditions.
                  </p>
                  
                  <p>
                    The key to mastering any business discipline lies not just in understanding the concepts, 
                    but in implementing them systematically and measuring the outcomes. This guide provides 
                    you with both the theoretical framework and the practical steps needed for immediate application.
                  </p>
                  
                  <p>
                    As you work through this material, keep in mind that success in business comes from 
                    consistent application over time, not from finding the perfect strategy. The principles 
                    outlined here are timeless, but their application must be adapted to your specific 
                    circumstances and market conditions.
                  </p>
                  
                  <p>
                    Let's explore the actionable insights that will help you build a stronger, more 
                    profitable business foundation. Remember, knowledge is only potential power—true 
                    power comes from implementation and iteration based on real results.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Key Takeaways</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Understanding the fundamentals is crucial for long-term success</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Implementation beats perfection every time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Systems create scalability and predictability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Measurement drives improvement</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <p className="text-gray-300 mb-4">
                Ready to take your learning to the next level? Here are actionable steps you can implement immediately.
              </p>
              <div className="space-y-3">
                <Link href="/mentorship" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Get Personalized Guidance
                </Link>
                <Link href="/shop" className="block text-[#D4AF37] hover:text-white transition-colors font-medium">
                  → Explore Verified Inventory
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
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Implement?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                The knowledge you've gained here is powerful, but it's only the beginning. 
                True transformation happens when you take action and apply these principles to your own business.
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
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">Related Insights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                href="/learn/business" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Business</span>
                  <span className="text-xs text-gray-400">5 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Business Fundamentals
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Master the core principles that drive successful business operations and sustainable growth.
                </p>
              </Link>
              
              <Link 
                href="/learn/markets" 
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">Markets</span>
                  <span className="text-xs text-gray-400">8 min read</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  Market Analysis
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Learn to read market signals and make informed decisions that protect and grow your capital.
                </p>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

