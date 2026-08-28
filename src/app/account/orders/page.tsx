'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { getAllOrders } from '@/services/orderService';
import { formatPrice } from '@/utils/formatPrice';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

export default function OrdersListPage() {
  const { customer, isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (authLoading) return;
      if (!isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getAllOrders();
        setOrders(result || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [authLoading, isAuthenticated, customer?.id]);

  const getStatusBadge = (status: string) => {
    const normalized = (status || '').toLowerCase();
    switch (normalized) {
      case 'delivered':
      case 'completed':
        return <Badge variant="success" size="md">Delivered</Badge>;
      case 'dispatched':
        return <Badge variant="info" size="md">Dispatched</Badge>;
      case 'processing':
        return <Badge variant="warning" size="md">Processing</Badge>;
      case 'confirmed':
        return <Badge variant="info" size="md">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="error" size="md">Cancelled</Badge>;
      default:
        return <Badge variant="default" size="md">Placed</Badge>;
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-shell">
        <Breadcrumb items={[{ label: 'My Account', href: '/account' }, { label: 'My Orders' }]} />

        <header className="orders-header">
          <div>
            <span className="orders-kicker">CR CUSTOMER / ORDER JOURNAL</span>
            <h1>My orders</h1>
          </div>
          <p>Track every purchase from confirmation to delivery, and keep your beauty and everyday essentials close at hand.</p>
        </header>

        {!authLoading && !isAuthenticated ? (
          <section className="orders-gate">
            <div className="orders-mark">CR</div>
            <span className="orders-kicker">CUSTOMER ACCESS</span>
            <h2>Sign in to see your orders.</h2>
            <p>Your order history, delivery updates and receipts will live here once you sign in.</p>
            <Link href="/signin" className="orders-primary">SIGN IN &rarr;</Link>
          </section>
        ) : loading ? (
          <section className="orders-loading">
            <p>Loading your order journal…</p>
          </section>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Your next beauty find or everyday essential will appear here after checkout."
            actionLabel="Explore Storefront"
            actionHref="/shop"
          />
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const orderId = order.orderNumber || order.id;
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Recent';

              return (
                <article key={orderId} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-overline">ORDER</span>
                      <strong className="order-id">#{orderId}</strong>
                      <span className="order-placed-date">Placed {dateStr}</span>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="order-card-items">
                    {(order.items || []).map((item, idx) => (
                      <div key={`${orderId}-${idx}`} className="order-item-mini">
                        <div className="item-mini-img">
                          {item.image ? <img src={item.image} alt={item.productName} /> : <span>CR</span>}
                        </div>
                        <div className="item-mini-details">
                          <div className="item-mini-name">{item.productName}</div>
                          <div className="item-mini-qty">Qty {item.quantity} &bull; {formatPrice(item.price)} each</div>
                        </div>
                        <div className="item-mini-total">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="footer-left">
                      <span className="del-addr-label">DELIVERING TO</span>
                      <span className="del-addr-text">{order.shippingAddress?.address || 'Botwe, Accra'}</span>
                    </div>
                    <div className="footer-right">
                      <div className="order-total-block"><span>Total</span><strong>{formatPrice(order.total || 0)}</strong></div>
                      <Button href={`/account/orders/${orderId}`} variant="primary" size="sm">View order &rarr;</Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-page { min-height: 100vh; background: #FAF7F2; color: #1C1917; padding: 100px 20px 90px; }
        .orders-shell { max-width: 1180px; margin: auto; }
        .orders-header { display: grid; grid-template-columns: 1.2fr .8fr; gap: 60px; align-items: end; padding: 40px 0 30px; border-bottom: 1px solid #E7E2DA; }
        .orders-kicker { display: block; font: 700 8px/1.2 var(--font-primary, sans-serif); letter-spacing: .2em; color: #7B2347; text-transform: uppercase; margin-bottom: 14px; }
        .orders-header h1 { font: 400 clamp(40px,6vw,72px)/.9 var(--font-display, serif); margin: 0; color: #2D1820; }
        .orders-header p { font-size: 0.95rem; color: #57534E; margin: 0; }
        .orders-list { padding-top: 28px; display: flex; flex-direction: column; gap: 18px; }
        .order-card { background: #fff; border: 1px solid #E7E2DA; padding: 0 26px; border-radius: 8px; }
        .order-card-header { display: flex; justify-content: space-between; align-items: center; padding: 21px 0; border-bottom: 1px solid #E7E2DA; }
        .order-card-header>div:first-child { display: flex; align-items: baseline; gap: 12px; }
        .order-overline { font: 700 8px var(--font-primary, sans-serif); letter-spacing: .15em; color: #8C8580; }
        .order-id { font: 700 13px var(--font-primary, sans-serif); color: #7B2347; }
        .order-placed-date { font-size: 11px; color: #8C8580; }
        .order-card-items { padding: 17px 0; display: flex; flex-direction: column; gap: 10px; }
        .order-item-mini { display: flex; align-items: center; gap: 15px; }
        .item-mini-img { width: 50px; height: 50px; border-radius: 6px; background: #FAF7F2; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .item-mini-img img { width: 100%; height: 100%; object-fit: cover; }
        .item-mini-details { flex: 1; }
        .item-mini-name { font-size: 13px; font-weight: 600; color: #1C1917; }
        .item-mini-qty { font-size: 11px; color: #57534E; }
        .item-mini-total { font-size: 12px; font-weight: 700; color: #1C1917; }
        .order-card-footer { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 19px 0; border-top: 1px solid #E7E2DA; }
        .footer-left { display: flex; flex-direction: column; gap: 4px; }
        .del-addr-label { font-size: 8px; font-weight: 700; letter-spacing: .16em; color: #8C8580; }
        .del-addr-text { font-size: 12px; color: #57534E; }
        .footer-right { display: flex; align-items: center; gap: 24px; }
        .order-total-block { display: flex; align-items: baseline; gap: 7px; font-size: 11px; color: #57534E; }
        .order-total-block strong { font-size: 16px; font-weight: 700; color: #2D1820; }
        .orders-gate { text-align: center; padding: 60px 20px; }
        .orders-mark { font-family: var(--font-display, serif); font-size: 48px; color: #7B2347; margin-bottom: 12px; }
        .orders-gate h2 { font-family: var(--font-display, serif); font-size: 32px; color: #2D1820; margin-bottom: 8px; }
        .orders-primary { display: inline-flex; background: #7B2347; color: #fff; padding: 12px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 12px; margin-top: 12px; }
      `}</style>
    </div>
  );
}
