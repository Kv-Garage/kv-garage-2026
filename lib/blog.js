import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

export async function getBlogPosts(limit = 10, offset = 0, category = null, tag = null) {
  try {
    let query = supabase
      .from("blog_posts")
      .select(`
        *,
        blog_categories (
          name,
          slug
        ),
        blog_tags (
          name,
          slug
        )
      `, { count: "exact" })
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category_id", category);
    }

    if (tag) {
      query = query.contains("tag_ids", [tag]);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      posts: data || [],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    };
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    return { posts: [], total: 0, hasMore: false };
  }
}

export async function getBlogPostBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        blog_categories (
          name,
          slug
        ),
        blog_tags (
          name,
          slug
        )
      `)
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error fetching blog post:", err);
    return null;
  }
}

export async function getBlogCategories() {
  try {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching blog categories:", err);
    return [];
  }
}

export async function getBlogTags() {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching blog tags:", err);
    return [];
  }
}

export async function getRelatedPosts(postId, categoryId, limit = 3) {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        blog_categories (
          name,
          slug
        )
      `)
      .eq("published", true)
      .eq("category_id", categoryId)
      .neq("id", postId)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching related posts:", err);
    return [];
  }
}

export async function getRecentPosts(limit = 5) {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        blog_categories (
          name,
          slug
        )
      `)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching recent posts:", err);
    return [];
  }
}

export async function searchBlogPosts(query, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        blog_categories (
          name,
          slug
        )
      `)
      .eq("published", true)
      .textSearch("title,excerpt,content", query, { config: "english" })
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error searching blog posts:", err);
    return [];
  }
}

// Admin functions
export async function createBlogPost(postData) {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert(postData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating blog post:", err);
    return { success: false, error: err.message };
  }
}

export async function updateBlogPost(id, postData) {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .update(postData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error updating blog post:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteBlogPost(id) {
  try {
    const { error } = await supabaseAdmin
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error("Error deleting blog post:", err);
    return { success: false, error: err.message };
  }
}

export async function getBlogPostAdmin(id) {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select(`
        *,
        blog_categories (
          name,
          slug
        ),
        blog_tags (
          name,
          slug
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error fetching blog post:", err);
    return null;
  }
}

export async function getBlogPostsAdmin(limit = 10, offset = 0, search = null, category = null) {
  try {
    let query = supabaseAdmin
      .from("blog_posts")
      .select(`
        *,
        blog_categories (
          name,
          slug
        ),
        blog_tags (
          name,
          slug
        )
      `, { count: "exact" })
      .order("published_at", { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq("category_id", category);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      posts: data || [],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    };
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    return { posts: [], total: 0, hasMore: false };
  }
}

// Helper functions for SEO
export function buildBlogPostUrl(slug) {
  return `/blog/${slug}`;
}

export function buildBlogCategoryUrl(categorySlug) {
  return `/blog/category/${categorySlug}`;
}

export function buildBlogTagUrl(tagSlug) {
  return `/blog/tag/${tagSlug}`;
}

export function buildBlogArchiveUrl(year, month) {
  if (month) {
    return `/blog/archive/${year}/${month}`;
  }
  return `/blog/archive/${year}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateReadingTime(content) {
  if (!content) return '1 min read';
  
  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200); // Average reading speed
  return `${readingTime} min read`;
}