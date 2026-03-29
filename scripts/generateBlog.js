#!/usr/bin/env node

/**
 * Daily Blog Auto-Generation System
 * 
 * This script automatically generates high-quality, long-form blog content
 * focused on watches, jewelry, luxury resale, and buying guides.
 * 
 * Features:
 * - Generates 25-30 lines of in-depth content per post
 * - Creates SEO-optimized titles and meta descriptions
 * - Includes relevant keywords and images
 * - Validates content quality before saving
 * - Integrates with Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import { validateBlogContent, validateBlogImages, generateReadingTime } from '../lib/blog.js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Content generation topics and templates
const TOPICS = {
  watches: [
    'luxury watch investment',
    'vintage watch collecting',
    'watch maintenance tips',
    'best dive watches under $1000',
    'Rolex vs Omega comparison',
    'watch authentication guide',
    'independent watchmakers to watch',
    'smartwatch vs traditional watch',
    'watch strap materials guide',
    'watch complications explained'
  ],
  jewelry: [
    'diamond buying guide',
    'vintage jewelry restoration',
    'ethical gemstone sourcing',
    'jewelry appraisal tips',
    'engagement ring trends 2024',
    'gold vs platinum comparison',
    'jewelry cleaning methods',
    'birthstone meanings',
    'custom jewelry design process',
    'jewelry insurance guide'
  ],
  moissanite: [
    'moissanite vs diamond comparison',
    'ethical benefits of moissanite',
    'moissanite care and maintenance',
    'best moissanite cuts for sparkle',
    'moissanite engagement ring styles',
    'moissanite value retention',
    'custom moissanite jewelry',
    'moissanite in different settings',
    'moissanite clarity and color guide',
    'why choose moissanite over lab-grown diamond'
  ],
  luxury_resale: [
    'luxury resale market trends',
    'how to authenticate luxury goods',
    'best platforms for luxury resale',
    'investment potential of luxury items',
    'luxury handbag care and maintenance',
    'spotting fake luxury items',
    'luxury watch resale value',
    'sustainable luxury shopping',
    'luxury item authentication services',
    'building a luxury collection'
  ],
  buying_guides: [
    'how to buy pre-owned luxury',
    'questions to ask when buying luxury',
    'red flags in luxury purchases',
    'negotiating luxury prices',
    'financing luxury purchases',
    'luxury return policies',
    'international luxury shopping',
    'luxury gift guides',
    'seasonal luxury sales',
    'luxury subscription boxes'
  ]
};

// SEO-optimized title templates
const TITLE_TEMPLATES = [
  'The Ultimate Guide to {topic}: Expert Tips and Insights',
  '{topic}: What Every {audience} Should Know in 2024',
  'How to Choose the Perfect {topic} for Your Collection',
  '{topic} 101: Everything You Need to Know',
  'The Complete {topic} Buying Guide for Beginners',
  'Expert Review: {topic} Quality, Value, and Performance',
  '{topic} Trends: What\'s Hot and What\'s Not in 2024',
  'The Truth About {topic}: Myths vs Reality',
  '{topic} Investment Guide: Building Lasting Value',
  'How to Maintain Your {topic} for Years to Come'
];

// Meta description templates
const META_DESCRIPTION_TEMPLATES = [
  'Discover everything you need to know about {topic}. Expert insights, buying tips, and industry secrets revealed.',
  'Your complete guide to {topic}. Learn how to choose, care for, and invest in quality {topic}.',
  'Expert advice on {topic} from industry professionals. Make informed decisions and get the best value.',
  'The definitive guide to {topic} in 2024. Trends, tips, and expert recommendations.',
  'Learn how to buy, maintain, and enjoy your {topic} with our comprehensive guide.'
];

// Image URLs for different topics (placeholder images)
const IMAGE_URLS = {
  watches: [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80'
  ],
  jewelry: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce3e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514987849355-25f4d8f29a58?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1599643478518-a78413ddd6f2?auto=format&fit=crop&w=1200&q=80'
  ],
  moissanite: [
    'https://images.unsplash.com/photo-1514226878942-c42e64085340?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524683339207-490d7ddae99b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce3e1?auto=format&fit=crop&w=1200&q=80'
  ],
  luxury_resale: [
    'https://images.unsplash.com/photo-1523240796268-5d1f1e6a393d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526178613495-4c914ada584a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523755231516-e43fd2e8c5b8?auto=format&fit=crop&w=1200&q=80'
  ],
  buying_guides: [
    'https://images.unsplash.com/photo-1523240796268-5d1f1e6a393d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526178613495-4c914ada584a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523755231516-e43fd2e8c5b8?auto=format&fit=crop&w=1200&q=80'
  ]
};

// Generate high-quality content paragraphs with internal links
function generateContent(topic, category) {
  const paragraphs = [];
  
  // Introduction paragraph
  paragraphs.push(`
    <p>In today's luxury market, <strong>${topic}</strong> has become increasingly popular among discerning collectors and enthusiasts. 
    Whether you're a seasoned collector or just beginning your journey into the world of fine ${category}, 
    understanding the nuances of quality, value, and authenticity is crucial for making informed decisions. 
    At <a href="/shop" title="Explore our luxury collection">KV Garage</a>, we specialize in curating exceptional pieces that combine timeless beauty with lasting value.</p>
  `);

  // Market analysis paragraph
  paragraphs.push(`
    <p>The ${category} market has seen significant growth and evolution in recent years, with new trends emerging 
    and traditional practices being reevaluated. Experts predict continued appreciation in value for high-quality 
    pieces, making now an excellent time to invest in timeless ${category} that will appreciate both 
    aesthetically and financially. For those interested in the investment potential, our <a href="/trading" title="Luxury trading services">trading program</a> offers expert guidance on building a valuable collection.</p>
  `);

  // Quality assessment paragraph
  paragraphs.push(`
    <p>When evaluating ${topic}, there are several key factors to consider. Craftsmanship, materials, 
    provenance, and condition all play critical roles in determining both the current value and future 
    appreciation potential. Understanding these elements will help you distinguish between mass-produced 
    items and true works of art that stand the test of time. Our <a href="/learn" title="Educational resources">Learn section</a> provides comprehensive guides to help you become a more informed collector.</p>
  `);

  // Buying considerations paragraph
  paragraphs.push(`
    <p>Purchasing ${topic} requires careful consideration and due diligence. It's essential to work with 
    reputable dealers who can provide proper documentation and authentication. Always ask about return 
    policies, warranties, and after-sales service, as these factors contribute significantly to your 
    overall buying experience and long-term satisfaction. At KV Garage, we offer a <a href="/deals" title="Current special offers">satisfaction guarantee</a> on all our pieces.</p>
  `);

  // Care and maintenance paragraph
  paragraphs.push(`
    <p>Proper care and maintenance are essential for preserving the beauty and value of your ${topic}. 
    Regular cleaning, appropriate storage conditions, and professional servicing when needed will ensure 
    your investment remains in pristine condition for generations to come. Many high-end ${category} 
    pieces benefit from annual check-ups by qualified professionals. For detailed care instructions, 
    visit our <a href="/contact" title="Get in touch with our experts">customer service</a> team.</p>
  `);

  // Investment perspective paragraph
  paragraphs.push(`
    <p>From an investment standpoint, ${topic} offers unique advantages in today's economic climate. 
    Unlike traditional investments, luxury ${category} provides both tangible value and aesthetic 
    enjoyment. Historical data shows that well-chosen pieces often outperform traditional investment 
    vehicles while providing the added benefit of personal satisfaction. Our <a href="/trading" title="Investment opportunities">trading experts</a> can help you identify pieces with strong investment potential.</p>
  `);

  // Expert tips paragraph
  paragraphs.push(`
    <p>Industry experts recommend taking your time when selecting ${topic}. Don't rush the decision 
    process—visit multiple dealers, handle different pieces, and trust your instincts. The right 
    ${category} should resonate with you personally while also meeting objective quality standards. 
    Remember, you're not just buying an object; you're making a statement about your taste and values. 
    Explore our <a href="/shop" title="Browse our collection">curated collection</a> to find pieces that speak to you.</p>
  `);

  // Future trends paragraph
  paragraphs.push(`
    <p>Looking ahead, the ${category} market is expected to continue its upward trajectory, 
    driven by increasing demand from younger collectors and growing appreciation for craftsmanship 
    in an increasingly digital world. Sustainability and ethical sourcing are also becoming more 
    important considerations for modern consumers, influencing both production methods and purchasing decisions. 
    Stay informed about industry trends by following our <a href="/blog" title="Latest industry insights">blog updates</a>.</p>
  `);

  // Conclusion paragraph
  paragraphs.push(`
    <p>Ultimately, ${topic} represents more than just a purchase—it's an investment in quality, 
    heritage, and personal style. By educating yourself about the market, working with trusted 
    professionals, and following your passion, you can build a collection that brings joy and 
    appreciation for years to come. Whether you're looking for a statement piece or starting your 
    collection, our <a href="/mentorship" title="Personalized guidance">mentorship program</a> can provide personalized guidance.</p>
  `);

  // Call to action paragraph
  paragraphs.push(`
    <p>At KV Garage, we're committed to helping our clients navigate the complex world of luxury ${category}. 
    Our team of experts is always available to answer your questions and guide you through the selection 
    process. Contact us today to learn more about our current inventory and how we can help you find 
    the perfect ${topic} for your collection. Schedule a consultation through our <a href="/book" title="Book a consultation">booking page</a> to get started.</p>
  `);

  return paragraphs.join('');
}

// Generate keywords for SEO with internal link references
function generateKeywords(topic, category) {
  const baseKeywords = [
    topic.replace(/\s+/g, '-').toLowerCase(),
    category.toLowerCase(),
    'luxury ' + category.toLowerCase(),
    'buy ' + topic.toLowerCase(),
    'best ' + topic.toLowerCase(),
    topic.toLowerCase() + ' guide',
    topic.toLowerCase() + ' tips',
    topic.toLowerCase() + ' review',
    'kv garage ' + category.toLowerCase(),
    'luxury collection ' + category.toLowerCase()
  ];
  
  const additionalKeywords = [
    'high-quality ' + category.toLowerCase(),
    'premium ' + category.toLowerCase(),
    'authentic ' + category.toLowerCase(),
    'investment-grade ' + category.toLowerCase(),
    'collector\'s ' + category.toLowerCase(),
    'vintage ' + category.toLowerCase(),
    'modern ' + category.toLowerCase(),
    'luxury investment ' + category.toLowerCase(),
    'ethical ' + category.toLowerCase(),
    'sustainable ' + category.toLowerCase()
  ];
  
  return [...baseKeywords, ...additionalKeywords.slice(0, 6)];
}

// Generate meta description
function generateMetaDescription(topic, category) {
  const template = META_DESCRIPTION_TEMPLATES[Math.floor(Math.random() * META_DESCRIPTION_TEMPLATES.length)];
  return template
    .replace(/{topic}/g, topic)
    .replace(/{category}/g, category)
    .replace(/{audience}/g, category === 'watches' ? 'collector' : 'buyer');
}

// Generate title
function generateTitle(topic, category) {
  const template = TITLE_TEMPLATES[Math.floor(Math.random() * TITLE_TEMPLATES.length)];
  return template
    .replace(/{topic}/g, topic)
    .replace(/{category}/g, category)
    .replace(/{audience}/g, category === 'watches' ? 'collector' : 'buyer');
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Main function to generate a blog post
async function generateBlogPost() {
  try {
    console.log('🚀 Starting blog post generation...');
    
    // Select random category and topic
    const categories = Object.keys(TOPICS);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const topics = TOPICS[randomCategory];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    console.log(`📝 Generating post about: ${randomTopic} (${randomCategory})`);
    
    // Generate content
    const title = generateTitle(randomTopic, randomCategory);
    const slug = generateSlug(title);
    const content = generateContent(randomTopic, randomCategory);
    const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 160) + '...';
    const metaDescription = generateMetaDescription(randomTopic, randomCategory);
    const keywords = generateKeywords(randomTopic, randomCategory);
    const readingTime = generateReadingTime(content);
    
    // Select images
    const coverImage = IMAGE_URLS[randomCategory][Math.floor(Math.random() * IMAGE_URLS[randomCategory].length)];
    const contentImages = [
      IMAGE_URLS[randomCategory][Math.floor(Math.random() * IMAGE_URLS[randomCategory].length)],
      IMAGE_URLS[randomCategory][Math.floor(Math.random() * IMAGE_URLS[randomCategory].length)]
    ];
    
    // Validate content
    const contentValidation = validateBlogContent(content);
    const imageValidation = validateBlogImages(contentImages, coverImage);
    
    if (!contentValidation.valid) {
      console.error('❌ Content validation failed:', contentValidation.message);
      return false;
    }
    
    if (!imageValidation.valid) {
      console.error('❌ Image validation failed:', imageValidation.message);
      return false;
    }
    
    console.log(`✅ Content validation passed: ${contentValidation.wordCount} words, ${contentValidation.paragraphCount} paragraphs`);
    console.log(`✅ Image validation passed: ${imageValidation.imageCount} images`);
    
    // Check if slug already exists
    const { data: existingPost } = await supabaseAdmin
      .from('learn_posts')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existingPost) {
      console.log('🔄 Slug already exists, generating new slug...');
      const newSlug = slug + '-' + Date.now().toString().slice(-4);
      console.log(`📝 Using new slug: ${newSlug}`);
    }
    
    // Prepare post data
    const postData = {
      title,
      slug,
      category: randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1),
      excerpt,
      content_html: content,
      cover_image: coverImage,
      images: contentImages,
      featured: Math.random() > 0.7, // 30% chance of being featured
      is_published: true,
      meta_title: title,
      meta_description: metaDescription,
      keywords: keywords,
      reading_time: readingTime,
      author: 'KV Garage Team',
      published_at: new Date().toISOString()
    };
    
    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('learn_posts')
      .insert(postData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error inserting blog post:', error);
      return false;
    }
    
    console.log('✅ Blog post generated successfully!');
    console.log(`📝 Title: ${data.title}`);
    console.log(`🔗 URL: /blog/${data.slug}`);
    console.log(`📊 Reading Time: ${data.reading_time}`);
    console.log(`🏷️ Category: ${data.category}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error generating blog post:', error);
    return false;
  }
}

// Generate multiple posts
async function generateMultiplePosts(count = 1) {
  console.log(`🎯 Generating ${count} blog post(s)...`);
  
  let successCount = 0;
  
  for (let i = 0; i < count; i++) {
    console.log(`\n--- Post ${i + 1} ---`);
    const success = await generateBlogPost();
    if (success) {
      successCount++;
    }
    // Add delay between generations to avoid rate limiting
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n🎉 Generation complete! ${successCount}/${count} posts created successfully.`);
  return successCount;
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 1;
  
  if (isNaN(count) || count < 1) {
    console.log('Usage: node scripts/generateBlog.js [number_of_posts]');
    console.log('Example: node scripts/generateBlog.js 3');
    process.exit(1);
  }
  
  generateMultiplePosts(count).then(successCount => {
    process.exit(successCount > 0 ? 0 : 1);
  });
}

export { generateBlogPost, generateMultiplePosts };