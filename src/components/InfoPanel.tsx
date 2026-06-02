import React, { useState, useEffect } from 'react';
import { ShoppingCart, Calendar, AlertTriangle, Check, Info } from 'lucide-react';
import type { EnrichedProduct } from '../utils/productMapper';
import { useCart } from '../context/CartContext';
import styles from './InfoPanel.module.scss';

interface InfoPanelProps {
  product: EnrichedProduct;
  selectedColorId: string;
  setSelectedColorId: (id: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  product,
  selectedColorId,
  setSelectedColorId,
  selectedSize,
  setSelectedSize
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedColor = product.colors.find(c => c.id === selectedColorId) || product.colors[0];

  // Find the stock level for the currently selected variant combination.
  // Note: Since size buttons represent the selected color's size stock, we look up dynamically.
  const getStockForSize = (sizeName: string) => {
    // For simplicity, size stock is computed in the mapper per product.
    const sizeObj = product.sizes.find(s => s.size === sizeName);
    return sizeObj ? sizeObj.stock : 0;
  };

  const currentVariantStock = getStockForSize(selectedSize);

  // If selected size changes, ensure quantity is clamped to the new variant's max stock.
  useEffect(() => {
    if (currentVariantStock > 0) {
      setQuantity(prev => Math.min(prev, currentVariantStock));
    } else {
      setQuantity(1);
    }
  }, [selectedSize, currentVariantStock]);

  const handleQtyChange = (val: number) => {
    const clamped = Math.max(1, Math.min(val, currentVariantStock || 1));
    setQuantity(clamped);
  };

  // Mock API post request with random failure
  const simulateAddToCartAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isFailure = Math.random() < 0.2; // 20% random failure rate
        if (isFailure) {
          reject(new Error('API Server Timeout: Failed to synchronize cart state.'));
        } else {
          resolve();
        }
      }, 1000); // 1s network latency simulation
    });
  };

  const handleAddToCart = async () => {
    if (currentVariantStock === 0) return;
    
    setIsAdding(true);
    setNotification(null);

    try {
      await simulateAddToCartAPI();
      
      // Successfully "posted" to API, now add to client context
      addToCart({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        image: product.images[0],
        maxStock: currentVariantStock
      }, quantity);

      setNotification({
        type: 'success',
        message: `Successfully added ${quantity}x ${product.title} (${selectedColor.name}, Size ${selectedSize}) to cart!`
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Clear toast notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Delivery Estimate variables
  const isVariantInStock = currentVariantStock > 0;
  const isVariantLowStock = currentVariantStock > 0 && currentVariantStock <= 2;

  // Render Star Rating
  const renderStars = (rate: number) => {
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;
    return (
      <div className={styles.ratingStars} aria-label={`Rated ${rate} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) {
            return <span key={i} className={styles.starFull}>★</span>;
          } else if (i === fullStars && hasHalfStar) {
            return <span key={i} className={styles.starHalf}>★</span>;
          }
          return <span key={i} className={styles.starEmpty}>★</span>;
        })}
      </div>
    );
  };

  return (
    <div className={styles.panel}>
      {/* Brand & Title */}
      <span className={styles.brand}>{product.brand}</span>
      <h1 className={styles.title}>{product.title}</h1>

      {/* Ratings */}
      <div className={styles.ratingRow}>
        {renderStars(product.rating.rate)}
        <span className={styles.ratingText}>
          {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
        </span>
      </div>

      {/* Prices */}
      <div className={styles.priceRow}>
        <span className={styles.price}>${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <>
            <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
            <span className={styles.saleBadge}>SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
          </>
        )}
      </div>

      <hr className={styles.divider} />

      {/* Colour swatches */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Color: <span className={styles.highlightVal}>{selectedColor.name}</span>
        </h3>
        <div className={styles.swatchRow} role="radiogroup" aria-label="Select Color Swatch">
          {product.colors.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.swatchButton} ${selectedColorId === c.id ? styles.activeSwatch : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => setSelectedColorId(c.id)}
              aria-checked={selectedColorId === c.id}
              role="radio"
              aria-label={`Select color ${c.name}`}
            >
              {selectedColorId === c.id && (
                <Check 
                  size={12} 
                  strokeWidth={3} 
                  color={c.hex === '#111827' || c.hex === '#1e3a2f' ? '#ffffff' : '#111827'} 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size buttons */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Size: <span className={styles.highlightVal}>{selectedSize}</span>
        </h3>
        <div className={styles.sizeGrid} role="radiogroup" aria-label="Select Product Size">
          {product.sizes.map((s) => {
            const stock = getStockForSize(s.size);
            const isSoldOut = stock === 0;
            const isLowStock = stock > 0 && stock <= 2;
            const isSelected = selectedSize === s.size;

            return (
              <button
                key={s.size}
                type="button"
                className={`
                  ${styles.sizeButton} 
                  ${isSelected ? styles.activeSize : ''} 
                  ${isSoldOut ? styles.soldOutSize : ''}
                `}
                disabled={isSoldOut}
                onClick={() => setSelectedSize(s.size)}
                aria-checked={isSelected}
                role="radio"
                aria-label={`Select size ${s.size}. ${isSoldOut ? 'Sold out' : isLowStock ? 'Low stock' : 'In stock'}`}
              >
                <span className={styles.sizeLabel}>{s.size}</span>
                {isLowStock && (
                  <span className={styles.stockAlert}>Only {stock} left</span>
                )}
                {isSoldOut && (
                  <span className={styles.soldOutLabel}>Sold Out</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className={styles.purchaseSection}>
        <div className={styles.qtyContainer}>
          <span className={styles.qtyLabel}>Quantity:</span>
          <div className={styles.qtyPicker}>
            <button
              type="button"
              onClick={() => handleQtyChange(quantity - 1)}
              disabled={quantity <= 1 || !isVariantInStock}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              max={currentVariantStock || 1}
              value={isVariantInStock ? quantity : 0}
              onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
              disabled={!isVariantInStock}
              aria-label="Product quantity input"
            />
            <button
              type="button"
              onClick={() => handleQtyChange(quantity + 1)}
              disabled={quantity >= currentVariantStock || !isVariantInStock}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.cartButton} ${isAdding ? styles.loadingBtn : ''}`}
          disabled={!isVariantInStock || isAdding}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <span className={styles.spinner} />
          ) : !isVariantInStock ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Wilderness Gear
            </>
          )}
        </button>
      </div>

      {/* API Action Feedback Toast Alerts */}
      {notification && (
        <div 
          className={`${styles.toast} ${notification.type === 'success' ? styles.toastSuccess : styles.toastError}`}
          role="alert"
        >
          {notification.type === 'success' ? (
            <Check size={18} className={styles.toastIcon} />
          ) : (
            <AlertTriangle size={18} className={styles.toastIcon} />
          )}
          <span className={styles.toastMessage}>{notification.message}</span>
        </div>
      )}

      {/* Conditionally Shown Delivery Estimate Line (Open Question 3) */}
      {isVariantInStock && (
        <div className={styles.deliveryEstimate}>
          <Calendar size={15} />
          <span>
            {isVariantLowStock ? (
              <strong>Expedited delivery available.</strong>
            ) : (
              'Standard Delivery:'
            )}{' '}
            Order in the next <strong>3h 45m</strong> for delivery by{' '}
            <strong>Friday, June 5</strong>.
          </span>
        </div>
      )}
      
      {!isVariantInStock && (
        <div className={styles.soldOutInfo}>
          <Info size={15} />
          <span>This combination is currently out of stock. Sign up below to get notified of restocks.</span>
        </div>
      )}
    </div>
  );
};
