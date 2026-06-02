import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  title: string;
  brand: string;
  price: number;
  color: { id: string; name: string; hex: string };
  size: string;
  quantity: number;
  image: string;
  maxStock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty: number) => void;
  removeFromCart: (productId: number, colorId: string, size: string) => void;
  updateQuantity: (productId: number, colorId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'summit_wilderness_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  // Rehydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, qty: number) => {
    setCart((prevCart) => {
      // Find if item with same ID, color, and size already exists in the cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.color.id === newItem.color.id &&
          item.size === newItem.size
      );

      if (existingItemIndex > -1) {
        // If it exists, update the quantity (ensuring it doesn't exceed stock limit)
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        const newQty = Math.min(existingItem.quantity + qty, newItem.maxStock);
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: newQty,
        };
        return updatedCart;
      } else {
        // If it does not exist, append it with the given quantity
        return [...prevCart, { ...newItem, quantity: Math.min(qty, newItem.maxStock) }];
      }
    });
    // Open the cart drawer automatically when adding a product for a premium feedback loop
    setCartOpen(true);
  };

  const removeFromCart = (productId: number, colorId: string, size: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === productId && item.color.id === colorId && item.size === size)
      )
    );
  };

  const updateQuantity = (
    productId: number,
    colorId: string,
    size: string,
    quantity: number
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId && item.color.id === colorId && item.size === size) {
          const clampedQty = Math.max(1, Math.min(quantity, item.maxStock));
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Derive cart counts and subtotals
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setCartOpen,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
