'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import EmptyState from '@/components/ui/EmptyState';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

export default function CartPage() {
  const {
    items,
    totalCount,
    subtotal,
    deliveryFee,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string>('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === 'WELCOME10' || promoCode.trim().toUpperCase() === 'GLOW10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "WELCOME10" for 10% off.');
      setPromoApplied(false);
    }
  };

  const discountAmount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const breadcrumbs = [{ label: 'Shopping Cart' }];

  const generateWhatsAppCartLink = () => {
    const lines = items.map(
      (it, idx) =>
        `${idx + 1}. ${it.product.name} ${it.selectedVariant ? `(${it.selectedVariant.name})` : ''} (Qty: ${it.quantity}) — ${formatPrice((it.selectedVariant?.price || it.product.price) * it.quantity)}`
    );
    const msg = `Hello CR Cosmetics & Essentials,\nI would like to order the following items from my cart:\n\n${lines.join('\n')}\n\n• Subtotal: ${formatPrice(subtotal)}${promoApplied ? `\n• Discount (10%): -${formatPrice(discountAmount)}` : ''}\n• Order Total: ${formatPrice(finalTotal)}\n\nPlease confirm availability and delivery dispatch to my location in Accra.`;
    return `https://wa.me/233592153306?text=${encodeURIComponent(msg)}`;
  };

  if (items.length === 0) {
    return (
      <div className="container cart-empty-wrap">
        <Breadcrumb items={breadcrumbs} />
        <EmptyState
          icon="🛍️"
          title="Your Shopping Cart is Empty"
          description="Explore our genuine skincare &amp; grocery essentials to get started."
          actionLabel="Explore Catalogue"
          actionHref="/shop"
        />
        <style jsx>{`
          .cart-empty-wrap {
            padding-top: 2rem;
            padding-bottom: 5rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <Breadcrumb items={breadcrumbs} />

        <div className="cart-header">
          <h1 className="heading-2">Your Shopping Cart</h1>
          <span className="cart-item-count">{totalCount} item{totalCount !== 1 ? 's' : ''}</span>
        </div>

        {/* Free Shipping Tracker */}
        <div className="free-shipping-progress-banner">
          <p className="shipping-banner-text">
            {subtotal >= 300 ? (
              <strong>🎉 You have unlocked FREE Doorstep Delivery in Greater Accra!</strong>
            ) : (
              <span>
                Add <strong>{formatPrice(300 - subtotal)}</strong> more to qualify for <strong>FREE Doorstep Delivery</strong> in Accra.
              </span>
            )}
          </p>
          <div className="progress-track">
            <div
              className="progress-bar"
              style={{ width: `${Math.min(100, (subtotal / 300) * 100)}%` }}
            />
          </div>
        </div>

        <div className="cart-layout-grid">
          {/* Main Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-table-header">
              <span className="col-product">Product</span>
              <span className="col-price">Unit Price</span>
              <span className="col-qty">Quantity</span>
              <span className="col-subtotal">Subtotal</span>
            </div>

            <div className="cart-items-body">
              {items.map(({ product, quantity, selectedVariant }) => {
                const isSkincare = product.category === 'skincare';
                const itemPrice = selectedVariant?.price || product.price;
                const lineTotal = itemPrice * quantity;

                return (
                  <div key={product.id} className="cart-item-card">
                    <div className={`item-thumb ${isSkincare ? 'thumb-skincare' : 'thumb-grocery'}`}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="item-img" />
                      ) : (
                        <span className="item-icon-fallback">{isSkincare ? '✨' : '🍯'}</span>
                      )}
                    </div>

                    <div className="item-info">
                      {product.brand && <span className="item-brand">{product.brand}</span>}
                      <Link href={`/shop/${product.slug}`} className="item-title">
                        {product.name} {selectedVariant ? `(${selectedVariant.name})` : ''}
                      </Link>
                      <div className="item-unit-price-mobile">
                        {formatPrice(itemPrice)} each
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="item-remove-btn"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="item-unit-price-desktop">
                      {formatPrice(itemPrice)}
                    </div>

                    <div className="item-qty-cell">
                      <QuantitySelector
                        value={quantity}
                        min={1}
                        max={product.stockCount || 99}
                        onChange={(newQty) => updateQuantity(product.id, newQty)}
                      />
                    </div>

                    <div className="item-subtotal-cell">
                      {formatPrice(lineTotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-actions-row">
              <Button href="/shop" variant="outline" size="sm">
                ← Continue Shopping
              </Button>
              <button
                type="button"
                onClick={clearCart}
                className="clear-cart-text-btn"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary-col">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal ({totalCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="summary-line">
                  <span>Delivery in Accra</span>
                  <span>{subtotal >= 300 ? 'FREE' : formatPrice(25)}</span>
                </div>

                {promoApplied && (
                  <div className="summary-line discount-line">
                    <span>Discount (10% Off)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="summary-divider" />

                <div className="summary-line total-line">
                  <span>Order Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <form onSubmit={handleApplyPromo} className="promo-form" aria-label="Promo code">
                <div className="promo-input-row">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. WELCOME10)"
                    className="promo-input"
                  />
                  <button type="submit" className="promo-btn">
                    Apply
                  </button>
                </div>
                {promoError && <p className="promo-msg error">{promoError}</p>}
                {promoApplied && <p className="promo-msg success">Promo WELCOME10 applied (10% off)!</p>}
              </form>

              <div className="cart-checkout-actions">
                <Button href="/checkout" variant="primary" size="lg" fullWidth>
                  Proceed to Checkout →
                </Button>

                <a
                  href={generateWhatsAppCartLink()}
                  className="cart-btn-wa-order"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>💬</span>
                  <span>Order Entire Cart via WhatsApp</span>
                </a>
              </div>

              <div className="checkout-assurances">
                <div className="assurance-bullet">
                  <span>🛡️</span>
                  <span>100% Genuine, verified skincare and essentials.</span>
                </div>
                <div className="assurance-bullet">
                  <span>📍</span>
                  <span>Store pickup &amp; fast Accra doorstep delivery.</span>
                </div>
                <div className="assurance-bullet">
                  <span>💳</span>
                  <span>MoMo (MTN, Telecel, AT) &amp; Cash on Delivery.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          padding-top: 1.5rem;
          padding-bottom: 5rem;
          background: #FAF7F2;
          min-height: 100vh;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .cart-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .heading-2 {
          font-family: var(--font-display, serif);
          font-size: 2rem;
          font-weight: 700;
          color: #2D1820;
        }
        .cart-item-count {
          font-size: 0.88rem;
          color: #57534E;
        }
        .free-shipping-progress-banner {
          background-color: #FAF1F4;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
        }
        .shipping-banner-text {
          font-size: 0.85rem;
          color: #7B2347;
          margin-bottom: 0.5rem;
        }
        .progress-track {
          width: 100%;
          height: 6px;
          background: #E7E2DA;
          border-radius: 999px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: #7B2347;
          border-radius: 999px;
          transition: width 0.3s ease;
        }
        .cart-layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1024px) {
          .cart-layout-grid {
            grid-template-columns: 1fr 380px;
            gap: 2.5rem;
          }
        }
        .cart-table-header {
          display: none;
          grid-template-columns: 3fr 1fr 1.5fr 1fr;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #E7E2DA;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8C8580;
        }
        @media (min-width: 768px) {
          .cart-table-header {
            display: grid;
          }
        }
        .cart-items-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        .cart-item-card {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 1rem;
          padding: 1rem;
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          align-items: center;
        }
        @media (min-width: 768px) {
          .cart-item-card {
            grid-template-columns: 80px 2fr 1fr 1.5fr 1fr;
            padding: 1rem 1.5rem;
          }
        }
        .item-thumb {
          width: 80px;
          height: 80px;
          border-radius: 6px;
          overflow: hidden;
          background: #FAF7F2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .item-brand {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #7B2347;
        }
        .item-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: #1C1917;
          text-decoration: none;
        }
        .item-remove-btn {
          align-self: flex-start;
          background: none;
          border: none;
          padding: 0;
          font-size: 0.75rem;
          color: #7B2347;
          text-decoration: underline;
          cursor: pointer;
        }
        .item-unit-price-desktop {
          display: none;
          font-size: 0.9rem;
          color: #1C1917;
          font-weight: 600;
        }
        @media (min-width: 768px) {
          .item-unit-price-desktop {
            display: block;
          }
        }
        .item-subtotal-cell {
          display: none;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1C1917;
        }
        @media (min-width: 768px) {
          .item-subtotal-cell {
            display: block;
          }
        }
        .cart-actions-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }
        .clear-cart-text-btn {
          background: none;
          border: none;
          font-size: 0.82rem;
          color: #8C8580;
          text-decoration: underline;
          cursor: pointer;
        }

        .summary-card {
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          padding: 1.5rem;
          position: sticky;
          top: 90px;
        }
        .summary-title {
          font-family: var(--font-display, serif);
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #2D1820;
        }
        .summary-lines {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #57534E;
        }
        .discount-line {
          color: #166534;
          font-weight: 600;
        }
        .summary-divider {
          height: 1px;
          background: #E7E2DA;
          margin: 0.5rem 0;
        }
        .total-line {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1C1917;
        }
        .promo-form {
          margin: 1.25rem 0;
        }
        .promo-input-row {
          display: flex;
          gap: 8px;
        }
        .promo-input {
          flex: 1;
          padding: 0.65rem 0.85rem;
          border: 1.5px solid #E7E2DA;
          border-radius: 6px;
          font-size: 0.85rem;
          outline: none;
        }
        .promo-btn {
          padding: 0.65rem 1.1rem;
          background: #2D1820;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
        }
        .promo-msg {
          font-size: 0.78rem;
          margin-top: 4px;
        }
        .promo-msg.error { color: #991B1B; }
        .promo-msg.success { color: #166534; }

        .cart-checkout-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .cart-btn-wa-order {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #25D366;
          color: #FFFFFF;
          padding: 0.85rem;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
        }

        .checkout-assurances {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid #E7E2DA;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .assurance-bullet {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.8rem;
          color: #57534E;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
