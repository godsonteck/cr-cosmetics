// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Store Data Storage Helper
// ═══════════════════════════════════════════════════════════

import { Product, Order } from '@/types';

const KEYS = {
  PRODUCTS: 'cr_store_products',
  ORDERS: 'cr_store_orders',
  INVENTORY: 'cr_store_inventory',
  CONFIG: 'cr_store_config',
  AUDIT_LOGS: 'cr_store_audit_logs',
  LEDGER: 'cr_store_ledger',
} as const;

function safeGet<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[StoreStorage] Failed reading ${key}:`, err);
    return defaultVal;
  }
}

function safeSet<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent('cr-store-updated', { detail: { key } }));
  } catch (err) {
    console.warn(`[StoreStorage] Failed saving ${key}:`, err);
  }
}

export const storeStorage = {
  getProducts: (fallback: Product[]): Product[] => safeGet<Product[]>(KEYS.PRODUCTS, fallback),
  saveProducts: (products: Product[]): void => safeSet(KEYS.PRODUCTS, products),

  getOrders: (fallback: Order[] = []): Order[] => safeGet<Order[]>(KEYS.ORDERS, fallback),
  saveOrders: (orders: Order[]): void => safeSet(KEYS.ORDERS, orders),

  getInventory: <T>(fallback: T = null as unknown as T): T => safeGet<T>(KEYS.INVENTORY, fallback),
  saveInventory: <T>(inv: T): void => safeSet(KEYS.INVENTORY, inv),

  getConfig: <T>(fallback: T = null as unknown as T): T => safeGet<T>(KEYS.CONFIG, fallback),
  saveConfig: <T>(cfg: T): void => safeSet(KEYS.CONFIG, cfg),

  getAuditLogs: <T>(fallback: T[] = []): T[] => safeGet<T[]>(KEYS.AUDIT_LOGS, fallback),
  saveAuditLogs: <T>(logs: T[]): void => safeSet(KEYS.AUDIT_LOGS, logs),

  getLedger: <T>(fallback: T[] = []): T[] => safeGet<T[]>(KEYS.LEDGER, fallback),
  saveLedger: <T>(ledger: T[]): void => safeSet(KEYS.LEDGER, ledger),
};
