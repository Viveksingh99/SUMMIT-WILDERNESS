import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { ImageGallery } from './components/ImageGallery';
import { InfoPanel } from './components/InfoPanel';
import { DetailsTabs } from './components/DetailsTabs';
import { CartProvider } from './context/CartContext';
import { enrichProduct } from './utils/productMapper';
import type { EnrichedProduct } from './utils/productMapper';
import { AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import './App.scss';

function AppContent() {
  const [product, setProduct] = useState<EnrichedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  const getProductIdFromURL = (): number => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('productId') || params.get('id');
    const parsedId = parseInt(idParam || '1', 10);
    return isNaN(parsedId) ? 1 : parsedId;
  };

  const productId = getProductIdFromURL();

  const fetchProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to load product. Server responded with status ${response.status}.`);
      }
      const data = await response.json();
      if (!data) {
        throw new Error('Product not found in the catalog.');
      }
      
      const enriched = enrichProduct(data);
      setProduct(enriched);
      
      const params = new URLSearchParams(window.location.search);
      const urlColor = params.get('color');
      const urlSize = params.get('size');
      
      const matchedColor = enriched.colors.find(c => c.id === urlColor || c.name.toLowerCase() === urlColor?.toLowerCase());
      const defaultColorId = matchedColor ? matchedColor.id : enriched.colors[0].id;
      setSelectedColorId(defaultColorId);

      const matchedSize = enriched.sizes.find(s => s.size.toLowerCase() === urlSize?.toLowerCase() && s.stock > 0);
      const defaultSizeObj = enriched.sizes.find(s => s.stock > 0) || enriched.sizes[0];
      const defaultSize = matchedSize ? matchedSize.size : defaultSizeObj.size;
      setSelectedSize(defaultSize);

    } catch (err: any) {
      setError(err.message || 'Unable to connect to the store database. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    const params = new URLSearchParams(window.location.search);
    params.set('productId', productId.toString());
    
    const activeColor = product.colors.find(c => c.id === selectedColorId);
    if (activeColor) {
      params.set('color', activeColor.id);
    }
    if (selectedSize) {
      params.set('size', selectedSize);
    }

    const newSearch = `?${params.toString()}`;
    if (window.location.search !== newSearch) {
      window.history.replaceState(null, '', newSearch);
    }
  }, [selectedColorId, selectedSize, product, productId]);

  if (loading) {
    return (
      <div className="pdp-container skeleton-layout">
        <div className="skeleton-grid">
          <div className="skeleton-gallery">
            <div className="skeleton-image pulse-animation" />
            <div className="skeleton-thumbnails">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-thumb pulse-animation" />
              ))}
            </div>
          </div>
          <div className="skeleton-info">
            <div className="skeleton-line short pulse-animation" />
            <div className="skeleton-line title pulse-animation" />
            <div className="skeleton-line medium pulse-animation" />
            <div className="skeleton-line short pulse-animation" />
            <div className="skeleton-swatches">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-circle pulse-animation" />
              ))}
            </div>
            <div className="skeleton-sizes">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-box pulse-animation" />
              ))}
            </div>
            <div className="skeleton-button pulse-animation" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdp-container error-layout">
        <div className="error-card">
          <AlertCircle size={48} className="error-icon" />
          <h2>Connection Interrupted</h2>
          <p>{error}</p>
          <button type="button" className="retry-button" onClick={fetchProductData}>
            <RotateCcw size={16} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pdp-container">
      <div className="breadcrumbs">
        <a href="/">Home</a> <span className="breadcrumb-sep">/</span>
        <a href={`#category-${product.category.toLowerCase().replace(/\s+/g, '-')}`}>{product.category}</a> <span className="breadcrumb-sep">/</span>
        <span className="active-breadcrumb">{product.title}</span>
      </div>

      <div className="pdp-grid">
        <section className="gallery-section">
          <ImageGallery images={product.images} />
        </section>

        <section className="info-section">
          <InfoPanel 
            product={product} 
            selectedColorId={selectedColorId}
            setSelectedColorId={setSelectedColorId}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        </section>
      </div>

      <section className="details-section">
        <DetailsTabs product={product} />
      </section>

      <div className="demo-navigation">
        <h4>Explore Other Gear (Demo Products)</h4>
        <div className="demo-links">
          <a href="?productId=1" className={productId === 1 ? 'active' : ''}>
            1. Apex Ranger Pack (Local High-Res Gallery) <ArrowRight size={12} />
          </a>
          <a href="?productId=2" className={productId === 2 ? 'active' : ''}>
            2. Merino Trail Tee <ArrowRight size={12} />
          </a>
          <a href="?productId=3" className={productId === 3 ? 'active' : ''}>
            3. Helios Insulated Storm Hoody <ArrowRight size={12} />
          </a>
          <a href="?productId=15" className={productId === 15 ? 'active' : ''}>
            15. Windbreaker Shell <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Navbar />
      <main className="main-content">
        <AppContent />
      </main>
      <CartDrawer />
      <footer className="footer-credits">
        <div className="footer-container">
          <p>© 2026 SUMMIT // WILDERNESS. Built for Technical Excellence.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#about">About Our Labs</a>
          </div>
        </div>
      </footer>
    </CartProvider>
  );
}

export default App;
