'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="clean-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="brand-logo">
            <span className="brand-name">CR COSMETICS &amp; ESSENTIALS</span>
          </div>
          <p className="brand-desc">
            Your neighbourhood store in Botwe, Accra for verified skincare, body lotions, fragrant rice, and daily groceries.
          </p>
          <div className="store-meta">
            <span>📍 Near Galaxy International School, Botwe, Accra</span>
            <span>📞 +233 59 215 3306</span>
          </div>
        </div>

        <div className="footer-col">
          <span className="col-heading">Shopping Worlds</span>
          <ul className="links-list">
            <li><Link href="/shop">All Catalogue</Link></li>
            <li><Link href="/shop?category=skincare">Beauty &amp; Skincare</Link></li>
            <li><Link href="/shop?category=groceries">Groceries &amp; Essentials</Link></li>
            <li><Link href="/about">Skincare Routine</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="col-heading">Customer Support</span>
          <ul className="links-list">
            <li><Link href="/contact">Contact &amp; Location</Link></li>
            <li><Link href="/delivery">Delivery Information</Link></li>
            <li><Link href="/returns">Returns &amp; Refunds</Link></li>
            <li><Link href="/faqs">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-col wa-col">
          <span className="col-heading">Direct WhatsApp Order</span>
          <p className="wa-desc">Order directly with our Botwe team for same-day Accra dispatch.</p>
          <a
            href="https://wa.me/233592153306"
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
          >
            💬 Chat on WhatsApp (059 215 3306)
          </a>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="footer-container bottom-flex">
          <span>&copy; {new Date().getFullYear()} CR Cosmetics &amp; Essentials. All rights reserved.</span>
          <span>MTN MoMo &bull; Telecel Cash &bull; AT Money &bull; Cash on Delivery</span>
        </div>
      </div>

      <style jsx>{`
        .clean-footer {
          background: #F3EFEA;
          border-top: 1px solid #E7E2DA;
          color: #1C1917;
          padding-top: 3.5rem;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 1.4fr 0.8fr 0.8fr 1fr;
          gap: 2.5rem;
          padding-bottom: 3rem;
        }

        .brand-name {
          font-family: var(--font-display, serif);
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #2D1820;
          display: block;
          margin-bottom: 0.75rem;
        }
        .brand-desc {
          font-size: 0.85rem;
          line-height: 1.55;
          color: #57534E;
          margin: 0 0 1rem;
          max-width: 320px;
        }
        .store-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.8rem;
          color: #2D1820;
          font-weight: 500;
        }

        .col-heading {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2D1820;
          display: block;
          margin-bottom: 1rem;
        }

        .links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .links-list a {
          font-size: 0.85rem;
          color: #57534E;
          text-decoration: none;
          transition: color 0.15s;
        }
        .links-list a:hover {
          color: #7B2347;
        }

        .wa-desc {
          font-size: 0.85rem;
          color: #57534E;
          margin: 0 0 1rem;
          line-height: 1.5;
        }
        .wa-btn {
          display: inline-flex;
          align-items: center;
          background: #25D366;
          color: #FFFFFF;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 10px 14px;
          border-radius: 6px;
          text-decoration: none;
        }
        .wa-btn:hover {
          background: #1EBE5B;
        }

        .bottom-bar {
          border-top: 1px solid #E7E2DA;
          padding: 1.25rem 0;
          font-size: 0.78rem;
          color: #8C8580;
        }
        .bottom-flex {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        @media (max-width: 860px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        @media (max-width: 500px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}
