// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Inventory Engine
// ═══════════════════════════════════════════════════════════

import { sql } from '@/lib/db';
import { updateProduct, getAllProductsAdmin, getProductById } from './productService';
import { storeStorage } from '@/utils/storeStorage';

export async function getInventoryPosition(productId: string) {
  try {
    const rows = await sql`
      SELECT id, name, stock_count, low_stock_threshold
      FROM products
      WHERE id = ${productId}
      LIMIT 1;
    `;
    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        productId: row.id,
        productName: row.name,
        sku: row.id.toUpperCase(),
        available: row.stock_count,
        reserved: 0,
        sold: 0,
        totalPhysical: row.stock_count,
        lowStockThreshold: row.low_stock_threshold || 10,
        lastUpdated: new Date().toISOString(),
      };
    }
  } catch (e) {}

  const p = await getProductById(productId);
  if (!p) return null;
  return {
    productId: p.id,
    productName: p.name,
    sku: p.id.toUpperCase(),
    available: p.stockCount !== undefined ? p.stockCount : 20,
    reserved: 0,
    sold: 0,
    totalPhysical: p.stockCount !== undefined ? p.stockCount : 20,
    lowStockThreshold: 10,
    lastUpdated: new Date().toISOString(),
  };
}

export async function checkStockAvailability(productId: string, requestedQty: number) {
  try {
    const rows = await sql`
      SELECT stock_count FROM products WHERE id = ${productId} LIMIT 1;
    `;
    if (rows && rows.length > 0) {
      return {
        available: rows[0].stock_count >= requestedQty,
        remaining: rows[0].stock_count,
      };
    }
  } catch (e) {}

  const p = await getProductById(productId);
  if (!p) return { available: false, remaining: 0 };
  const count = p.stockCount !== undefined ? p.stockCount : 20;
  return {
    available: count >= requestedQty,
    remaining: count,
  };
}

export async function releaseStock(productId: string, quantity: number, referenceId: string, operator = 'Checkout Engine') {
  const p = await getProductById(productId);
  if (!p) return;
  const currentStock = p.stockCount !== undefined ? p.stockCount : 20;
  const newStock = currentStock + quantity;
  await updateProduct(productId, { stockCount: newStock }, operator);
}

export async function adjustStock(productId: string, deltaQuantity: number, reason: string, operator = 'Store Manager') {
  const p = await getProductById(productId);
  if (!p) throw new Error(`Product ${productId} not found`);

  const currentStock = p.stockCount !== undefined ? p.stockCount : 20;
  const newStock = Math.max(0, currentStock + deltaQuantity);

  await updateProduct(productId, { stockCount: newStock }, operator);

  return {
    position: {
      productId,
      productName: p.name,
      available: newStock,
      totalPhysical: newStock,
    },
  };
}

export async function getInventoryLedger(limit = 50) {
  if (typeof window !== 'undefined') {
    return storeStorage.getLedger([]);
  }
  return [];
}

export async function getLowStockAlerts() {
  try {
    const rows = await sql`
      SELECT id, name, stock_count, low_stock_threshold
      FROM products
      WHERE stock_count <= low_stock_threshold
      ORDER BY stock_count ASC;
    `;
    if (rows && rows.length > 0) {
      return rows.map((row: any) => ({
        productId: row.id,
        productName: row.name,
        available: row.stock_count,
        lowStockThreshold: row.low_stock_threshold || 10,
      }));
    }
  } catch (e) {}

  const products = await getAllProductsAdmin();
  return products
    .filter((p) => (p.stockCount || 0) <= 10)
    .map((p) => ({
      productId: p.id,
      productName: p.name,
      available: p.stockCount || 0,
      lowStockThreshold: 10,
    }));
}

export async function getAllInventoryPositions() {
  const products = await getAllProductsAdmin();
  return products.map((p) => ({
    productId: p.id,
    productName: p.name,
    sku: p.id.toUpperCase(),
    available: p.stockCount !== undefined ? p.stockCount : 20,
    reserved: 0,
    sold: 0,
    totalPhysical: p.stockCount !== undefined ? p.stockCount : 20,
    lowStockThreshold: 10,
    lastUpdated: new Date().toISOString(),
  }));
}
