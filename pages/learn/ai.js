import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../lib/timeUtils";

export default function AI() {
  // Mock recent posts for the AI category
  const recentPosts = [
    {
      title: "AI Tools for Business Automation",
      excerpt: "Discover the most effective AI tools to automate your business processes and save time.",
      category: "AI",
      readingTime: "7 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      slug: "ai-tools-business-automation",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 950
    },
    {
      title: "Building Your First API Integration",
      excerpt: "Step-by-step guide to connecting different systems and automating data flow.",
      category: "Technology",
      readingTime: "14 min read",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
      slug: "api-integration-guide",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1200
    },
    {
      title: "Digital Leverage Strategies",
      excerpt: "How to use technology to multiply your efforts and achieve more with less work.",
      category: "Technology",
      readingTime: "10 min read",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      slug: "digital-leverage-strategies",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1100
    },
    {
      title: "ChatGPT for Business Optimization",
      excerpt: "Practical applications of AI language models to improve your business operations.",
      category: "AI",
      readingTime: "8 min read",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      slug: "chatgpt-business-optimization",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1000
    },
    {
      title: "AI-Powered Content Creation",
      excerpt: "How to use AI tools to create high-quality content at scale for your business.",
      category: "AI",
      readingTime: "12 min read",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
      slug: "ai-content-creation",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1300
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Head>
        <title>AI & Technology | KV Garage Learn</title>
        <meta
          name="description"
          content="Master AI tools, automation, API integrations, and digital leverage strategies for business growth."
        />
        <link rel="canonical" href={buildCanonicalUrl("/learn/ai")} />
        <meta property="og:title" content="AI & Technology | KV Garage Learn" />
        <meta property="og:description" content="Automation, APIs, AI systems, and how to build digital leverage in the modern economy." />
        <meta property="og:url" content={buildCanonicalUrl("/learn/ai")} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" />
      </Head>

      {/* HERO */}
      <section className="py-24 text-center max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
              AI & Technology Mastery
            </h1>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence and modern technology to build 
              automated systems, create digital leverage, and scale your business operations. 
              Learn practical applications that deliver real results.
            </p>
            <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>AI Automation</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>API Integration</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Digital Leverage</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CONCEPTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Tools for Business */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
                alt="AI tools"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">AI Tools</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                AI Tools for Business
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Discover the most effective AI tools to automate your business processes and save time.
                  From content creation to customer service, AI can handle repetitive tasks with remarkable accuracy.
                </p>
                <p>
                  The key is identifying which tasks in your business can be automated and selecting the right
                  tools for each specific use case. This requires understanding both the capabilities and limitations
                  of current AI technology.
                </p>
                <p>
                  Successful AI implementation starts small and scales gradually. Begin with low-risk, high-impact
                  tasks and build your confidence and expertise before moving to more complex applications.
                </p>
              </div>
            </div>
          </div>

          {/* API Integration */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80"
                alt="API integration"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Integration</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                API Integration
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Step-by-step guide to connecting different systems and automating data flow.
                  APIs (Application Programming Interfaces) are the backbone of modern software integration.
                </p>
                <p>
                  Understanding APIs allows you to connect disparate systems, automate workflows, and
                  create seamless data flow between different applications. This eliminates manual data entry
                  and reduces errors while increasing efficiency.
                </p>
                <p>
                  The key to successful API integration is understanding the documentation, handling errors
                  gracefully, and implementing proper security measures. Start with simple integrations and
                  gradually build more complex workflows.
                </p>
              </div>
            </div>
          </div>

          {/* Digital Leverage */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
                alt="Digital leverage"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Leverage</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Digital Leverage
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  How to use technology to multiply your efforts and achieve more with less work.
                  Digital leverage is about creating systems that work for you 24/7, scaling your impact
                  without linearly increasing your time investment.
                </p>
                <p>
                  The most powerful digital leverage comes from creating assets that appreciate in value
                  over time, such as automated systems, digital products, or content that continues to
                  generate value long after it's created.
                </p>
                <p>
                  Building digital leverage requires upfront investment of time and resources, but the
                  long-term payoff can be extraordinary. Focus on creating systems that can scale and
                  compound your efforts over time.
                </p>
              </div>
            </div>
          </div>

          {/* AI Systems Architecture */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80"
                alt="AI systems"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Architecture</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                AI Systems Architecture
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Building robust AI systems requires understanding the entire pipeline from data collection
                  to model deployment and monitoring. Each stage presents unique challenges and opportunities.
                </p>
                <p>
                  Successful AI systems are not just about the algorithms—they're about creating end-to-end
                  solutions that integrate seamlessly into existing workflows while providing measurable value.
                </p>
                <p>
                  The key to building effective AI systems is starting with clear business objectives, ensuring
                  data quality, and implementing proper monitoring and maintenance procedures to keep the system
                  performing optimally over time.
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
            <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Tech Insights</p>
            <h2 className="mt-3 text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Latest Technology Strategies
            </h2>
            <p className="mt-4 text-gray-300 text-lg leading-relaxed">
              Cutting-edge insights and strategies to help you leverage technology for business growth. 
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
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">AI Automation</span>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">API Integration</span>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Digital Leverage</span>
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
              From Technology to Transformation
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              Technology is only valuable when it's applied effectively. The real power comes from 
              integrating these tools into your business processes to create measurable improvements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Start with Automation</h3>
              <p className="text-gray-400 leading-relaxed">
                Identify repetitive tasks in your business that can be automated using AI tools.
                Start with simple automations and build from there.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Build Integrations</h3>
              <p className="text-gray-400 leading-relaxed">
                Connect your tools and systems using APIs to create seamless workflows
                that eliminate manual data entry and reduce errors.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Scale with Systems</h3>
              <p className="text-gray-400 leading-relaxed">
                Create digital systems that work for you 24/7, multiplying your efforts
                and creating scalable business processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-black via-[#0B0F19] to-black py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
            Ready to Leverage Technology?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
            The future belongs to those who embrace technology effectively. 
            Start building your automated, scalable business today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/learn">
              <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                Continue Learning
              </button>
            </Link>
            <Link href="/mentorship">
              <button className="border border-[#D4AF37]/50 text-[#D4AF37] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                Get Tech Guidance
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}