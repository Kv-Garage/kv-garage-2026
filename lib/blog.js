import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

export async function getBlogPosts(limit = 10, offset = 0, category = null, tag = null) {
  try {
    let query = supabase
      .from("learn_posts")
      .select(`
        id,
        title,
        slug,
        category,
        excerpt,
        content_html,
        cover_image,
        images,
        featured,
        is_published,
        related_product_slug,
        meta_title,
        meta_description,
        keywords,
        reading_time,
        author,
        published_at,
        created_at,
        updated_at
      `, { count: "exact" })
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
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
      .from("learn_posts")
      .select(`
        id,
        title,
        slug,
        category,
        excerpt,
        content_html,
        cover_image,
        images,
        featured,
        is_published,
        related_product_slug,
        meta_title,
        meta_description,
        keywords,
        reading_time,
        author,
        published_at,
        created_at,
        updated_at
      `)
      .eq("slug", slug)
      .eq("is_published", true)
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
    // Get unique categories from learn_posts
    const { data, error } = await supabase
      .from("learn_posts")
      .select("category")
      .eq("is_published", true)
      .order("category", { ascending: true });

    if (error) {
      throw error;
    }

    // Remove duplicates and return unique categories
    const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
    return uniqueCategories.map(cat => ({ name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }));
  } catch (err) {
    console.error("Error fetching blog categories:", err);
    return [];
  }
}

export async function getBlogTags() {
  try {
    // Get all keywords from learn_posts and flatten them
    const { data, error } = await supabase
      .from("learn_posts")
      .select("keywords")
      .eq("is_published", true);

    if (error) {
      throw error;
    }

    // Flatten keywords array and remove duplicates
    const allKeywords = data?.flatMap(item => item.keywords || []) || [];
    const uniqueKeywords = [...new Set(allKeywords)];
    
    return uniqueKeywords.map(keyword => ({ 
      name: keyword, 
      slug: keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') 
    }));
  } catch (err) {
    console.error("Error fetching blog tags:", err);
    return [];
  }
}

export async function getRelatedPosts(postId, category, limit = 3) {
  try {
    const { data, error } = await supabase
      .from("learn_posts")
      .select(`
        id,
        title,
        slug,
        category,
        excerpt,
        cover_image,
        published_at
      `)
      .eq("is_published", true)
      .eq("category", category)
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
      .from("learn_posts")
      .select(`
        id,
        title,
        slug,
        category,
        excerpt,
        cover_image,
        published_at
      `)
      .eq("is_published", true)
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
      .from("learn_posts")
      .select(`
        id,
        title,
        slug,
        category,
        excerpt,
        cover_image,
        published_at
      `)
      .eq("is_published", true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content_html.ilike.%${query}%`)
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
    // Validate content length
    const contentLength = postData.content_html ? postData.content_html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length : 0;
    if (contentLength < 800) {
      return { 
        success: false, 
        error: 'Content must be at least 800 words for long-form content requirements' 
      };
    }

    const { data, error } = await supabaseAdmin
      .from("learn_posts")
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
    // Validate content length if content is being updated
    if (postData.content_html) {
      const contentLength = postData.content_html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
      if (contentLength < 800) {
        return { 
          success: false, 
          error: 'Content must be at least 800 words for long-form content requirements' 
        };
      }
    }

    const { data, error } = await supabaseAdmin
      .from("learn_posts")
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
      .from("learn_posts")
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
      .from("learn_posts")
      .select(`
        id,
        title,
        slug,
        category,
        excerpt,
        content_html,
        cover_image,
        images,
        featured,
        is_published,
        related_product_slug,
        meta_title,
        meta_description,
        keywords,
        reading_time,
        author,
        published_at,
        created_at,
        updated_at
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
      .from("learn_posts")
      .select(`
        id,
        title,
        slug,
        category,
        excerpt,
        cover_image,
        featured,
        is_published,
        related_product_slug,
        meta_title,
        meta_description,
        keywords,
        reading_time,
        author,
        published_at,
        created_at,
        updated_at
      `, { count: "exact" })
      .order("published_at", { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content_html.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq("category", category);
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
  
  // Remove HTML tags for accurate word count
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  const words = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200); // Average reading speed
  return `${readingTime} min read`;
}

// Content validation functions
export function validateBlogContent(content) {
  if (!content) return { valid: false, message: 'Content is required' };
  
  // Remove HTML tags for word count
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  const wordCount = textContent.split(/\s+/).length;
  
  if (wordCount < 800) {
    return { 
      valid: false, 
      message: `Content must be at least 800 words. Current word count: ${wordCount}` 
    };
  }
  
  // Check for minimum paragraph count (should have at least 10 paragraphs)
  const paragraphCount = (content.match(/<\/p>/g) || []).length;
  if (paragraphCount < 10) {
    return { 
      valid: false, 
      message: `Content must have at least 10 paragraphs. Current paragraph count: ${paragraphCount}` 
    };
  }
  
  return { valid: true, wordCount, paragraphCount };
}

// Image validation
export function validateBlogImages(images, coverImage) {
  const imageArray = Array.isArray(images) ? images : [];
  
  // Check if cover image exists
  if (!coverImage) {
    return { valid: false, message: 'Cover image is required' };
  }
  
  // Check if content images exist (at least 2-3 images for long-form content)
  if (imageArray.length < 2) {
    return { 
      valid: false, 
      message: 'Long-form content should include at least 2 additional images for better engagement' 
    };
  }
  
  return { valid: true, imageCount: imageArray.length + 1 };
}
