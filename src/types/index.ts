export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  currency: CurrencyCode;
  theme_preference: 'dark' | 'light' | 'system';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id?: string | null;
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
  is_default: boolean;
  created_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  month_year: string; // YYYY-MM
  created_at?: string;
  category?: Category;
}

export interface TransactionSplit {
  category_id: string;
  amount: number;
  notes?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  type: 'expense' | 'income';
  amount: number;
  currency: CurrencyCode;
  payment_method: 'cash' | 'credit_card' | 'bank_transfer' | 'other';
  date: string; // ISO String
  notes?: string | null;
  receipt_url?: string | null;
  is_recurring: boolean;
  recurrence_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  splits?: TransactionSplit[] | null;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  sync_status?: 'synced' | 'pending';
}

export interface SummaryStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  topCategory: {
    name: string;
    amount: number;
    color: string;
    percentage: number;
  } | null;
}

export interface FilterOptions {
  monthYear: string;
  type: 'all' | 'expense' | 'income';
  categoryId: string;
  paymentMethod: string;
  searchQuery: string;
  startDate?: string;
  endDate?: string;
}
