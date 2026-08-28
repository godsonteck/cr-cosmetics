import React, { Suspense } from 'react';
import ShopClient from './ShopClient';

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <ShopClient />
    </Suspense>
  );
}
