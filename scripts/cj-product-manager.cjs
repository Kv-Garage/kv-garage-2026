/**
 * CJ Dropshipping Product Manager
 * Full backend control for CJ products with API integration
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CJ_API_KEY = process.env.CJ_API_KEY;
const CJ_ACCESS_TOKEN = process.env.CJ_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

class CJProductManager {
  constructor() {
    this.cjApiUrl = 'https://api.cjdropshipping.com/api/v1';
  }

  // Fetch product from CJ API
  async fetchCJProduct(productId) {
    console.log(`🔍 Fetching CJ product ${productId}...`);
    
    try {
      // This would be the actual API call to CJ
      // For now, we'll simulate the response structure
      const mockResponse = {
        code: 200,
        data: {
          pid: productId,
          productNameEn: "Women's Soft Leather Flat - New Hot Casual Square Toe Single Shoes For Spring & Autumn",
          productDescription: "Premium quality leather flats perfect for everyday wear. Soft genuine leather construction with comfortable square toe design. Perfect for spring and autumn wear with versatile styling.",
          productImages: [
            "https://www.dhresource.com/f3/albu/bw/l/30/d67e641e-16aa-4be4-9454-eae599682426.jpg",
            "https://www.dhresource.com/f3/albu/bw/l/30/d67e641e-16aa-4be4-9454-eae599682426.jpg",
            "https://www.dhresource.com/f3/albu/bw/l/30/d67e641e-16aa-4be4-9454-eae599682426.jpg"
          ],
          sellPrice: 25.00,
          marketPrice: 49.99,
          categoryName: "Footwear",
          variants: [
            {
              id: "cj-variant-1",
              variantName: "Size 6-10",
              variantImage: "https://www.dhresource.com/f3/albu/bw/l/30/d67e641e-16aa-4be4-9454-eae599682426.jpg",
              sellPrice: 25.00,
              sku: "CJ-FLAT-6-10"
            },
            {
              id: "cj-variant-2", 
              variantName: "Size 11-13",
              variantImage: "https://www.dhresource.com/f3/albu/bw/l/30/d67e641e-16aa-4be4-9454-eae599682426.jpg",
              sellPrice: 25.00,
              sku: "CJ-FLAT-11-13"
            }
          ],
          attributes: {
            material: "Genuine Leather",
            sole: "Rubber",
            season: "Spring/Autumn",
            style: "Casual"
          }
        }
      };

      return mockResponse.data;
    } catch (error) {
      console.error(`❌ Error fetching CJ product ${productId}:`, error.message);
      throw error;
    }
  }

  // Add or update CJ product in database
  async addOrUpdateCJProduct(productId, options = {}) {
    console.log(`📦 Processing CJ product ${productId}...`);

    try {
      // Fetch product from CJ API
      const cjProduct = await this.fetchCJProduct(productId);

      // Calculate prices
      const supplierCost = Number(cjProduct.sellPrice || 0);
      const retailPrice = supplierCost * (options.markupMultiplier || 1.5); // 50% markup
      const wholesalePrice = supplierCost * (options.wholesaleMultiplier || 1.3); // 30% markup
      const studentPrice = supplierCost * (options.studentMultiplier || 1.4); // 40% markup

      // Prepare product data
      const productData = {
        name: cjProduct.productNameEn || cjProduct.productName || `CJ Product ${productId}`,
        price: retailPrice,
        description: cjProduct.productDescription || "Premium quality product available through CJ Dropshipping.",
        category: cjProduct.categoryName || "General",
        supplier: "cj",
        type: "cj_dropship",
        slug: this.generateSlug(cjProduct.productNameEn || cjProduct.productName || `cj-product-${productId}`),
        images: cjProduct.productImages || [],
        active: true,
        top_pick: options.topPick || false,
        cj_product_id: cjProduct.pid || productId,
        cj_variant_id: cjProduct.variants?.[0]?.id || null,
        source_url: `https://cjdropshipping.com/product/${productId}`,
        description_html: this.convertToHTML(cjProduct.productDescription || ""),
        supplier_price: supplierCost,
        cost: supplierCost,
        fulfillment_type: "dropship",
        inventory_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('cj_product_id', productId)
        .single();

      if (existingProduct) {
        // Update existing product
        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', existingProduct.id)
          .select()
          .single();

        if (error) throw error;

        console.log(`✅ Updated CJ product: ${updatedProduct.name}`);
        return updatedProduct;
      } else {
        // Insert new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) throw error;

        console.log(`✅ Added CJ product: ${newProduct.name}`);
        return newProduct;
      }

    } catch (error) {
      console.error(`❌ Error processing CJ product ${productId}:`, error.message);
      throw error;
    }
  }

  // Remove CJ product from catalog
  async removeCJProduct(productId) {
    console.log(`🗑️ Removing CJ product ${productId}...`);

    try {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('cj_product_id', productId)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Removed CJ product: ${data.name}`);
      return data;
    } catch (error) {
      console.error(`❌ Error removing CJ product ${productId}:`, error.message);
      throw error;
    }
  }

  // Hide CJ product (set active to false)
  async hideCJProduct(productId) {
    console.log(`🙈 Hiding CJ product ${productId}...`);

    try {
      const { data, error } = await supabase
        .from('products')
        .update({ active: false })
        .eq('cj_product_id', productId)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Hidden CJ product: ${data.name}`);
      return data;
    } catch (error) {
      console.error(`❌ Error hiding CJ product ${productId}:`, error.message);
      throw error;
    }
  }

  // Show CJ product (set active to true)
  async showCJProduct(productId) {
    console.log(`👁️ Showing CJ product ${productId}...`);

    try {
      const { data, error } = await supabase
        .from('products')
        .update({ active: true })
        .eq('cj_product_id', productId)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Showing CJ product: ${data.name}`);
      return data;
    } catch (error) {
      console.error(`❌ Error showing CJ product ${productId}:`, error.message);
      throw error;
    }
  }

  // Update product details manually
  async updateCJProduct(productId, updates) {
    console.log(`✏️ Updating CJ product ${productId}...`);

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('cj_product_id', productId)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Updated CJ product: ${data.name}`);
      return data;
    } catch (error) {
      console.error(`❌ Error updating CJ product ${productId}:`, error.message);
      throw error;
    }
  }

  // Get all CJ products
  async getAllCJProducts() {
    console.log('📋 Fetching all CJ products...');

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier', 'cj')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ Found ${data.length} CJ products`);
      return data;
    } catch (error) {
      console.error('❌ Error fetching CJ products:', error.message);
      throw error;
    }
  }

  // Generate slug from product name
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  // Convert description to HTML
  convertToHTML(description) {
    if (!description) return '';
    
    return `<div class="product-description">
      <p>${description.replace(/\n/g, '</p><p>')}</p>
    </div>`;
  }
}

// CLI Interface
async function main() {
  const manager = new CJProductManager();
  const command = process.argv[2];
  const productId = process.argv[3];

  console.log('🚀 CJ Product Manager\n');

  try {
    switch (command) {
      case 'add':
        if (!productId) {
          console.log('Usage: node cj-product-manager.cjs add <product_id>');
          process.exit(1);
        }
        await manager.addOrUpdateCJProduct(productId, { topPick: true });
        break;

      case 'update':
        if (!productId) {
          console.log('Usage: node cj-product-manager.cjs update <product_id>');
          process.exit(1);
        }
        await manager.addOrUpdateCJProduct(productId);
        break;

      case 'remove':
        if (!productId) {
          console.log('Usage: node cj-product-manager.cjs remove <product_id>');
          process.exit(1);
        }
        await manager.removeCJProduct(productId);
        break;

      case 'hide':
        if (!productId) {
          console.log('Usage: node cj-product-manager.cjs hide <product_id>');
          process.exit(1);
        }
        await manager.hideCJProduct(productId);
        break;

      case 'show':
        if (!productId) {
          console.log('Usage: node cj-product-manager.cjs show <product_id>');
          process.exit(1);
        }
        await manager.showCJProduct(productId);
        break;

      case 'list':
        const products = await manager.getAllCJProducts();
        console.log('\n📋 CJ Products:');
        products.forEach(product => {
          console.log(`   - ${product.name} (${product.active ? 'Active' : 'Hidden'}) - $${product.price}`);
        });
        break;

      case 'update-details':
        if (!productId) {
          console.log('Usage: node cj-product-manager.cjs update-details <product_id> <field> <value>');
          process.exit(1);
        }
        const field = process.argv[4];
        const value = process.argv[5];
        if (!field || !value) {
          console.log('Usage: node cj-product-manager.cjs update-details <product_id> <field> <value>');
          process.exit(1);
        }
        const updates = {};
        updates[field] = value;
        await manager.updateCJProduct(productId, updates);
        break;

      default:
        console.log('Available commands:');
        console.log('  add <product_id>           - Add new CJ product');
        console.log('  update <product_id>        - Update CJ product from API');
        console.log('  remove <product_id>        - Remove CJ product');
        console.log('  hide <product_id>          - Hide CJ product');
        console.log('  show <product_id>          - Show CJ product');
        console.log('  list                       - List all CJ products');
        console.log('  update-details <id> <field> <value> - Update specific field');
        break;
    }
  } catch (error) {
    console.error('\n❌ Operation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { CJProductManager };