// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Order Engine (TypeScript)
// ═══════════════════════════════════════════════════════════

import { sql } from '@/lib/db';
import { checkStockAvailability, releaseStock } from './inventoryService';
import { recordAuditEvent } from './auditService';
import { CartItem, Order, OrderStatus, ShippingAddress, PaymentMethod } from '@/types';

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `CR-${year}-${randomSuffix}`;
}

export interface CreateOrderParams {
  customerData: {
    id?: string;
    fullName: string;
    phone: string;
    email?: string;
    area?: string;
    address?: string;
    deliveryNotes?: string;
  };
  cartItems: CartItem[];
  deliveryMethod?: string;
  paymentMethod?: PaymentMethod;
  paymentNetwork?: string;
  momoWalletNumber?: string;
  discountAmount?: number;
  promoCode?: string | null;
  idempotencyKey?: string | null;
}

export async function createOrder({
  customerData,
  cartItems,
  deliveryMethod = 'doorstep',
  paymentMethod = 'momo',
  paymentNetwork = 'MTN MoMo',
  momoWalletNumber = '',
  discountAmount = 0,
  promoCode = null,
  idempotencyKey = null,
}: CreateOrderParams): Promise<Order> {
  if (idempotencyKey) {
    const existing = await sql`
      SELECT id FROM orders WHERE idempotency_key = ${idempotencyKey} LIMIT 1;
    `;
    if (existing.length > 0) {
      throw new Error('This order has already been processed.');
    }
  }

  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cannot create an order with an empty cart.');
  }

  for (const item of cartItems) {
    const { available, remaining } = await checkStockAvailability(item.product.id, item.quantity);
    if (!available) {
      throw new Error(
        `Insufficient stock for "${item.product.name}". Requested: ${item.quantity}, Available: ${remaining}`
      );
    }
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.selectedVariant?.price || item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  let deliveryFee = 0;
  if (deliveryMethod === 'doorstep') {
    deliveryFee = subtotal >= 300 ? 0 : 25;
  }

  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);
  const orderNumber = generateOrderNumber();
  const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const timestamp = new Date().toISOString();

  const itemSnapshots = cartItems.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    price: Number(item.selectedVariant?.price || item.product.price),
    quantity: item.quantity,
    image: item.product.image || '/images/products/1.jpeg',
    variantName: item.selectedVariant?.name || '',
  }));

  const isPayOnDelivery = paymentMethod === 'cod';
  const initialOrderStatus: OrderStatus = isPayOnDelivery ? 'confirmed' : 'placed';

  const shippingAddr: ShippingAddress = {
    fullName: customerData.fullName,
    phone: customerData.phone,
    email: customerData.email,
    address: customerData.address || '',
    city: 'Accra',
    region: 'Greater Accra',
    notes: customerData.deliveryNotes || '',
  };

  try {
    await sql`
      INSERT INTO orders (
        id, order_number, customer_id, customer_name,
        customer_phone, customer_email, delivery_address,
        items, subtotal, delivery_fee, discount, total,
        payment_method, order_status, created_at
      ) VALUES (
        ${orderId}, ${orderNumber}, ${customerData.id || null}, ${customerData.fullName},
        ${customerData.phone}, ${customerData.email || null}, ${customerData.address || ''},
        ${JSON.stringify(itemSnapshots)}, ${subtotal}, ${deliveryFee}, ${discountAmount}, ${finalTotal},
        ${paymentMethod}, ${initialOrderStatus}, CURRENT_TIMESTAMP
      );
    `;
  } catch (e) {}

  await recordAuditEvent({
    action: 'ORDER_CREATED',
    operator: customerData.fullName,
    entityId: orderNumber,
    entityType: 'ORDER',
    details: { total: finalTotal, itemsCount: itemSnapshots.length, paymentMethod },
  });

  return {
    id: orderId,
    orderNumber,
    customerName: customerData.fullName,
    customerPhone: customerData.phone,
    customerEmail: customerData.email,
    shippingAddress: shippingAddr,
    items: itemSnapshots,
    subtotal,
    deliveryFee,
    discount: discountAmount,
    total: finalTotal,
    paymentMethod,
    momoNumber: momoWalletNumber,
    momoNetwork: (paymentNetwork.toLowerCase().includes('mtn') ? 'mtn' : paymentNetwork.toLowerCase().includes('telecel') ? 'telecel' : 'at') as any,
    status: initialOrderStatus,
    createdAt: timestamp,
  };
}

function formatOrderRow(row: Record<string, any>): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    shippingAddress: {
      fullName: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email,
      address: row.delivery_address || '',
      city: 'Accra',
      region: 'Greater Accra',
    },
    items: row.items || [],
    subtotal: parseFloat(row.subtotal || 0),
    deliveryFee: parseFloat(row.delivery_fee || 0),
    discount: parseFloat(row.discount || 0),
    total: parseFloat(row.total || 0),
    paymentMethod: row.payment_method || 'momo',
    status: row.order_status || 'placed',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function transitionOrderStatus(orderId: string, nextStatus: OrderStatus, operator = 'Store Staff', note = ''): Promise<Order | null> {
  try {
    await sql`
      UPDATE orders
      SET order_status = ${nextStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId} OR order_number = ${orderId};
    `;
  } catch (e) {}

  await recordAuditEvent({
    action: 'ORDER_STATUS_CHANGED',
    operator,
    entityId: orderId,
    entityType: 'ORDER',
    details: { nextStatus, note },
  });

  return getOrderById(orderId);
}

export async function markOrderPaymentPaid(orderId: string, transactionRef: string, operator = 'Payment Gateway'): Promise<Order | null> {
  try {
    await sql`
      UPDATE orders
      SET payment_status = 'PAID', order_status = 'confirmed', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId} OR order_number = ${orderId};
    `;
  } catch (e) {}

  await recordAuditEvent({
    action: 'PAYMENT_VERIFIED',
    operator,
    entityId: orderId,
    entityType: 'PAYMENT',
    details: { transactionRef },
  });

  return getOrderById(orderId);
}

export async function issueRefund({ orderId, amount, reason = 'Customer requested refund', operator = 'Store Admin' }: { orderId: string; amount: number; reason?: string; operator?: string }): Promise<Order | null> {
  await recordAuditEvent({
    action: 'REFUND_ISSUED',
    operator,
    entityId: orderId,
    entityType: 'PAYMENT',
    details: { amount, reason },
  });

  return getOrderById(orderId);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const rows = await sql`
      SELECT * FROM orders WHERE id = ${orderId} OR order_number = ${orderId} LIMIT 1;
    `;
    if (rows && rows.length > 0) return formatOrderRow(rows[0]);
  } catch (e) {}
  return null;
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const rows = await sql`
      SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;
    `;
    if (rows && rows.length > 0) return rows.map(formatOrderRow);
  } catch (e) {}
  return [];
}

export async function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  try {
    const rows = await sql`
      SELECT * FROM orders WHERE order_status = ${status} ORDER BY created_at DESC;
    `;
    if (rows && rows.length > 0) return rows.map(formatOrderRow);
  } catch (e) {}
  return [];
}

export async function getRecentOrders(count = 5): Promise<Order[]> {
  try {
    const rows = await sql`
      SELECT * FROM orders ORDER BY created_at DESC LIMIT ${count};
    `;
    if (rows && rows.length > 0) return rows.map(formatOrderRow);
  } catch (e) {}
  return [];
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  try {
    const rows = await sql`
      SELECT * FROM orders WHERE customer_id = ${customerId} ORDER BY created_at DESC;
    `;
    if (rows && rows.length > 0) return rows.map(formatOrderRow);
  } catch (e) {}
  return [];
}
