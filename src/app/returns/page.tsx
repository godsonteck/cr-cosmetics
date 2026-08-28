'use client';

import React from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="policy-page">
      <div className="container">
        <header className="policy-header">
          <span className="policy-eyebrow">CUSTOMER PROTECTION</span>
          <h1 className="policy-title">Returns &amp; Refunds Policy</h1>
          <p className="policy-sub">We prioritize authenticity, safety, and customer satisfaction at CR Cosmetics &amp; Essentials.</p>
        </header>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Product Verification &amp; Inspection</h2>
            <p>Every order dispatched from our Botwe storefront undergoes strict quality inspection. We guarantee that all skincare, cosmetics, and groceries are 100% genuine and unadulterated.</p>
          </section>

          <section className="policy-section">
            <h2>2. Eligible Return Conditions</h2>
            <p>We accept return requests within <strong>48 hours of delivery</strong> under the following conditions:</p>
            <ul>
              <li>The item arrived damaged or defective during transit.</li>
              <li>An incorrect product variant was dispatched compared to your order confirmation.</li>
              <li>The product seal remains completely unopened, untampered, and in original packaging.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Hygiene &amp; Non-Returnable Items</h2>
            <p>For health, hygiene, and cosmetic safety reasons, opened skincare products, unsealed cosmetics, or opened food items cannot be returned once unsealed unless defective.</p>
          </section>

          <section className="policy-section">
            <h2>4. Refund Processing</h2>
            <p>Approved refunds are issued back via Mobile Money (MTN MoMo, Telecel Cash, AT Money) or store credit within 24 business hours of receiving and verifying the returned item.</p>
          </section>

          <div className="policy-actions">
            <a href="https://wa.me/233592153306" className="btn btn-primary" target="_blank" rel="noopener noreferrer">Request Return on WhatsApp</a>
            <Link href="/contact" className="btn btn-outline">Contact Customer Support</Link>
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
        .policy-section p { font-size: 0.92rem; color: #57534E; line-height: 1.6; margin-bottom: 0.5rem; }
        .policy-section ul { padding-left: 1.25rem; font-size: 0.92rem; color: #57534E; line-height: 1.7; }
        .policy-actions { display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #E7E2DA; }
      `}</style>
    </div>
  );
}
