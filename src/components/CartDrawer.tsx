import React, { useEffect, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.scss';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal,
    cartCount
  } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setCartOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setCartOpen(false);
    }
  };

  return (
    <div 
      className={`${styles.overlay} ${isCartOpen ? styles.active : ''}`} 
      onClick={handleOverlayClick}
    >
      <div 
        ref={drawerRef}
        className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingBag size={20} />
            <h2>Your Gear ({cartCount})</h2>
          </div>
          <button 
            type="button" 
            className={styles.closeButton}
            onClick={() => setCartOpen(false)}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIconContainer}>
                <ShoppingBag size={48} className={styles.emptyIcon} />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any gear to your adventure yet.</p>
              <button 
                type="button" 
                className={styles.shopButton}
                onClick={() => setCartOpen(false)}
              >
                Continue Exploring
              </button>
            </div>
          ) : (
            <div className={styles.cartList}>
              {cart.map((item) => (
                <div key={`${item.id}-${item.color.id}-${item.size}`} className={styles.cartItem}>
                  <img src={item.image} alt={item.title} className={styles.itemImage} />
                  
                  <div className={styles.itemDetails}>
                    <span className={styles.itemBrand}>{item.brand}</span>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                    
                    <div className={styles.itemVariants}>
                      <span className={styles.itemVariant}>
                        Color: 
                        <span 
                          className={styles.colorIndicator} 
                          style={{ backgroundColor: item.color.hex }} 
                        />
                        {item.color.name}
                      </span>
                      <span className={styles.itemVariant}>Size: {item.size}</span>
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.qtyPicker}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.color.id, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.color.id, item.size, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeFromCart(item.id, item.color.id, item.size)}
                        aria-label="Remove item from cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span className={styles.subtotalValue}>${cartSubtotal.toFixed(2)}</span>
            </div>
            <p className={styles.footerText}>Shipping and taxes calculated at checkout.</p>
            <button 
              type="button" 
              className={styles.checkoutButton}
              onClick={() => alert('Proceeding to checkout... (Demo only)')}
            >
              Secure Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
