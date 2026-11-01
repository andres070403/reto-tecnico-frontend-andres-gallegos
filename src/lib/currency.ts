import { CURRENCY, LOCALE } from './config';

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export const CURRENCY_SYMBOL =
  currencyFormatter.formatToParts(0).find((part) => part.type === 'currency')?.value ?? CURRENCY;
