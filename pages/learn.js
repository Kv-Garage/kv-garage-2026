import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../lib/seo";
import { fetchLearnPosts, LEARN_CATEGORIES } from "../lib/learnPosts";

const LEARN_PATHS = [
  {
    title: "Business & Reselling",
    href: "/learn/business",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    description: "Learn wholesale, margins, inventory systems, and how to build structured income from products.",
  },
  {
    title: "Markets & Investing",
    href: "/learn/markets",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    description: "Understand investing, futures, volatility, risk management, and how markets actually move.",
  },
  {
    title: "AI & Technology",
    href: "/learn/ai",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    description: "Automation, APIs, AI systems, and how to build digital leverage in the modern economy.",
  },
  {
    title: "Sales & Psychology",
    href: "/learn/psychology",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    description: "Communication, discipline, execution habits, and decision-making under pressure.",
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

  return {
    props: {
      activeCategory: category,
      page,
      latestPosts: latest.posts,
      totalCount: latest.totalCount,
      featuredPosts: featured.posts,
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
      <section className="py-24 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-6">
          The KV Garage Knowledge Library
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          A structured gateway into business, markets, technology,
          and personal execution. Choose your direction and begin.
        </p>
      </section>

      {/* PATH SELECTOR GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-10">
          {LEARN_PATHS.map((path) => (
            <Link key={path.href} href={path.href} className="bg-[#111827] rounded-2xl overflow-hidden hover:scale-[1.02] transition">
              <Image
                src={path.image}
                alt={path.title}
                width={1200}
                height={640}
                className="w-full h-60 object-cover opacity-80"
                loading="lazy"
              />
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-3 text-[#D4AF37]">
                  {path.title}
                </h2>
                <p className="text-gray-400">{path.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Content Engine</p>
            <h2 className="mt-3 text-4xl font-semibold">Latest Insights</h2>
            <p className="mt-3 max-w-3xl text-gray-400">
              Explore practical insights on reselling, AI tools, investing, and sales strategy to help you build a smarter business and make better decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={category === "All" ? "/learn" : `/learn?category=${encodeURIComponent(category)}`}
              className={`rounded-full px-4 py-2 text-sm ${activeCategory === category ? "bg-[#D4AF37] text-black" : "border border-white/10 text-[#CBD5E1]"}`}
            >
              {category}
            </Link>
          ))}
        </div>

        {featuredPosts.length > 0 ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link key={post.slug} href={`/learn/posts/${post.slug}`} className="rounded-3xl border border-white/10 bg-[#111827] overflow-hidden">
                <Image src={post.cover_image} alt={post.title} width={1200} height={680} className="h-52 w-full object-cover" loading="lazy" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Featured</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-10 grid gap-6">
          {latestPosts.map((post) => (
            <Link key={post.slug} href={`/learn/posts/${post.slug}`} className="grid gap-6 rounded-3xl border border-white/10 bg-[#111827] p-5 md:grid-cols-[260px_minmax(0,1fr)]">
              <Image src={post.cover_image} alt={post.title} width={520} height={340} className="h-56 w-full rounded-2xl object-cover" loading="lazy" />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">{post.category}</p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight">{post.title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-400">{post.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[#CBD5E1]">Latest Insights</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[#CBD5E1]">Internal links to Retail + Mentorship</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-between">
            <span className="text-sm text-[#94A3B8]">Page {page} of {totalPages}</span>
            <div className="flex gap-3">
              {page > 1 ? (
                <Link href={page - 1 === 1 ? (activeCategory === "All" ? "/learn" : `/learn?category=${encodeURIComponent(activeCategory)}`) : `/learn?category=${encodeURIComponent(activeCategory)}&page=${page - 1}`} className="rounded-xl border border-white/10 px-4 py-2 text-sm">
                  Previous
                </Link>
              ) : null}
              {page < totalPages ? (
                <Link href={`/learn?category=${encodeURIComponent(activeCategory)}&page=${page + 1}`} className="rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black">
                  Next
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-black py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-[#D4AF37]">
            Why This Exists
          </h2>
          <p className="text-gray-400">
            When building from the ground up, access to structured
            information changes everything. This library exists to
            remove confusion and provide clear paths toward ownership,
            markets, leverage, and execution.
          </p>
        </div>
      </section>

    </div>
  );
}
