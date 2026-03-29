#!/usr/bin/env node

/**
 * Sitemap Generator for Blog Posts
 * 
 * This script generates and updates the sitemap.xml file to include
 * all published blog posts for better SEO indexing.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Generate sitemap XML
function generateSitemap(blogPosts, baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kvgarage.com') {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/shop</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/learn</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/trading</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/deals</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/terms-and-conditions</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  
  <!-- Blog posts -->
`;

  // Add blog posts to sitemap
  blogPosts.forEach(post => {
    const postDate = new Date(post.published_at).toISOString().split('T')[0];
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    
    sitemap += `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Generate robots.txt
function generateRobotsTxt(baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kvgarage.com') {
  return `# robots.txt for KV Garage
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow crawling of admin pages
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow important directories
Allow: /blog/
Allow: /shop/
Allow: /learn/
Allow: /trading/

# Crawl delay to be respectful
Crawl-delay: 1

# Google AdsBot
User-agent: AdsBot-Google
Allow: /

# Googlebot Image
User-agent: Googlebot-Image
Allow: /

# Bingbot
User-agent: bingbot
Allow: /

# Yandex
User-agent: Yandex
Allow: /
`;
}

// Main function to update sitemap
async function updateSitemap() {
  try {
    console.log('🔄 Updating sitemap.xml...');
    
    // Fetch all published blog posts
    const { data: blogPosts, error } = await supabaseAdmin
      .from('learn_posts')
      .select('id, slug, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!blogPosts || blogPosts.length === 0) {
      console.log('⚠️  No blog posts found, generating sitemap with static pages only');
    } else {
      console.log(`📊 Found ${blogPosts.length} published blog posts`);
    }

    // Generate sitemap
    const sitemap = generateSitemap(blogPosts || []);
    
    // Write sitemap to public directory
    const sitemapPath = path.join(PROJECT_ROOT, 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`✅ Sitemap generated: ${sitemapPath}`);

    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();
    
    // Write robots.txt to public directory
    const robotsPath = path.join(PROJECT_ROOT, 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt);
    console.log(`✅ Robots.txt generated: ${robotsPath}`);

    // Validate XML format
    try {
      // Basic XML validation
      if (sitemap.includes('<urlset') && sitemap.includes('</urlset>')) {
        console.log('✅ Sitemap XML validation passed');
      } else {
        console.warn('⚠️  Sitemap XML validation failed');
      }
    } catch (validationError) {
      console.warn('⚠️  Could not validate sitemap XML:', validationError.message);
    }

    console.log('🎉 Sitemap and robots.txt update complete!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Verify the sitemap.xml file in your public directory');
    console.log('2. Submit to Google Search Console');
    console.log('3. Submit to Bing Webmaster Tools');
    console.log('4. Monitor crawl errors in search console');

  } catch (error) {
    console.error('❌ Error updating sitemap:', error);
    process.exit(1);
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  updateSitemap();
}

export { updateSitemap, generateSitemap, generateRobotsTxt };