import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../../lib/seo";
import { formatTimeAgo, formatReadingTime } from "../../lib/timeUtils";

export default function Psychology() {
  // Mock recent posts for the psychology category
  const recentPosts = [
    {
      title: "The Psychology of Sales Success",
      excerpt: "Understanding buyer behavior and mastering the mental game of selling.",
      category: "Psychology",
      readingTime: "8 min read",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71b?auto=format&fit=crop&w=800&q=80",
      slug: "psychology-sales-success",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1000
    },
    {
      title: "Building Unshakeable Discipline",
      excerpt: "Practical techniques to develop the discipline needed for business and personal success.",
      category: "Psychology",
      readingTime: "12 min read",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      slug: "building-discipline",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1300
    },
    {
      title: "Decision Making Under Pressure",
      excerpt: "How to make clear, rational decisions when the stakes are high and time is limited.",
      category: "Psychology",
      readingTime: "9 min read",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      slug: "decision-making-pressure",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1100
    },
    {
      title: "Overcoming Fear of Failure",
      excerpt: "Strategies to reframe failure and use it as a stepping stone to success.",
      category: "Psychology",
      readingTime: "10 min read",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      slug: "overcoming-fear-failure",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1200
    },
    {
      title: "Mastering Your Mindset for Success",
      excerpt: "How to cultivate a growth mindset and maintain motivation through challenges.",
      category: "Psychology",
      readingTime: "11 min read",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
      slug: "mastering-mindset-success",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      wordCount: 1150
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Head>
        <title>Sales & Psychology | KV Garage Learn</title>
        <meta
          name="description"
          content="Master communication, discipline, execution habits, and decision-making under pressure for business success."
        />
        <link rel="canonical" href={buildCanonicalUrl("/learn/psychology")} />
        <meta property="og:title" content="Sales & Psychology | KV Garage Learn" />
        <meta property="og:description" content="Communication, discipline, execution habits, and decision-making under pressure." />
        <meta property="og:url" content={buildCanonicalUrl("/learn/psychology")} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" />
      </Head>

      {/* HERO */}
      <section className="py-24 text-center max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
              Sales & Psychology Mastery
            </h1>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
              Master the psychology of human behavior, build unshakeable discipline, 
              and develop the mental frameworks needed for consistent success in business 
              and life. Your mindset is your greatest competitive advantage.
            </p>
            <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Sales Psychology</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Discipline Building</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                <span>Mindset Mastery</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CONCEPTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Psychology of Sales */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71b?auto=format&fit=crop&w=1200&q=80"
                alt="Sales psychology"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Sales</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Psychology of Sales
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Understanding buyer behavior and mastering the mental game of selling.
                  Sales is not about pushing products—it's about understanding needs, building trust,
                  and guiding people toward decisions that benefit them.
                </p>
                <p>
                  The most successful salespeople understand human psychology: how people make decisions,
                  what motivates them, and how to build rapport quickly. They focus on listening more than talking
                  and asking the right questions to uncover real needs.
                </p>
                <p>
                  Effective sales requires emotional intelligence, patience, and the ability to handle rejection
                  without taking it personally. It's a skill that can be developed through practice and self-awareness.
                </p>
              </div>
            </div>
          </div>

          {/* Building Discipline */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
                alt="Discipline building"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Discipline</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Building Discipline
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Practical techniques to develop the discipline needed for business and personal success.
                  Discipline is not something you're born with—it's a muscle that gets stronger with consistent practice.
                </p>
                <p>
                  Building discipline starts with small, consistent actions that compound over time. It's about
                  showing up even when you don't feel like it and creating systems that support your goals rather
                  than relying solely on willpower.
                </p>
                <p>
                  The key is to start with habits so small they're impossible to fail at, then gradually increase
                  the difficulty as the habit becomes automatic. Focus on consistency over intensity and track your
                  progress to maintain motivation.
                </p>
              </div>
            </div>
          </div>

          {/* Decision Making Under Pressure */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
                alt="Decision making"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Decisions</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Decision Making Under Pressure
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  How to make clear, rational decisions when the stakes are high and time is limited.
                  Pressure can cloud judgment, but with the right frameworks, you can maintain clarity
                  and make better decisions even in high-stress situations.
                </p>
                <p>
                  Effective decision-making under pressure involves having predefined criteria for what
                  constitutes a good decision, trusting your preparation and experience, and avoiding analysis
                  paralysis when time is limited.
                </p>
                <p>
                  The best decision-makers develop mental models and frameworks they can rely on when stress
                  levels are high. They also learn to distinguish between what's urgent and what's important,
                  focusing their energy on the factors they can actually control.
                </p>
              </div>
            </div>
          </div>

          {/* Mindset and Execution */}
          <div className="group bg-gradient-to-br from-[#111827] to-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/20">
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
                alt="Mindset"
                width={1200}
                height={640}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#D4AF37]/90 text-black text-xs px-2 py-1 rounded-full font-medium">Mindset</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                Mindset and Execution
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Communication, discipline, execution habits, and decision-making under pressure.
                  Your mindset determines your results more than any other factor in your business or personal life.
                </p>
                <p>
                  A growth mindset allows you to see challenges as opportunities to learn and improve,
                  while a fixed mindset keeps you stuck in fear and limitation. The way you talk to yourself
                  and frame your experiences shapes your reality.
                </p>
                <p>
                  Building mental resilience requires consistent practice in reframing negative thoughts,
                  focusing on solutions rather than problems, and maintaining perspective during difficult times.
                  Your mindset is trainable, just like any other skill.
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
            <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Psychology Insights</p>
            <h2 className="mt-3 text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Latest Psychology Strategies
            </h2>
            <p className="mt-4 text-gray-300 text-lg leading-relaxed">
              Deep insights into human behavior and mental frameworks to help you master yourself 
              and influence others effectively. Each article provides actionable guidance you can implement immediately.
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
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Sales Psychology</span>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Discipline Building</span>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">Mindset Mastery</span>
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
              From Mindset to Mastery
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              Your psychology is the foundation of everything you achieve. Mastering your mind
              gives you the power to overcome obstacles, build meaningful relationships, and
              achieve goals that once seemed impossible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Master Self-Awareness</h3>
              <p className="text-gray-400 leading-relaxed">
                Understand your triggers, biases, and emotional patterns.
                Self-awareness is the foundation of all personal growth and effective leadership.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Build Mental Resilience</h3>
              <p className="text-gray-400 leading-relaxed">
                Develop the ability to bounce back from setbacks and maintain
                focus during challenging times. Resilience is what separates successful people from those who give up.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-[#D4AF37] text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Cultivate Emotional Intelligence</h3>
              <p className="text-gray-400 leading-relaxed">
                Learn to understand and manage your emotions while
                building strong relationships with others. EQ is more important than IQ for long-term success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-black via-[#0B0F19] to-black py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
            Ready to Master Your Mind?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
            Your greatest asset is your mindset. Start developing the mental frameworks
            and psychological skills that will propel you to new levels of success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/mentorship">
              <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                Get Personal Development Coaching
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