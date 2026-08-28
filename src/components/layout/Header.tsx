'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/context/SearchContext';

export default function Header() {
  const pathname = usePathname() || '';
  const { totalCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { openSearch } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onScroll = useCallback(() => setScrolled(window.scrollY > 10), []);
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="top-banner">
        <span>✨ Free Accra Delivery on Orders GH₵300+ &bull; Botwe Store &bull; WhatsApp: 059 215 3306</span>
      </div>

      {/* Main Header */}
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="header-container">
          <Link href="/" className="brand-logo">
            <span className="brand-title">CR COSMETICS</span>
            <span className="brand-tagline">&amp; ESSENTIALS</span>
          </Link>

          {/* Quick Search Bar Trigger */}
          <div className="header-search-box" onClick={() => openSearch()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span>Search skincare, jasmine rice, honey, body lotion...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="action-btn search-mobile-btn"
              onClick={() => openSearch()}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>
              </svg>
            </button>

            <Link
              href="/account/wishlist"
              className="action-btn"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.8 8.7c0 5.5-8.8 10.1-8.8 10.1S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/>
              </svg>
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            <Link
              href={isAuthenticated ? '/account' : '/signin'}
              className="action-btn"
              aria-label={isAuthenticated ? 'Account' : 'Sign in'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/>
              </svg>
            </Link>

            <button
              type="button"
              className="action-btn cart-btn"
              onClick={openDrawer}
              aria-label={`Shopping Cart (${totalCount} items)`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalCount > 0 && <span className="action-badge cart-badge">{totalCount}</span>}
            </button>

            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* E-Commerce Category Sub-Nav Bar */}
        <nav className="header-subnav" aria-label="Category Sub Navigation">
          <div className="subnav-container">
            <Link href="/shop" className={`subnav-link ${isActive('/shop') && !pathname.includes('category') ? 'is-active' : ''}`}>
              All Catalogue
            </Link>
            <Link href="/shop?category=skincare" className={`subnav-link ${pathname.includes('category=skincare') ? 'is-active' : ''}`}>
              ✨ Beauty &amp; Skincare
            </Link>
            <Link href="/shop?category=skincare&subcategory=Face" className="subnav-link subnav-sub">
              Face Care
            </Link>
            <Link href="/shop?category=skincare&subcategory=Body" className="subnav-link subnav-sub">
              Body Lotions
            </Link>
            <span className="subnav-divider">|</span>
            <Link href="/shop?category=groceries" className={`subnav-link ${pathname.includes('category=groceries') ? 'is-active' : ''}`}>
              🛒 Groceries &amp; Essentials
            </Link>
            <Link href="/shop?category=groceries&subcategory=Pantry" className="subnav-link subnav-sub">
              Jasmine Rice &amp; Oils
            </Link>
            <Link href="/shop?category=groceries&subcategory=Household" className="subnav-link subnav-sub">
              Raw Shea Butter &amp; Soap
            </Link>
            <Link href="/about" className="subnav-link subnav-right">
              About Our Store
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All Catalogue</Link>
            <Link href="/shop?category=skincare" onClick={() => setMobileMenuOpen(false)}>✨ Beauty &amp; Skincare World</Link>
            <Link href="/shop?category=groceries" onClick={() => setMobileMenuOpen(false)}>🛒 Groceries &amp; Essentials World</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>Our Store &amp; Location</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact &amp; Delivery Rates</Link>
            <a href="https://wa.me/233592153306" target="_blank" rel="noopener noreferrer" className="mobile-wa">
              💬 WhatsApp Order (059 215 3306)
            </a>
          </nav>
        </div>
      )}

      <style jsx>{`
        .top-banner {
          background: #2D1820;
          color: #FAF7F2;
          text-align: center;
          font-size: 0.75rem;
          padding: 6px 1rem;
          letter-spacing: 0.02em;
          font-weight: 500;
        }

        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FFFFFF;
          border-bottom: 1px solid #E7E2DA;
          transition: box-shadow 0.2s ease;
        }
        .site-header.is-scrolled {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          gap: 1.5rem;
        }

        .brand-logo {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          line-height: 1;
          flex-shrink: 0;
        }
        .brand-title {
          font-family: var(--font-display, serif);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #2D1820;
        }
        .brand-tagline {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #7B2347;
          margin-top: 2px;
        }

        .header-search-box {
          flex: 1;
          max-width: 460px;
          height: 40px;
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 10px;
          cursor: pointer;
          color: #8C8580;
          font-size: 0.85rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .header-search-box:hover {
          border-color: #7B2347;
          background: #FFFFFF;
          color: #2D1820;
        }
        .header-search-box span {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .search-kbd {
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.65rem;
          font-weight: 600;
          color: #8C8580;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .action-btn {
          background: none;
          border: none;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          color: #2D1820;
          cursor: pointer;
          border-radius: 50%;
          position: relative;
          text-decoration: none;
        }
        .action-btn:hover {
          background: #FAF7F2;
          color: #7B2347;
        }
        .search-mobile-btn {
          display: none;
        }

        .action-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #2D1820;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: grid;
          place-items: center;
        }
        .cart-badge {
          background: #7B2347;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #2D1820;
          padding: 4px 8px;
        }

        /* E-Commerce Sub-Nav */
        .header-subnav {
          background: #FAF7F2;
          border-top: 1px solid #E7E2DA;
          height: 38px;
          display: flex;
          align-items: center;
        }
        .subnav-container {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .subnav-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: #57534E;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .subnav-link:hover,
        .subnav-link.is-active {
          color: #7B2347;
        }
        .subnav-sub {
          color: #8C8580;
          font-weight: 500;
        }
        .subnav-divider {
          color: #E7E2DA;
          font-size: 0.8rem;
        }
        .subnav-right {
          margin-left: auto;
        }

        .mobile-menu {
          background: #FFFFFF;
          border-bottom: 1px solid #E7E2DA;
          padding: 1.25rem 1.5rem;
        }
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mobile-nav a {
          text-decoration: none;
          font-size: 1rem;
          color: #2D1820;
          font-weight: 500;
        }
        .mobile-wa {
          margin-top: 0.5rem;
          padding: 10px;
          background: #25D366;
          color: #FFF !important;
          text-align: center;
          border-radius: 6px;
          font-weight: 600;
        }

        @media (max-width: 960px) {
          .header-search-box { display: none; }
          .search-mobile-btn { display: grid; }
          .header-subnav { display: none; }
          .mobile-toggle { display: block; }
        }
      `}</style>
    </>
  );
}
