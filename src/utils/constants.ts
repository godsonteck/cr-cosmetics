// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Business Constants
// ═══════════════════════════════════════════════════════════

export const BUSINESS = {
  name: 'CR Cosmetics & Essentials',
  shortName: 'CR',
  tagline: 'Beauty • Care • Essentials',
  phone: '+233 59 215 3306',
  displayPhone: '059 215 3306',
  rawPhone: '0592153306',
  intlPhone: '+233592153306',
  whatsappNumber: '233592153306',
  whatsappUrl: 'https://wa.me/233592153306',
  email: 'crcosmetics.essential@gmail.com',
  location: 'Botwe, near Galaxy International School, Accra, Ghana',
  googleMapsUrl: 'https://maps.app.goo.gl/3m9QQxQdi6tLc9Pd7',
  city: 'Accra',
  country: 'Ghana',
  currency: 'GHS',
  currencySymbol: '₵',
};

export interface StatusConfig {
  label: string;
  color: string;
}

export const ORDER_STATUS: Record<string, StatusConfig> = {
  placed: { label: 'Order Placed', color: '#3B82F6' },
  confirmed: { label: 'Confirmed', color: '#10B981' },
  processing: { label: 'Processing', color: '#F59E0B' },
  dispatched: { label: 'Dispatched', color: '#8B5CF6' },
  delivered: { label: 'Delivered', color: '#059669' },
  cancelled: { label: 'Cancelled', color: '#EF4444' },
};

export const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};
