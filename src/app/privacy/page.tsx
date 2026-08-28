'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="policy-page">
      <div className="container">
        <header className="policy-header">
          <span className="policy-eyebrow">DATA SECURITY</span>
          <h1 className="policy-title">Privacy Policy</h1>
          <p className="policy-sub">How CR Cosmetics &amp; Essentials handles and protects your personal information.</p>
        </header>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>When you place an order or create an account, we collect your name, phone number, email address, and delivery location to fulfill your order and send delivery receipts.</p>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Data</h2>
            <p>Your details are used strictly for order processing, Ghana dispatch logistics, customer support communication, and account management. We never sell or lease customer data.</p>
          </section>

          <section className="policy-section">
            <h2>3. Payment Security</h2>
            <p>Mobile Money transactions and card payments are processed securely through encrypted local financial gateways. CR Cosmetics &amp; Essentials does not store raw Mobile Money PINs or credit card CVV numbers.</p>
          </section>

          <div className="policy-actions">
            <Link href="/shop" className="btn btn-primary">Return to Shop &rarr;</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .policy-page { padding-top: 100px; padding-bottom: 80px; background: #FAF7F2; min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
        .policy-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E7E2DA; }
        .policy-eyebrow { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; color: #7B2347; text-transform: uppercase; }
        .policy-title { font-family: var(--font-display, serif); font-size: 2.5rem; font-weight: 700; color: #2D1820; margin: 0.25rem 0; }
        .policy-sub { font-size: 0.95rem; color: #57534E; }
        .policy-content { background: #FFFFFF; border: 1px solid #E7E2DA; border-radius: 12px; padding: 2.5rem; }
        .policy-section { margin-bottom: 2rem; }
        .policy-section h2 { font-family: var(--font-display, serif); font-size: 1.35rem; color: #2D1820; margin-bottom: 0.75rem; }
        .policy-section p { font-size: 0.92rem; color: #57534E; line-height: 1.6; }
        .policy-actions { display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #E7E2DA; }
      `}</style>
    </div>
  );
}
