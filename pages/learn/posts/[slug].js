import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { buildCanonicalUrl } from "../../../lib/seo";
import { fetchLearnPostBySlug } from "../../../lib/learnPosts";

export async function getServerSideProps({ params }) {
  const post = await fetchLearnPostBySlug(params.slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
  };
}

export default function LearnPostPage({ post }) {
  const description = post.excerpt;
  const canonical = buildCanonicalUrl(`/learn/posts/${post.slug}`);

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

      <main className="min-h-screen bg-[#0B0F19] text-white">
        <article className="mx-auto max-w-4xl px-6 py-16">
          <Link href="/learn" className="text-sm text-[#D4AF37]">
            ← Back to Learn
          </Link>
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
            <Image src={post.cover_image} alt={post.title} width={1200} height={680} className="h-auto w-full object-cover" />
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.24em] text-[#D4AF37]">{post.category}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-8 text-[#94A3B8]">{post.excerpt}</p>
          <div
            className="prose prose-invert mt-10 max-w-none prose-p:text-[#CBD5E1] prose-p:leading-8 prose-headings:text-white"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
          <div className="mt-12 rounded-3xl border border-[#D4AF37]/20 bg-[#111827] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Next Step</p>
            <h2 className="mt-3 text-2xl font-semibold">Turn insight into execution.</h2>
            <p className="mt-3 text-[#94A3B8]">
              Explore verified inventory, sharpen your sales system, and move from learning into revenue generation.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-xl bg-[#D4AF37] px-5 py-3 font-medium text-black">
                Shop Inventory
              </Link>
              <Link href="/mentorship" className="rounded-xl border border-[#D4AF37]/30 px-5 py-3 font-medium text-[#D4AF37]">
                Explore Mentorship
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

