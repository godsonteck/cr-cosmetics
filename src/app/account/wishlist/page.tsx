'use client';

import React from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import EmptyState from '@/components/ui/EmptyState';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { items, count } = useWishlist();

  const breadcrumbs = [
    { label: 'My Account', href: '/account' },
    { label: 'Saved Wishlist' },
  ];

  return (
    <div className="wishlist-page">
      <div className="container">
        <Breadcrumb items={breadcrumbs} />

        <div className="wishlist-header">
          <h1 className="heading-2">My Saved Wishlist</h1>
          <p className="wishlist-count-text">
            {count} item{count !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon="♥"
            title="Your Wishlist is Empty"
            description="Explore our skincare essentials and groceries. Click the heart icon on any product to save it here."
            actionLabel="Explore Shop"
            actionHref="/shop"
          />
        ) : (
          <ProductGrid products={items} columns={4} />
        )}
      </div>

      <style jsx>{`
        .wishlist-page {
          padding-top: 100px;
          padding-bottom: 80px;
          background: #FAF7F2;
          min-height: 100vh;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .wishlist-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E7E2DA;
        }
        .heading-2 {
          font-family: var(--font-display, serif);
          font-size: 2rem;
          font-weight: 700;
          color: #2D1820;
        }
        .wishlist-count-text {
          font-size: 0.88rem;
          color: #57534E;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
