'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getOrderById } from '@/services/orderService';
import { formatPrice } from '@/utils/formatPrice';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const resolvedParams = await params;
      const res = await getOrderById(resolvedParams.id);
      setOrder(res);
      setLoading(false);
    }
    load();
  }, [params]);

  if (loading) {
    return <div className="container" style={{ padding: '120px 20px' }}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '120px 20px', textCenter: 'center' } as any}>
        <h2>Order Not Found</h2>
        <Link href="/account/orders">Back to Orders</Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <Badge variant="success" size="md">Delivered</Badge>;
      case 'dispatched':
        return <Badge variant="info" size="md">Dispatched</Badge>;
      case 'processing':
        return <Badge variant="warning" size="md">Processing</Badge>;
      case 'confirmed':
        return <Badge variant="info" size="md">Confirmed</Badge>;
      default:
        return <Badge variant="default" size="md">Placed</Badge>;
    }
  };

  return (
    <div className="order-detail-page">
      <div className="container">
        <Breadcrumb items={[
          { label: 'My Account', href: '/account' },
          { label: 'My Orders', href: '/account/orders' },
          { label: `#${order.orderNumber}` }
        ]} />

        <div className="order-detail-card">
          <div className="detail-head">
            <div>
              <span className="kicker">ORDER DETAILS</span>
              <h1>Order #{order.orderNumber}</h1>
              <span className="order-date">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div>{getStatusBadge(order.status)}</div>
          </div>

          <div className="detail-grid">
            <div className="detail-section">
              <h3>Items Ordered</h3>
              <div className="items-list">
                {(order.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="item-row">
                    <img src={item.image || '/images/products/1.jpeg'} alt={item.productName} className="item-img" />
                    <div className="item-info">
                      <strong>{item.productName}</strong>
                      <span>Qty: {item.quantity} &bull; {formatPrice(item.price)} each</span>
                    </div>
                    <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Customer &amp; Delivery Information</h3>
              <div className="info-box">
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.customerPhone}</p>
                {order.customerEmail && <p><strong>Email:</strong> {order.customerEmail}</p>}
                <p><strong>Delivery Address:</strong> {order.shippingAddress?.address || 'Botwe, Accra'}</p>
                <p><strong>Payment Method:</strong> {(order.paymentMethod || 'momo').toUpperCase()}</p>
              </div>

              <div className="financials-box">
                <div className="f-row"><span>Subtotal:</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="f-row"><span>Delivery Fee:</span><span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span></div>
                {order.discount > 0 && <div className="f-row discount"><span>Discount:</span><span>-{formatPrice(order.discount)}</span></div>}
                <div className="f-row total"><span>Total Paid:</span><span>{formatPrice(order.total)}</span></div>
              </div>
            </div>
          </div>

          <div className="card-foot">
            <Button href="/account/orders" variant="outline" size="sm">&larr; Back to Orders List</Button>
            <Button href="/shop" variant="primary" size="sm">Continue Shopping &rarr;</Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-detail-page { padding-top: 100px; padding-bottom: 80px; background: #FAF7F2; min-height: 100vh; }
        .container { max-width: 960px; margin: 0 auto; padding: 0 1.5rem; }
        .order-detail-card { background: #FFFFFF; border: 1px solid #E7E2DA; border-radius: 12px; padding: 2rem; }
        .detail-head { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 1.5rem; border-bottom: 1px solid #E7E2DA; margin-bottom: 1.5rem; }
        .kicker { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: #7B2347; }
        .detail-head h1 { font-family: var(--font-display, serif); font-size: 1.8rem; color: #2D1820; margin: 0.2rem 0; }
        .order-date { font-size: 0.85rem; color: #57534E; }
        .detail-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }
        .detail-section h3 { font-family: var(--font-display, serif); font-size: 1.2rem; color: #2D1820; margin-bottom: 1rem; }
        .items-list { display: flex; flex-direction: column; gap: 12px; }
        .item-row { display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #E7E2DA; padding-bottom: 12px; }
        .item-img { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; }
        .item-info { flex: 1; display: flex; flex-direction: column; font-size: 0.85rem; }
        .item-price { font-weight: 700; font-size: 0.9rem; color: #1C1917; }
        .info-box, .financials-box { background: #FAF7F2; border: 1px solid #E7E2DA; border-radius: 8px; padding: 1rem; font-size: 0.85rem; margin-bottom: 1rem; }
        .info-box p { margin-bottom: 6px; color: #57534E; }
        .financials-box .f-row { display: flex; justify-content: space-between; padding: 4px 0; color: #57534E; }
        .financials-box .total { font-weight: 700; font-size: 1rem; color: #2D1820; border-top: 1px solid #E7E2DA; padding-top: 8px; margin-top: 4px; }
        .card-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E7E2DA; padding-top: 1.5rem; }
      `}</style>
    </div>
  );
}
