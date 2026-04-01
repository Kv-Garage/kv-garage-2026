/**
 * Shopify Product Demo Page
 * 
 * This page demonstrates the Shopify-integrated product page system with:
 * - Custom pricing based on user type (guest/student/wholesale)
 * - Local image gallery
 * - Shopify Buy Button for checkout only
 * - Test controls for switching user types
 * 
 * Access these demo products:
 * - /shop/demo/demo-luxury-watch
 * - /shop/demo/demo-leather-messenger-bag
 * - /shop/demo/demo-portable-camp-grill
 */

import { useRouter } from "next/router";
import productsData from "../../../data/products.json";
import SimpleProductPage from "../../../components/product/SimpleProductPage";

export default function DemoProductPage({ product }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The demo product you're looking for doesn't exist.</p>
          <a href="/shop" className="text-orange-500 hover:text-orange-600 underline">
            Browse all products
          </a>
        </div>
      </div>
    );
  }

  return <SimpleProductPage product={product} />;
}

// Generate static paths for all demo products
export async function getStaticPaths() {
  const paths = productsData.products.map((product) => ({
    params: { slug: product.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

// Get product data at build time
export async function getStaticProps({ params }) {
  const product = productsData.products.find(
    (p) => p.slug === params.slug
  );

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
  };
}