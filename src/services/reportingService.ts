// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Reporting Engine
// ═══════════════════════════════════════════════════════════

import { getAllOrders } from './orderEngine';
import { getAllInventoryPositions, getLowStockAlerts } from './inventoryService';
import { getAllProductsAdmin } from './productService';

export async function getOperationalDashboardSummary() {
  let orders: any[] = [];
  let lowStock: any[] = [];
  let allProducts: any[] = [];

  try {
    orders = await getAllOrders();
  } catch (e) {
    orders = [];
  }

  try {
    lowStock = await getLowStockAlerts();
  } catch (e) {
    lowStock = [];
  }

  try {
    allProducts = await getAllProductsAdmin();
  } catch (e) {
    allProducts = [];
  }

  const validPaidOrders = orders.filter((o) => o && (o.status === 'confirmed' || o.status === 'delivered'));

  const totalGrossRevenue = validPaidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalItemsSold = validPaidOrders.reduce(
    (sum, o) => sum + (o.items || []).reduce((iSum: number, i: any) => iSum + (i.quantity || 0), 0),
    0
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o && o.createdAt && String(o.createdAt).startsWith(todayStr));

  return {
    metrics: {
      totalGrossRevenue,
      todayRevenue: 0,
      totalOrdersCount: orders.length,
      todayOrdersCount: todayOrders.length,
      totalItemsSold,
      totalCatalogProducts: allProducts.length,
      lowStockCount: lowStock.length,
    },
    lowStockAlerts: lowStock,
    recentOrders: orders.slice(0, 5),
  };
}
