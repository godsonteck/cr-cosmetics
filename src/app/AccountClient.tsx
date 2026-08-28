'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/utils/formatPrice';
import { CustomerUser, Order } from '@/types';

interface AccountClientProps {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  recentOrders?: Order[];
  wishlistCount?: number;
  getStatusBadge?: (status: string) => React.ReactNode;
  signOutCustomer: () => void;
}

export default function AccountClient({
  customer,
  isAuthenticated,
  recentOrders = [],
  wishlistCount = 0,
  getStatusBadge,
  signOutCustomer,
}: AccountClientProps) {
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const visibleOrders = [...recentOrders].reverse().slice(0, 3);
  const firstName = customer?.name?.split(' ')?.[0] || 'Customer';

  return (
    <div className="cr-account-page">
      <div className="cr-account-shell">
        <header className="cr-account-hero">
          <div>
            <p className="cr-account-kicker">MY CR / ACCOUNT</p>
            <h1>{isAuthenticated ? `Welcome back, ${firstName}.` : 'Your CR account.'}</h1>
            <p className="cr-account-lead">Keep your orders, saved products and delivery details together in one place.</p>
          </div>
          {isAuthenticated ? (
            <Button variant="secondary" size="sm" onClick={signOutCustomer}>Sign Out</Button>
          ) : (
            <Link href="/signin" className="cr-account-signin">Sign In &rarr;</Link>
          )}
        </header>

        <div className="cr-account-grid">
          <section className="cr-account-card cr-account-orders">
            <div className="cr-section-head">
              <div><span>01 / ORDERS</span><h2>Recent orders</h2></div>
              <Link href="/account/orders">View all &rarr;</Link>
            </div>
            {visibleOrders.length ? visibleOrders.map(order => {
              const orderId = order.orderNumber || order.id;
              const total = order.total || 0;
              const status = order.status || 'placed';
              return (
                <article key={orderId} className="cr-order-row">
                  <div><strong>#{orderId}</strong><span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : 'Recent'}</span></div>
                  <div className="cr-order-items">{(order.items || []).slice(0, 2).map((item, i) => <span key={i}>{item.quantity}× {item.productName}</span>)}</div>
                  <div className="cr-order-end"><span>{formatPrice(total)}</span>{getStatusBadge ? getStatusBadge(status) : <small>{status}</small>}</div>
                </article>
              );
            }) : <div className="cr-account-empty"><p>Your order history is waiting for its first chapter.</p><Link href="/shop">Start shopping &rarr;</Link></div>}
          </section>

          <section className="cr-account-card cr-account-wishlist">
            <div className="cr-section-head"><div><span>02 / SAVED</span><h2>Wishlist</h2></div><span className="cr-count-label">{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}</span></div>
            {wishlistItems.length ? <div className="cr-wishlist-list">{wishlistItems.slice(0, 5).map(item => <div key={item.id} className="cr-wishlist-row"><div><strong>{item.name}</strong><span>{formatPrice(item.price || 0)}</span></div><button onClick={() => removeFromWishlist(item.id)} aria-label={`Remove ${item.name}`}>×</button></div>)}</div> : <div className="cr-account-empty"><p>Save products you want to come back to.</p><Link href="/shop">Explore catalogue &rarr;</Link></div>}
          </section>

          <section className="cr-account-card cr-account-address">
            <div className="cr-section-head"><div><span>03 / DELIVERY</span><h2>Saved address</h2></div></div>
            {customer?.addresses?.length ? customer.addresses.map((addr, idx) => <div className="cr-address" key={idx}><strong>{addr.fullName || 'Saved address'}</strong><p>{[addr.address, addr.city, addr.region].filter(Boolean).join(', ')}</p></div>) : <div className="cr-account-empty"><p>No saved delivery address yet.</p><span>Addresses can be added during checkout.</span></div>}
          </section>

          <section className="cr-account-card cr-account-discover">
            <span>04 / KEEP EXPLORING</span><h2>Good things,<br />well selected.</h2><div className="cr-account-links"><Link href="/shop?category=skincare">Beauty &amp; body <b>↗</b></Link><Link href="/shop?category=groceries">Everyday essentials <b>↗</b></Link><Link href="/cart">Your shopping bag <b>↗</b></Link></div>
          </section>
        </div>
      </div>
      <style jsx>{`
        .cr-account-page{min-height:100vh;padding:120px 20px 90px;background:#FAF7F2;color:#1C1917}.cr-account-shell{max-width:1240px;margin:auto}.cr-account-hero{display:flex;justify-content:space-between;align-items:end;gap:30px;padding-bottom:48px;border-bottom:1px solid #E7E2DA}.cr-account-kicker,.cr-section-head>div>span,.cr-account-discover>span{font:700 9px/1 var(--font-primary, sans-serif);letter-spacing:.18em;color:#7B2347}.cr-account-hero h1{font:400 clamp(45px,6vw,82px)/.9 var(--font-display, serif);letter-spacing:-.045em;margin:14px 0 18px;color:#2D1820}.cr-account-lead{max-width:510px;font:400 16px/1.55 var(--font-primary, sans-serif);color:#57534E;margin:0}.cr-account-signin{border-bottom:1px solid #7B2347;color:#7B2347;text-decoration:none;padding-bottom:5px;font:700 10px var(--font-primary, sans-serif);letter-spacing:.1em;text-transform:uppercase}.cr-account-grid{display:grid;grid-template-columns:1.45fr .75fr;gap:18px;margin-top:18px}.cr-account-card{background:#fff;border:1px solid #E7E2DA;padding:28px}.cr-account-orders{grid-row:span 2}.cr-section-head{display:flex;justify-content:space-between;align-items:start;margin-bottom:26px}.cr-section-head h2{font:400 30px/1 var(--font-display, serif);margin:9px 0 0;color:#2D1820}.cr-section-head a{color:#7B2347;text-decoration:none;font:700 9px var(--font-primary, sans-serif);letter-spacing:.1em;text-transform:uppercase}.cr-count-label{font:500 10px var(--font-primary, sans-serif);color:#8C8580}.cr-order-row{display:grid;grid-template-columns:110px 1fr auto;gap:20px;align-items:center;padding:18px 0;border-top:1px solid #E7E2DA}.cr-order-row>div:first-child{display:flex;flex-direction:column;gap:5px}.cr-order-row strong{font:700 11px var(--font-primary, sans-serif)}.cr-order-row span,.cr-order-row small{font:500 10px var(--font-primary, sans-serif);color:#8C8580}.cr-order-items{display:flex;flex-direction:column;gap:5px}.cr-order-end{display:flex;align-items:end;flex-direction:column;gap:8px}.cr-order-end>span{font:700 12px var(--font-primary, sans-serif);color:#1C1917}.cr-account-empty{padding:32px 0;border-top:1px solid #E7E2DA;color:#57534E;font:400 13px/1.6 var(--font-primary, sans-serif)}.cr-account-empty p{margin:0 0 8px}.cr-account-empty a{color:#7B2347;text-decoration:none;font-weight:700}.cr-wishlist-list{border-top:1px solid #E7E2DA}.cr-wishlist-row{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #E7E2DA}.cr-wishlist-row>div{display:flex;flex-direction:column;gap:4px}.cr-wishlist-row strong{font:600 12px var(--font-primary, sans-serif)}.cr-wishlist-row span{font:500 10px var(--font-primary, sans-serif);color:#8C8580}.cr-wishlist-row button{border:0;background:none;font-size:21px;color:#8C8580;cursor:pointer}.cr-address{border-top:1px solid #E7E2DA;padding-top:18px}.cr-address strong{font:700 10px var(--font-primary, sans-serif);text-transform:uppercase;letter-spacing:.12em}.cr-address p{font:400 14px/1.6 var(--font-primary, sans-serif);color:#57534E}.cr-account-discover{background:#2D1820;color:#fff;border-color:#2D1820}.cr-account-discover>span{color:#C59B3F}.cr-account-discover h2{font:400 38px/.98 var(--font-display, serif);margin:20px 0 34px;color:#fff}.cr-account-links{display:flex;flex-direction:column}.cr-account-links a{padding:14px 0;border-top:1px solid rgba(255,255,255,.2);color:#fff;text-decoration:none;font:600 11px var(--font-primary, sans-serif);display:flex;justify-content:space-between}.cr-account-links b{font-weight:400}@media(max-width:800px){.cr-account-hero{align-items:start;flex-direction:column}.cr-account-grid{grid-template-columns:1fr}.cr-account-orders{grid-row:auto}.cr-order-row{grid-template-columns:1fr auto}.cr-order-items{grid-column:1/-1;order:3}.cr-order-end{grid-column:2;grid-row:1}.cr-account-page{padding-top:100px}}
      `}</style>
    </div>
  );
}
