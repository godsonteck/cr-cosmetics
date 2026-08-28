'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  badgeText?: string;
  imageSrc?: string;
  quote?: string;
  quoteAuthor?: string;
  footerPrompt?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  isAdmin?: boolean;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  badgeText = 'Authentic Skincare & Essentials',
  imageSrc = '/images/hero-pedestal.jpg',
  quote = '“Everyday luxury and verified skincare essentials, delivered right to your doorstep in Ghana.”',
  quoteAuthor = 'CR Cosmetics & Essentials, Botwe',
  footerPrompt,
  footerLinkText,
  footerLinkHref,
  isAdmin = false,
}: AuthLayoutProps) {
  return (
    <div className={`auth-page-container ${isAdmin ? 'admin-auth-theme' : ''}`}>
      <div className="auth-visual-panel">
        <div
          className="auth-visual-bg"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
        <div className="auth-visual-overlay" />

        <div className="auth-visual-content">
          <Link href="/" className="auth-brand-logo-link">
            <span className="auth-brand-crown">♛</span>
            <div className="auth-brand-text">
              <span className="auth-brand-name">CR COSMETICS</span>
              <span className="auth-brand-sub">AND ESSENTIALS</span>
            </div>
          </Link>

          <div className="auth-visual-footer">
            <div className="auth-brand-badge">{badgeText}</div>
            <blockquote className="auth-visual-quote">
              <p>{quote}</p>
              <cite>— {quoteAuthor}</cite>
            </blockquote>

            <div className="auth-visual-features">
              <div className="auth-feature-pill">✓ 100% Genuine Brands</div>
              <div className="auth-feature-pill">✓ Fast Ghana Delivery</div>
              <div className="auth-feature-pill">✓ Mobile Money &amp; Cash</div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-mobile-header">
            <Link href="/" className="auth-mobile-brand">
              <span className="auth-brand-crown">♛</span>
              <span className="auth-brand-name">CR Cosmetics &amp; Essentials</span>
            </Link>
          </div>

          <div className="auth-header-block">
            {isAdmin && <span className="auth-admin-pill">STAFF &amp; ADMIN PORTAL</span>}
            <h1 className="auth-heading">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>

          <div className="auth-body-content">{children}</div>

          {footerPrompt && footerLinkText && footerLinkHref && (
            <div className="auth-bottom-nav">
              <span>{footerPrompt} </span>
              <Link href={footerLinkHref} className="auth-bottom-link">
                {footerLinkText}
              </Link>
            </div>
          )}

          <div className="auth-micro-footer">
            <span>Botwe, near Galaxy Int. School, Accra • 059 215 3306</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .auth-page-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #FAF7F2;
          color: #1C1917;
        }

        .auth-visual-panel {
          flex: 1.1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3.5rem;
          color: #fff;
          overflow: hidden;
          background: #2D1820;
        }

        .auth-visual-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.65);
        }

        .auth-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(45, 24, 32, 0.4) 0%,
            rgba(45, 24, 32, 0.75) 60%,
            rgba(123, 35, 71, 0.85) 100%
          );
        }

        .auth-visual-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          gap: 2rem;
        }

        .auth-brand-logo-link {
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
          color: #fff;
        }

        .auth-brand-crown {
          font-size: 1.75rem;
          color: #C59B3F;
        }

        .auth-brand-text {
          display: flex;
          flex-direction: column;
        }

        .auth-brand-name {
          font-family: var(--font-display, serif);
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #fff;
        }

        .auth-brand-sub {
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          color: #C59B3F;
          font-weight: 600;
        }

        .auth-visual-footer {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-brand-badge {
          display: inline-block;
          background: rgba(197, 155, 63, 0.2);
          color: #FAF5EB;
          border: 1px solid rgba(197, 155, 63, 0.4);
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          align-self: flex-start;
        }

        .auth-visual-quote p {
          font-family: var(--font-display, serif);
          font-size: 1.35rem;
          line-height: 1.5;
          color: #fff;
          font-style: italic;
          margin: 0 0 0.5rem 0;
        }

        .auth-visual-quote cite {
          font-size: 0.82rem;
          color: #E7E2DA;
          font-style: normal;
        }

        .auth-visual-features {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .auth-feature-pill {
          background: rgba(255, 255, 255, 0.12);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .auth-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3.5rem 2.5rem;
          background: #fff;
          overflow-y: auto;
        }

        .auth-form-inner {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .auth-heading {
          font-family: var(--font-display, serif);
          font-size: 2rem;
          font-weight: 700;
          color: #2D1820;
          line-height: 1.2;
          margin: 0 0 0.4rem 0;
        }

        .auth-subtitle {
          font-size: 0.9rem;
          color: #57534E;
          margin: 0;
        }

        .auth-body-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .auth-bottom-nav {
          text-align: center;
          font-size: 0.88rem;
          color: #57534E;
          padding-top: 0.75rem;
          border-top: 1px solid #E7E2DA;
        }

        .auth-bottom-link {
          color: #7B2347;
          font-weight: 600;
          text-decoration: none;
          margin-left: 0.25rem;
        }

        .auth-micro-footer {
          text-align: center;
          font-size: 0.72rem;
          color: #8C8580;
        }

        @media (max-width: 960px) {
          .auth-visual-panel { display: none; }
          .auth-mobile-header { display: block; margin-bottom: 0.5rem; }
          .auth-form-panel { padding: 2.5rem 1.5rem; min-height: 100vh; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
