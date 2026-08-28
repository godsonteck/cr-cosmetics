'use client';

import React, { useState, MouseEvent } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/utils/formatPrice';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const { id, slug, name, brand, price, originalPrice, image, inStock, details, rating, reviewCount } = product;
  const isWishlisted = isInWishlist(id);
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <div className="media-box">
        <Link href={`/shop/${slug}`} className="image-link" aria-label={name}>
          <img
            src={image || '/images/products/1.jpeg'}
            alt={name}
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? 'is-active' : ''}`}
          onClick={handleWishlist}
          aria-label="Save to wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? '#7B2347' : 'none'} stroke="#7B2347" strokeWidth="1.8">
            <path d="M20.8 8.7c0 5.5-8.8 10.1-8.8 10.1S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/>
          </svg>
        </button>

        {!inStock && <span className="sold-out-tag">Sold Out</span>}
        {discount > 0 && inStock && <span className="sale-tag">−{discount}%</span>}
      </div>

      <div className="info-box">
        <div className="card-top-meta">
          {brand && <span className="brand-label">{brand}</span>}
          {details?.size && <span className="size-label">{details.size}</span>}
        </div>

        <Link href={`/shop/${slug}`} className="name-link">
          <h3 className="product-name">{name}</h3>
        </Link>

        <div className="rating-row">
          <span className="stars">★ {(rating || 5.0).toFixed(1)}</span>
          <span className="review-count">({reviewCount || 12})</span>
        </div>

        <div className="price-row">
          <span className="current-price">{formatPrice(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className="original-price">{formatPrice(originalPrice)}</span>
          )}
        </div>

        <button
          type="button"
          className={`add-btn ${added ? 'is-added' : ''}`}
          onClick={handleAdd}
          disabled={!inStock}
        >
          {!inStock ? 'Out of Stock' : added ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
      </div>

      <style jsx>{`
        .product-card {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .product-card:hover {
          border-color: #2D1820;
          box-shadow: 0 6px 20px rgba(45, 24, 32, 0.08);
          transform: translateY(-2px);
        }

        .media-box {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #FAF7F2;
          overflow: hidden;
        }
        .image-link {
          display: block;
          width: 100%;
          height: 100%;
        }
        .media-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .product-card:hover .media-box img {
          transform: scale(1.04);
        }

        .wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .wishlist-btn:hover {
          background: #FAF1F4;
        }

        .sold-out-tag {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(28, 25, 23, 0.85);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .sale-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #7B2347;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .info-box {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-top-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .brand-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #7B2347;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .size-label {
          font-size: 0.68rem;
          color: #8C8580;
        }
        .name-link {
          text-decoration: none;
          color: inherit;
        }
        .product-name {
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.35;
          color: #1C1917;
          margin: 0 0 0.35rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          min-height: 2.45em;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 0.5rem;
        }
        .stars {
          font-size: 0.75rem;
          font-weight: 700;
          color: #C59B3F;
        }
        .review-count {
          font-size: 0.7rem;
          color: #8C8580;
        }

        .price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 0.85rem;
          margin-top: auto;
        }
        .current-price {
          font-size: 1rem;
          font-weight: 700;
          color: #1C1917;
        }
        .original-price {
          font-size: 0.8rem;
          color: #8C8580;
          text-decoration: line-through;
        }

        .add-btn {
          width: 100%;
          height: 38px;
          background: #2D1820;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .add-btn:hover:not(:disabled) {
          background: #7B2347;
        }
        .add-btn.is-added {
          background: #166534;
        }
        .add-btn:disabled {
          background: #E7E2DA;
          color: #8C8580;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
