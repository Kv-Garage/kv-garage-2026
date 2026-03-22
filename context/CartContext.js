import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 🔥 LOAD CART (SAFE)
  useEffect(() => {
    const storedCart = localStorage.getItem("kv_cart");

    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);

        // ensure structure is valid
        if (Array.isArray(parsed)) {
          setCart(parsed);
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      }
    }
  }, []);

  // 🔥 SAVE CART
  useEffect(() => {
    localStorage.setItem("kv_cart", JSON.stringify(cart));
  }, [cart]);

  // 🔥 ADD TO CART (MERGE + STRUCTURE SAFE)
  const addToCart = (item) => {
    if (!item || !item.name) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.name === item.name
      );

      if (existingIndex !== -1) {
        const updated = [...prev];

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity:
            updated[existingIndex].quantity + (item.quantity || 1),
        };

        return updated;
      }

      return [
        ...prev,
        {
          name: item.name,
          price: Number(item.price) || 0,
          quantity: item.quantity || 1,
          image: item.image || null, // 🔥 READY FOR PRODUCT IMAGE
          id: item.id || item.name, // 🔥 FUTURE SAFE
        },
      ];
    });
  };

  // 🔥 UPDATE QUANTITY
  const updateQuantity = (index, newQty) => {
    setCart((prev) => {
      const updated = [...prev];

      if (!updated[index]) return prev;

      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = {
          ...updated[index],
          quantity: newQty,
        };
      }

      return updated;
    });
  };

  // 🔥 REMOVE ITEM
  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔥 CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}