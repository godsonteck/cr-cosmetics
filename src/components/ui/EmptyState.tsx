'use client';

import React from 'react';
import Link from 'next/link';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: string;
}

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Explore our catalog to discover authentic skincare and everyday essentials.',
  actionLabel = 'Explore Catalogue',
  actionHref = '/shop',
  icon = '🛍️',
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}

      <style jsx>{`
        .empty-state {
          text-align: center;
          padding: 3.5rem 1.5rem;
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          border-radius: 12px;
          margin: 1.5rem 0;
        }
        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .empty-state-title {
          font-family: var(--font-display, serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: #2D1820;
          margin: 0 0 0.5rem;
        }
        .empty-state-desc {
          font-size: 0.88rem;
          color: #57534E;
          margin: 0 0 1.5rem;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
}
