'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight } from 'lucide-react';
import { Budget, Transaction, CurrencyCode } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/lib/utils';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

interface BudgetProgressWidgetProps {
  budgets: Budget[];
  transactions: Transaction[];
  currency: CurrencyCode;
}

export function BudgetProgressWidget({ budgets, transactions, currency }: BudgetProgressWidgetProps) {
  // Calculate total spent per budget category
  const budgetTrackers = budgets.map((b) => {
    const totalSpent = transactions
      .filter((t) => t.type === 'expense' && t.category_id === b.category_id)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const percentage = b.amount > 0 ? (totalSpent / b.amount) * 100 : 0;

    return {
      budget: b,
      totalSpent,
      percentage,
    };
  });

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Category Budgets</h3>
        </div>
        <Link
          href="/budgets"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
        >
          <span>Manage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {budgetTrackers.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs">
          <p>No budgets set for this month.</p>
          <Link href="/budgets" className="text-emerald-400 underline font-medium mt-1 inline-block">
            Set budget goals →
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {budgetTrackers.slice(0, 4).map(({ budget, totalSpent, percentage }) => (
            <div key={budget.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <CategoryBadge category={budget.category} size="sm" />
                <span className="text-slate-400 text-[11px]">
                  <strong className="text-slate-200">{formatCurrency(totalSpent, currency)}</strong> of{' '}
                  {formatCurrency(budget.amount, currency)}
                </span>
              </div>
              <ProgressBar percentage={percentage} showLabel={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
