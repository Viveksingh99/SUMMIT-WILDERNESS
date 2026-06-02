import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import styles from './ImageGallery.module.scss';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transform: 'scale(1)' });
  
  const mainImageRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = mainImageRef.current;
    if (!container) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center'
    });
  };

  const handleMobileScroll = () => {
    const container = mobileContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = mobileContainerRef.current;
    if (!container) return;

    const currentScrollLeft = container.scrollLeft;
    const targetScrollLeft = activeIndex * container.clientWidth;

    if (Math.abs(currentScrollLeft - targetScrollLeft) > 5) {
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  return (
    <div className={styles.gallery}>
      <div 
        ref={mainImageRef}
        className={styles.mainImageContainer}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setLightboxOpen(true)}
      >
        <img 
          src={images[activeIndex]} 
          alt={`Product view ${activeIndex + 1}`} 
          className={styles.mainImage}
          style={zoomStyle}
        />
        <div className={styles.zoomIndicator}>
          <ZoomIn size={16} />
          <span>Click to Zoom</span>
        </div>

        {images.length > 1 && (
          <>
            <button 
              type="button" 
              className={`${styles.navButton} ${styles.prev}`}
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              type="button" 
              className={`${styles.navButton} ${styles.next}`}
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div 
        ref={mobileContainerRef}
        className={styles.mobileGallery}
        onScroll={handleMobileScroll}
        onClick={() => setLightboxOpen(true)}
      >
        {images.map((img, idx) => (
          <div key={idx} className={styles.mobileSlide}>
            <img src={img} alt={`Product mobile slide ${idx + 1}`} />
          </div>
        ))}
        <div className={styles.mobileZoomBadge}>
          <ZoomIn size={14} />
        </div>
      </div>

      {images.length > 1 && (
        <div className={styles.dotsIndicator}>
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <div className={styles.thumbnailRow}>
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            className={`${styles.thumbnailButton} ${idx === activeIndex ? styles.activeThumbnail : ''}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Select product view ${idx + 1}`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} />
          </button>
        ))}
      </div>

      {isLightboxOpen && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <button 
            type="button" 
            className={styles.closeLightbox}
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen view"
          >
            <X size={24} />
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={images[activeIndex]} alt={`Fullscreen view ${activeIndex + 1}`} />
            
            {images.length > 1 && (
              <>
                <button 
                  type="button" 
                  className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  type="button" 
                  className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight size={28} />
                </button>
                
                <div className={styles.lightboxCounter}>
                  {activeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
