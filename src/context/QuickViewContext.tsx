'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Badge from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/utils/formatPrice';
import { Product } from '@/types';
import Link from 'next/link';

interface QuickViewContextType {
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const openQuickView = (product: Product) => {
    setActiveProduct(product);
    setQuantity(1);
  };

  const closeQuickView = () => {
    setActiveProduct(null);
  };

  const handleAddToCart = () => {
    if (!activeProduct || !activeProduct.inStock) return;
    addItem(activeProduct, quantity, true);
    addToast({
      title: 'Added to Cart',
      message: `${quantity} × ${activeProduct.name} added to your cart.`,
      type: 'success',
    });
    closeQuickView();
  };

  const inWishlist = activeProduct ? isInWishlist(activeProduct.id) : false;
  const discount = activeProduct && activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price
    ? Math.round(((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100)
    : 0;

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
      {children}

      <Modal
        isOpen={!!activeProduct}
        onClose={closeQuickView}
        title="Quick Product Preview"
        maxWidth="720px"
      >
        {activeProduct && (
          <div className="quickview-body-grid">
            {/* Image Col */}
            <div className="quickview-img-col">
              <div className="quickview-img-wrap">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="quickview-img"
                />
                {discount > 0 && (
                  <span className="qv-badge">
                    <Badge variant="sale" size="sm">-{discount}% OFF</Badge>
                  </span>
                )}
              </div>
            </div>

            {/* Info Col */}
            <div className="quickview-info-col">
              <span className="qv-brand">{activeProduct.brand}</span>
              <h3 className="qv-title">{activeProduct.name}</h3>

              <div className="qv-price-row">
                <span className="qv-price">{formatPrice(activeProduct.price)}</span>
                {activeProduct.originalPrice && (
                  <span className="qv-old-price">{formatPrice(activeProduct.originalPrice)}</span>
                )}
                <span className="qv-stock-tag">
                  {activeProduct.inStock ? '✓ In Stock' : 'Out of Stock'}
                </span>
              </div>

              <p className="qv-desc">{activeProduct.description}</p>

              <div className="qv-specs">
                {activeProduct.details?.size && (
                  <span className="spec-tag">🧴 {activeProduct.details.size}</span>
                )}
                {activeProduct.details?.skinType && (
                  <span className="spec-tag">✨ {activeProduct.details.skinType}</span>
                )}
              </div>

              <div className="qv-actions">
                <div className="qv-qty-row">
                  <span className="qty-label">Qty:</span>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    max={activeProduct.stockCount || 10}
                    disabled={!activeProduct.inStock}
                    size="sm"
                  />
                </div>

                <div className="qv-btns-row">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!activeProduct.inStock}
                    variant="primary"
                    size="md"
                    fullWidth
                  >
                    {activeProduct.inStock ? `Add to Cart • ${formatPrice(activeProduct.price * quantity)}` : 'Out of Stock'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      toggleWishlist(activeProduct);
                      addToast({
                        title: inWishlist ? 'Removed from Wishlist' : 'Saved to Wishlist',
                        message: activeProduct.name,
                        type: 'info',
                      });
                    }}
                    className={`qv-heart-btn ${inWishlist ? 'active' : ''}`}
                    aria-label="Wishlist"
                  >
                    ♥
                  </button>
                </div>

                <Link
                  href={`/shop/${activeProduct.slug}`}
                  onClick={closeQuickView}
                  className="view-full-details-link"
                >
                  View Full Product Details →
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error('useQuickView must be used within QuickViewProvider');
  }
  return context;
}
