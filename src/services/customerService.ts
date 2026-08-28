// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Customer Service
// ═══════════════════════════════════════════════════════════

import { getAllOrders } from './orderEngine';
import { CustomerUser, Order } from '@/types';

export interface CustomerSummary {
  customerId: string;
  fullName: string;
  phone: string;
  email: string;
  area: string;
  address: string;
  orderCount: number;
  totalSpend: number;
  lastOrderDate: string;
  firstOrderDate: string;
  orders: Order[];
  status: string;
}

export async function getAllCustomers(): Promise<CustomerSummary[]> {
  const orders = await getAllOrders();
  const customerMap: Record<string, CustomerSummary> = {};

  orders.forEach((order) => {
    const phone = order.customerPhone || 'Unknown';
    const email = order.customerEmail || '';
    const key = phone;

    if (!customerMap[key]) {
      customerMap[key] = {
        customerId: `CUST-${phone.replace(/\D/g, '').slice(-6) || Math.floor(100000 + Math.random() * 900000)}`,
        fullName: order.customerName,
        phone: order.customerPhone,
        email,
        area: 'Botwe',
        address: order.shippingAddress?.address || '',
        orderCount: 0,
        totalSpend: 0,
        lastOrderDate: order.createdAt,
        firstOrderDate: order.createdAt,
        orders: [],
        status: 'ACTIVE',
      };
    }

    const c = customerMap[key];
    c.orderCount += 1;
    if (order.status === 'delivered' || order.status === 'confirmed') {
      c.totalSpend += order.total || 0;
    }
    c.orders.push(order);

    if (new Date(order.createdAt) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = order.createdAt;
    }
    if (new Date(order.createdAt) < new Date(c.firstOrderDate)) {
      c.firstOrderDate = order.createdAt;
    }
  });

  return Object.values(customerMap);
}

export async function getCustomerByPhone(phone: string): Promise<CustomerSummary | null> {
  const customers = await getAllCustomers();
  return customers.find((c) => c.phone === phone) || null;
}

export async function getCustomerMetrics() {
  const customers = await getAllCustomers();
  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => c.orderCount > 1).length;
  const totalSpendAll = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const avgSpend = totalCustomers > 0 ? totalSpendAll / totalCustomers : 0;

  return {
    totalCustomers,
    repeatCustomers,
    repeatRate: totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : 0,
    averageLifetimeValue: avgSpend,
  };
}
