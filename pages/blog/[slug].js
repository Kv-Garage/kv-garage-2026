import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getBlogPostBySlug, getRelatedPosts, getRecentPosts } from '../../lib/blog';

export default function BlogPostPage({ post, relatedPosts, recentPosts }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareOnSocial = (platform) => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`;
    const title = encodeURIComponent(post.title);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${encodeURIComponent(url)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <Head>
        <title>{post.title} | KV Garage Blog</title>
        <meta name="description" content={post.excerpt || post.content?.substring(0, 160)} />
        <meta name="keywords" content={post.meta_keywords || 'blog, KV Garage'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.content?.substring(0, 160)} />
        <meta property="og:image" content={post.featured_image || '/logo/Kv%20garage%20icon.png'} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at} />
        {post.blog_categories && <meta property="article:section" content={post.blog_categories.name} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.content?.substring(0, 160)} />
        <meta name="twitter:image" content={post.featured_image || '/logo/Kv%20garage%20icon.png'} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt || post.content?.substring(0, 160),
              "image": post.featured_image || '/logo/Kv%20garage%20icon.png',
              "author": {
                "@type": "Organization",
                "name": "KV Garage"
              },
              "publisher": {
                "@type": "Organization",
                "name": "KV Garage",
                "logo": {
                  "@type": "ImageObject",
                  "url": "/logo/Kv%20garage%20icon.png"
                }
              },
              "datePublished": post.published_at,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/blog" className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4">
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              {post.blog_categories && (
                <Link href={`/blog/category/${post.blog_categories.slug}`} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full hover:bg-orange-200 transition-colors">
                  {post.blog_categories.name}
                </Link>
              )}
              <span>{formatDate(post.published_at)}</span>
              <span>•</span>
              <span>{post.reading_time || '5 min read'}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="prose prose-lg max-w-none">
            <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Tags */}
          {post.blog_tags && post.blog_tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.blog_tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Share this post</h3>
            <div className="flex gap-2">
              <button
                onClick={() => shareOnSocial('twitter')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() => shareOnSocial('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Facebook
              </button>
              <button
                onClick={() => shareOnSocial('linkedin')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                LinkedIn
              </button>
              <button
                onClick={() => shareOnSocial('email')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Email
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {(relatedPosts.length > 0 || recentPosts.length > 0) && (
          <div className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map(relatedPost => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                      <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-video">
                        {relatedPost.featured_image ? (
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {relatedPost.excerpt || relatedPost.content?.substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <span>{formatDate(relatedPost.published_at)}</span>
                        <span>•</span>
                        <span>{relatedPost.reading_time || '5 min read'}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  recentPosts.slice(0, 3).map(recentPost => (
                    <Link key={recentPost.id} href={`/blog/${recentPost.slug}`} className="group">
                      <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-video">
                        {recentPost.featured_image ? (
                          <img
                            src={recentPost.featured_image}
                            alt={recentPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {recentPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {recentPost.excerpt || recentPost.content?.substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <span>{formatDate(recentPost.published_at)}</span>
                        <span>•</span>
                        <span>{recentPost.reading_time || '5 min read'}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  // This would ideally fetch all blog post slugs from your database
  // For now, we'll return an empty array and use fallback
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  try {
    const post = await getBlogPostBySlug(params.slug);
    
    if (!post) {
      return {
        notFound: true
      };
    }

    const [relatedPosts, recentPosts] = await Promise.all([
      getRelatedPosts(post.id, post.category_id, 3),
      getRecentPosts(3)
    ]);

    return {
      props: {
        post,
        relatedPosts: relatedPosts || [],
        recentPosts: recentPosts || []
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      notFound: true
    };
  }
}