import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency } from '@/types/shoe';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: Currency = 'USD'): string {
  const rates: Record<Currency, { rate: number; symbol: string; pos: 'prefix' | 'suffix' }> = {
    USD: { rate: 1, symbol: '$', pos: 'prefix' },
    EUR: { rate: 0.92, symbol: '€', pos: 'prefix' },
    GBP: { rate: 0.78, symbol: '£', pos: 'prefix' },
  };

  const { rate, symbol } = rates[currency] || rates.USD;
  const converted = (amount * rate).toFixed(2);
  return `${symbol}${converted}`;
}
