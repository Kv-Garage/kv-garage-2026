import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getBlogCategories, getBlogTags, getRecentPosts } from '../lib/blog';

export default function BlogPage({ initialPosts, initialCategories, initialTags, initialRecentPosts, totalPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);
  const [recentPosts, setRecentPosts] = useState(initialRecentPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPosts > initialPosts.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadMore = async () => {
    setLoading(true);
    const nextPage = currentPage + 1;
    const offset = (nextPage - 1) * 10;

    try {
      const response = await fetch(`/api/blog/posts?limit=10&offset=${offset}&category=${selectedCategory}&tag=${selectedTag}&search=${searchQuery}`);
      const data = await response.json();
      
      if (data.posts) {
        setPosts(prev => [...prev, ...data.posts]);
        setHasMore(data.hasMore);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setPosts([]);
    setHasMore(true);
  };

  const handleTagFilter = (tagId) => {
    setSelectedTag(tagId);
    setCurrentPage(1);
    setPosts([]);
    setHasMore(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setPosts([]);
    setHasMore(true);
  };

  return (
    <>
      <Head>
        <title>KV Garage Blog | Industry Insights & Product Updates</title>
        <meta name="description" content="Stay updated with the latest industry insights, product updates, and expert tips from KV Garage." />
        <meta name="keywords" content="blog, industry insights, product updates, tips, KV Garage" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">KV Garage Blog</h1>
              <p className="text-xl text-gray-600">Industry insights, product updates, and expert tips</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filters */}
              <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search blog posts..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedCategory(''); setSelectedTag(''); setSearchQuery(''); }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 mr-2">Categories:</span>
                  <button
                    onClick={() => handleCategoryFilter('')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      !selectedCategory ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCategory === category.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Tag Filters */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                    <button
                      onClick={() => handleTagFilter('')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        !selectedTag ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All
                    </button>
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagFilter(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTag === tag.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map(post => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {post.cover_image && (
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={75}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {post.blog_categories && (
                          <Link href={`/blog/category/${post.blog_categories.slug}`}>
                            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full hover:bg-orange-200 transition-colors">
                              {post.blog_categories.name}
                            </span>
                          </Link>
                        )}
                        <span className="text-xs text-gray-500">{new Date(post.published_at).toLocaleDateString()}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="group">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt || post.content_html?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <Link href={`/blog/${post.slug}`} className="text-orange-500 hover:text-orange-600 font-medium group-hover:underline">
                          Read More →
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post.reading_time || '5 min read'}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Load More Posts'}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Recent Posts */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors group">
                      {post.cover_image && (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="80px"
                            quality={70}
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors">{post.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{new Date(post.published_at).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <Link href="/blog" className={`block text-sm ${!selectedCategory ? 'text-orange-500 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>
                    All Posts
                  </Link>
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      href={`/blog/category/${category.slug}`}
                      className={`block text-sm ${selectedCategory === category.id ? 'text-orange-500 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Link
                        key={tag.id}
                        href={`/blog/tag/${tag.slug}`}
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedTag === tag.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Get Updates</h3>
                <p className="text-orange-100 text-sm mb-4">Subscribe to our newsletter for the latest blog posts and industry insights.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-600"
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-orange-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const [postsResult, categoriesResult, tagsResult, recentPostsResult] = await Promise.all([
      getBlogPosts(10, 0),
      getBlogCategories(),
      getBlogTags(),
      getRecentPosts(5)
    ]);

    return {
      props: {
        initialPosts: postsResult.posts || [],
        initialCategories: categoriesResult || [],
        initialTags: tagsResult || [],
        initialRecentPosts: recentPostsResult || [],
        totalPosts: postsResult.total || 0
      },
      revalidate: 60 // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      props: {
        initialPosts: [],
        initialCategories: [],
        initialTags: [],
        initialRecentPosts: [],
        totalPosts: 0
      },
      revalidate: 60
    };
  }
}