// ═══════════════════════════════════════════════════════════
// Product Service — PostgreSQL & Reactive Storage Catalog
// ═══════════════════════════════════════════════════════════

import { sql } from '@/lib/db';
import { recordAuditEvent } from './auditService';
import { products as initialFallbackProducts, categories as initialCategories } from '@/data/products';
import { storeStorage } from '@/utils/storeStorage';
import { Product, Category } from '@/types';

let memoryProducts: Product[] = [...initialFallbackProducts];

function getStoredProducts(): Product[] {
  if (typeof window !== 'undefined') {
    const stored = storeStorage.getProducts([]);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      memoryProducts = stored;
      return stored;
    }
  }
  return memoryProducts;
}

function saveStoredProducts(list: Product[]): void {
  memoryProducts = list;
  if (typeof window !== 'undefined') {
    storeStorage.saveProducts(list);
  }
}

function formatProduct(row: Record<string, any>): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory,
    price: parseFloat(row.price),
    originalPrice: row.original_price ? parseFloat(row.original_price) : null,
    stockCount: row.stock_count !== undefined ? row.stock_count : 20,
    inStock: row.in_stock !== false && (row.stock_count === undefined || row.stock_count > 0),
    badge: row.badge,
    currency: row.currency || 'GHS',
    rating: parseFloat(row.rating || 5.0),
    reviewCount: row.review_count || 0,
    image: row.image,
    images: row.images || (row.image ? [row.image] : []),
    description: row.description || '',
    details: row.details || {},
    tags: row.tags || [],
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT * FROM products
      WHERE status NOT IN ('ARCHIVED', 'DRAFT', 'HIDDEN')
      ORDER BY created_at DESC;
    `;
    if (rows && rows.length > 0) {
      return rows.map(formatProduct);
    }
  } catch (e) {}

  return getStoredProducts();
}

export function getAllProductsSync(): Product[] {
  return getStoredProducts();
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC;
    `;
    if (rows && rows.length > 0) {
      return rows.map(formatProduct);
    }
  } catch (e) {}

  return getStoredProducts();
}

export function getAllProductsAdminSync(): Product[] {
  return getStoredProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const rows = await sql`
      SELECT * FROM products
      WHERE slug = ${slug}
      LIMIT 1;
    `;
    if (rows && rows.length > 0) {
      return formatProduct(rows[0]);
    }
  } catch (e) {}

  const current = getStoredProducts();
  return current.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const rows = await sql`
      SELECT * FROM products
      WHERE id = ${id}
      LIMIT 1;
    `;
    if (rows && rows.length > 0) return formatProduct(rows[0]);
  } catch (e) {}

  const current = getStoredProducts();
  return current.find((p) => p.id === id) || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT * FROM products
      WHERE category = ${categorySlug}
      ORDER BY created_at DESC;
    `;
    if (rows && rows.length > 0) return rows.map(formatProduct);
  } catch (e) {}

  const current = getStoredProducts();
  return current.filter((p) => p.category === categorySlug);
}

export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT * FROM products
      WHERE in_stock = true
      ORDER BY created_at DESC
      LIMIT ${count};
    `;
    if (rows && rows.length > 0) {
      return rows.map(formatProduct);
    }
  } catch (e) {}

  const current = getStoredProducts();
  const valid = current.filter((p) => p.inStock);
  return valid.slice(0, count);
}

export async function getRelatedProducts(product: Product | null, count = 4): Promise<Product[]> {
  if (!product) return [];
  try {
    const rows = await sql`
      SELECT * FROM products
      WHERE id != ${product.id}
        AND (category = ${product.category} OR subcategory = ${product.subcategory})
      LIMIT ${count};
    `;
    if (rows && rows.length > 0) return rows.map(formatProduct);
  } catch (e) {}

  const current = getStoredProducts();
  return current
    .filter((p) => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, count);
}

export interface FilterOptions {
  category?: string;
  subcategory?: string;
  brand?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: string;
  skinType?: string;
}

export function filterProducts({
  category,
  subcategory,
  brand,
  query,
  minPrice,
  maxPrice,
  inStockOnly,
  skinType,
  sortBy = 'default',
}: FilterOptions = {}): Product[] {
  let list = getStoredProducts();

  if (category) {
    list = list.filter((p) => p.category === category);
  }
  if (subcategory) {
    list = list.filter(
      (p) => p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase()
    );
  }
  if (brand) {
    list = list.filter((p) => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
  }
  if (skinType) {
    list = list.filter(
      (p) => p.details?.skinType && p.details.skinType.toLowerCase().includes(skinType.toLowerCase())
    );
  }
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const catMatch = (p.category || '').toLowerCase().includes(q);
      const subMatch = (p.subcategory || '').toLowerCase().includes(q);
      const brandMatch = (p.brand || '').toLowerCase().includes(q);
      const descMatch = (p.description || '').toLowerCase().includes(q);
      const tagMatch = (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return nameMatch || catMatch || subMatch || brandMatch || descMatch || tagMatch;
    });
  }
  if (minPrice !== undefined) {
    list = list.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    list = list.filter((p) => p.price <= maxPrice);
  }
  if (inStockOnly) {
    list = list.filter((p) => p.inStock && (p.stockCount === undefined || p.stockCount > 0));
  }

  switch (sortBy) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      break;
    default:
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      break;
  }

  return list;
}

export function searchProducts(query: string): Product[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const list = getStoredProducts();
  return list.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const catMatch = (p.category || '').toLowerCase().includes(q);
    const subMatch = (p.subcategory || '').toLowerCase().includes(q);
    const brandMatch = (p.brand || '').toLowerCase().includes(q);
    const descMatch = (p.description || '').toLowerCase().includes(q);
    return nameMatch || catMatch || subMatch || brandMatch || descMatch;
  });
}

export function getAllCategories(): Category[] {
  return initialCategories;
}

export function getAllBrands(): string[] {
  const current = getStoredProducts();
  const set = new Set(current.map((p) => p.brand).filter(Boolean));
  return Array.from(set);
}

export function getPriceRange(): { min: number; max: number } {
  const current = getStoredProducts();
  if (current.length === 0) return { min: 0, max: 500 };
  const prices = current.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export async function createProduct(productData: Partial<Product>, operator = 'Admin'): Promise<Product> {
  const slug =
    productData.slug ||
    (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const id = productData.id || `prod-${Date.now().toString().slice(-4)}`;

  const newProduct: Product = {
    id,
    slug,
    name: productData.name || 'New Product',
    brand: productData.brand || 'CR Essentials',
    category: productData.category || 'skincare',
    subcategory: productData.subcategory || (productData.category === 'groceries' ? 'Pantry' : 'Face'),
    price: Number(productData.price) || 0,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
    currency: 'GHS',
    stockCount: Number(productData.stockCount) || 25,
    inStock: Number(productData.stockCount || 25) > 0,
    badge: productData.badge || 'new',
    rating: 5.0,
    reviewCount: 1,
    image: productData.image || '/images/products/1.jpeg',
    images: [productData.image || '/images/products/1.jpeg'],
    description: productData.description || '',
    details: productData.details || {},
    tags: productData.tags || [],
    createdAt: new Date().toISOString(),
  };

  try {
    await sql`
      INSERT INTO products (
        id, slug, name, brand, category, subcategory,
        price, original_price, stock_count,
        in_stock, badge, image, description, details, created_at
      ) VALUES (
        ${id}, ${slug}, ${newProduct.name}, ${newProduct.brand}, ${newProduct.category}, ${newProduct.subcategory},
        ${newProduct.price}, ${newProduct.originalPrice}, ${newProduct.stockCount},
        ${newProduct.inStock}, ${newProduct.badge}, ${newProduct.image}, ${newProduct.description}, ${JSON.stringify(newProduct.details)}, CURRENT_TIMESTAMP
      );
    `;
  } catch (e) {}

  const current = getStoredProducts();
  const updated = [newProduct, ...current.filter((p) => p.id !== id)];
  saveStoredProducts(updated);

  try {
    await recordAuditEvent({
      action: 'PRODUCT_CREATED',
      operator,
      entityId: id,
      entityType: 'PRODUCT',
      details: { name: newProduct.name, price: newProduct.price, category: newProduct.category },
    });
  } catch (e) {}

  return newProduct;
}

export async function updateProduct(productId: string, updates: Partial<Product>, operator = 'Admin'): Promise<Product | null> {
  const current = getStoredProducts();
  const existing = current.find((p) => p.id === productId);
  if (!existing) return null;

  const updatedProduct: Product = {
    ...existing,
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : existing.price,
    originalPrice: updates.originalPrice !== undefined ? (updates.originalPrice ? Number(updates.originalPrice) : null) : existing.originalPrice,
    stockCount: updates.stockCount !== undefined ? Number(updates.stockCount) : existing.stockCount,
    inStock: updates.stockCount !== undefined ? Number(updates.stockCount) > 0 : (updates.inStock !== undefined ? updates.inStock : existing.inStock),
  };

  const updatedList = current.map((p) => (p.id === productId ? updatedProduct : p));
  saveStoredProducts(updatedList);

  try {
    await recordAuditEvent({
      action: 'PRODUCT_UPDATED',
      operator,
      entityId: productId,
      entityType: 'PRODUCT',
      details: { updates },
    });
  } catch (e) {}

  return updatedProduct;
}

export async function archiveProduct(productId: string, operator = 'Admin'): Promise<Product | null> {
  return updateProduct(productId, { badge: 'archived' }, operator);
}

export async function deleteProduct(productId: string, operator = 'Admin'): Promise<boolean> {
  try {
    await sql`DELETE FROM products WHERE id = ${productId}`;
  } catch (e) {}

  const current = getStoredProducts();
  const updatedList = current.filter((p) => p.id !== productId);
  saveStoredProducts(updatedList);

  try {
    await recordAuditEvent({
      action: 'PRODUCT_DELETED',
      operator,
      entityId: productId,
      entityType: 'PRODUCT',
      details: { productId },
    });
  } catch (e) {}

  return true;
}
