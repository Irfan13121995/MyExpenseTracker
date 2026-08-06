'use client';

import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { Category, CurrencyCode, Budget } from '@/types';
import { DEFAULT_CATEGORIES, getCurrentMonthYear } from '@/lib/utils';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBudget: (budget: Partial<Budget>) => Promise<void>;
  categories?: Category[];
  currency: CurrencyCode;
}

export function BudgetModal({
  isOpen,
  onClose,
  onSaveBudget,
  categories = DEFAULT_CATEGORIES,
  currency,
}: BudgetModalProps) {
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'cat-1');
  const [amount, setAmount] = useState<string>('400');
  const [monthYear, setMonthYear] = useState<string>(getCurrentMonthYear());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await onSaveBudget({
        category_id: categoryId,
        amount: parseFloat(amount),
        month_year: monthYear,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-modal w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-700/60 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Set Category Budget</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Month</label>
            <input
              type="month"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700"
            >
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Monthly Limit ({currency})
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="e.g. 400.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 text-white font-bold text-xl px-4 py-3 rounded-2xl border border-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all mt-2"
          >
            {isSubmitting ? 'Saving Goal...' : 'Save Budget Target'}
          </button>
        </form>
      </div>
    </div>
  );
}
