'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="policy-page">
      <div className="container">
        <header className="policy-header">
          <span className="policy-eyebrow">TERMS OF SERVICE</span>
          <h1 className="policy-title">Terms &amp; Conditions</h1>
          <p className="policy-sub">Terms governing purchases and storefront usage at CR Cosmetics &amp; Essentials.</p>
        </header>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Pricing &amp; Currency</h2>
            <p>All prices listed across our storefront are in Ghanaian Cedis (GHS / GH₵). Prices are inclusive of applicable taxes but exclude doorstep delivery fees unless specified.</p>
          </section>

          <section className="policy-section">
            <h2>2. Product Sourcing &amp; Authenticity</h2>
            <p>CR Cosmetics &amp; Essentials guarantees 100% genuine products sourced from authorized regional distributors. Product descriptions reflect factual specifications provided by manufacturer labels.</p>
          </section>

          <section className="policy-section">
            <h2>3. Order Fulfillment &amp; Dispatch</h2>
            <p>Orders placed before 2:00 PM GMT for Botwe and Greater Accra are eligible for same-day doorstep dispatch. Orders placed after 2:00 PM are dispatched next morning.</p>
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
