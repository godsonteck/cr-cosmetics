'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/utils/formatPrice';
import { BUSINESS } from '@/utils/constants';

interface OrderConfirmation {
  orderId: string;
  date: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    deliveryMethod: string;
    area: string;
    address: string;
    paymentMethod: string;
    momoNetwork: string;
  };
  orderStatus: string;
  paymentStatus: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { addToast } = useToast();

  const [activeStep, setActiveStep] = useState<number>(1);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryMethod: 'doorstep',
    area: 'Botwe',
    address: '',
    gpsLandmark: '',
    deliveryNotes: '',
    paymentMethod: 'momo',
    momoNetwork: 'mtn',
    momoNumber: '',
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<OrderConfirmation | null>(null);

  const deliveryFee = formData.deliveryMethod === 'pickup' ? 0 : subtotal >= 300 ? 0 : 25;
  const calculatedDiscount = promoApplied ? subtotal * 0.1 : 0;
  const calculatedTotal = Math.max(0, subtotal + deliveryFee - calculatedDiscount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === 'WELCOME10' || promoCode.trim().toUpperCase() === 'GLOW10') {
      setPromoApplied(true);
      addToast({
        title: 'Promo Applied!',
        message: '10% discount has been applied to your order.',
        type: 'success',
      });
    } else {
      addToast({
        title: 'Invalid Code',
        message: 'Try code "WELCOME10" for 10% off.',
        type: 'error',
      });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step >= 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please enter your phone number';
      } else if (formData.phone.trim().replace(/\D/g, '').length < 9) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email address';
      }
    }
    if (step >= 2 && formData.deliveryMethod === 'doorstep') {
      if (!formData.address.trim()) {
        newErrors.address = 'Please enter your delivery street address or landmark';
      }
    }
    if (step >= 3 && formData.paymentMethod === 'momo') {
      if (!formData.momoNumber.trim()) {
        newErrors.momoNumber = 'Please enter your Mobile Money wallet number';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (targetStep: number) => {
    if (validateStep(activeStep)) {
      setActiveStep(targetStep);
      window.scrollTo({ top: 140, behavior: 'smooth' });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      const apiItems = items.map(({ product, quantity, selectedVariant }) => ({
        productId: product.id,
        quantity,
        variantId: selectedVariant?.id,
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: apiItems,
          customerData: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            area: formData.area,
            deliveryNotes: formData.deliveryNotes,
          },
          deliveryMethod: formData.deliveryMethod,
          paymentMethod: formData.paymentMethod,
          paymentNetwork: formData.momoNetwork === 'mtn' ? 'MTN MoMo' : formData.momoNetwork === 'telecel' ? 'Telecel Cash' : 'AT Money',
          momoWalletNumber: formData.momoNumber,
          discountAmount: calculatedDiscount,
          promoCode: promoApplied ? promoCode : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not complete order. Please review your details.');
      }

      setOrderConfirmed({
        orderId: data.order?.orderNumber || `CR-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: items.map(({ product, quantity }) => ({
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          },
          quantity,
        })),
        subtotal,
        deliveryFee,
        discount: calculatedDiscount,
        total: calculatedTotal,
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          deliveryMethod: formData.deliveryMethod,
          area: formData.area,
          address: formData.address,
          paymentMethod: formData.paymentMethod,
          momoNetwork: formData.momoNetwork === 'mtn' ? 'MTN MoMo' : formData.momoNetwork === 'telecel' ? 'Telecel Cash' : 'AT Money',
        },
        orderStatus: 'confirmed',
        paymentStatus: 'paid',
      });

      clearCart();
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setIsSubmitting(false);
      addToast({
        title: 'Order Processing Error',
        message: err.message || 'Could not complete order. Please try again.',
        type: 'error',
      });
    }
  };

  if (orderConfirmed) {
    return (
      <div className="confirmation-page-root">
        <div className="container confirmation-container">
          <div className="confirmation-luxe-card">
            <div className="conf-celebration-head">
              <div className="conf-check-orb">✓</div>
              <span className="conf-subtitle-pill">ORDER CONFIRMED</span>
              <h1 className="conf-main-title">Thank You, {orderConfirmed.customer.fullName.split(' ')[0]}!</h1>
              <p className="conf-intro-text">
                Your order <strong className="order-id-txt">#{orderConfirmed.orderId}</strong> has been received and is being prepared at our Botwe storefront.
              </p>
            </div>

            <div className="receipt-summary-grid">
              <div className="receipt-pane">
                <h3 className="pane-title">Fulfillment Details</h3>
                <div className="receipt-info-rows">
                  <div className="r-row">
                    <span className="r-label">Customer:</span>
                    <strong className="r-val">{orderConfirmed.customer.fullName}</strong>
                  </div>
                  <div className="r-row">
                    <span className="r-label">Contact Phone:</span>
                    <strong className="r-val">{orderConfirmed.customer.phone}</strong>
                  </div>
                  <div className="r-row">
                    <span className="r-label">Email Receipt:</span>
                    <strong className="r-val">{orderConfirmed.customer.email}</strong>
                  </div>
                  <div className="r-row">
                    <span className="r-label">Fulfillment Mode:</span>
                    <strong className="r-val highlight-mode">
                      {orderConfirmed.customer.deliveryMethod === 'pickup'
                        ? `🏬 Free Store Pickup (${BUSINESS.location})`
                        : `🚚 Express Doorstep Dispatch (${orderConfirmed.customer.area})`}
                    </strong>
                  </div>
                  {orderConfirmed.customer.deliveryMethod === 'doorstep' && (
                    <div className="r-row">
                      <span className="r-label">Street Address:</span>
                      <strong className="r-val">{orderConfirmed.customer.address}</strong>
                    </div>
                  )}
                  <div className="r-row">
                    <span className="r-label">Payment Mode:</span>
                    <strong className="r-val uppercase">
                      {orderConfirmed.customer.paymentMethod === 'momo'
                        ? `📱 Mobile Money (${orderConfirmed.customer.momoNetwork})`
                        : orderConfirmed.customer.paymentMethod === 'card'
                        ? '💳 Debit / Credit Card'
                        : '💵 Cash on Delivery'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="receipt-pane">
                <h3 className="pane-title">Items Ordered ({orderConfirmed.items.length})</h3>
                <div className="ordered-items-list">
                  {orderConfirmed.items.map((item) => (
                    <div key={item.product.id} className="ordered-item-row">
                      <img src={item.product.image} alt={item.product.name} className="ordered-thumb" />
                      <div className="ordered-details">
                        <div className="ordered-name">{item.product.name}</div>
                        <div className="ordered-meta">Qty: {item.quantity} • {formatPrice(item.product.price)}</div>
                      </div>
                      <div className="ordered-line-price">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="receipt-totals-table">
                  <div className="total-r-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(orderConfirmed.subtotal)}</span>
                  </div>
                  <div className="total-r-row">
                    <span>Delivery:</span>
                    <span>{orderConfirmed.deliveryFee === 0 ? 'FREE' : formatPrice(orderConfirmed.deliveryFee)}</span>
                  </div>
                  {orderConfirmed.discount > 0 && (
                    <div className="total-r-row discount-row">
                      <span>Promo Discount:</span>
                      <span>-{formatPrice(orderConfirmed.discount)}</span>
                    </div>
                  )}
                  <div className="total-r-row grand-total-row">
                    <span>Total Amount:</span>
                    <span className="grand-val">{formatPrice(orderConfirmed.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="conf-actions-group">
              <Link href="/account" className="btn-conf-solid">
                View Account Orders &rarr;
              </Link>
              <Link href="/shop" className="btn-conf-outline">
                Back to Storefront
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .confirmation-page-root {
            background-color: #FAF7F2;
            padding: 48px 0 80px;
            min-height: 80vh;
          }
          .confirmation-container {
            max-width: 840px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }
          .confirmation-luxe-card {
            background: #FFFFFF;
            border: 1px solid #E7E2DA;
            border-radius: 12px;
            padding: 40px;
          }
          .conf-celebration-head {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 32px;
          }
          .conf-check-orb {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #7B2347;
            color: #FFFFFF;
            font-size: 28px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .conf-subtitle-pill {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: #7B2347;
            background: #FAF1F4;
            padding: 4px 14px;
            border-radius: 999px;
            margin-bottom: 8px;
          }
          .conf-main-title {
            font-family: var(--font-display, serif);
            font-size: 30px;
            font-weight: 700;
            color: #2D1820;
            margin-bottom: 8px;
          }
          .conf-intro-text {
            font-size: 14px;
            color: #57534E;
            max-width: 500px;
          }
          .order-id-txt {
            color: #7B2347;
          }
          .receipt-summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 32px;
          }
          .receipt-pane {
            background: #FAF7F2;
            border: 1px solid #E7E2DA;
            border-radius: 8px;
            padding: 20px;
          }
          .pane-title {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            color: #2D1820;
            margin-bottom: 14px;
            padding-bottom: 8px;
            border-bottom: 1px solid #E7E2DA;
          }
          .receipt-info-rows {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .r-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
          }
          .r-label {
            color: #57534E;
          }
          .r-val {
            color: #1C1917;
            text-align: right;
          }
          .highlight-mode {
            color: #7B2347;
          }
          .ordered-items-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 180px;
            overflow-y: auto;
            margin-bottom: 14px;
          }
          .ordered-item-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .ordered-thumb {
            width: 36px;
            height: 36px;
            border-radius: 6px;
            object-fit: cover;
          }
          .ordered-details {
            flex: 1;
            min-width: 0;
          }
          .ordered-name {
            font-size: 11.5px;
            font-weight: 600;
            color: #1C1917;
          }
          .ordered-meta {
            font-size: 10.5px;
            color: #8C8580;
          }
          .ordered-line-price {
            font-size: 11.5px;
            font-weight: 700;
            color: #1C1917;
          }
          .receipt-totals-table {
            border-top: 1px dashed #E7E2DA;
            padding-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .total-r-row {
            display: flex;
            justify-content: space-between;
            font-size: 11.5px;
            color: #57534E;
          }
          .discount-row {
            color: #166534;
            font-weight: 600;
          }
          .grand-total-row {
            font-size: 13.5px;
            font-weight: 800;
            color: #1C1917;
            padding-top: 6px;
            border-top: 1px solid #E7E2DA;
          }
          .grand-val {
            color: #7B2347;
            font-size: 15px;
          }
          .conf-actions-group {
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .btn-conf-solid {
            background-color: #7B2347;
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 700;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
          }
          .btn-conf-outline {
            border: 1px solid #E7E2DA;
            color: #1C1917;
            font-size: 12px;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="checkout-page-root">
      <div className="container checkout-container">
        <div className="checkout-top-head">
          <div className="checkout-brand-row">
            <span>🔒</span>
            <span>SECURE CHECKOUT • CR COSMETICS &amp; ESSENTIALS</span>
          </div>
          <h1 className="checkout-title">Express Store Checkout</h1>
        </div>

        <div className="checkout-steps-nav">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`step-nav-btn ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`}
          >
            <span className="step-num">{activeStep > 1 ? '✓' : '1'}</span>
            <span className="step-txt">Contact Info</span>
          </button>
          <div className="step-nav-divider" />
          <button
            type="button"
            onClick={() => validateStep(1) && setActiveStep(2)}
            className={`step-nav-btn ${activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : ''}`}
          >
            <span className="step-num">{activeStep > 2 ? '✓' : '2'}</span>
            <span className="step-txt">Fulfillment</span>
          </button>
          <div className="step-nav-divider" />
          <button
            type="button"
            onClick={() => validateStep(2) && setActiveStep(3)}
            className={`step-nav-btn ${activeStep === 3 ? 'active' : ''}`}
          >
            <span className="step-num">3</span>
            <span className="step-txt">Payment</span>
          </button>
        </div>

        <div className="checkout-split-grid">
          <div className="checkout-forms-column">
            <form onSubmit={handleSubmitOrder} className="luxe-checkout-form">
              {activeStep === 1 && (
                <div className="form-step-card">
                  <div className="step-card-header">
                    <h2 className="step-heading">1. Customer Contact Details</h2>
                    <p className="step-desc">Enter your contact info for order confirmation and receipt.</p>
                  </div>

                  <div className="fields-stack">
                    <div className="input-group">
                      <label className="field-label">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ama Serwaa"
                        className={`luxe-input ${errors.fullName ? 'has-error' : ''}`}
                      />
                      {errors.fullName && <span className="field-err">{errors.fullName}</span>}
                    </div>

                    <div className="fields-row-2">
                      <div className="input-group">
                        <label className="field-label">Phone / WhatsApp Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="059 215 3306"
                          className={`luxe-input ${errors.phone ? 'has-error' : ''}`}
                        />
                        {errors.phone && <span className="field-err">{errors.phone}</span>}
                      </div>

                      <div className="input-group">
                        <label className="field-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className={`luxe-input ${errors.email ? 'has-error' : ''}`}
                        />
                        {errors.email && <span className="field-err">{errors.email}</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNextStep(2)}
                      className="btn-continue-step"
                    >
                      Continue to Fulfillment &rarr;
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="form-step-card">
                  <div className="step-card-header">
                    <h2 className="step-heading">2. Delivery &amp; Fulfillment Method</h2>
                    <p className="step-desc">Choose doorstep delivery across Accra or free pickup at our Botwe storefront.</p>
                  </div>

                  <div className="fulfillment-options-grid">
                    <label className={`fulfillment-card ${formData.deliveryMethod === 'doorstep' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="doorstep"
                        checked={formData.deliveryMethod === 'doorstep'}
                        onChange={handleChange}
                        className="radio-sr"
                      />
                      <div className="f-icon">🚚</div>
                      <div className="f-info">
                        <strong className="f-title">Express Doorstep Delivery</strong>
                        <span className="f-sub">Greater Accra delivery to your home or office</span>
                      </div>
                      <span className="f-price-tag">
                        {subtotal >= 300 ? 'FREE (300+ GHS)' : 'GH₵25.00'}
                      </span>
                    </label>

                    <label className={`fulfillment-card ${formData.deliveryMethod === 'pickup' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={formData.deliveryMethod === 'pickup'}
                        onChange={handleChange}
                        className="radio-sr"
                      />
                      <div className="f-icon">🏬</div>
                      <div className="f-info">
                        <strong className="f-title">Store Pickup</strong>
                        <span className="f-sub">Botwe, near Galaxy International School</span>
                      </div>
                      <span className="f-price-tag free-tag">FREE</span>
                    </label>
                  </div>

                  {formData.deliveryMethod === 'doorstep' && (
                    <div className="doorstep-fields-wrap">
                      <div className="input-group">
                        <label className="field-label">Delivery Area / Neighborhood</label>
                        <select
                          name="area"
                          value={formData.area}
                          onChange={handleChange}
                          className="luxe-select"
                        >
                          <option value="Botwe">Botwe / School Junction</option>
                          <option value="Madina">Madina</option>
                          <option value="East Legon">East Legon</option>
                          <option value="Adenta">Adenta</option>
                          <option value="Airport Residential">Airport Residential</option>
                          <option value="Cantonments">Cantonments / Labone</option>
                          <option value="Spintex">Spintex Road</option>
                          <option value="Tema">Tema</option>
                          <option value="Other Accra">Other Greater Accra</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="field-label">Street Address &amp; Landmark *</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="e.g. House 42, near Galaxy International School"
                          className={`luxe-input ${errors.address ? 'has-error' : ''}`}
                        />
                        {errors.address && <span className="field-err">{errors.address}</span>}
                      </div>
                    </div>
                  )}

                  <div className="step-actions-row">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="btn-back-step"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNextStep(3)}
                      className="btn-continue-step"
                    >
                      Continue to Payment &rarr;
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="form-step-card">
                  <div className="step-card-header">
                    <h2 className="step-heading">3. Payment Channel</h2>
                    <p className="step-desc">Select your payment method.</p>
                  </div>

                  <div className="payment-options-grid">
                    <label className={`payment-card ${formData.paymentMethod === 'momo' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="momo"
                        checked={formData.paymentMethod === 'momo'}
                        onChange={handleChange}
                        className="radio-sr"
                      />
                      <div className="pay-card-head">
                        <div className="pay-icon">📱</div>
                        <div>
                          <strong className="pay-title">Mobile Money (Ghana)</strong>
                          <span className="pay-sub">MTN MoMo, Telecel Cash, AT Money</span>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="radio-sr"
                      />
                      <div className="pay-card-head">
                        <div className="pay-icon">💵</div>
                        <div>
                          <strong className="pay-title">Cash on Delivery</strong>
                          <span className="pay-sub">Pay upon doorstep arrival</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {formData.paymentMethod === 'momo' && (
                    <div className="momo-inputs-box">
                      <div className="input-group">
                        <label className="field-label">Mobile Money Wallet Number *</label>
                        <input
                          type="tel"
                          name="momoNumber"
                          value={formData.momoNumber}
                          onChange={handleChange}
                          placeholder="e.g. 059 215 3306"
                          className={`luxe-input ${errors.momoNumber ? 'has-error' : ''}`}
                        />
                        {errors.momoNumber && <span className="field-err">{errors.momoNumber}</span>}
                      </div>
                    </div>
                  )}

                  <div className="step-actions-row">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="btn-back-step"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-submit-order"
                    >
                      {isSubmitting ? 'Processing Order...' : `Complete Order • ${formatPrice(calculatedTotal)}`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="checkout-summary-column">
            <div className="sticky-summary-card">
              <div className="summary-head">
                <h3 className="summary-title">Order Summary</h3>
                <span className="summary-items-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="summary-items-scroll">
                {items.map(({ product, quantity, selectedVariant }) => (
                  <div key={product.id} className="summary-item-card">
                    <div className="summary-thumb-wrap">
                      <img src={product.image} alt={product.name} className="summary-thumb-img" />
                      <span className="item-qty-badge">{quantity}</span>
                    </div>
                    <div className="summary-item-info">
                      <div className="s-brand">{product.brand}</div>
                      <div className="s-name">{product.name} {selectedVariant ? `(${selectedVariant.name})` : ''}</div>
                    </div>
                    <div className="summary-item-price">
                      {formatPrice((selectedVariant?.price || product.price) * quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleApplyPromo} className="summary-promo-form">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (WELCOME10)"
                  className="promo-input"
                />
                <button type="submit" className="btn-apply-promo">
                  Apply
                </button>
              </form>

              <div className="summary-breakdown">
                <div className="b-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="b-row">
                  <span>Delivery:</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="free-txt">FREE</strong>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                {calculatedDiscount > 0 && (
                  <div className="b-row discount-row">
                    <span>10% Promo Discount:</span>
                    <span>-{formatPrice(calculatedDiscount)}</span>
                  </div>
                )}
                <div className="b-row total-row">
                  <span>Grand Total:</span>
                  <span className="grand-price">{formatPrice(calculatedTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page-root {
          background-color: #FAF7F2;
          padding: 36px 0 80px;
          min-height: 85vh;
        }
        .checkout-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .checkout-top-head {
          margin-bottom: 24px;
        }
        .checkout-brand-row {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #7B2347;
          margin-bottom: 6px;
        }
        .checkout-title {
          font-family: var(--font-display, serif);
          font-size: 32px;
          font-weight: 700;
          color: #2D1820;
        }

        .checkout-steps-nav {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 12px;
          padding: 8px 16px;
          margin-bottom: 32px;
        }
        .step-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 14px;
          border-radius: 8px;
        }
        .step-nav-btn.active {
          background: #FAF1F4;
        }
        .step-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #E7E2DA;
          color: #57534E;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-nav-btn.active .step-num {
          background: #7B2347;
          color: #FFFFFF;
        }
        .step-txt {
          font-size: 12px;
          font-weight: 700;
          color: #1C1917;
        }
        .step-nav-divider {
          flex: 1;
          height: 1px;
          background: #E7E2DA;
          margin: 0 12px;
        }

        .checkout-split-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 36px;
          align-items: flex-start;
        }
        @media (max-width: 960px) {
          .checkout-split-grid { grid-template-columns: 1fr; }
        }

        .form-step-card {
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 12px;
          padding: 32px;
        }
        .step-card-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #E7E2DA;
        }
        .step-heading {
          font-size: 18px;
          font-weight: 700;
          color: #2D1820;
          margin-bottom: 4px;
        }
        .step-desc {
          font-size: 12px;
          color: #57534E;
        }

        .fields-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .fields-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 11.5px;
          font-weight: 700;
          color: #1C1917;
        }
        .luxe-input, .luxe-select {
          height: 44px;
          padding: 0 14px;
          border: 1px solid #E7E2DA;
          border-radius: 6px;
          font-size: 13px;
          color: #1C1917;
          background: #FFFFFF;
        }
        .field-err {
          font-size: 11px;
          color: #991B1B;
        }

        .fulfillment-options-grid, .payment-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        .fulfillment-card, .payment-card {
          border: 1.5px solid #E7E2DA;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
          background: #FFFFFF;
        }
        .fulfillment-card.selected, .payment-card.selected {
          border-color: #7B2347;
          background: #FAF1F4;
        }
        .radio-sr { position: absolute; opacity: 0; }
        .f-icon, .pay-icon { font-size: 24px; }
        .f-title, .pay-title { font-size: 13px; font-weight: 700; color: #1C1917; }
        .f-sub, .pay-sub { font-size: 11px; color: #57534E; }
        .f-price-tag { font-size: 11px; font-weight: 800; color: #7B2347; }
        .free-tag { color: #166534; }

        .doorstep-fields-wrap, .momo-inputs-box {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          padding: 18px;
          margin-bottom: 24px;
        }

        .btn-continue-step, .btn-submit-order {
          width: 100%;
          height: 48px;
          background-color: #7B2347;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-continue-step:hover, .btn-submit-order:hover {
          background-color: #5E1937;
        }
        .step-actions-row {
          display: flex;
          gap: 12px;
        }
        .btn-back-step {
          height: 48px;
          padding: 0 20px;
          background: transparent;
          border: 1px solid #E7E2DA;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #1C1917;
          cursor: pointer;
        }

        .sticky-summary-card {
          position: sticky;
          top: 90px;
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 12px;
          padding: 24px;
        }
        .summary-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid #E7E2DA;
          margin-bottom: 16px;
        }
        .summary-title { font-size: 15px; font-weight: 700; color: #2D1820; }
        .summary-items-count { font-size: 12px; color: #57534E; }
        .summary-items-scroll {
          max-height: 240px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 18px;
        }
        .summary-item-card {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .summary-thumb-wrap {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 6px;
          overflow: hidden;
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          flex-shrink: 0;
        }
        .summary-thumb-img { width: 100%; height: 100%; object-fit: cover; }
        .item-qty-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #7B2347;
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 800;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .summary-item-info { flex: 1; min-width: 0; }
        .s-brand { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #7B2347; }
        .s-name { font-size: 12px; font-weight: 600; color: #1C1917; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .summary-item-price { font-size: 12.5px; font-weight: 700; color: #1C1917; }

        .summary-promo-form {
          display: flex;
          gap: 6px;
          margin-bottom: 18px;
          padding-top: 14px;
          border-top: 1px dashed #E7E2DA;
        }
        .promo-input { flex: 1; height: 38px; padding: 0 12px; border: 1px solid #E7E2DA; border-radius: 6px; font-size: 12px; }
        .btn-apply-promo { height: 38px; padding: 0 14px; background: #2D1820; color: #FFFFFF; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; }

        .summary-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px 0;
          border-top: 1px solid #E7E2DA;
          border-bottom: 1px solid #E7E2DA;
        }
        .b-row { display: flex; justify-content: space-between; font-size: 12.5px; color: #57534E; }
        .total-row { font-size: 15px; font-weight: 800; color: #1C1917; }
        .grand-price { color: #7B2347; font-size: 18px; }
      `}</style>
    </div>
  );
}
