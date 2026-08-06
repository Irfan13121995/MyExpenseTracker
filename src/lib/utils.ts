import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category, SUPPORTED_CURRENCIES, CurrencyCode } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'USD'): string {
  const currencyObj = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyObj.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyObj.symbol}${amount.toFixed(2)}`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getCurrentMonthYear(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#ef4444', is_default: true },
  { id: 'cat-2', name: 'Utilities & Bills', type: 'expense', icon: 'Zap', color: '#f59e0b', is_default: true },
  { id: 'cat-3', name: 'Travel & Transport', type: 'expense', icon: 'Car', color: '#3b82f6', is_default: true },
  { id: 'cat-4', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899', is_default: true },
  { id: 'cat-5', name: 'Housing & Rent', type: 'expense', icon: 'Home', color: '#8b5cf6', is_default: true },
  { id: 'cat-6', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#06b6d4', is_default: true },
  { id: 'cat-7', name: 'Health & Fitness', type: 'expense', icon: 'HeartPulse', color: '#10b981', is_default: true },
  { id: 'cat-8', name: 'Salary & Income', type: 'income', icon: 'Wallet', color: '#22c55e', is_default: true },
  { id: 'cat-9', name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#14b8a6', is_default: true },
  { id: 'cat-10', name: 'Other Expense', type: 'expense', icon: 'MoreHorizontal', color: '#64748b', is_default: true },
];
