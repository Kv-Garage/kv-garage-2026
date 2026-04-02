import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { PUBLIC_PRODUCT_FIELDS, getPrimaryProductImage } from "../lib/productFields";
import CartDisclaimerBanner from "../components/product/CartDisclaimerBanner";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateQuantity,
    addToCart,
  } = useCart();

  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [pricingMap, setPricingMap] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchProfile();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select(PUBLIC_PRODUCT_FIELDS)
      .or("is_active.eq.true,is_active.is.null")
      .limit(4);

    setProducts(data || []);
  };

  const fetchProfile = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user?.id) return;

    const { data } = await supabase
      .from("profiles")
      .select("role,approved")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(data || null);
  };

  useEffect(() => {
    const loadPricing = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      const nextPricing = {};

      for (const item of cart) {
        try {
          // Skip pricing API call for Shopify products - use item.price directly
          if (item.shopifyId || (typeof item.id === 'string' && (item.id.startsWith('shopify_') || item.id.includes('gid://shopify')))) {
            nextPricing[item.id] = {
              display_price: item.price || 0,
              price: item.price || 0,
            };
            continue;
          }

          const response = await fetch("/api/price-preview", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              productId: item.id,
              quantity: item.quantity,
            }),
          });

          const payload = await response.json();
          if (response.ok) {
            nextPricing[item.id] = payload;
          }
        } catch (error) {
          console.error("Cart pricing failed:", error);
        }
      }

      setPricingMap(nextPricing);
    };

    if (cart.length > 0) {
      loadPricing();
    } else {
      setPricingMap({});
    }
  }, [cart]);

  // Calculate cart total before discounts
  const cartTotal = cart.reduce(
    (total, item) => total + Number(pricingMap[item.id]?.display_price || item.price || 0) * item.quantity,
    0
  );

  // Calculate cart-based discount percentage
  let cartDiscountPercent = 0;
  let discountType = null;
  
  if (cartTotal >= 1000) {
    cartDiscountPercent = 20;
    discountType = 'cart-total';
  } else if (cartTotal >= 500) {
    cartDiscountPercent = 15;
    discountType = 'cart-total';
  } else if (cartTotal >= 250) {
    cartDiscountPercent = 10;
    discountType = 'cart-total';
  } else if (cartTotal >= 100) {
    cartDiscountPercent = 5;
    discountType = 'cart-total';
  }

  // Check for per-item volume discounts
  // Volume discount tiers: 4+ units (5% off), 10+ units (10% off), 25+ units (15% off)
  let totalVolumeDiscount = 0;
  const volumeDiscountItems = [];
  
  cart.forEach(item => {
    const itemTotal = Number(pricingMap[item.id]?.display_price || item.price || 0) * item.quantity;
    let itemVolumePercent = 0;
    
    if (item.quantity >= 25) {
      itemVolumePercent = 15;
    } else if (item.quantity >= 10) {
      itemVolumePercent = 10;
    } else if (item.quantity >= 4) {
      itemVolumePercent = 5;
    }
    
    if (itemVolumePercent > 0) {
      const itemDiscount = itemTotal * (itemVolumePercent / 100);
      totalVolumeDiscount += itemDiscount;
      volumeDiscountItems.push({
        name: item.name,
        quantity: item.quantity,
        discountPercent: itemVolumePercent,
        discountAmount: itemDiscount
      });
    }
  });
  
  // Use the higher of cart total discount or sum of item volume discounts
  const cartDiscountAmount = cartTotal * (cartDiscountPercent / 100);
  const bestDiscountAmount = Math.max(cartDiscountAmount, totalVolumeDiscount);
  const bestDiscountType = totalVolumeDiscount >= cartDiscountAmount ? 'volume' : (cartDiscountPercent > 0 ? 'cart-total' : null);
  const totalDiscountPercent = cartTotal > 0 ? Math.round((bestDiscountAmount / cartTotal) * 100) : 0;

  // Calculate final price with best discount
  const totalPrice = cartTotal - bestDiscountAmount;

  const getInventoryCount = (item) => {
    const raw =
      item?.inventory_count ??
      item?.inventory ??
      item?.stock ??
      item?.quantity_available ??
      item?.available_quantity;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const getUrgencyText = (item) => {
    const inventory = getInventoryCount(item);
    if (inventory != null && inventory < 10) return `Only ${inventory} left in stock`;
    return "High demand";
  };

  // 🔥 TIERS
  const tiers = [100, 250, 500];
  const nextTier = tiers.find(t => totalPrice < t);
  const amountToNext = nextTier ? (nextTier - totalPrice).toFixed(2) : null;

  // 🔥 BULK TRIGGER
  const bulkMode =
    totalPrice >= 100 ||
    cart.some(item => item.quantity >= 3);

  // 🔥 PROFIT (ONLY IF BULK)
  const estimatedRevenue = totalPrice * 2;
  const estimatedProfit = estimatedRevenue - totalPrice;

  // 🔥 CHECKOUT HANDLER - Routes to Shopify or Stripe based on cart contents
  const handleCheckout = async () => {
    console.log("🔷 Checkout button clicked");
    
    if (cart.length === 0) {
      setCheckoutError("Your cart is empty. Add items to continue.");
      return;
    }

    if (checkoutLoading) {
      console.log("⏳ Checkout already in progress");
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError("");
      
      console.log("🔍 Cart items:", cart);
      console.log("🔍 Pricing map:", pricingMap);
      console.log("🔍 Total price:", totalPrice);

      // Determine which checkout to use based on cart contents
      // Shopify items have shopifyId OR id starts with 'shopify_' OR id contains 'gid://shopify'
      const shopifyCartItems = cart.filter(item => {
        if (item.shopifyId) return true;
        if (typeof item.id === 'string' && (item.id.startsWith('shopify_') || item.id.includes('gid://shopify'))) {
          return true;
        }
        return false;
      });
      const stripeCartItems = cart.filter(item => !shopifyCartItems.includes(item));

      console.log(`📦 Shopify items: ${shopifyCartItems.length}, Stripe items: ${stripeCartItems.length}`);
      console.log('🔍 Cart items:', cart.map(item => ({ id: item.id, shopifyId: item.shopifyId, isShopify: shopifyCartItems.includes(item) })));

      // If cart has ONLY Shopify items, use Shopify checkout
      if (shopifyCartItems.length > 0 && stripeCartItems.length === 0) {
        console.log("🛍️ Using Shopify checkout");
        
        // Calculate per-item discounts for Shopify items
        const shopifySubtotal = shopifyCartItems.reduce((total, item) => 
          total + Number(pricingMap[item.id]?.display_price || item.price || 0) * item.quantity, 0);
        
        // Calculate volume discounts for Shopify items
        let shopifyVolumeDiscount = 0;
        shopifyCartItems.forEach(item => {
          const itemTotal = Number(pricingMap[item.id]?.display_price || item.price || 0) * item.quantity;
          let itemVolumePercent = 0;
          if (item.quantity >= 25) itemVolumePercent = 15;
          else if (item.quantity >= 10) itemVolumePercent = 10;
          else if (item.quantity >= 4) itemVolumePercent = 5;
          if (itemVolumePercent > 0) {
            shopifyVolumeDiscount += itemTotal * (itemVolumePercent / 100);
          }
        });
        
        // Calculate cart total discount for Shopify items
        let shopifyCartDiscountPercent = 0;
        if (shopifySubtotal >= 1000) shopifyCartDiscountPercent = 20;
        else if (shopifySubtotal >= 500) shopifyCartDiscountPercent = 15;
        else if (shopifySubtotal >= 250) shopifyCartDiscountPercent = 10;
        else if (shopifySubtotal >= 100) shopifyCartDiscountPercent = 5;
        
        const shopifyCartDiscountAmount = shopifySubtotal * (shopifyCartDiscountPercent / 100);
        const shopifyBestDiscount = Math.max(shopifyVolumeDiscount, shopifyCartDiscountAmount);
        
        // Apply discount proportionally to each item's price
        const discountRatio = shopifySubtotal > 0 ? shopifyBestDiscount / shopifySubtotal : 0;
        
        const shopifyPayload = {
          cartItems: shopifyCartItems.map(item => {
            // CRITICAL: Ensure we have the variant ID, not product ID
            const variantId = item.shopifyVariantId || item.variantId;
            const basePrice = Number(pricingMap[item.id]?.display_price || item.price || 0);
            
            // Apply discount to the price
            const discountedPrice = basePrice * (1 - discountRatio);
            
            console.log('🔍 Preparing Shopify item for checkout:', {
              name: item.name,
              id: item.id,
              shopifyId: item.shopifyId,
              shopifyVariantId: item.shopifyVariantId,
              variantId: item.variantId,
              finalVariantId: variantId,
              hasVariantId: !!variantId,
              basePrice,
              discountedPrice,
              discountRatio
            });
            
            // Format variant ID for Shopify API (must be full GraphQL ID)
            let formattedVariantId = variantId;
            if (variantId && !variantId.startsWith('gid://shopify/ProductVariant/')) {
              // If it's just an ID number, we need to fetch the full variant ID
              // For now, pass through and let the API handle it
              console.warn('⚠️ Variant ID may not be in correct format:', variantId);
            }
            
            return {
              id: item.id,
              shopifyId: item.shopifyId || (typeof item.id === 'string' ? item.id.replace('shopify_', '') : null),
              shopifyVariantId: formattedVariantId,
              variantId: formattedVariantId, // Also include as variantId for fallback
              name: item.name,
              quantity: item.quantity,
              image: item.image,
              price: discountedPrice, // Use discounted price
              originalPrice: basePrice, // Keep original for reference
              discountApplied: discountRatio > 0 ? Math.round(discountRatio * 100) : 0,
            };
          }),
          discountPercent: Math.round(discountRatio * 100),
          discountAmount: shopifyBestDiscount,
          subtotal: shopifySubtotal,
          total: shopifySubtotal - shopifyBestDiscount,
        };
        
        console.log('📦 Shopify checkout payload:', JSON.stringify(shopifyPayload, null, 2));

        const res = await fetch("/api/create-shopify-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shopifyPayload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Shopify checkout error: ${res.status}`);
        }

        if (!data.url) {
          throw new Error("No checkout URL received from Shopify");
        }

        console.log("✅ Redirecting to Shopify checkout:", data.url);
        window.location.href = data.url;
        return;
      }

      // If cart has ONLY Stripe items or mixed items, use Stripe checkout
      console.log("💳 Using Stripe checkout");
      
      // Validate that all items have prices
      const itemsWithoutPrices = cart.filter(item => {
        const price = Number(pricingMap[item.id]?.display_price || item.price || 0);
        return price === 0;
      });

      if (itemsWithoutPrices.length > 0) {
        throw new Error("Unable to load prices. Please refresh the page and try again.");
      }

      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user || null;
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || null;

      const checkoutPayload = {
        cartItems: cart.map((item) => {
          const basePrice = Number(pricingMap[item.id]?.display_price || item.price || 0);
          // Apply discount proportionally
          const discountedPrice = basePrice * (1 - (cartTotal > 0 ? bestDiscountAmount / cartTotal : 0));
          return {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            image: item.image,
            price: discountedPrice,
            originalPrice: basePrice,
            discountApplied: cartTotal > 0 ? Math.round((bestDiscountAmount / cartTotal) * 100) : 0,
          };
        }),
        discountPercent: totalDiscountPercent,
        discountAmount: bestDiscountAmount,
        subtotal: cartTotal,
        total: Number(totalPrice.toFixed(2)),
        userId: currentUser?.id || null,
        customerEmail: currentUser?.email || null,
      };

      console.log("📤 Sending checkout payload:", checkoutPayload);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(checkoutPayload),
      });

      console.log("📥 Response status:", res.status);

      const data = await res.json();
      console.log("📥 Response data:", data);

      if (!res.ok) {
        const errorMsg = data.error || `Server error: ${res.status}`;
        throw new Error(errorMsg);
      }

      if (!data.url) {
        throw new Error("No checkout URL received. Please try again.");
      }

      console.log("✅ Redirecting to Stripe:", data.url);
      window.location.href = data.url;
      return;

    } catch (err) {
      console.error("❌ Checkout error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setCheckoutError(errorMessage);
      console.error("Full error details:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070D] text-white px-6 py-16">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Order Review
        </h1>

        {/* DEBUG INFO - Shows if checkout is ready */}
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg text-sm text-blue-300">
          <p>✓ Cart Items: {cart.length} | Total: ${totalPrice.toFixed(2)} | Prices Loaded: {Object.keys(pricingMap).length > 0 ? "Yes" : "Loading..."}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">

            {cart.length === 0 && (
              <div className="text-gray-400">
                Your cart is empty — start adding products below.
              </div>
            )}

            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-[#111827] border border-[#1C2233] rounded-xl p-6 flex gap-6 items-center"
              >

                <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden">
                  {item.image && (
                    <img src={item.image} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>

                <div className="flex-1">

                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-400">
                    ${Number(pricingMap[item.id]?.display_price || item.price || 0).toFixed(2)} per unit
                  </p>
                  {pricingMap[item.id]?.note ? (
                    <p className="text-xs text-[#D4AF37] mt-1">{pricingMap[item.id].note}</p>
                  ) : null}
                  <p className="text-xs text-[#D4AF37] mt-1">
                    {getUrgencyText(item)}
                  </p>

                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="bg-gray-700 px-3 py-1 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="bg-gray-700 px-3 py-1 rounded"
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-lg">
                    ${(Number(pricingMap[item.id]?.display_price || item.price || 0) * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-400 text-sm mt-2"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

            {/* ADD MORE */}
            <div className="mt-12">

              <h2 className="text-xl font-semibold mb-4">
                Add More to Your Order
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#111827] border border-[#1C2233] rounded-lg p-4"
                  >

                    <div className="bg-gray-700 h-24 mb-3 rounded overflow-hidden">
                      {getPrimaryProductImage(p) && (
                        <img src={getPrimaryProductImage(p)} className="w-full h-full object-cover" loading="lazy" alt={p.name} />
                      )}
                    </div>

                    <p className="text-sm font-medium">
                      {p.name}
                    </p>

                    <p className="text-xs text-gray-400 mb-2">
                      ${Number(p.price).toFixed(2)}
                    </p>

                    <button
                      onClick={() =>
                        addToCart({
                          name: p.name,
                          price: p.price,
                          quantity: 1,
                          image: getPrimaryProductImage(p),
                          id: p.id,
                          category: p.category || "general",
                        })
                      }
                      className="w-full bg-[#D4AF37] text-black py-1 rounded text-sm font-semibold"
                    >
                      Add
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div className="bg-[#111827] border border-[#1C2233] rounded-xl p-6">

              <h3 className="font-semibold mb-3">
                Pricing Progress
              </h3>

              {amountToNext ? (
                <p className="text-sm text-gray-300 mb-2">
                  Add <strong>${amountToNext}</strong> more to unlock better pricing
                </p>
              ) : (
                <p className="text-green-400 text-sm mb-2">
                  Highest pricing tier reached
                </p>
              )}

              <div className="text-xs text-gray-400 space-y-1">
                <p>$100+ → 5% off</p>
                <p>$250+ → 10% off</p>
                <p>$500+ → 15% off</p>
                <p>$1000+ → 20% off</p>
              </div>

            </div>

            {/* Discount Summary */}
            {bestDiscountType && totalDiscountPercent > 0 && (
              <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎉</span>
                  <h3 className="font-semibold text-green-400">Discount Applied!</h3>
                </div>
                
                {bestDiscountType === 'volume' && volumeDiscountItems.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-300 font-semibold">📦 Volume Discounts (Per Item):</p>
                    {volumeDiscountItems.map((vdi, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-white/5 p-2 rounded">
                        <span>{vdi.name.length > 30 ? vdi.name.substring(0, 30) + '...' : vdi.name} ({vdi.quantity} units)</span>
                        <span className="text-green-400">-{vdi.discountPercent}% (${vdi.discountAmount.toFixed(2)})</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {bestDiscountType === 'cart-total' && (
                  <p className="text-sm text-gray-300 mb-2">
                    💰 Cart Total Discount: {cartDiscountPercent}% off (Cart over $${cartTotal >= 1000 ? '1,000' : cartTotal >= 500 ? '500' : cartTotal >= 250 ? '250' : '100'})
                  </p>
                )}
                
                <div className="mt-4 space-y-2 border-t border-white/20 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount ({totalDiscountPercent}%):</span>
                    <span className="text-green-400">-${bestDiscountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-white/20 pt-2 mt-2">
                    <span>Total:</span>
                    <span className="text-[#D4AF37]">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Volume Discount Progress for Each Item */}
            {cart.some(item => item.quantity >= 3) && (
              <div className="bg-[#111827] border border-[#1C2233] rounded-xl p-6 mt-4">
                <h3 className="font-semibold mb-3 text-sm text-gray-300">📦 Volume Discount Progress</h3>
                {cart.filter(item => item.quantity >= 3).map((item, idx) => {
                  const unitPrice = Number(pricingMap[item.id]?.display_price || item.price || 0);
                  const nextTier = item.quantity >= 10 ? null : item.quantity >= 4 ? { at: 10, discount: '10%' } : { at: 4, discount: '5%' };
                  const progress = nextTier ? Math.min(100, (item.quantity / nextTier.at) * 100) : 100;
                  
                  return (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 truncate max-w-[150px]">{item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name}</span>
                        <span className="text-gray-400">{item.quantity} units</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.quantity >= 10 ? 'bg-green-500' : 
                            item.quantity >= 4 ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {nextTier ? (
                        <p className="text-xs text-gray-500 mt-1">
                          Add {nextTier.at - item.quantity} more for {nextTier.discount} off this item!
                        </p>
                      ) : (
                        <p className="text-xs text-green-400 mt-1">✓ Max volume discount unlocked!</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {bulkMode && (
              <div className="bg-[#111827] border border-[#1C2233] rounded-xl p-6">

                <h3 className="font-semibold mb-3">
                  Resell Potential
                </h3>

                <p className="text-sm text-gray-300">
                  Estimated Revenue: <strong>${estimatedRevenue.toFixed(2)}</strong>
                </p>

                <p className="text-green-400 text-sm">
                  Estimated Profit: ${estimatedProfit.toFixed(2)}
                </p>
                {profile?.role === "wholesale" && cart.some((item) => pricingMap[item.id]?.volume_pricing?.length) ? (
                  <div className="mt-4 space-y-2 text-xs text-gray-300">
                    {cart
                      .map((item) => pricingMap[item.id])
                      .filter((entry) => entry?.volume_pricing?.length)
                      .slice(0, 1)
                      .map((entry) => (
                        <div key={entry.productId}>
                          {entry.volume_pricing.map((row) => (
                            <p key={row.range}>
                              {row.range}: ${Number(row.price || 0).toFixed(2)} {row.note ? `(${row.note})` : ""}
                            </p>
                          ))}
                        </div>
                      ))}
                  </div>
                ) : null}

              </div>
            )}

            <div className="bg-[#111827] border border-[#1C2233] rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-4">
                Total: ${totalPrice.toFixed(2)}
              </h2>

              {checkoutError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
                  <p className="text-red-400 text-sm font-medium">⚠️ Error: {checkoutError}</p>
                </div>
              )}

              {/* 🔥 REPLICA DISCLAIMER BANNER - ONLY FOR WATCHES */}
              {cart.length > 0 && cart.every(item => 
                item.category && item.category.toLowerCase().includes('watch') ||
                item.name && item.name.toLowerCase().includes('replica') ||
                item.name && item.name.toLowerCase().includes('fake')
              ) && (
                <div className="mb-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-900 font-bold text-sm">⚠️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-300 mb-1">Important Notice</h3>
                      <p className="text-yellow-200 text-sm">
                        This cart contains replica products. By proceeding with checkout, you acknowledge and accept that these are 1:1 replicas and not authentic branded items.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {}}
                          className="px-4 py-2 bg-yellow-600 text-yellow-900 rounded font-medium hover:bg-yellow-500 transition-colors"
                        >
                          I Understand
                        </button>
                        <button
                          onClick={() => window.location.href = '/shop'}
                          className="px-4 py-2 border border-yellow-600 text-yellow-300 rounded font-medium hover:bg-yellow-900/50 transition-colors"
                        >
                          Remove Replicas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkoutLoading}
                className={`w-full py-3 rounded-md font-semibold transition ${cart.length === 0 || checkoutLoading ? "cursor-not-allowed bg-[#D4AF37]/60 text-black/70" : "bg-[#D4AF37] text-black hover:bg-[#E5C158]"}`}
              >
                {checkoutLoading ? "🔄 Redirecting to Stripe..." : "💳 Checkout"}
              </button>

              <Link
                href="/shop"
                className="block mt-4 text-center text-sm text-gray-400 hover:text-white transition"
              >
                Continue Shopping
              </Link>

              <button
                onClick={clearCart}
                className="w-full mt-3 bg-gray-700 py-2 rounded text-sm hover:bg-gray-600 transition"
              >
                Clear Cart
              </button>

            </div>

          </div>

        </div>

        <section className="mt-20">

          <div className="bg-[#111827] border border-[#1C2233] rounded-2xl p-10">

            <h2 className="text-2xl font-bold mb-4">
              Partner With KV Garage
            </h2>

            <p className="text-gray-300 mb-6 max-w-3xl">
              Looking to move beyond retail buying? KV Garage provides a structured path
              into reselling and scalable supply access.
            </p>

            <div className="flex gap-4 flex-wrap">

              <Link href="/signup">
                <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-md font-semibold">
                  Apply for Access
                </button>
              </Link>

              <Link href="/mentorship">
                <button className="border border-white px-6 py-3 rounded-md font-semibold">
                  Learn System
                </button>
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
