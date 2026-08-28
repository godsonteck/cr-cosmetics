'use client';

import React, { useRef, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';
import { formatPrice } from '@/utils/formatPrice';

export default function SearchOverlay() {
  const router = useRouter();
  const {
    isOpen,
    query,
    results,
    recentSearches,
    setQuery,
    closeSearch,
    saveRecentSearch,
    clearRecentSearches,
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query);
    closeSearch();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    saveRecentSearch(tag);
  };

  const handleProductClick = (slug: string) => {
    saveRecentSearch(query);
    closeSearch();
    router.push(`/shop/${slug}`);
  };

  return (
    <div className="search-overlay-root" role="dialog" aria-modal="true" aria-label="Search">
      <div className="search-backdrop" onClick={closeSearch} />
      <div className="search-panel">
        <div className="container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-box">
              <svg className="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skincare, groceries, Neutrogena, jasmine rice, honey..."
                className="search-main-input"
                aria-label="Search query"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="search-clear-btn"
                  aria-label="Clear input"
                >
                  &times;
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="search-cancel-btn"
            >
              Cancel
            </button>
          </form>

          {!query && (
            <div className="search-suggestions-area">
              {recentSearches.length > 0 && (
                <div className="suggestion-section">
                  <div className="suggestion-head">
                    <span className="section-title">Recent Searches</span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="clear-recent-btn"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="pill-group">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleTagClick(term)}
                        className="search-tag-pill"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="suggestion-section">
                <span className="section-title">Popular Categories</span>
                <div className="pill-group">
                  <button type="button" onClick={() => handleTagClick('Face')} className="search-tag-pill">
                    ✨ Face Care &amp; Creams
                  </button>
                  <button type="button" onClick={() => handleTagClick('Pantry')} className="search-tag-pill">
                    🛒 Rice &amp; Cooking Oils
                  </button>
                  <button type="button" onClick={() => handleTagClick('Body')} className="search-tag-pill">
                    🧴 Body Lotions &amp; Oils
                  </button>
                  <button type="button" onClick={() => handleTagClick('Household')} className="search-tag-pill">
                    🌿 Raw Shea Butter &amp; Black Soap
                  </button>
                </div>
              </div>
            </div>
          )}

          {query.trim() && (
            <div className="search-results-area">
              <div className="results-count-bar">
                <span>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</span>
                {results.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="view-all-results-btn"
                  >
                    View in Full Catalogue →
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="no-results-box">
                  <p className="no-results-msg">No products found matching "{query}"</p>
                  <p className="no-results-sub">Try searching for broader keywords like "gel", "lotion", "rice", or "soap".</p>
                </div>
              ) : (
                <div className="results-grid">
                  {results.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="search-result-card"
                    >
                      <div className={`result-thumb ${product.category === 'skincare' ? 'thumb-sk' : 'thumb-gr'}`}>
                        <span>{product.category === 'skincare' ? '✨' : '🛒'}</span>
                      </div>
                      <div className="result-info">
                        <div className="result-name">{product.name}</div>
                        <div className="result-category">{product.subcategory || product.category}</div>
                        <div className="result-price">{formatPrice(product.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-overlay-root {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }
        .search-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.6);
        }
        .search-panel {
          position: relative;
          z-index: 1;
          background: #FFFFFF;
          padding-top: 1.5rem;
          padding-bottom: 2rem;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          max-height: 85vh;
          overflow-y: auto;
        }
        .search-form {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .search-input-box {
          flex: 1;
          display: flex;
          align-items: center;
          position: relative;
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          padding: 0 16px;
        }
        .search-icon {
          color: #8C8580;
          flex-shrink: 0;
          margin-right: 12px;
        }
        .search-main-input {
          width: 100%;
          height: 52px;
          border: none;
          background: transparent;
          font-size: 1rem;
          color: #1C1917;
          outline: none;
        }
        .search-clear-btn {
          font-size: 20px;
          color: #8C8580;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0 4px;
        }
        .search-cancel-btn {
          background: none;
          border: none;
          font-size: 0.88rem;
          font-weight: 500;
          color: #57534E;
          cursor: pointer;
        }
        .search-suggestions-area {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .suggestion-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .suggestion-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #57534E;
        }
        .clear-recent-btn {
          font-size: 0.75rem;
          color: #8C8580;
          background: none;
          border: none;
          cursor: pointer;
        }
        .pill-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .search-tag-pill {
          padding: 8px 14px;
          border-radius: 999px;
          background-color: #FAF7F2;
          border: 1px solid #E7E2DA;
          font-size: 0.8rem;
          font-weight: 500;
          color: #1C1917;
          cursor: pointer;
        }
        .search-tag-pill:hover {
          border-color: #7B2347;
          color: #7B2347;
          background-color: #FFFFFF;
        }
        .search-results-area {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .results-count-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          color: #57534E;
          padding-bottom: 8px;
          border-bottom: 1px solid #F0ECE4;
        }
        .view-all-results-btn {
          background: none;
          border: none;
          color: #7B2347;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .results-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .results-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .search-result-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #E7E2DA;
          cursor: pointer;
        }
        .search-result-card:hover {
          border-color: #7B2347;
          background-color: #FAF7F2;
        }
        .result-thumb {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .thumb-sk { background-color: #FAF1F4; }
        .thumb-gr { background-color: #FAF5EB; }
        .result-info { flex: 1; }
        .result-name { font-size: 0.88rem; font-weight: 500; color: #1C1917; }
        .result-category { font-size: 0.75rem; color: #8C8580; }
        .result-price { font-size: 0.8rem; font-weight: 600; color: #1C1917; margin-top: 2px; }
        .no-results-box { padding: 2rem 0; text-align: center; }
        .no-results-msg { font-weight: 600; color: #1C1917; margin-bottom: 4px; }
        .no-results-sub { font-size: 0.85rem; color: #57534E; }
      `}</style>
    </div>
  );
}
