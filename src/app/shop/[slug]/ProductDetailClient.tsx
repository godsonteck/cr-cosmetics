'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/utils/formatPrice';
import { Product, ProductVariant } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [imgError, setImgError] = useState<boolean>(false);

  const {
    id,
    name,
    brand,
    price,
    originalPrice,
    image,
    badge,
    inStock,
    stockCount,
    description,
    details,
    category,
  } = product;

  const activePrice = selectedVariant?.price || price;
  const isWishlisted = isInWishlist(id);
  const discount = originalPrice && originalPrice > activePrice
    ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem(product, quantity, true, selectedVariant);
    addToast({
      title: 'Added to Cart',
      message: `${name} ${selectedVariant ? `(${selectedVariant.name})` : ''} × ${quantity}`,
      type: 'success',
    });
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    addToast({
      message: isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist',
      type: isWishlisted ? 'info' : 'success',
    });
  };

  const waOrderMsg = encodeURIComponent(
    `Hello CR Cosmetics & Essentials! 🇬🇭\nI want to order:\nProduct: ${name} ${selectedVariant ? `(${selectedVariant.name})` : ''}\nQuantity: ${quantity}\nPrice: ${formatPrice(activePrice * quantity)}`
  );

  return (
    <div className="cr-pdp-page">
      <div className="cr-pdp-container">
        {/* Breadcrumb */}
        <nav className="cr-pdp-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${category}`}>
            {category === 'skincare' ? 'Beauty & Skincare' : 'Groceries & Essentials'}
          </Link>
          <span>/</span>
          <span className="cr-pdp-crumb-current">{name}</span>
        </nav>

        {/* 2-Column Product Layout */}
        <div className="cr-pdp-layout">
          <div className="cr-pdp-gallery">
            <div className="cr-pdp-media-frame">
              {badge && (
                <span className="cr-pdp-badge">
                  {badge === 'sale' ? `−${discount}%` : badge.toUpperCase()}
                </span>
              )}
              {image && !imgError ? (
                <img
                  src={image}
                  alt={name}
                  className="cr-pdp-main-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="cr-pdp-img-fallback">✨</div>
              )}
            </div>
          </div>

          <div className="cr-pdp-details">
            {brand && <p className="cr-pdp-brand">{brand}</p>}
            <h1 className="cr-pdp-title">{name}</h1>

            <div className="cr-pdp-rating-row">
              <span className="cr-pdp-stars">★★★★★</span>
              <span className="cr-pdp-rating-text">5.0 (Verified Authentic Product)</span>
            </div>

            <div className="cr-pdp-price-box">
              <span className="cr-pdp-price">{formatPrice(activePrice)}</span>
              {originalPrice && originalPrice > activePrice && (
                <span className="cr-pdp-original-price">{formatPrice(originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="cr-pdp-discount-tag">Save {discount}%</span>
              )}
            </div>

            <p className="cr-pdp-description">{description}</p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="cr-pdp-variants-block">
                <span className="variant-label">Select Option / Pack Size:</span>
                <div className="variant-options">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      className={`variant-btn ${selectedVariant?.id === variant.id ? 'is-selected' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <span>{variant.name}</span>
                      <span className="v-price">{formatPrice(variant.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Card */}
            <div className="cr-pdp-specs-card">
              {details?.size && <div className="spec-row"><strong>Size / Net Vol:</strong> <span>{details.size}</span></div>}
              {details?.skinType && <div className="spec-row"><strong>Skin Concern:</strong> <span>{details.skinType}</span></div>}
              {details?.origin && <div className="spec-row"><strong>Origin:</strong> <span>{details.origin}</span></div>}
              {details?.usage && <div className="spec-row"><strong>How to Use:</strong> <span>{details.usage}</span></div>}
              {details?.ingredients && <div className="spec-row"><strong>Ingredients:</strong> <span>{details.ingredients}</span></div>}
            </div>

            <div className="cr-pdp-stock-status">
              <span className={`cr-stock-dot ${inStock ? 'in-stock' : 'out-stock'}`} />
              <span className="cr-stock-label">
                {inStock ? `In Stock (${stockCount || 20} available at Botwe Store)` : 'Currently Out of Stock'}
              </span>
            </div>

            {/* CTA Buttons */}
            {inStock ? (
              <div className="cr-pdp-cta-block">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={stockCount || 20}
                  disabled={!inStock}
                />

                <button
                  type="button"
                  className="cr-btn-add-cart"
                  onClick={handleAddToCart}
                >
                  Add to Cart • {formatPrice(activePrice * quantity)}
                </button>

                <button
                  type="button"
                  className={`cr-btn-wishlist ${isWishlisted ? 'active' : ''}`}
                  onClick={handleWishlist}
                  aria-label="Wishlist"
                >
                  ♥
                </button>
              </div>
            ) : (
              <button type="button" className="cr-btn-oos" disabled>
                Out of Stock
              </button>
            )}

            <a
              href={`https://wa.me/233592153306?text=${waOrderMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cr-pdp-wa-btn"
            >
              💬 Order Directly on WhatsApp (059 215 3306)
            </a>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="cr-pdp-related">
            <div className="cr-related-header">
              <p className="cr-related-eyebrow">
                {category === 'skincare' ? 'Complete Your Routine' : 'Frequently Paired Essentials'}
              </p>
              <h2 className="cr-related-title">Recommended Complementary Products</h2>
            </div>
            <div className="cr-related-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .cr-pdp-page {
          padding-top: 1.5rem;
          padding-bottom: 5rem;
          background: #FFFFFF;
        }

        .cr-pdp-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .cr-pdp-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #8C8580;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .cr-pdp-breadcrumb a {
          color: #57534E;
          text-decoration: none;
        }
        .cr-pdp-crumb-current {
          color: #1C1917;
          font-weight: 600;
        }

        .cr-pdp-layout {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 3.5rem;
          align-items: start;
        }

        .cr-pdp-media-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          overflow: hidden;
        }

        .cr-pdp-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 3;
          background: #7B2347;
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
        }

        .cr-pdp-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cr-pdp-img-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
        }

        .cr-pdp-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cr-pdp-brand {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7B2347;
        }

        .cr-pdp-title {
          font-family: var(--font-display, serif);
          font-size: clamp(1.8rem, 3.2vw, 2.5rem);
          font-weight: 700;
          color: #2D1820;
          line-height: 1.2;
        }

        .cr-pdp-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cr-pdp-stars {
          color: #C59B3F;
          font-size: 0.95rem;
        }

        .cr-pdp-rating-text {
          font-size: 0.8rem;
          color: #57534E;
        }

        .cr-pdp-price-box {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 1rem 0;
          border-top: 1px solid #E7E2DA;
          border-bottom: 1px solid #E7E2DA;
          margin: 0.5rem 0;
        }

        .cr-pdp-price {
          font-size: 1.85rem;
          font-weight: 700;
          color: #7B2347;
        }

        .cr-pdp-original-price {
          font-size: 1.1rem;
          color: #8C8580;
          text-decoration: line-through;
        }

        .cr-pdp-discount-tag {
          padding: 0.25rem 0.6rem;
          background: #FAF1F4;
          color: #7B2347;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 4px;
        }

        .cr-pdp-description {
          font-size: 0.95rem;
          color: #57534E;
          line-height: 1.6;
        }

        .cr-pdp-variants-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 0.5rem 0;
        }

        .variant-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #2D1820;
        }

        .variant-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .variant-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 8px 14px;
          border: 1.5px solid #E7E2DA;
          border-radius: 6px;
          background: #FFFFFF;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .variant-btn.is-selected {
          border-color: #7B2347;
          background: #FAF1F4;
        }

        .v-price {
          font-size: 0.75rem;
          font-weight: 700;
          color: #7B2347;
        }

        .cr-pdp-specs-card {
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.82rem;
        }

        .spec-row strong {
          color: #2D1820;
          margin-right: 6px;
        }

        .cr-pdp-stock-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .cr-stock-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .cr-stock-dot.in-stock { background: #166534; }
        .cr-stock-dot.out-stock { background: #991B1B; }

        .cr-pdp-cta-block {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 0.5rem;
        }

        .cr-btn-add-cart {
          flex: 1;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #7B2347;
          color: #FFFFFF;
          font-size: 0.88rem;
          font-weight: 700;
          text-transform: uppercase;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .cr-btn-add-cart:hover {
          background: #5E1937;
        }

        .cr-btn-wishlist {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          border: 1.5px solid #E7E2DA;
          background: #FFFFFF;
          color: #57534E;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .cr-btn-wishlist.active {
          color: #7B2347;
          border-color: #7B2347;
          background: #FAF1F4;
        }

        .cr-btn-oos {
          width: 100%;
          height: 44px;
          background: #E7E2DA;
          color: #8C8580;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: not-allowed;
        }

        .cr-pdp-wa-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0.85rem 1rem;
          background: #25D366;
          color: #FFFFFF;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          margin-top: 0.5rem;
        }

        .cr-pdp-related {
          margin-top: 5rem;
          padding-top: 3.5rem;
          border-top: 1px solid #E7E2DA;
        }

        .cr-related-header {
          margin-bottom: 2rem;
        }

        .cr-related-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7B2347;
          margin-bottom: 0.25rem;
        }

        .cr-related-title {
          font-family: var(--font-display, serif);
          font-size: 1.8rem;
          font-weight: 700;
          color: #2D1820;
        }

        .cr-related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 960px) {
          .cr-pdp-layout { grid-template-columns: 1fr; gap: 2rem; }
          .cr-related-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }
      `}</style>
    </div>
  );
}
