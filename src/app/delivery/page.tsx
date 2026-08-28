'use client';

import React from 'react';
import Link from 'next/link';

export default function DeliveryPage() {
  return (
    <div className="policy-page">
      <div className="container">
        <header className="policy-header">
          <span className="policy-eyebrow">FULFILLMENT &amp; LOGISTICS</span>
          <h1 className="policy-title">Delivery Information</h1>
          <p className="policy-sub">Fast, reliable same-day delivery across Greater Accra and direct store pickup in Botwe.</p>
        </header>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Accra Doorstep Delivery Rates</h2>
            <p>We deliver directly to your residence or office across Greater Accra:</p>
            <ul>
              <li><strong>Botwe &amp; Immediate Environs:</strong> GH₵15.00 (Same-day dispatch)</li>
              <li><strong>Madina, East Legon, Adenta:</strong> GH₵20.00 – GH₵25.00</li>
              <li><strong>Central Accra (Airport, Cantonments, Osu, Spintex):</strong> GH₵25.00 – GH₵35.00</li>
              <li><strong>Free Delivery Offer:</strong> Orders of <strong>GH₵300.00 and above</strong> qualify for 100% FREE doorstep delivery across Greater Accra!</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. In-Store Pickup (Botwe)</h2>
            <p>You can choose free store pickup at checkout. Once your order is ready, collect it from our storefront:</p>
            <p><strong>Location:</strong> Near Galaxy International School, Botwe, Accra, Ghana.</p>
            <p><strong>Hours:</strong> Monday – Saturday: 8:00 AM – 8:00 PM</p>
          </section>

          <section className="policy-section">
            <h2>3. Regional Ghana Delivery</h2>
            <p>For orders outside Greater Accra (Kumasi, Takoradi, Tamale, Cape Coast, Ho, Sunyani), we dispatch via VIP/STC parcel delivery or express courier within 24–48 hours.</p>
          </section>

          <div className="policy-actions">
            <Link href="/shop" className="btn btn-primary">Start Shopping &rarr;</Link>
            <Link href="/contact" className="btn btn-outline">Contact Store Support</Link>
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
