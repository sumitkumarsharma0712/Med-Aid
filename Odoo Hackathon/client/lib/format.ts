export function formatPrice(cents: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format((cents || 0) / 100);
}
