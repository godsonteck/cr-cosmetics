// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Price Formatter Utility
// ═══════════════════════════════════════════════════════════

export function formatPrice(amount: number | null | undefined, currency: string = 'GHS'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'GH₵0.00';
  }

  const formattedNumber = new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `GH₵${formattedNumber}`;
}
