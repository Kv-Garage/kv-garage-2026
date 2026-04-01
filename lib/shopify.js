/**
 * Shopify Storefront API Integration
 * Store: kv-garage-2.myshopify.com
 */

const SHOPIFY_STORE_DOMAIN = 'kv-garage-2.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

/**
 * Fetch data from Shopify Storefront API
 * @param {string} query - GraphQL query string
 * @param {object} variables - Optional GraphQL variables
 * @returns {Promise<any>} - GraphQL response data
 */
export async function shopifyFetch(query, variables = {}) {
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    console.error('Shopify Storefront Token is not configured');
    throw new Error('Shopify Storefront Token is missing. Set NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in .env.local');
  }

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Shopify API Error: ${response.statusText}`);
    }

    const result = await response.json();

    // Log any GraphQL errors
    if (result.errors) {
      console.error('Shopify GraphQL Errors:', JSON.stringify(result.errors, null, 2));
      throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  } catch (error) {
    console.error('Shopify fetch failed:', error);
    throw error;
  }
}

/**
 * Normalize a Shopify product to ensure it has all required fields
 * @param {object} product - Raw Shopify product object
 * @returns {object} - Normalized product with guaranteed variantId
 */
export function normalizeShopifyProduct(product) {
  // Get the first variant - CRITICAL for checkout
  const variant = product.variants?.edges?.[0]?.node;
  
  if (!variant?.id) {
    console.error('❌ INVALID PRODUCT - Missing variantId:', JSON.stringify(product, null, 2));
    throw new Error(`Shopify product "${product.title}" (ID: ${product.id}) is missing a variant ID`);
  }
  
  // Get first image or use placeholder
  const firstImage = product.images?.edges?.[0]?.node;
  const image = firstImage?.url || '/placeholder.jpg';
  
  // Get price from first variant
  const price = variant.price?.amount || product.priceRange?.minVariantPrice?.amount || 0;
  
  return {
    id: product.id,
    shopifyId: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    image: image,
    images: product.images?.edges?.map(({ node: img }) => ({
      url: img.url,
      altText: img.altText,
      width: img.width,
      height: img.height,
    })) || [],
    price: parseFloat(price),
    priceFormatted: `$${parseFloat(price).toFixed(2)}`,
    variantId: variant.id, // CRITICAL: This is what we use for checkout
    variants: product.variants?.edges?.map(({ node: v }) => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price?.amount || 0),
      available: v.availableForSale,
      compareAtPrice: v.compareAtPrice?.amount ? parseFloat(v.compareAtPrice.amount) : null,
    })) || [],
    minPrice: parseFloat(product.priceRange?.minVariantPrice?.amount || 0),
    maxPrice: parseFloat(product.priceRange?.maxVariantPrice?.amount || 0),
    tags: product.tags || [],
    productType: product.productType,
    vendor: product.vendor,
    availableForSale: product.variants?.edges?.some(({ node: v }) => v.availableForSale) || false,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

/**
 * Get products from a specific Shopify collection by handle
 * @param {string} handle - Collection handle (e.g., "women", "pets")
 * @param {number} first - Number of products to fetch (default: 50)
 * @returns {Promise<Array>} - Array of normalized product objects
 */
export async function getProductsByCollection(handle, first = 50) {
  const query = `
    query GetCollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id
        title
        handle
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              tags
              productType
              vendor
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  `;

  try {
    console.log(`🔍 Fetching products from collection "${handle}"...`);
    const data = await shopifyFetch(query, { handle, first });
    
    if (!data?.collection) {
      console.warn(`⚠️ Collection "${handle}" not found`);
      return [];
    }

    console.log('📦 COLLECTION DATA:', {
      title: data.collection.title,
      handle: data.collection.handle,
      productCount: data.collection.products.edges.length,
    });

    const products = [];
    const skippedProducts = [];
    
    for (const { node } of data.collection.products.edges) {
      try {
        // Filter: Skip products without images
        if (!node.images?.edges?.length) {
          skippedProducts.push({ title: node.title, reason: 'No images' });
          continue;
        }
        
        // Filter: Skip products without variants
        if (!node.variants?.edges?.length) {
          skippedProducts.push({ title: node.title, reason: 'No variants' });
          continue;
        }
        
        // Filter: Skip products where first variant has no ID
        const firstVariant = node.variants.edges[0]?.node;
        if (!firstVariant?.id) {
          skippedProducts.push({ title: node.title, reason: 'Variant ID missing' });
          continue;
        }
        
        const normalized = normalizeShopifyProduct(node);
        products.push(normalized);
      } catch (error) {
        skippedProducts.push({ title: node.title, reason: error.message });
      }
    }

    console.log(`✅ Collection "${handle}": ${products.length} valid products, ${skippedProducts.length} skipped`);
    
    if (skippedProducts.length > 0) {
      console.log('⚠️ Skipped products:', skippedProducts);
    }
    
    if (products.length > 0) {
      console.log('✅ First 3 products:', products.slice(0, 3).map(p => ({
        title: p.title,
        variantId: p.variantId,
        price: p.price,
      })));
    }
    
    return products;
  } catch (error) {
    console.error(`❌ Error fetching collection "${handle}":`, error);
    return [];
  }
}

/**
 * Get products filtered by product type
 * @param {string} productType - Product type to filter by (e.g., "Woman", "Pet", "Home", "Health/Beauty", "Watch")
 * @param {number} first - Number of products to fetch (default: 50)
 * @returns {Promise<Array>} - Array of normalized product objects
 */
export async function getProductsByType(productType, first = 50) {
  // Build the query filter for product_type
  const queryFilter = `product_type:"${productType}"`;
  
  const query = `
    query GetProductsByType($query: String!, $first: Int!) {
      products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            tags
            vendor
            createdAt
            updatedAt
          }
        }
      }
    }
  `;

  try {
    console.log(`🔍 Fetching products with product_type="${productType}"...`);
    const data = await shopifyFetch(query, { query: queryFilter, first });
    
    if (!data?.products?.edges) {
      console.warn(`⚠️ No products found for product_type="${productType}"`);
      return [];
    }

    const totalEdges = data.products.edges.length;
    console.log(`📦 Found ${totalEdges} products for product_type="${productType}"`);
    
    console.log('📦 FILTERED PRODUCTS:', data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      productType: node.productType,
      hasImages: node.images?.edges?.length > 0,
      hasVariants: node.variants?.edges?.length > 0,
    })));

    const products = [];
    const skippedProducts = [];
    
    for (const { node } of data.products.edges) {
      try {
        // Filter: Skip products without images
        if (!node.images?.edges?.length) {
          skippedProducts.push({ title: node.title, reason: 'No images' });
          continue;
        }
        
        // Filter: Skip products without variants
        if (!node.variants?.edges?.length) {
          skippedProducts.push({ title: node.title, reason: 'No variants' });
          continue;
        }
        
        // Filter: Skip products where first variant has no ID
        const firstVariant = node.variants.edges[0]?.node;
        if (!firstVariant?.id) {
          skippedProducts.push({ title: node.title, reason: 'Variant ID missing' });
          continue;
        }
        
        const normalized = normalizeShopifyProduct(node);
        products.push(normalized);
      } catch (error) {
        skippedProducts.push({ title: node.title, reason: error.message });
      }
    }

    console.log(`✅ Product type "${productType}": ${products.length} valid products, ${skippedProducts.length} skipped`);
    
    if (skippedProducts.length > 0) {
      console.log('⚠️ Skipped products:', skippedProducts);
    }
    
    if (products.length > 0) {
      console.log('✅ First 3 products:', products.slice(0, 3).map(p => ({
        title: p.title,
        variantId: p.variantId,
        price: p.price,
        productType: p.productType,
      })));
    }
    
    return products;
  } catch (error) {
    console.error(`❌ Error fetching products by type "${productType}":`, error);
    return [];
  }
}

/**
 * Get all collections from Shopify
 * @param {number} first - Number of collections to fetch (default: 20)
 * @returns {Promise<Array>} - Array of collection objects
 */
export async function getCollections(first = 20) {
  const query = `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            productsCount
            updatedAt
          }
        }
      }
    }
  `;

  try {
    console.log(`🔍 Fetching ${first} collections...`);
    const data = await shopifyFetch(query, { first });
    
    if (!data?.collections?.edges) {
      console.warn('⚠️ No collections found');
      return [];
    }

    const collections = data.collections.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      productsCount: node.productsCount,
      updatedAt: node.updatedAt,
    }));

    console.log(`✅ Found ${collections.length} collections:`, collections.map(c => c.title));
    return collections;
  } catch (error) {
    console.error('❌ Error fetching collections:', error);
    return [];
  }
}

/**
 * Get products from Shopify Store
 * @param {number} first - Number of products to fetch (default: 50)
 * @returns {Promise<Array>} - Array of product objects
 */
export async function getProducts(first = 50) {
  // Updated query: Fetch newest products first, with proper filtering
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            tags
            productType
            vendor
            createdAt
            updatedAt
          }
        }
      }
    }
  `;

  try {
    console.log(`🔍 Fetching ${first} products from Shopify Storefront API...`);
    const data = await shopifyFetch(query, { first });
    
    if (!data?.products?.edges) {
      console.warn('⚠️ No products found in Shopify response');
      return [];
    }

    const totalEdges = data.products.edges.length;
    console.log(`📦 Shopify returned ${totalEdges} products`);
    console.log('📦 SHOPIFY PRODUCTS:', data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      hasImages: node.images?.edges?.length > 0,
      hasVariants: node.variants?.edges?.length > 0,
      productType: node.productType,
    })));

    // Transform and normalize Shopify data
    const products = [];
    const skippedProducts = [];
    
    for (const { node } of data.products.edges) {
      try {
        // Filter: Skip products without images
        if (!node.images?.edges?.length) {
          skippedProducts.push({ title: node.title, reason: 'No images' });
          console.log(`⏭️ Skipping "${node.title}" - No images`);
          continue;
        }
        
        // Filter: Skip products without variants
        if (!node.variants?.edges?.length) {
          skippedProducts.push({ title: node.title, reason: 'No variants' });
          console.log(`⏭️ Skipping "${node.title}" - No variants`);
          continue;
        }
        
        // Filter: Skip products where first variant has no ID
        const firstVariant = node.variants.edges[0]?.node;
        if (!firstVariant?.id) {
          skippedProducts.push({ title: node.title, reason: 'Variant ID missing' });
          console.log(`⏭️ Skipping "${node.title}" - Variant ID missing`);
          continue;
        }
        
        const normalized = normalizeShopifyProduct(node);
        products.push(normalized);
      } catch (error) {
        skippedProducts.push({ title: node.title, reason: error.message });
        console.error('❌ Skipping invalid product:', node.title, error.message);
      }
    }

    console.log(`✅ Successfully normalized ${products.length} products from Shopify`);
    if (skippedProducts.length > 0) {
      console.log(`⚠️ Skipped ${skippedProducts.length} invalid products:`, skippedProducts);
    }
    
    // Log first few valid products
    if (products.length > 0) {
      console.log('✅ First 3 valid products:', products.slice(0, 3).map(p => ({
        title: p.title,
        variantId: p.variantId,
        price: p.price,
        category: p.productType,
      })));
    }
    
    return products;
  } catch (error) {
    console.error('❌ Error fetching products from Shopify:', error);
    return [];
  }
}

/**
 * Get a single product by handle
 * @param {string} handle - Product handle (slug)
 * @returns {Promise<object|null>} - Product object or null
 */
export async function getProductByHandle(handle) {
  const query = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        tags
        productType
        vendor
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { handle });
    
    if (!data?.product) {
      console.warn(`Product with handle "${handle}" not found`);
      return null;
    }

    const node = data.product;
    const firstImage = node.images.edges[0]?.node;
    const firstVariant = node.variants.edges[0]?.node;
    const price = firstVariant?.price?.amount || node.priceRange.minVariantPrice.amount;

    return {
      id: node.id,
      shopifyId: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      image: firstImage?.url || '/placeholder.jpg',
      images: node.images.edges.map(({ node: img }) => ({
        url: img.url,
        altText: img.altText,
        width: img.width,
        height: img.height,
      })),
      price: parseFloat(price),
      priceFormatted: `$${parseFloat(price).toFixed(2)}`,
      variantId: firstVariant?.id || null,
      variants: node.variants.edges.map(({ node: v }) => ({
        id: v.id,
        title: v.title,
        price: parseFloat(v.price?.amount || 0),
        available: v.availableForSale,
        compareAtPrice: v.compareAtPrice?.amount ? parseFloat(v.compareAtPrice.amount) : null,
      })),
      minPrice: parseFloat(node.priceRange.minVariantPrice.amount),
      maxPrice: parseFloat(node.priceRange.maxVariantPrice.amount),
      tags: node.tags || [],
      productType: node.productType,
      vendor: node.vendor,
      availableForSale: node.variants.edges.some(({ node: v }) => v.availableForSale),
    };
  } catch (error) {
    console.error(`Error fetching product "${handle}" from Shopify:`, error);
    return null;
  }
}

/**
 * Get product by ID
 * @param {string} id - Shopify product ID
 * @returns {Promise<object|null>} - Product object or null
 */
export async function getProductById(id) {
  const query = `
    query GetProduct($id: ID!) {
      node(id: $id) {
        ... on Product {
          id
          title
          handle
          description
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { id });
    
    if (!data?.node) {
      console.warn(`Product with ID "${id}" not found`);
      return null;
    }

    const node = data.node;
    const firstImage = node.images.edges[0]?.node;
    const firstVariant = node.variants.edges[0]?.node;
    const price = firstVariant?.price?.amount || node.priceRange.minVariantPrice.amount;

    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      image: firstImage?.url || '/placeholder.jpg',
      price: parseFloat(price),
      variantId: firstVariant?.id || null,
      variants: node.variants.edges.map(({ node: v }) => ({
        id: v.id,
        title: v.title,
        price: parseFloat(v.price?.amount || 0),
        available: v.availableForSale,
      })),
    };
  } catch (error) {
    console.error(`Error fetching product "${id}" from Shopify:`, error);
    return null;
  }
}

/**
 * Create a cart
 * @returns {Promise<object|null>} - Cart object
 */
export async function createCart() {
  const query = `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          createdAt
          updatedAt
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { input: {} });
    return data?.cartCreate?.cart || null;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

/**
 * Add item to cart
 * @param {string} cartId - Cart ID
 * @param {string} merchandiseId - Variant ID
 * @param {number} quantity - Quantity
 * @returns {Promise<object|null>} - Updated cart
 */
export async function addToCart(cartId, merchandiseId, quantity = 1) {
  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, {
      cartId,
      lines: [{ merchandiseId, quantity }],
    });
    return data?.cartLinesAdd?.cart || null;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

export default {
  shopifyFetch,
  getProducts,
  getProductsByType,
  getProductsByCollection,
  getCollections,
  getProductByHandle,
  getProductById,
  normalizeShopifyProduct,
  createCart,
  addToCart,
};
