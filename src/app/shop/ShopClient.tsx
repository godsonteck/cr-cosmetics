'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import EmptyState from '@/components/ui/EmptyState';
import { filterProducts, getAllBrands, getPriceRange } from '@/services/productService';
import { SORT_OPTIONS } from '@/utils/constants';

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();

  const category = params.get('category') || '';
  const subcategory = params.get('subcategory') || '';
  const brand = params.get('brand') || '';
  const skinType = params.get('skinType') || '';
  const query = params.get('q') || '';
  const sort = params.get('sort') || 'default';
  const inStock = params.get('inStock') === 'true';

  const ranges = getPriceRange();
  const maxPrice = Number(params.get('maxPrice')) || ranges.max;

  const brands = useMemo(() => getAllBrands(), []);

  const products = useMemo(() => {
    return filterProducts({
      category: category || undefined,
      subcategory: subcategory || undefined,
      brand: brand || undefined,
      skinType: skinType || undefined,
      query: query || undefined,
      maxPrice,
      inStockOnly: inStock || undefined,
      sortBy: sort,
    });
  }, [category, subcategory, brand, skinType, query, maxPrice, inStock, sort]);

  const push = useCallback((changes: Record<string, any> = {}) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false) {
        next.set(key, String(value));
      } else {
        next.delete(key);
      }
    });
    router.push(`/shop${next.toString() ? `?${next}` : ''}`);
  }, [params, router]);

  const clearAllFilters = () => {
    router.push('/shop');
  };

  const activeFilterCount = [category, subcategory, brand, skinType, query, inStock].filter(Boolean).length;

  return (
    <main className="shop-page">
      {/* Page Header */}
      <div className="shop-header">
        <div className="container">
          <span className="shop-eyebrow">CR Storefront Catalogue</span>
          <h1 className="shop-title">
            {category === 'skincare'
              ? 'Beauty & Skincare World'
              : category === 'groceries'
              ? 'Groceries & Essentials World'
              : query
              ? `Search: "${query}"`
              : 'All Products'}
          </h1>
          <p className="shop-sub">
            Browse our complete collection of verified cosmetics and everyday essentials in Botwe, Accra. Same-day delivery available across Accra.
          </p>

          {/* Department Selector */}
          <div className="dept-tabs">
            <button
              type="button"
              className={`dept-tab ${!category ? 'is-active' : ''}`}
              onClick={() => push({ category: '', subcategory: '', skinType: '' })}
            >
              All Departments ({filterProducts().length})
            </button>
            <button
              type="button"
              className={`dept-tab ${category === 'skincare' ? 'is-active' : ''}`}
              onClick={() => push({ category: 'skincare', subcategory: '' })}
            >
              Beauty &amp; Skincare ({filterProducts({ category: 'skincare' }).length})
            </button>
            <button
              type="button"
              className={`dept-tab ${category === 'groceries' ? 'is-active' : ''}`}
              onClick={() => push({ category: 'groceries', subcategory: '' })}
            >
              Groceries &amp; Essentials ({filterProducts({ category: 'groceries' }).length})
            </button>
          </div>
        </div>
      </div>

      <div className="container shop-body">
        <div className="shop-layout">
          {/* Adaptive Sidebar Filters */}
          <aside className="shop-sidebar">
            <div className="sidebar-head">
              <span className="sidebar-title">Filter Products</span>
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearAllFilters} className="clear-all-btn">
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Category / Subcategory */}
            <div className="filter-group">
              <span className="filter-label">Categories</span>
              <div className="filter-options">
                <button
                  type="button"
                  className={`filter-btn ${!category && !subcategory ? 'active' : ''}`}
                  onClick={() => push({ category: '', subcategory: '' })}
                >
                  All Categories
                </button>

                <div className="filter-subgroup">
                  <span className="subgroup-heading">Beauty &amp; Skincare</span>
                  <button
                    type="button"
                    className={`filter-btn ${category === 'skincare' && subcategory === 'Face' ? 'active' : ''}`}
                    onClick={() => push({ category: 'skincare', subcategory: 'Face' })}
                  >
                    Face Care &amp; Washes
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${category === 'skincare' && subcategory === 'Body' ? 'active' : ''}`}
                    onClick={() => push({ category: 'skincare', subcategory: 'Body' })}
                  >
                    Body Care &amp; Lotions
                  </button>
                </div>

                <div className="filter-subgroup">
                  <span className="subgroup-heading">Groceries &amp; Essentials</span>
                  <button
                    type="button"
                    className={`filter-btn ${category === 'groceries' && subcategory === 'Pantry' ? 'active' : ''}`}
                    onClick={() => push({ category: 'groceries', subcategory: 'Pantry' })}
                  >
                    Pantry &amp; Food Staples
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${category === 'groceries' && subcategory === 'Household' ? 'active' : ''}`}
                    onClick={() => push({ category: 'groceries', subcategory: 'Household' })}
                  >
                    Household &amp; Shea Butter
                  </button>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <span className="filter-label">Verified Brands</span>
              <div className="filter-options">
                <button
                  type="button"
                  className={`filter-btn ${!brand ? 'active' : ''}`}
                  onClick={() => push({ brand: '' })}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`filter-btn ${brand === b ? 'active' : ''}`}
                    onClick={() => push({ brand: brand === b ? '' : b })}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Type Filter (Beauty World) */}
            {category === 'skincare' && (
              <div className="filter-group">
                <span className="filter-label">Skin Concern &amp; Type</span>
                <div className="filter-options">
                  <button
                    type="button"
                    className={`filter-btn ${!skinType ? 'active' : ''}`}
                    onClick={() => push({ skinType: '' })}
                  >
                    All Skin Types
                  </button>
                  {['Dry', 'Sensitive', 'Dull', 'Hyperpigmentation', 'Uneven Skin'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`filter-btn ${skinType === st ? 'active' : ''}`}
                      onClick={() => push({ skinType: skinType === st ? '' : st })}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability Filter */}
            <div className="filter-group">
              <span className="filter-label">Availability</span>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => push({ inStock: e.target.checked })}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Main Grid Content */}
          <div className="shop-main">
            {/* Toolbar */}
            <div className="controls-row">
              <span className="count-label">
                Showing <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''}
              </span>

              <div className="sort-wrap">
                <label htmlFor="shop-sort">Sort by:</label>
                <select
                  id="shop-sort"
                  className="sort-select"
                  value={sort}
                  onChange={(e) => push({ sort: e.target.value === 'default' ? '' : e.target.value })}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filter Pills */}
            {activeFilterCount > 0 && (
              <div className="active-pills-row">
                <span className="pills-label">Active Filters:</span>
                {category && (
                  <span className="filter-pill">
                    World: {category}
                    <button onClick={() => push({ category: '', subcategory: '' })}>&times;</button>
                  </span>
                )}
                {subcategory && (
                  <span className="filter-pill">
                    Subcategory: {subcategory}
                    <button onClick={() => push({ subcategory: '' })}>&times;</button>
                  </span>
                )}
                {brand && (
                  <span className="filter-pill">
                    Brand: {brand}
                    <button onClick={() => push({ brand: '' })}>&times;</button>
                  </span>
                )}
                {skinType && (
                  <span className="filter-pill">
                    Skin: {skinType}
                    <button onClick={() => push({ skinType: '' })}>&times;</button>
                  </span>
                )}
                {query && (
                  <span className="filter-pill">
                    Search: "{query}"
                    <button onClick={() => push({ q: '' })}>&times;</button>
                  </span>
                )}
                {inStock && (
                  <span className="filter-pill">
                    In Stock Only
                    <button onClick={() => push({ inStock: false })}>&times;</button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matching products found"
                description="Try clearing some filter criteria or searching for different keywords."
                actionLabel="Clear Filters"
                actionHref="/shop"
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .shop-page {
          background: #FFFFFF;
          color: #1C1917;
          padding-bottom: 5rem;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .shop-header {
          padding: 3rem 0 2rem;
          background: #FAF7F2;
          border-bottom: 1px solid #E7E2DA;
          margin-bottom: 2.5rem;
        }
        .shop-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7B2347;
          display: block;
          margin-bottom: 0.4rem;
        }
        .shop-title {
          font-family: var(--font-display, serif);
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 700;
          color: #2D1820;
          margin: 0 0 0.5rem;
        }
        .shop-sub {
          font-size: 0.95rem;
          color: #57534E;
          margin: 0 0 1.5rem;
          max-width: 520px;
        }

        .dept-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .dept-tab {
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #57534E;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .dept-tab:hover {
          border-color: #2D1820;
          color: #2D1820;
        }
        .dept-tab.is-active {
          background: #2D1820;
          color: #FFFFFF;
          border-color: #2D1820;
        }

        .shop-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        /* ── Sidebar ── */
        .shop-sidebar {
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 80px;
        }
        .sidebar-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #E7E2DA;
        }
        .sidebar-title {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #2D1820;
        }
        .clear-all-btn {
          background: none;
          border: none;
          font-size: 0.75rem;
          color: #7B2347;
          font-weight: 600;
          cursor: pointer;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .filter-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #57534E;
        }
        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .filter-subgroup {
          margin-top: 6px;
          padding-left: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .subgroup-heading {
          font-size: 0.68rem;
          font-weight: 700;
          color: #8C8580;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .filter-btn {
          background: none;
          border: none;
          text-align: left;
          padding: 5px 8px;
          font-size: 0.82rem;
          color: #57534E;
          border-radius: 4px;
          cursor: pointer;
        }
        .filter-btn:hover {
          background: #FFFFFF;
          color: #2D1820;
        }
        .filter-btn.active {
          background: #7B2347;
          color: #FFFFFF;
          font-weight: 600;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #1C1917;
          cursor: pointer;
        }

        /* ── Shop Main ── */
        .shop-main {
          display: flex;
          flex-direction: column;
        }
        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid #E7E2DA;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .count-label {
          font-size: 0.88rem;
          color: #57534E;
        }
        .sort-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #57534E;
        }
        .sort-select {
          padding: 6px 12px;
          border: 1px solid #E7E2DA;
          border-radius: 6px;
          background: #FFFFFF;
          font-size: 0.85rem;
          color: #1C1917;
          outline: none;
          cursor: pointer;
        }

        .active-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .pills-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #57534E;
        }
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FAF1F4;
          border: 1px solid #7B2347;
          color: #7B2347;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .filter-pill button {
          background: none;
          border: none;
          color: #7B2347;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 960px) {
          .shop-layout { grid-template-columns: 1fr; }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }
        @media (max-width: 500px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        }
      `}</style>
    </main>
  );
}
