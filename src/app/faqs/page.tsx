'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    q: 'Where is CR Cosmetics & Essentials located?',
    a: 'Our physical store is conveniently located near Galaxy International School in Botwe, Accra, Ghana. You can visit us in person or order online for same-day delivery.',
  },
  {
    q: 'Are all skincare products 100% genuine?',
    a: 'Yes, 100%. We source all cosmetics, lotions, serums, and body washes directly from verified brand distributors (Neutrogena, Olay, Medix 5.5, K-Beauty brands).',
  },
  {
    q: 'How fast is doorstep delivery in Accra?',
    a: 'Orders within Botwe, Madina, East Legon, and Adenta are delivered within 2–4 hours. Other Greater Accra locations receive same-day delivery when ordered before 2:00 PM.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Mobile Money (MTN MoMo, Telecel Cash, AT Money), Visa & Mastercard debit/credit cards, and Cash on Delivery for eligible Accra areas.',
  },
  {
    q: 'Can I order both skincare and groceries in one cart?',
    a: 'Absolutely! Our store is designed as One Brand with Two Shopping Worlds. You can freely combine Neutrogena face gels with fragrant jasmine rice and raw shea butter in a single checkout.',
  },
];

export default function FAQsPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="faqs-page">
      <div className="container">
        <header className="faqs-header">
          <span className="faqs-eyebrow">HELP &amp; ANSWERS</span>
          <h1 className="faqs-title">Frequently Asked Questions</h1>
          <p className="faqs-sub">Find answers to common questions about our products, delivery, and store location.</p>
        </header>

        <div className="faqs-card">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`faq-item ${openIdx === idx ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span>{faq.q}</span>
                <span className="faq-toggle-icon">{openIdx === idx ? '−' : '+'}</span>
              </button>
              {openIdx === idx && (
                <div className="faq-answer-body">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}

          <div className="faqs-foot">
            <p>Still have questions? Chat directly with our Botwe store team.</p>
            <a href="https://wa.me/233592153306" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              💬 Ask on WhatsApp (059 215 3306)
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .faqs-page { padding-top: 100px; padding-bottom: 80px; background: #FAF7F2; min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
        .faqs-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E7E2DA; }
        .faqs-eyebrow { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; color: #7B2347; text-transform: uppercase; }
        .faqs-title { font-family: var(--font-display, serif); font-size: 2.5rem; font-weight: 700; color: #2D1820; margin: 0.25rem 0; }
        .faqs-sub { font-size: 0.95rem; color: #57534E; }
        .faqs-card { background: #FFFFFF; border: 1px solid #E7E2DA; border-radius: 12px; padding: 2rem; }
        .faq-item { border-bottom: 1px solid #E7E2DA; }
        .faq-question-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 0; background: none; border: none; font-size: 1rem; font-weight: 700; color: #2D1820; cursor: pointer; text-align: left; }
        .faq-question-btn:hover { color: #7B2347; }
        .faq-toggle-icon { font-size: 1.4rem; color: #7B2347; }
        .faq-answer-body { padding-bottom: 1.25rem; font-size: 0.92rem; color: #57534E; line-height: 1.6; }
        .faqs-foot { text-align: center; padding-top: 2rem; margin-top: 1.5rem; border-top: 1px solid #E7E2DA; }
        .faqs-foot p { font-size: 0.9rem; color: #57534E; margin-bottom: 1rem; }
      `}</style>
    </div>
  );
}
