export function formatCurrency(amount: number | string, currency = 'USD') {
  const value = typeof amount === 'string' ? Number(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(Number.isFinite(value) ? value : 0)
}
