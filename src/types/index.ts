// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Domain Models & TypeScript Types
// ═══════════════════════════════════════════════════════════

export type ProductCategory = 'skincare' | 'groceries';

export type BeautySubcategory = 'Face' | 'Body' | 'Hair' | 'Fragrance' | 'Beauty';
export type GrocerySubcategory = 'Pantry' | 'Household' | 'Drinks' | 'Everyday Essentials';
export type SubcategoryName = BeautySubcategory | GrocerySubcategory | string;

export interface ProductDetails {
  size?: string;
  skinType?: string;
  usage?: string;
  ingredients?: string;
  origin?: string;
  storage?: string;
  nutritionalInfo?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  sku?: string;
  inStock?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  subcategory: SubcategoryName;
  price: number;
  originalPrice?: number | null;
  currency: string;
  image: string;
  images: string[];
  badge?: 'sale' | 'bestseller' | 'new' | null | string;
  inStock: boolean;
  stockCount: number;
  description: string;
  details: ProductDetails;
  brand: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  variants?: ProductVariant[];
  createdAt?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: ProductCategory;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant | null;
}

export type PaymentMethod = 'momo' | 'card' | 'cod' | 'whatsapp';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  region: string;
  landmark?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  variantName?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  momoNumber?: string;
  momoNetwork?: 'mtn' | 'telecel' | 'at';
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: ShippingAddress[];
  role: 'customer' | 'admin';
}

export interface FilterState {
  category: string;
  subcategory: string;
  brand: string;
  skinType: string;
  priceMin?: number;
  priceMax?: number;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: string;
}

export interface SkincareRoutineStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  categoryTag: string;
  recommendedProducts: Product[];
}
