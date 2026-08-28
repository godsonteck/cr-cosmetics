// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Order Service Facade
// ═══════════════════════════════════════════════════════════

import {
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  getRecentOrders,
  getOrdersByCustomer,
  createOrder,
  transitionOrderStatus,
  markOrderPaymentPaid,
  issueRefund,
} from './orderEngine';

export {
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  getRecentOrders,
  getOrdersByCustomer,
  createOrder,
  transitionOrderStatus,
  markOrderPaymentPaid,
  issueRefund,
};

export async function getOrderCount(): Promise<number> {
  const orders = await getAllOrders();
  return orders.length;
}
