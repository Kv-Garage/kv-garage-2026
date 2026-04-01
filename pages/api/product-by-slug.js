import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Slug parameter required' });
  }

  try {
    // First try to find by slug
    let { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    // If not found by slug, try by id
    if (!product && !error) {
      const { data: productById, error: idError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', slug)
        .single();
      
      product = productById;
      error = idError;
    }

    if (error || !product) {
      // Check static JSON as fallback
      const productsData = require('../../data/products.json');
      const staticProduct = productsData.products.find(p => p.slug === slug || p.id === slug);
      
      if (staticProduct) {
        return res.status(200).json({ product: staticProduct, source: 'static' });
      }
      
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform database product to match expected format
    const formattedProduct = {
      id: product.id,
      slug: product.slug || product.id,
      name: product.name,
      description: product.description || '',
      price: Number(product.price || 0),
      display_price: product.display_price ? Number(product.display_price) : undefined,
      images: product.images || [product.image_url].filter(Boolean),
      category: product.category || 'Uncategorized',
      tags: product.tags || [],
      inventory: Number(product.inventory_count || product.inventory || 0),
      top_pick: product.top_pick || false,
      price_note: product.price_note || null,
    };

    res.status(200).json({ product: formattedProduct, source: 'database' });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}