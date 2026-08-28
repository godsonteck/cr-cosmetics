'use client';

import React from 'react';
import Link from 'next/link';

const VALUES = [
  {
    icon: '✨',
    title: '100% Authenticity Guaranteed',
    desc: 'Every single serum, lotion, soap, and pantry item is verified genuine and sourced directly from reputable cosmetic distributors.',
  },
  {
    icon: '📍',
    title: 'Rooted in Botwe, Serving Accra',
    desc: 'Conveniently located near Galaxy International School. We bring premium global and local wellness staples right to your neighbourhood.',
  },
  {
    icon: '💧',
    title: 'Skin-First Formulation Care',
    desc: 'We curate products specifically chosen to thrive in the Ghanaian tropical climate — prioritizing hydration, barrier repair, and radiant tone.',
  },
  {
    icon: '🤝',
    title: 'Community & Trust',
    desc: 'From flexible MoMo payments to personal WhatsApp skincare recommendations, our customers are family.',
  },
];

export default function AboutPage() {
  return (
    <div className="cr-about-page">
      <section className="cr-about-hero">
        <div className="cr-about-container">
          <span className="cr-about-eyebrow">OUR STORY &amp; PHILOSOPHY</span>
          <h1 className="cr-about-title">
            Bringing Everyday Beauty &amp; Quality Essentials to <span className="cr-title-italic">Botwe.</span>
          </h1>

          <div className="cr-about-lead-grid">
            <p className="cr-lead-p">
              CR Cosmetics &amp; Essentials was founded with a clear, heartfelt purpose: to ensure that the residents of Botwe and Greater Accra have immediate access to 100% genuine skincare, nourishing body care, and verified household essentials.
            </p>
            <p className="cr-lead-p">
              Located right by Galaxy International School in Botwe, we bridge the gap between world-class beauty formulations and everyday household convenience — delivering directly to your door with care, speed, and integrity.
            </p>
          </div>
        </div>
      </section>

      <section className="cr-pillars-section">
        <div className="cr-about-container">
          <div className="cr-pillars-header">
            <span className="cr-about-eyebrow">WHAT WE STAND FOR</span>
            <h2 className="cr-pillars-title">Our Core Commitments</h2>
          </div>

          <div className="cr-pillars-grid">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="cr-pillar-card">
                <span className="cr-pillar-icon">{icon}</span>
                <h3 className="cr-pillar-h">{title}</h3>
                <p className="cr-pillar-p">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cr-store-section">
        <div className="cr-about-container">
          <div className="cr-store-card">
            <div className="cr-store-info">
              <span className="cr-store-tag">FLAGSHIP STORE</span>
              <h2 className="cr-store-title">Visit Us in Botwe</h2>
              <p className="cr-store-address">
                📍 Near Galaxy International School, Botwe, Greater Accra, Ghana
              </p>
              <div className="cr-store-meta">
                <div>
                  <strong>Store Hours:</strong>
                  <p>Monday – Saturday: 8:00 AM – 8:00 PM</p>
                </div>
                <div>
                  <strong>Phone / WhatsApp:</strong>
                  <p>+233 59 215 3306 (059 215 3306)</p>
                </div>
              </div>
              <div className="cr-store-actions">
                <Link href="/shop" className="cr-btn-primary">
                  Shop Online Now
                </Link>
                <a
                  href="https://wa.me/233592153306"
                  className="cr-btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat with Our Team
                </a>
              </div>
            </div>
            <div className="cr-store-visual">
              <img
                src="/images/hero-pedestal.jpg"
                alt="CR Cosmetics & Essentials Storefront"
                className="cr-store-img"
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .cr-about-page {
          padding-top: 100px;
          background: #FAF7F2;
          min-height: 100vh;
        }

        .cr-about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .cr-about-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7B2347;
          display: block;
          margin-bottom: 0.5rem;
        }

        .cr-about-hero {
          padding: 3.5rem 0 3rem;
          border-bottom: 1px solid #E7E2DA;
          background: #FFFFFF;
        }

        .cr-about-title {
          font-family: var(--font-display, serif);
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 700;
          color: #2D1820;
          line-height: 1.15;
          max-width: 22ch;
          margin-bottom: 2.5rem;
        }

        .cr-title-italic {
          font-family: var(--font-script, serif);
          font-style: italic;
          color: #7B2347;
        }

        .cr-about-lead-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .cr-lead-p {
          font-size: 1rem;
          line-height: 1.7;
          color: #57534E;
        }

        .cr-pillars-section {
          padding: 4rem 0;
          background: #FAF7F2;
        }

        .cr-pillars-header {
          margin-bottom: 2.5rem;
        }

        .cr-pillars-title {
          font-family: var(--font-display, serif);
          font-size: 2rem;
          font-weight: 700;
          color: #2D1820;
        }

        .cr-pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
        }

        .cr-pillar-card {
          padding: 2rem;
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cr-pillar-icon {
          font-size: 1.75rem;
        }

        .cr-pillar-h {
          font-family: var(--font-display, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: #2D1820;
        }

        .cr-pillar-p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #57534E;
        }

        .cr-store-section {
          padding: 3rem 0 5rem;
        }

        .cr-store-card {
          background: #2D1820;
          color: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
        }

        .cr-store-info {
          padding: 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cr-store-tag {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #C59B3F;
        }

        .cr-store-title {
          font-family: var(--font-display, serif);
          font-size: 2.2rem;
          font-weight: 700;
        }

        .cr-store-address {
          font-size: 0.95rem;
          color: #E7E2DA;
        }

        .cr-store-meta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: #A8A29E;
          padding: 1rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .cr-store-meta strong {
          color: #FFFFFF;
          display: block;
          margin-bottom: 2px;
        }

        .cr-store-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cr-btn-primary {
          padding: 0.85rem 1.6rem;
          background: #7B2347;
          color: #FFFFFF;
          font-weight: 700;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 0.82rem;
          border-radius: 6px;
        }

        .cr-btn-secondary {
          padding: 0.85rem 1.6rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
          font-weight: 700;
          text-decoration: none;
          font-size: 0.82rem;
          border-radius: 6px;
        }

        .cr-store-visual {
          height: 100%;
          min-height: 340px;
        }

        .cr-store-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 900px) {
          .cr-about-lead-grid { grid-template-columns: 1fr; }
          .cr-pillars-grid { grid-template-columns: 1fr; }
          .cr-store-card { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
