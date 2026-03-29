#!/usr/bin/env node

/**
 * Blog Automation Setup Script
 * 
 * This script sets up automated daily blog generation using various methods:
 * - Netlify Functions (recommended for Netlify deployments)
 * - GitHub Actions (for GitHub-hosted projects)
 * - Local cron jobs (for development/local environments)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();

// Netlify Functions setup
function setupNetlifyFunctions() {
  console.log('🚀 Setting up Netlify Functions for blog automation...');
  
  const functionsDir = path.join(PROJECT_ROOT, 'netlify/functions');
  
  // Create functions directory if it doesn't exist
  if (!fs.existsSync(functionsDir)) {
    fs.mkdirSync(functionsDir, { recursive: true });
  }
  
  // Create scheduled function for daily blog generation
  const scheduledFunction = `
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const handler = async (event, context) => {
  try {
    console.log('🚀 Starting scheduled blog generation...');
    
    // Import the generation function
    const { generateBlogPost } = await import('../scripts/generateBlog.js');
    
    // Generate one blog post
    const success = await generateBlogPost();
    
    if (success) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Blog post generated successfully',
          timestamp: new Date().toISOString()
        })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'Failed to generate blog post',
          timestamp: new Date().toISOString()
        })
      };
    }
    
  } catch (error) {
    console.error('❌ Error in scheduled blog generation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
  `;
  
  fs.writeFileSync(path.join(functionsDir, 'generate-daily-blog.js'), scheduledFunction);
  
  // Create netlify.toml configuration for scheduled functions
  const netlifyTomlPath = path.join(PROJECT_ROOT, 'netlify.toml');
  let netlifyToml = '';
  
  if (fs.existsSync(netlifyTomlPath)) {
    netlifyToml = fs.readFileSync(netlifyTomlPath, 'utf8');
  }
  
  // Add scheduled function configuration
  const scheduledConfig = '\n[functions]\n  directory = "netlify/functions"\n\n[[functions.generate-daily-blog]]\n  path = "/api/generate-daily-blog"\n  schedule = "0 9 * * *"  # Daily at 9 AM UTC\n';
  
  if (!netlifyToml.includes('[[functions.generate-daily-blog]]')) {
    fs.writeFileSync(netlifyTomlPath, netlifyToml + scheduledConfig);
    console.log('✅ Netlify Functions configuration updated');
  } else {
    console.log('✅ Netlify Functions already configured');
  }
  
  console.log('✅ Netlify Functions setup complete');
  console.log('📝 The function will run daily at 9 AM UTC');
  console.log('🔗 Access endpoint: /.netlify/functions/generate-daily-blog');
}

// GitHub Actions setup
function setupGitHubActions() {
  console.log('🤖 Setting up GitHub Actions for blog automation...');
  
  const workflowsDir = path.join(PROJECT_ROOT, '.github/workflows');
  
  // Create workflows directory if it doesn't exist
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
  }
  
  // Create GitHub Actions workflow
  const workflow = 'name: Daily Blog Generation\non:\n  schedule:\n    - cron: \'0 9 * * *\'  # Daily at 9 AM UTC\n  workflow_dispatch:  # Allow manual triggering\n\njobs:\n  generate-blog:\n    runs-on: ubuntu-latest\n    \n    steps:\n    - name: Checkout repository\n      uses: actions/checkout@v4\n      \n    - name: Setup Node.js\n      uses: actions/setup-node@v4\n      with:\n        node-version: \'18\'\n        cache: \'npm\'\n        \n    - name: Install dependencies\n      run: npm install\n      \n    - name: Generate blog post\n      env:\n        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}\n        SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}\n      run: node scripts/generateBlog.js 1\n      \n    - name: Commit and push changes\n      run: |\n        git config --local user.email "action@github.com"\n        git config --local user.name "GitHub Action"\n        git add .\n        if ! git diff --cached --quiet; then\n          git commit -m "🤖 Auto-generate daily blog post $(date -u +%Y-%m-%d)"\n          git push\n        else\n          echo "No changes to commit"\n        fi\n      env:\n        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}';
  
  fs.writeFileSync(path.join(workflowsDir, 'daily-blog-generation.yml'), workflow);
  console.log('✅ GitHub Actions workflow created');
  console.log('📝 The workflow will run daily at 9 AM UTC');
  console.log('🔧 Manual trigger available via GitHub Actions UI');
}

// Local cron setup
function setupLocalCron() {
  console.log('⏰ Setting up local cron job for blog automation...');
  
  const scriptPath = path.join(PROJECT_ROOT, 'scripts/generateBlog.js');
  const cronCommand = 'cd ' + PROJECT_ROOT + ' && node ' + scriptPath + ' 1 >> ' + PROJECT_ROOT + '/logs/blog-generation.log 2>&1';
  
  console.log('📋 Add this line to your crontab (run "crontab -e"):');
  console.log('0 9 * * * ' + cronCommand);
  
  // Create logs directory
  const logsDir = path.join(PROJECT_ROOT, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  console.log('✅ Logs directory created at: /logs');
  console.log('📝 Cron job will run daily at 9 AM local time');
  console.log('📁 Logs will be saved to: /logs/blog-generation.log');
}

// Environment variables setup
function setupEnvironmentVariables() {
  console.log('🔧 Setting up environment variables...');
  
  const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
  let envExample = '';
  
  if (fs.existsSync(envExamplePath)) {
    envExample = fs.readFileSync(envExamplePath, 'utf8');
  }
  
  const blogEnvVars = '\n# Blog Automation Environment Variables\nNEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here\nSUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here\n\n# Optional: Blog generation settings\nBLOG_GENERATION_COUNT=1\nBLOG_GENERATION_ENABLED=true\n';
  
  if (!envExample.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    fs.writeFileSync(envExamplePath, envExample + blogEnvVars);
    console.log('✅ Environment variables added to .env.example');
  } else {
    console.log('✅ Environment variables already configured');
  }
  
  // Check if .env.local exists and has the required variables
  const envLocalPath = path.join(PROJECT_ROOT, '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envLocal = fs.readFileSync(envLocalPath, 'utf8');
    if (!envLocal.includes('NEXT_PUBLIC_SUPABASE_URL')) {
      fs.writeFileSync(envLocalPath, envLocal + blogEnvVars);
      console.log('✅ Environment variables added to .env.local');
    } else {
      console.log('✅ .env.local already configured');
    }
  }
}

// Package.json scripts update
function updatePackageScripts() {
  console.log('📦 Updating package.json scripts...');
  
  const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add blog generation scripts
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['generate:blog'] = 'node scripts/generateBlog.js';
  packageJson.scripts['generate:blog:multi'] = 'node scripts/generateBlog.js 5';
  packageJson.scripts['setup:blog:automation'] = 'node scripts/setup-cron.js';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json scripts updated');
  console.log('📝 Available scripts:');
  console.log('   npm run generate:blog     - Generate 1 blog post');
  console.log('   npm run generate:blog:multi - Generate 5 blog posts');
  console.log('   npm run setup:blog:automation - Setup automation');
}

// Main setup function
async function setupAutomation() {
  console.log('🚀 Starting blog automation setup...\n');
  
  try {
    // Update package.json scripts
    updatePackageScripts();
    
    // Setup environment variables
    setupEnvironmentVariables();
    
    // Setup automation based on deployment platform
    const platform = process.env.DEPLOYMENT_PLATFORM || 'local';
    
    switch (platform) {
      case 'netlify':
        setupNetlifyFunctions();
        break;
      case 'github':
        setupGitHubActions();
        break;
      case 'local':
      default:
        setupLocalCron();
        break;
    }
    
    console.log('\n🎉 Blog automation setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Set your Supabase environment variables in .env.local');
    console.log('2. Test the generation: npm run generate:blog');
    console.log('3. Deploy your changes');
    console.log('4. Monitor logs for successful generation');
    
    console.log('\n📊 Monitoring:');
    console.log('- Check Supabase dashboard for new blog posts');
    console.log('- Monitor logs for generation status');
    console.log('- Verify posts appear on your blog page');
    
  } catch (error) {
    console.error('❌ Error setting up automation:', error);
    process.exit(1);
  }
}

// CLI interface
if (import.meta.url === 'file://' + process.argv[1]) {
  setupAutomation();
}

export { setupAutomation, setupNetlifyFunctions, setupGitHubActions, setupLocalCron };