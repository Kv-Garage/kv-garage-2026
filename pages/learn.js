import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../lib/seo";
import { fetchLearnPosts, LEARN_CATEGORIES } from "../lib/learnPosts";
import { formatTimeAgo, formatReadingTime } from "../lib/timeUtils";

const LEARN_PATHS = [
  {
    title: "Business & Reselling",
    href: "/learn/business",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    description: "Learn wholesale, margins, inventory systems, and how to build structured income from products.",
    posts: [
      {
        title: "The Complete Guide to Wholesale Business Models",
        excerpt: "Understanding the different approaches to wholesale and how to choose the right one for your goals.",
        category: "Business",
        readingTime: "8 min read",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        slug: "wholesale-business-models"
      },
      {
        title: "Inventory Management Systems for Resellers",
        excerpt: "How to track, organize, and optimize your inventory for maximum efficiency and profit.",
        category: "Business",
        readingTime: "10 min read",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
        slug: "inventory-management-systems"
      },
      {
        title: "Margin Analysis and Profit Optimization",
        excerpt: "Deep dive into understanding your costs and maximizing your profit margins.",
        category: "Business",
        readingTime: "12 min read",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
        slug: "margin-analysis-profit-optimization"
      }
    ]
  },
  {
    title: "Markets & Investing",
    href: "/learn/markets",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    description: "Understand investing, futures, volatility, risk management, and how markets actually move.",
    posts: [
      {
        title: "Understanding Market Cycles and Timing",
        excerpt: "Learn to identify market phases and position your investments for optimal returns.",
        category: "Markets",
        readingTime: "9 min read",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
        slug: "market-cycles-timing"
      },
      {
        title: "Risk Management Strategies for Traders",
        excerpt: "Essential techniques to protect your capital and manage trading risks effectively.",
        category: "Markets",
        readingTime: "11 min read",
        image: "https://images.unsplash.com/photo-1560438718-ebfa50dc65e3?auto=format&fit=crop&w=800&q=80",
        slug: "risk-management-strategies"
      },
      {
        title: "Technical Analysis Fundamentals",
        excerpt: "Master the basics of chart reading and technical indicators for better trading decisions.",
        category: "Markets",
        readingTime: "15 min read",
        image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=800&q=80",
        slug: "technical-analysis-fundamentals"
      }
    ]
  },
  {
    title: "AI & Technology",
    href: "/learn/ai",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    description: "Automation, APIs, AI systems, and how to build digital leverage in the modern economy.",
    posts: [
      {
        title: "AI Tools for Business Automation",
        excerpt: "Discover the most effective AI tools to automate your business processes and save time.",
        category: "AI",
        readingTime: "7 min read",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
        slug: "ai-tools-business-automation"
      },
      {
        title: "Building Your First API Integration",
        excerpt: "Step-by-step guide to connecting different systems and automating data flow.",
        category: "Technology",
        readingTime: "14 min read",
        image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
        slug: "api-integration-guide"
      },
      {
        title: "Digital Leverage Strategies",
        excerpt: "How to use technology to multiply your efforts and achieve more with less work.",
        category: "Technology",
        readingTime: "10 min read",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
        slug: "digital-leverage-strategies"
      }
    ]
  },
  {
    title: "Sales & Psychology",
    href: "/learn/psychology",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    description: "Communication, discipline, execution habits, and decision-making under pressure.",
    posts: [
      {
        title: "The Psychology of Sales Success",
        excerpt: "Understanding buyer behavior and mastering the mental game of selling.",
        category: "Psychology",
        readingTime: "8 min read",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71b?auto=format&fit=crop&w=800&q=80",
        slug: "psychology-sales-success"
      },
      {
        title: "Building Unshakeable Discipline",
        excerpt: "Practical techniques to develop the discipline needed for business and personal success.",
        category: "Psychology",
        readingTime: "12 min read",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
        slug: "building-discipline"
      },
      {
        title: "Decision Making Under Pressure",
        excerpt: "How to make clear, rational decisions when the stakes are high and time is limited.",
        category: "Psychology",
        readingTime: "9 min read",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
        slug: "decision-making-pressure"
      }
    ]
  },
];

export async function getServerSideProps({ query }) {
  const category = String(query.category || "All");
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = 6;

  const [latest, featured] = await Promise.all([
    fetchLearnPosts({ category, page, pageSize }),
    fetchLearnPosts({ category: "All", page: 1, pageSize: 3, featuredOnly: true }),
  ]);

  // Add fake recent timestamps for demo purposes
  const enhancedLatestPosts = latest.posts.map(post => ({
    ...post,
    fakeCreatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: Math.floor(Math.random() * 500) + 800 // Random word count between 800-1300
  }));

  const enhancedFeaturedPosts = featured.posts.map(post => ({
    ...post,
    fakeCreatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: Math.floor(Math.random() * 500) + 800
  }));

  return {
    props: {
      activeCategory: category,
      page,
      latestPosts: enhancedLatestPosts,
      totalCount: latest.totalCount,
      featuredPosts: enhancedFeaturedPosts,
      categories: ["All", ...LEARN_CATEGORIES],
    },
  };
}

export default function Learn({ activeCategory, page, latestPosts, totalCount, featuredPosts, categories }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / 6));

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Head>
        <title>KV Garage Learn | Business Reselling, AI Income, Markets & Sales Psychology</title>
        <meta
          name="description"
          content="Explore KV Garage insights on business reselling, AI income, online sales psychology, and investing systems. Learn with structured, SEO-ready articles and practical strategy."
        />
        <link rel="canonical" href={buildCanonicalUrl("/learn")} />
        <meta property="og:title" content="KV Garage Learn | Business Reselling, AI Income, Markets & Sales Psychology" />
        <meta property="og:description" content="A content engine for resale business growth, AI leverage, markets, and conversion psychology." />
        <meta property="og:url" content={buildCanonicalUrl("/learn")} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80" />
      </Head>

      {/* HERO */}
      <section className="py-24 text-center max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
              The KV Garage Knowledge Library
            </h1>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
              A comprehensive learning gallery designed to transform your understanding of business, 
              markets, technology, and the psychology of success. Each article is crafted to provide 
              actionable insights that you can immediately apply to your journey.
            </p>
            <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Expert Insights</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Actionable Strategies</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Real-World Applications</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PATH SELECTOR GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {LEARN_PATHS.map((path) => (
            <div key={path.href} className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
              <div className="relative overflow-hidden">
                <Image
                  src={path.image}
                  alt={path.title}
                  width={1200}
                  height={640}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {path.title}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">{path.description}</p>
                
                {/* Featured Posts Grid */}
                <div className="grid gap-4">
                  {path.posts.map((post, index) => (
                    <Link 
                      key={post.slug} 
                      href={`/learn/posts/${post.slug}`}
                      className="group/post flex gap-4 p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 hover:bg-[#111827]"
                    >
                      <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={200}
                          height={120}
                          className="w-full h-full object-cover group-hover/post:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">{post.category}</span>
                          <span className="text-xs text-gray-400">{post.readingTime}</span>
                        </div>
                        <h3 className="text-sm font-medium text-white group-hover/post:text-[#D4AF37] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link 
                  href={path.href}
                  className="inline-flex items-center gap-2 mt-4 text-[#D4AF37] hover:text-white transition-colors font-medium"
                >
                  Explore {path.title}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Live Learning Gallery</p>
            <h2 className="mt-3 text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Latest Insights
            </h2>
            <p className="mt-4 max-w-4xl text-gray-300 text-lg leading-relaxed">
              Our content engine continuously generates fresh, actionable insights across all business disciplines. 
              Each article is designed to provide immediate value and practical strategies you can implement today.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <span>{latestPosts.length} articles available</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={category === "All" ? "/learn" : `/learn?category=${encodeURIComponent(category)}`}
              className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30" 
                  : "border border-white/10 text-[#CBD5E1] hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Featured Posts Carousel */}
        {featuredPosts.length > 0 ? (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-6">Editor's Picks</h3>
            <div className="grid gap-6 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <Link 
                  key={post.slug} 
                  href={`/learn/posts/${post.slug}`}
                  className="group rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/30"
                >
                  <div className="relative overflow-hidden">
                    <Image 
                      src={post.cover_image} 
                      alt={post.title} 
                      width={1200} 
                      height={680} 
                      className="h-52 w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      loading="lazy" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Featured</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">{formatReadingTime(post.wordCount)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-gray-400">{formatTimeAgo(post.fakeCreatedAt)}</span>
                    </div>
                    <h3 className="text-2xl font-semibold leading-tight text-white group-hover:text-[#D4AF37] transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-400 line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* Latest Posts Grid */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-white mb-8">Recent Publications</h3>
          <div className="grid gap-8">
            {latestPosts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/learn/posts/${post.slug}`}
                className="group grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 md:grid-cols-[280px_minmax(0,1fr)] hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/20"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <Image 
                    src={post.cover_image} 
                    alt={post.title} 
                    width={520} 
                    height={340} 
                    className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">{formatTimeAgo(post.fakeCreatedAt)}</span>
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
                    <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Expert Insights</span>
                    <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Actionable Strategies</span>
                    <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Real-World Applications</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between">
              <span className="text-sm text-[#94A3B8]">Page {page} of {totalPages}</span>
              <div className="flex gap-3">
                {page > 1 ? (
                  <Link 
                    href={page - 1 === 1 ? (activeCategory === "All" ? "/learn" : `/learn?category=${encodeURIComponent(activeCategory)}`) : `/learn?category=${encodeURIComponent(activeCategory)}&page=${page - 1}`} 
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
                  >
                    Previous
                  </Link>
                ) : null}
                {page < totalPages ? (
                  <Link 
                    href={`/learn?category=${encodeURIComponent(activeCategory)}&page=${page + 1}`} 
                    className="rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-gradient-to-br from-black via-[#0B0F19] to-black py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                The KV Garage Philosophy
              </h2>
              <div className="grid md:grid-cols-3 gap-8 text-gray-300 leading-relaxed">
                <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold text-[#D4AF37] mb-4">Knowledge is Power</h3>
                  <p>
                    When building from the ground up, access to structured
                    information changes everything. This library exists to
                    remove confusion and provide clear paths toward ownership.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold text-[#D4AF37] mb-4">Action Creates Results</h3>
                  <p>
                    Information without application is just entertainment.
                    Every article is designed to be immediately actionable,
                    giving you the tools to implement change today.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold text-[#D4AF37] mb-4">Continuous Evolution</h3>
                  <p>
                    The world moves fast. Our content engine ensures you
                    always have access to the latest strategies, tools,
                    and insights to stay ahead of the curve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
