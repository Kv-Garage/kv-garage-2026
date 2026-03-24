import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { calculatePrice } from "../../lib/pricing";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabase";

export default function ProductPage({ profile }) {
  const router = useRouter();
  const { slug } = router.query;

  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  // 🔥 UPSSELL (ADDED ONLY)
  const [upsellProducts, setUpsellProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [bundleSelected, setBundleSelected] = useState([]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        console.log("Product not found");
        return;
      }

      // 🔥 SAFE VARIANT QUERY
      let v = [];
      if (data && data.id) {
        const { data: variants } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", data.id);
        v = variants || [];
      }

      // 🔥 UPSSELL FETCH (ADDED)
      const { data: upsells } = await supabase
        .from("products")
        .select("*")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(3);

      setUpsellProducts(upsells || []);

      setProduct(data);
      setVariants(v || []);

      // 🔥 FIX: Use standardized images array
      const productImages = data.images || [data.image].filter(Boolean);
      
      if (v?.length > 0) {
        setSelectedVariant(v[0]);
        setSelectedImage(v[0].image || productImages[0]);
      } else {
        setSelectedImage(productImages[0]);
      }

      // 🔥 FETCH REVIEWS
      if (data.cj_product_id) {
        fetchReviews(data.cj_product_id);
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
  }, [slug]);

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

  const basePrice = product.price || product.cost * 2;

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
      name: product.name,
      price: pricePerUnit,
      quantity,
      image: selectedImage,
    });

    setAddedMessage("Added to cart");
    setTimeout(() => setAddedMessage(""), 2000);
  };

  // 🔥 BUNDLE ADD (ADDED)
  const handleBundleAdd = () => {
    handleAddToCart();

    bundleSelected.forEach((p) => {
      addToCart({
        name: p.name,
        price: p.price,
        quantity: 1,
        image: p.image,
      });
    });

    setAddedMessage("Bundle added to cart");
  };

  return (
    <>
      <Head>
        <title>{product.name} | KV Garage</title>
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
                  />
                )}
              </div>

              {/* THUMBNAIL GALLERY */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {(product.images || [product.image].filter(Boolean)).map((img, i) => (
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
                  />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN - PRODUCT INFO */}
            <div className="space-y-6">

              {/* PRODUCT TITLE */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

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
                    ${Number(pricePerUnit).toFixed(2)}
                  </span>
                  <span className="text-gray-500">per unit</span>
                </div>
                {quantity > 1 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Total: <span className="font-semibold">${Number(totalPrice).toFixed(2)}</span>
                  </div>
                )}
              </div>

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
          {console.log("DESCRIPTION VALUE:", product.description)}
          <div className="border-t pt-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Product Details</h2>
            <div
              className="mt-6 space-y-4 text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: product.description || (
                  product.type === "manual" ? `<h2>Luxury Moissanite Iced Out Watch</h2>

<p>
This moissanite watch showcases an exquisite fully iced-out design with precision-set stones 
that deliver maximum brilliance and shine. Built for statement wear, this timepiece is perfect 
for formal events, luxury styling, and high-end street fashion.
</p>

<h3>Premium Build Quality</h3>
<ul>
  <li>High-grade stainless steel construction</li>
  <li>Scratch-resistant sapphire crystal glass</li>
  <li>Hand-set moissanite stones with honeycomb setting</li>
  <li>Durable, long-lasting shine and structure</li>
</ul>

<h3>Specifications</h3>
<ul>
  <li><strong>Movement:</strong> Mechanical Automatic</li>
  <li><strong>Material:</strong> Stainless Steel</li>
  <li><strong>Glass:</strong> Sapphire Crystal</li>
  <li><strong>Water Resistance:</strong> 100M</li>
  <li><strong>Clasp:</strong> Folding Buckle</li>
</ul>

<h3>Why Choose This Watch</h3>
<ul>
  <li>Passes diamond tester (moissanite stones)</li>
  <li>Luxury appearance without inflated pricing</li>
  <li>Perfect for resale or personal collection</li>
</ul>

<p>
We focus on quality over cheap pricing. Every piece is crafted to meet high standards. 
Contact us for bulk orders or customization.
</p>` : ''
                )
              }}
            />
          </div>

          {/* 🌟 REVIEWS SECTION */}
          {product.cj_product_id && (
            <div className="border-t pt-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Customer Reviews</h2>
              
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
                  No reviews yet for this product.
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}