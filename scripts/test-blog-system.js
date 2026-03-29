#!/usr/bin/env node

/**
 * Blog System Test Suite
 * 
 * This script tests all components of the automated blog system:
 * - Database schema validation
 * - Content generation
 * - Image handling
 * - SEO optimization
 * - Performance metrics
 * - Automation workflows
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function logTest(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}`);
    if (details) console.log(`   ${details}`);
  }
  testResults.details.push({ testName, passed, details });
}

// Test 1: Database Schema Validation
async function testDatabaseSchema() {
  try {
    const { data, error } = await supabaseAdmin
      .from('learn_posts')
      .select('id')
      .limit(1);

    if (error) {
      logTest('Database Schema', false, error.message);
      return;
    }

    // Check if required fields exist by examining the table structure
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'learn_posts')
      .in('column_name', [
        'title', 'slug', 'category', 'excerpt', 'content_html', 
        'cover_image', 'images', 'featured', 'is_published',
        'meta_title', 'meta_description', 'keywords', 'reading_time',
        'author', 'published_at', 'created_at', 'updated_at'
      ]);

    if (tableError) {
      logTest('Database Schema', false, tableError.message);
      return;
    }

    const requiredFields = [
      'title', 'slug', 'category', 'excerpt', 'content_html', 
      'cover_image', 'images', 'featured', 'is_published',
      'meta_title', 'meta_description', 'keywords', 'reading_time',
      'author', 'published_at', 'created_at', 'updated_at'
    ];

    const existingFields = tableInfo.map(col => col.column_name);
    const missingFields = requiredFields.filter(field => !existingFields.includes(field));

    if (missingFields.length === 0) {
      logTest('Database Schema', true, 'All required fields present');
    } else {
      logTest('Database Schema', false, `Missing fields: ${missingFields.join(', ')}`);
    }

  } catch (error) {
    logTest('Database Schema', false, error.message);
  }
}

// Test 2: Content Generation
async function testContentGeneration() {
  try {
    // Import the generation function
    const { generateBlogPost } = await import('./generateBlog.js');
    
    // Test content generation
    const success = await generateBlogPost();
    
    if (success) {
      logTest('Content Generation', true, 'Blog post generated successfully');
    } else {
      logTest('Content Generation', false, 'Failed to generate blog post');
    }

  } catch (error) {
    logTest('Content Generation', false, error.message);
  }
}

// Test 3: Image Handling
async function testImageHandling() {
  try {
    // Check if placeholder images are accessible
    const imageUrls = [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce3e1',
      'https://images.unsplash.com/photo-1523240796268-5d1f1e6a393d'
    ];

    let allImagesAccessible = true;
    
    for (const url of imageUrls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          allImagesAccessible = false;
          break;
        }
      } catch (error) {
        allImagesAccessible = false;
        break;
      }
    }

    if (allImagesAccessible) {
      logTest('Image Handling', true, 'All placeholder images accessible');
    } else {
      logTest('Image Handling', false, 'Some placeholder images are not accessible');
    }

  } catch (error) {
    logTest('Image Handling', false, error.message);
  }
}

// Test 4: SEO Optimization
async function testSEO() {
  try {
    // Check if sitemap and robots.txt exist
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    
    const sitemapExists = fs.existsSync(sitemapPath);
    const robotsExists = fs.existsSync(robotsPath);
    
    if (sitemapExists && robotsExists) {
      logTest('SEO Optimization', true, 'Sitemap and robots.txt files exist');
    } else {
      logTest('SEO Optimization', false, `Missing files: ${!sitemapExists ? 'sitemap.xml' : ''} ${!robotsExists ? 'robots.txt' : ''}`);
    }

  } catch (error) {
    logTest('SEO Optimization', false, error.message);
  }
}

// Test 5: Performance Metrics
async function testPerformance() {
  try {
    // Test blog data fetching performance
    const startTime = Date.now();
    
    const { data, error } = await supabaseAdmin
      .from('learn_posts')
      .select('id, title, slug, published_at')
      .eq('is_published', true)
      .limit(10);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (error) {
      logTest('Performance', false, `Database query failed: ${error.message}`);
      return;
    }

    if (responseTime < 1000) { // Under 1 second
      logTest('Performance', true, `Database query completed in ${responseTime}ms`);
    } else {
      logTest('Performance', false, `Database query too slow: ${responseTime}ms`);
    }

  } catch (error) {
    logTest('Performance', false, error.message);
  }
}

// Test 6: Content Quality
async function testContentQuality() {
  try {
    // Fetch a recent blog post to test content quality
    const { data: posts, error } = await supabaseAdmin
      .from('learn_posts')
      .select('content_html, title, excerpt, cover_image, keywords')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(1);

    if (error) {
      logTest('Content Quality', false, error.message);
      return;
    }

    if (!posts || posts.length === 0) {
      logTest('Content Quality', false, 'No published blog posts found');
      return;
    }

    const post = posts[0];
    const content = post.content_html || '';
    
    // Check content length
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const wordCount = textContent.split(/\s+/).length;
    const paragraphCount = (content.match(/<\/p>/g) || []).length;
    
    // Check for internal links
    const hasInternalLinks = content.includes('href="/');
    
    // Check for keywords
    const hasKeywords = post.keywords && post.keywords.length > 0;
    
    // Check for images
    const hasImages = post.cover_image && (post.images || []).length >= 2;

    const qualityChecks = [
      { name: 'Word count', passed: wordCount >= 800, value: wordCount },
      { name: 'Paragraph count', passed: paragraphCount >= 10, value: paragraphCount },
      { name: 'Internal links', passed: hasInternalLinks, value: hasInternalLinks },
      { name: 'Keywords', passed: hasKeywords, value: hasKeywords },
      { name: 'Images', passed: hasImages, value: hasImages }
    ];

    const passedChecks = qualityChecks.filter(check => check.passed).length;
    const totalChecks = qualityChecks.length;

    if (passedChecks === totalChecks) {
      logTest('Content Quality', true, `All quality checks passed (${passedChecks}/${totalChecks})`);
    } else {
      const failedChecks = qualityChecks.filter(check => !check.passed).map(check => check.name);
      logTest('Content Quality', false, `Failed checks: ${failedChecks.join(', ')}`);
    }

  } catch (error) {
    logTest('Content Quality', false, error.message);
  }
}

// Test 7: Automation Scripts
async function testAutomationScripts() {
  try {
    const scriptsDir = path.join(process.cwd(), 'scripts');
    const requiredScripts = [
      'generateBlog.js',
      'setup-cron.js',
      'update-sitemap.js'
    ];

    const missingScripts = [];
    
    for (const script of requiredScripts) {
      const scriptPath = path.join(scriptsDir, script);
      if (!fs.existsSync(scriptPath)) {
        missingScripts.push(script);
      }
    }

    if (missingScripts.length === 0) {
      logTest('Automation Scripts', true, 'All required scripts present');
    } else {
      logTest('Automation Scripts', false, `Missing scripts: ${missingScripts.join(', ')}`);
    }

  } catch (error) {
    logTest('Automation Scripts', false, error.message);
  }
}

// Test 8: File Structure
async function testFileStructure() {
  try {
    const requiredFiles = [
      'pages/blog.js',
      'pages/blog/[slug].js',
      'lib/blog.js',
      'supabase/migrations/20260326_learn_posts.sql'
    ];

    const missingFiles = [];
    
    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length === 0) {
      logTest('File Structure', true, 'All required files present');
    } else {
      logTest('File Structure', false, `Missing files: ${missingFiles.join(', ')}`);
    }

  } catch (error) {
    logTest('File Structure', false, error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting Blog System Test Suite...\n');

  await testDatabaseSchema();
  await testContentGeneration();
  await testImageHandling();
  await testSEO();
  await testPerformance();
  await testContentQuality();
  await testAutomationScripts();
  await testFileStructure();

  console.log('\n📊 Test Results:');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Blog system is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix the issues before going live.');
    
    console.log('\n📋 Failed Tests:');
    testResults.details
      .filter(result => !result.passed)
      .forEach(result => {
        console.log(`- ${result.testName}: ${result.details}`);
      });
  }

  return testResults.failed === 0;
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { runTests, testDatabaseSchema, testContentGeneration, testImageHandling, testSEO, testPerformance, testContentQuality, testAutomationScripts, testFileStructure };