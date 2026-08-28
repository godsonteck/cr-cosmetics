'use client';

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/" className="breadcrumb__link">Home</Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="breadcrumb__sep">/</span>
          {item.href ? (
            <Link href={item.href} className="breadcrumb__link">{item.label}</Link>
          ) : (
            <span className="breadcrumb__current">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
