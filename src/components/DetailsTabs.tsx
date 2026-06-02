import React, { useState } from 'react';
import { FileText, ClipboardList, Star } from 'lucide-react';
import type { EnrichedProduct } from '../utils/productMapper';
import styles from './DetailsTabs.module.scss';

interface DetailsTabsProps {
  product: EnrichedProduct;
}

type TabType = 'description' | 'specifications' | 'reviews';

export const DetailsTabs: React.FC<DetailsTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const renderStars = (rating: number) => {
    return (
      <div className={styles.ratingStars} aria-label={`Rated ${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span 
            key={i} 
            className={i < rating ? styles.starFull : styles.starEmpty}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.detailsContainer}>
      {/* Tab Buttons */}
      <div className={styles.tabHeaders} role="tablist" aria-label="Product details sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'description'}
          aria-controls="panel-description"
          id="tab-description"
          className={`${styles.tabButton} ${activeTab === 'description' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('description')}
        >
          <FileText size={16} />
          <span>Description</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'specifications'}
          aria-controls="panel-specifications"
          id="tab-specifications"
          className={`${styles.tabButton} ${activeTab === 'specifications' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('specifications')}
        >
          <ClipboardList size={16} />
          <span>Specifications</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'reviews'}
          aria-controls="panel-reviews"
          id="tab-reviews"
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <Star size={16} />
          <span>Reviews ({product.reviews.length})</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className={styles.tabPanels}>
        {/* Description Panel */}
        {activeTab === 'description' && (
          <div 
            id="panel-description"
            role="tabpanel"
            aria-labelledby="tab-description"
            className={styles.panelContent}
          >
            <h3 className={styles.panelHeading}>Engineering under the hood</h3>
            <p className={styles.descriptionText}>{product.description}</p>
            <div className={styles.featuresHighlight}>
              <div className={styles.featureItem}>
                <strong>Built for Wilderness</strong>
                <p>Engineered to perform in harsh weather and support heavy loads without fatiguing.</p>
              </div>
              <div className={styles.featureItem}>
                <strong>Responsible Materials</strong>
                <p>Crafted in facilities that respect environmental standards, using recycled technical fabrics.</p>
              </div>
            </div>
          </div>
        )}

        {/* Specifications Panel */}
        {activeTab === 'specifications' && (
          <div 
            id="panel-specifications"
            role="tabpanel"
            aria-labelledby="tab-specifications"
            className={styles.panelContent}
          >
            <h3 className={styles.panelHeading}>Technical specifications</h3>
            <table className={styles.specsTable}>
              <tbody>
                {product.specifications.length > 0 ? (
                  product.specifications.map((spec, i) => (
                    <tr key={i}>
                      <td className={styles.specKey}>{spec.key}</td>
                      <td className={styles.specValue}>{spec.value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className={styles.specKey}>Category</td>
                    <td className={styles.specValue}>{product.category}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews Panel */}
        {activeTab === 'reviews' && (
          <div 
            id="panel-reviews"
            role="tabpanel"
            aria-labelledby="tab-reviews"
            className={styles.panelContent}
          >
            <h3 className={styles.panelHeading}>What explorers are saying</h3>
            <div className={styles.reviewsGrid}>
              {product.reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewerName}>{review.author}</span>
                    <span className={styles.reviewDate}>{review.date}</span>
                  </div>
                  {renderStars(review.rating)}
                  <h4 className={styles.reviewTitle}>{review.title}</h4>
                  <p className={styles.reviewComment}>"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
