import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.scss';

export const Navbar: React.FC = () => {
  const { cartCount, setCartOpen } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <a href="/">
            SUMMIT <span className={styles.divider}>//</span> WILDERNESS
          </a>
        </div>
        
        <nav className={styles.nav}>
          <a href="#shop" className={styles.navLink}>Apparel</a>
          <a href="#gear" className={styles.navLink}>Technical Gear</a>
          <a href="#expeditions" className={styles.navLink}>Expeditions</a>
          <a href="#journal" className={styles.navLink}>Our Journal</a>
        </nav>

        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.cartButton}
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping cart"
          >
            <ShoppingBag size={20} strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className={styles.badge} key={cartCount}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
