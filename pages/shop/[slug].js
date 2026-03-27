import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { calculatePrice } from "../../lib/pricing";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabase";
import { getPrimaryProductImage, getProductImageArray } from "../../lib/productFields";
import { buildCanonicalUrl, buildProductDescription, stripHtml } from "../../lib/seo";
import GoogleReviews from "../../components/GoogleReviews";

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ProductPage({ profile }) {
  const router = useRouter();
  const { slug } = router.query;

  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pricingPreview, setPricingPreview] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  // 🔥 UPSSELL (ADDED ONLY)
  const [upsellProducts, setUpsellProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [bundleSelected, setBundleSelected] = useState([]);

  const getProductImages = (record) => {
    return getProductImageArray(record);
  };

  const getAdaptiveVariants = (record, tableVariants) => {
    if (Array.isArray(tableVariants) && tableVariants.length > 0) {
      return tableVariants;
    }

    if (Array.isArray(record?.variants) && record.variants.length > 0) {
      return record.variants.map((variant) => ({
        id: variant.id || variant.vid || variant.sku,
        option1: variant.name || variant.variantName || variant.option1 || variant.sku,
        option2: variant.option2 || null,
        image: variant.image || variant.variantImage || null,
        cost: variant.supplier_cost || variant.cost || null,
        price: variant.price || null,
        sku: variant.sku || null,
      }));
    }

    return [];
  };

  // SWR fetcher function
  const fetcher = async (url) => {
    const response = await fetch(url, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  };

  // SWR hook for product data with revalidation
  const { data: productData, error: productError, mutate } = useSWR(
    slug ? `/api/public-products?slug=${encodeURIComponent(slug)}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 2000,
    }
  );

  // SWR hook for upsell products
  const { data: upsellData } = useSWR(
    productData?.product?.category 
      ? `/api/public-products?category=${encodeURIComponent(productData.product.category || "")}&limit=12`
      : null,
    fetcher
  );

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      if (productData?.product) {
        const data = productData.product;

        // 🔥 SAFE VARIANT QUERY
        let v = [];
        if (data && data.id) {
          const { data: variants } = await supabase
            .from("product_variants")
            .select("id,option1,option2,image,price,sku")
            .eq("product_id", data.id);
          v = variants || [];
        }

        const adaptiveVariants = getAdaptiveVariants(data, v || []);
        const productImages = getProductImages(data);

        setProduct(data);
        setVariants(adaptiveVariants);

        if (adaptiveVariants?.length > 0) {
          setSelectedVariant(adaptiveVariants[0]);
          setSelectedImage(adaptiveVariants[0].image || productImages[0]);
        } else {
          setSelectedImage(productImages[0]);
        }

        // 🔥 FETCH REVIEWS
        if (data.cj_product_id) {
          fetchReviews(data.cj_product_id);
        }

        try {
          const existing = JSON.parse(localStorage.getItem("recentlyViewedProducts") || "[]");
          const next = [
            {
              id: data.id,
              slug: data.slug,
              name: data.name,
              image: getPrimaryProductImage(data),
              price: data.price,
            },
            ...existing.filter((item) => item.id !== data.id),
          ].slice(0, 10);

          localStorage.setItem("recentlyViewedProducts", JSON.stringify(next));
        } catch (storageError) {
          console.error("Recently viewed tracking failed:", storageError);
        }
      }
    };

    const fetchReviews = async (pid) => {
      setLoadingReviews(true);
      try {
        const res = await fetch(`/api/cj-reviews?pid=${pid}`);
        const data = await res.json();
        
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchData();
  }, [slug, productData]);

  // Update upsell products when product data changes
  useEffect(() => {
    if (upsellData?.products) {
      const currentProductId = productData?.product?.id;
      setUpsellProducts((upsellData.products || []).filter((item) => item.id !== currentProductId).slice(0, 3));
    }
  }, [upsellData, productData]);

  useEffect(() => {
    if (!product?.id) return;

    const loadPricing = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      try {
        const response = await fetch("/api/price-preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
          }),
        });

        const payload = await response.json();
        if (response.ok) {
          setPricingPreview(payload);
        }
      } catch (error) {
        console.error("Price preview failed:", error);
      }
    };

    loadPricing();
  }, [product?.id, quantity]);

  // Function to manually revalidate product data
  const revalidateProduct = () => {
    if (slug) {
      mutate();
    }
  };

  useEffect(() => {
    if (!product?.id) return;

    const trackProductView = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();

        await fetch("/api/traffic-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: authData?.user?.id || null,
            page: `product:${product.id}`,
            event_type: "product_view",
          }),
        });
      } catch (error) {
        console.error("Product view tracking failed:", error);
      }
    };

    trackProductView();
  }, [product?.id]);

  if (!product) {
    return (
      <main className="bg-white text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/shop" className="text-sm mb-6 inline-block hover:underline text-blue-600">
            ← Back to Shop
          </Link>
          
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/shop"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 🔥 CART TOTAL
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const role = profile?.role || "retail";
  const approved = profile?.approved || false;

  const activeCost =
    selectedVariant?.cost || product.cost || product.price;

  const basePrice = pricingPreview?.display_price || product.retail_price || product.price || product.cost * 2;
  const productImages = getProductImages(product);
  const showThumbnailRow = productImages.length > 1;
  const showComparePrice =
    product.compare_price && Number(product.compare_price) > Number(pricePerUnit || 0);
  const descriptionHtml = typeof product.description === "string" ? product.description.trim() : "";
  const displaySku = selectedVariant?.sku || product.sku || null;

  // 🔥 CUSTOM PRICING SYSTEM
let pricePerUnit;

// MANUAL PRODUCTS (WATCHES)
if (product.type === "manual") {

  if (role === "retail") {
    if (quantity >= 10) pricePerUnit = 125;
    else if (quantity >= 4) pricePerUnit = 150;
    else pricePerUnit = 200;
  }

  if (role === "student") {
    if (quantity < 4) {
      pricePerUnit = 150; // still show price, MOQ handled separately
    } else if (quantity >= 10) {
      pricePerUnit = 125;
    } else {
      pricePerUnit = 150;
    }
  }

  if (role === "wholesale") {
    if (quantity < 10) {
      pricePerUnit = 125; // show price, MOQ handled separately
    } else {
      pricePerUnit = 125;
    }
  }

} else {
  // EXISTING SYSTEM (DO NOT CHANGE)
  const shouldDiscount =
    quantity > 1 || cartTotal >= 100 || role !== "retail";

  pricePerUnit = shouldDiscount
    ? calculatePrice({
        cost: activeCost,
        quantity,
        role,
        approved,
        cartTotal,
      })
    : basePrice;
}

if (pricingPreview?.display_price) {
  pricePerUnit = pricingPreview.display_price;
}

const totalPrice = pricePerUnit * quantity;

  // 🔥 MOQ ENFORCEMENT FOR MANUAL PRODUCTS
  let minQty = 1;
  if (product.type === "manual") {
    if (role === "student") minQty = 4;
    if (role === "wholesale") minQty = 10;
  }

  // 🔥 TIERS SYSTEM (UNCHANGED)
  const tiers = [100, 250, 500];
  const nextTier = tiers.find(t => cartTotal < t);
  const amountToNext = nextTier
    ? (nextTier - cartTotal).toFixed(2)
    : null;

  // 🔥 VARIANTS
  const sizes = [...new Set(variants.map(v => v.option1).filter(Boolean))];
  const colors = [...new Set(variants.map(v => v.option2).filter(Boolean))];

  const selectVariant = (type, value) => {
    let found;

    if (type === "size") {
      found = variants.find(v => v.option1 === value);
    }

    if (type === "color") {
      found = variants.find(v => v.option2 === value);
    }

    if (found) {
      setSelectedVariant(found);
      setSelectedImage(found.image);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: pricingPreview?.display_price || pricePerUnit,
      quantity,
      image: selectedImage,
      category: product.category || "general",
    });

    setAddedMessage("Added to cart");
    setTimeout(() => setAddedMessage(""), 2000);
  };

  // 🔥 BUNDLE ADD (ADDED)
  const handleBundleAdd = () => {
    handleAddToCart();

    bundleSelected.forEach((p) => {
      addToCart({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: 1,
        image: p.image,
        category: p.category || "general",
      });
    });

    setAddedMessage("Bundle added to cart");
  };

  return (
    <>
      <Head>
        <title>{product.meta_title || `${product.name} | Buy Wholesale or Retail — KV Garage`}</title>
        <meta name="description" content={product.meta_description || buildProductDescription(product)} />
        <link rel="canonical" href={buildCanonicalUrl(`/shop/${product.slug || product.id}`)} />
        <meta property="og:title" content={product.meta_title || `${product.name} | Buy Wholesale or Retail — KV Garage`} />
        <meta property="og:description" content={product.meta_description || buildProductDescription(product)} />
        <meta property="og:image" content={getPrimaryProductImage(product)} />
        <meta property="og:url" content={buildCanonicalUrl(`/shop/${product.slug || product.id}`)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.meta_title || `${product.name} | Buy Wholesale or Retail — KV Garage`} />
        <meta name="twitter:description" content={product.meta_description || buildProductDescription(product)} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: productImages,
              description: stripHtml(product.description || ""),
              sku: displaySku || undefined,
              offers: {
                "@type": "Offer",
                availability:
                  Number(product.inventory_count || 0) > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                priceCurrency: "USD",
                price: Number(pricePerUnit || product.price || 0).toFixed(2),
                url: buildCanonicalUrl(`/shop/${product.slug || product.id}`),
              },
            }),
          }}
        />
      </Head>

      <main className="bg-white text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <Link href="/shop" className="text-sm mb-6 inline-block hover:underline text-blue-600">
            ← Back to Shop
          </Link>

          {/* 🏪 AMAZON-STYLE 2-COLUMN LAYOUT */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">

            {/* LEFT COLUMN - IMAGE GALLERY */}
            <div>
              {/* MAIN PRODUCT IMAGE */}
              <div className="bg-gray-50 h-[500px] flex items-center justify-center rounded-lg mb-4 border border-gray-200">
                {selectedImage && (
                  <img 
                    src={selectedImage} 
                    className="h-full w-full object-contain rounded-lg"
                    alt={product.name}
                    loading="lazy"
                  />
                )}
              </div>

              {/* THUMBNAIL GALLERY */}
              {showThumbnailRow && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 object-cover border-2 rounded cursor-pointer transition-all ${
                      selectedImage === img 
                        ? 'border-orange-500 shadow-md' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    alt={`Product image ${i + 1}`}
                    loading="lazy"
                  />
                ))}
              </div>
              )}
            </div>

            {/* RIGHT COLUMN - PRODUCT INFO */}
            <div className="space-y-6">

              {/* PRODUCT TITLE */}
              <div className="space-y-3">
                {product.top_pick === true && (
                  <span className="inline-flex rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6800]">
                    Top Pick
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* RATING & SALES */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <span className="text-yellow-500">★★★★☆</span>
                  <span className="ml-2 text-gray-600">4.7</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">2,100+ sold</span>
                <span className="text-gray-400">|</span>
                <span className="text-green-600 font-medium">In Stock</span>
              </div>

              {/* PRICE */}
              <div className="border-b pb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${Number(pricingPreview?.display_price || pricePerUnit).toFixed(2)}
                  </span>
                  <span className="text-gray-500">per unit</span>
                  {showComparePrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${Number(product.compare_price).toFixed(2)}
                    </span>
                  )}
                </div>
                {quantity > 1 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Total: <span className="font-semibold">${Number(totalPrice).toFixed(2)}</span>
                  </div>
                )}
                {pricingPreview?.note ? (
                  <div className="mt-2 text-sm font-medium text-[#B78B16]">{pricingPreview.note}</div>
                ) : null}
              </div>

              {variants.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Variant</label>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id || variant.sku || variant.option1}
                        onClick={() => {
                          setSelectedVariant(variant);
                          if (variant.image) setSelectedImage(variant.image);
                        }}
                        className={`rounded-lg border px-4 py-2 text-sm transition ${
                          selectedVariant?.id === variant.id
                            ? "border-black bg-black text-white"
                            : "border-gray-300 text-gray-700 hover:border-black"
                        }`}
                      >
                        {variant.option1 || variant.name || variant.sku || "Variant"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {displaySku && (
                <div className="text-sm text-gray-500">
                  SKU: <span className="font-medium text-gray-700">{displaySku}</span>
                </div>
              )}

              {product.type === "manual" && (
                <div className="mt-4 text-xs text-gray-600">
                  <p>Buy 4+ units → $150 each</p>
                  <p>Buy 10+ units → $125 each</p>
                </div>
              )}

              {product.type === "manual" && (
                <div className="mt-4 text-sm border rounded-lg p-4 bg-gray-50">
                  <p className="font-semibold mb-2">Volume Pricing</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>1–3 units: $200 each</li>
                    <li>4–9 units: $150 each</li>
                    <li>10+ units: $125 each</li>
                  </ul>

                  {role === "retail" && (
                    <p className="mt-3 text-xs text-gray-500">
                      Create an account to unlock reseller pricing.
                    </p>
                  )}

                  {role === "student" && (
                    <p className="mt-3 text-xs text-gray-500">
                      Reseller pricing active. Minimum order: 4 units.
                    </p>
                  )}

                  {role === "wholesale" && (
                    <p className="mt-3 text-xs text-gray-500">
                      Wholesale pricing active. Minimum order: 10 units.
                    </p>
                  )}
                </div>
              )}

              {/* QUANTITY SELECTOR */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-10 text-center border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 🔥 BUY BUTTONS WITH MOQ ENFORCEMENT */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={quantity < minQty}
                  className={`w-full py-4 px-6 font-semibold text-lg rounded-lg shadow-md transition-colors ${
                    quantity < minQty
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {quantity < minQty ? `Minimum order: ${minQty}` : "Add to Cart"}
                </button>
                
                <button
                  onClick={() => router.push('/cart')}
                  disabled={quantity < minQty}
                  className={`w-full py-4 px-6 font-semibold text-lg rounded-lg shadow-md transition-colors ${
                    quantity < minQty
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black"
                  }`}
                >
                  {quantity < minQty ? `Minimum order: ${minQty}` : "Buy Now"}
                </button>
              </div>

              {pricingPreview?.volume_pricing?.length ? (
                <div className="rounded-lg border bg-gray-50 p-4">
                  <p className="mb-3 text-sm font-semibold text-gray-800">Wholesale Volume Pricing</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    {pricingPreview.volume_pricing.map((row) => (
                      <div key={row.range} className="flex items-center justify-between">
                        <span>{row.range}</span>
                        <span>
                          ${Number(row.price || 0).toFixed(2)} {row.note ? `(${row.note})` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* 🔥 TRUST BADGES */}
              <div className="border-t pt-6 mt-6">
                <div className="flex justify-around text-center">
                  <div className="text-center">
                    <div className="text-green-600 text-xl mb-1">🔒</div>
                    <div className="text-xs text-gray-600">Secure Checkout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-600 text-xl mb-1">🚚</div>
                    <div className="text-xs text-gray-600">Fast Shipping</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-600 text-xl mb-1">✓</div>
                    <div className="text-xs text-gray-600">Verified Supplier</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* PRODUCT DETAILS SECTION */}
          {descriptionHtml && (
          <div className="border-t pt-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Product Details</h2>
            {descriptionHtml.includes("<") ? (
              <div
                className="mt-6 space-y-4 text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              <div className="mt-6 space-y-4 text-sm text-gray-700 leading-relaxed">
                {descriptionHtml.split(/\n+/).filter(Boolean).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
          )}

          {/* 🌟 REVIEWS SECTION */}
          <div className="border-t pt-12">
            <GoogleReviews productId={product.id} />
          </div>

          {/* Cj REVIEWS SECTION (if available) */}
          {product.cj_product_id && (
            <div className="border-t pt-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Additional Reviews</h2>
              
              {loadingReviews ? (
                <div className="text-center py-8 text-gray-500">
                  Loading reviews...
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      
                      {/* STAR RATING */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < review.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>

                      {/* REVIEW CONTENT */}
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {review.comment}
                      </p>

                      {/* REVIEW META */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            {review.author}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        {review.helpful > 0 && (
                          <span>
                            {review.helpful} found helpful
                          </span>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No additional reviews yet for this product.
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
