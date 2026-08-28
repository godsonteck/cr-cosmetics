'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

interface HomeClientProps {
  allProducts: Product[];
  featuredProducts: Product[];
}

export default function HomeClient({ allProducts = [], featuredProducts = [] }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'skincare' | 'groceries' | 'sale'>('all');
  const [routineStep, setRoutineStep] = useState<number>(0);

  const displayedProducts = useMemo(() => {
    const list = featuredProducts.length ? featuredProducts : allProducts;
    if (activeTab === 'skincare') return list.filter((p) => p.category === 'skincare').slice(0, 8);
    if (activeTab === 'groceries') return list.filter((p) => p.category === 'groceries').slice(0, 8);
    if (activeTab === 'sale') return list.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 8);
    return list.slice(0, 8);
  }, [activeTab, allProducts, featuredProducts]);

  const routineSteps = [
    {
      num: '01',
      title: 'CLEANSE',
      subtitle: 'Gentle Pure Clarifying',
      desc: 'Remove impurities, oil and environmental buildup without stripping skin moisture.',
      tag: 'Cleansers & Washes',
      matchFilter: (p: Product) => p.tags?.some(t => t.includes('cleanser') || t.includes('wash') || t.includes('soap')),
    },
    {
      num: '02',
      title: 'TREAT',
      subtitle: 'Targeted Radiance & Tone',
      desc: 'Active Vitamin C, Niacinamide and Turmeric solutions for dark spots and glow.',
      tag: 'Serums & Oils',
      matchFilter: (p: Product) => p.tags?.some(t => t.includes('serum') || t.includes('oil') || t.includes('vitamin c') || t.includes('turmeric')),
    },
    {
      num: '03',
      title: 'HYDRATE',
      subtitle: 'Deep Moisture Barrier',
      desc: 'Hyaluronic acid and Norwegian formula creams locking in 24-hour hydration.',
      tag: 'Face Creams & Lotions',
      matchFilter: (p: Product) => p.tags?.some(t => t.includes('moisturizer') || t.includes('lotion') || t.includes('cream') || t.includes('hyaluronic')),
    },
    {
      num: '04',
      title: 'PROTECT',
      subtitle: 'SPF 50+ Sun & Daily Shield',
      desc: 'Broad-spectrum dry-touch UV protection tailored with zero white cast.',
      tag: 'Sun Protection',
      matchFilter: (p: Product) => p.tags?.some(t => t.includes('sunscreen') || t.includes('spf') || t.includes('protection')),
    },
  ];

  const currentRoutineProducts = useMemo(() => {
    const currentStepConfig = routineSteps[routineStep];
    const matches = allProducts.filter((p) => p.category === 'skincare' && currentStepConfig.matchFilter(p));
    return matches.length > 0 ? matches.slice(0, 4) : allProducts.filter(p => p.category === 'skincare').slice(0, 4);
  }, [routineStep, allProducts]);

  const groceryHighlights = useMemo(() => {
    return allProducts.filter((p) => p.category === 'groceries').slice(0, 4);
  }, [allProducts]);

  return (
    <div className="home-page">

      {/* ── 1. Editorial Campaign Hero ── */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="hero-eyebrow">CR Cosmetics &amp; Essentials • Accra, Ghana</span>
            <h1 className="hero-title">
              Verified Beauty.<br />
              Smart Everyday Essentials.
            </h1>
            <p className="hero-desc">
              Your neighbourhood digital flagship in Botwe, Accra. Discover authentic skincare, radiant body care, and pantry staples under one cohesive brand.
            </p>
            <div className="hero-btns">
              <Link href="/shop?category=skincare" className="btn btn-primary btn-lg">
                Explore Beauty World &rarr;
              </Link>
              <Link href="/shop?category=groceries" className="btn btn-outline btn-lg">
                Shop Groceries &rarr;
              </Link>
            </div>

            <div className="hero-trust-bar">
              <div className="trust-pill">
                <span>📍</span>
                <span>Botwe, Accra</span>
              </div>
              <div className="trust-pill">
                <span>⚡</span>
                <span>Same-Day Accra Delivery</span>
              </div>
              <div className="trust-pill">
                <span>✨</span>
                <span>100% Genuine Guaranteed</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrap">
            <img
              src="/images/hero-campaign.jpg"
              alt="CR Cosmetics & Essentials Campaign"
              className="hero-image"
            />
            <div className="hero-badge-overlay">
              <span className="overlay-tag">BOTWE FLAGSHIP</span>
              <span className="overlay-sub">Authentic Retail</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Two Shopping Worlds Banners ── */}
      <section className="departments-section">
        <div className="container">
          <div className="section-head-center">
            <span className="section-eyebrow">One Brand • Two Shopping Worlds</span>
            <h2 className="section-title">Designed for Your Lifestyle &amp; Home</h2>
          </div>

          <div className="dept-grid">
            <div className="dept-card beauty-world">
              <div className="dept-img-box">
                <img src="/images/categories/skincare.jpg" alt="Beauty and Skincare World" />
              </div>
              <div className="dept-content">
                <span className="world-tag">WORLD 01</span>
                <h2>Skincare &amp; Radiant Beauty</h2>
                <p>Neutrogena Hydro Boost, Olay Niacinamide, Medix 5.5, and K-Beauty formulations for glowing melanin-rich skin.</p>
                <Link href="/shop?category=skincare" className="btn btn-primary btn-sm">
                  Shop Beauty World &rarr;
                </Link>
              </div>
            </div>

            <div className="dept-card grocery-world">
              <div className="dept-img-box">
                <img src="/images/categories/groceries.jpg" alt="Groceries and Essentials World" />
              </div>
              <div className="dept-content">
                <span className="world-tag">WORLD 02</span>
                <h2>Groceries &amp; Everyday Essentials</h2>
                <p>Royal Fragrant Jasmine Rice, extra virgin cold-pressed olive oil, pure raw honey &amp; unrefined Ghanaian shea butter.</p>
                <Link href="/shop?category=groceries" className="btn btn-secondary btn-sm">
                  Shop Essentials World &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Signature Feature: Skincare Routine Showcase ── */}
      <section className="routine-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Signature CR Experience</span>
              <h2 className="section-title">The 4-Step Skincare Routine</h2>
            </div>
            <p className="section-sub">
              Dermatologist-aligned skincare steps mapped with verified products available in store.
            </p>
          </div>

          <div className="routine-nav">
            {routineSteps.map((step, idx) => (
              <button
                key={step.num}
                type="button"
                className={`routine-step-btn ${routineStep === idx ? 'is-active' : ''}`}
                onClick={() => setRoutineStep(idx)}
              >
                <span className="step-num">{step.num}</span>
                <span className="step-title">{step.title}</span>
              </button>
            ))}
          </div>

          <div className="routine-content-card">
            <div className="routine-info">
              <span className="routine-step-tag">{routineSteps[routineStep].num} — {routineSteps[routineStep].tag}</span>
              <h3>{routineSteps[routineStep].subtitle}</h3>
              <p>{routineSteps[routineStep].desc}</p>
            </div>

            <div className="routine-products-grid">
              {currentRoutineProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Everyday Essentials & Pantry Highlight ── */}
      <section className="essentials-highlight-section">
        <div className="container">
          <div className="essentials-box">
            <div className="essentials-text">
              <span className="section-eyebrow-light">Fresh Pantry &amp; Home</span>
              <h2>Quality Everyday Grocery Staples</h2>
              <p>
                Stock your kitchen and home with grade-AAA fragrant jasmine rice, cold-pressed oils, pure natural wildflower honey, and handcrafted Ghanaian shea butter.
              </p>
              <Link href="/shop?category=groceries" className="btn btn-outline-white">
                View Pantry &amp; Essentials ({groceryHighlights.length}+ items)
              </Link>
            </div>

            <div className="essentials-grid">
              {groceryHighlights.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Curated Bestsellers & New Arrivals ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Curated Selection</span>
              <h2 className="section-title">Popular In Store Right Now</h2>
            </div>

            <div className="simple-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Items
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'skincare' ? 'active' : ''}`}
                onClick={() => setActiveTab('skincare')}
              >
                Beauty &amp; Skincare
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'groceries' ? 'active' : ''}`}
                onClick={() => setActiveTab('groceries')}
              >
                Groceries
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'sale' ? 'active' : ''}`}
                onClick={() => setActiveTab('sale')}
              >
                Special Offers
              </button>
            </div>
          </div>

          <div className="products-grid">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="view-all-wrap">
            <Link href="/shop" className="btn btn-outline btn-lg">
              Explore Full Storefront Catalogue ({allProducts.length} items) &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Local Botwe Store & WhatsApp Order Banner ── */}
      <section className="contact-strip">
        <div className="container contact-box">
          <div>
            <span className="contact-eyebrow">ACCRA STORE &amp; DELIVERY</span>
            <h3>Visit Us in Botwe or Order Direct on WhatsApp</h3>
            <p>Location: Near Galaxy International School, Botwe, Accra &bull; Mon–Sat 9:00 AM – 8:00 PM</p>
          </div>
          <div className="contact-actions">
            <a
              href="https://wa.me/233592153306"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              💬 WhatsApp Order (059 215 3306)
            </a>
            <Link href="/contact" className="btn btn-outline-white">
              Location Map &amp; Info
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          background: #FAF7F2;
          color: #1C1917;
        }

        /* ── Hero ── */
        .hero-section {
          padding: 3.5rem 0 4.5rem;
          background: #F3EFEA;
          border-bottom: 1px solid #E7E2DA;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }
        .hero-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7B2347;
          display: block;
          margin-bottom: 0.75rem;
        }
        .hero-title {
          font-family: var(--font-display, serif);
          font-size: clamp(2.3rem, 4.8vw, 3.8rem);
          font-weight: 700;
          line-height: 1.1;
          color: #2D1820;
          margin: 0 0 1.25rem;
          letter-spacing: -0.02em;
        }
        .hero-desc {
          font-size: 1rem;
          line-height: 1.65;
          color: #57534E;
          margin: 0 0 2rem;
          max-width: 520px;
        }
        .hero-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .hero-trust-bar {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          padding-top: 1.5rem;
          border-top: 1px solid #E7E2DA;
        }
        .trust-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #2D1820;
        }

        .hero-image-wrap {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          background: #E7E2DA;
          box-shadow: 0 8px 32px rgba(45, 24, 32, 0.1);
        }
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-badge-overlay {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(45, 24, 32, 0.85);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          padding: 8px 14px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
        }
        .overlay-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #C59B3F;
        }
        .overlay-sub {
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* ── Departments ── */
        .departments-section {
          padding: 4.5rem 0 3.5rem;
        }
        .section-head-center {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .section-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7B2347;
          display: block;
          margin-bottom: 0.4rem;
        }
        .section-title {
          font-family: var(--font-display, serif);
          font-size: 2rem;
          font-weight: 700;
          color: #2D1820;
          margin: 0;
        }

        .dept-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .dept-card {
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .dept-img-box {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #E7E2DA;
        }
        .dept-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .dept-card:hover .dept-img-box img {
          transform: scale(1.03);
        }
        .dept-content {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }
        .world-tag {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #C59B3F;
          margin-bottom: 0.25rem;
        }
        .dept-content h2 {
          font-family: var(--font-display, serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: #2D1820;
          margin: 0 0 0.5rem;
        }
        .dept-content p {
          font-size: 0.88rem;
          color: #57534E;
          margin: 0 0 1.25rem;
          line-height: 1.55;
        }

        /* ── Routine Section ── */
        .routine-section {
          padding: 3.5rem 0 4.5rem;
          background: #F3EFEA;
          border-top: 1px solid #E7E2DA;
          border-bottom: 1px solid #E7E2DA;
        }
        .section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .section-sub {
          font-size: 0.9rem;
          color: #57534E;
          max-width: 420px;
          margin: 0;
        }

        .routine-nav {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .routine-step-btn {
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .routine-step-btn.is-active {
          border-color: #7B2347;
          background: #FAF1F4;
        }
        .step-num {
          font-size: 0.72rem;
          font-weight: 800;
          color: #7B2347;
          margin-bottom: 2px;
        }
        .step-title {
          font-family: var(--font-display, serif);
          font-size: 1.1rem;
          font-weight: 700;
          color: #2D1820;
        }

        .routine-content-card {
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 12px;
          padding: 2rem;
        }
        .routine-info {
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E7E2DA;
        }
        .routine-step-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7B2347;
        }
        .routine-info h3 {
          font-family: var(--font-display, serif);
          font-size: 1.4rem;
          color: #2D1820;
          margin: 0.25rem 0 0.4rem;
        }
        .routine-info p {
          font-size: 0.9rem;
          color: #57534E;
          margin: 0;
        }
        .routine-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        /* ── Essentials Highlight Box ── */
        .essentials-highlight-section {
          padding: 4.5rem 0;
        }
        .essentials-box {
          background: #2D1820;
          color: #FFFFFF;
          border-radius: 12px;
          padding: 3rem;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          align-items: center;
        }
        .section-eyebrow-light {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C59B3F;
          display: block;
          margin-bottom: 0.5rem;
        }
        .essentials-text h2 {
          font-family: var(--font-display, serif);
          font-size: 2.2rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 1rem;
          line-height: 1.15;
        }
        .essentials-text p {
          font-size: 0.92rem;
          color: #D6D3D1;
          margin: 0 0 2rem;
          line-height: 1.6;
        }
        .btn-outline-white {
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
        }
        .btn-outline-white:hover {
          border-color: #FFFFFF;
          background: rgba(255, 255, 255, 0.1);
        }

        .essentials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        /* ── Featured Products ── */
        .featured-section {
          padding: 3.5rem 0 5rem;
        }
        .simple-tabs {
          display: flex;
          gap: 6px;
          background: #F3EFEA;
          padding: 4px;
          border-radius: 6px;
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 8px 16px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #57534E;
          border-radius: 4px;
          cursor: pointer;
        }
        .tab-btn.active {
          background: #2D1820;
          color: #FFFFFF;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .view-all-wrap {
          text-align: center;
        }

        /* ── Contact Strip ── */
        .contact-strip {
          padding: 0 0 4.5rem;
        }
        .contact-box {
          background: #2D1820;
          color: #FFFFFF;
          border-radius: 12px;
          padding: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .contact-eyebrow {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #C59B3F;
          display: block;
          margin-bottom: 0.25rem;
        }
        .contact-box h3 {
          font-family: var(--font-display, serif);
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.4rem;
        }
        .contact-box p {
          font-size: 0.88rem;
          color: #D6D3D1;
          margin: 0;
        }
        .contact-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-whatsapp {
          background: #25D366;
          color: #FFFFFF;
        }
        .btn-whatsapp:hover {
          background: #1EBE5B;
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr; gap: 2rem; }
          .dept-grid { grid-template-columns: 1fr; }
          .routine-nav { grid-template-columns: repeat(2, 1fr); }
          .routine-products-grid { grid-template-columns: repeat(2, 1fr); }
          .essentials-box { grid-template-columns: 1fr; padding: 2rem; }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }

        @media (max-width: 500px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .routine-nav { grid-template-columns: 1fr; }
          .essentials-grid { grid-template-columns: 1fr; }
          .contact-box { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
