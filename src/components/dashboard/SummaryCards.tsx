'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Scale, Tag } from 'lucide-react';
import { SummaryStats, CurrencyCode } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  stats: SummaryStats;
  currency: CurrencyCode;
}

export function SummaryCards({ stats, currency }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border-l-4 border-l-emerald-500 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Income</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {formatCurrency(stats.totalIncome, currency)}
          </h3>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            Incoming cash flow
          </p>
        </div>
      </div>

      {/* Total Expense Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border-l-4 border-l-rose-500 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Expenses</span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {formatCurrency(stats.totalExpense, currency)}
          </h3>
          <p className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1">
            Outflow this period
          </p>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border-l-4 border-l-blue-500 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Balance</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${stats.netBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {formatCurrency(stats.netBalance, currency)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {stats.netBalance >= 0 ? 'Positive Savings' : 'Deficit spending'}
          </p>
        </div>
      </div>

      {/* Top Spending Category Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border-l-4 border-l-purple-500 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Spending</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
        </div>
        <div>
          {stats.topCategory ? (
            <>
              <h3 className="text-lg font-bold text-white truncate">{stats.topCategory.name}</h3>
              <p className="text-[11px] text-purple-300 mt-1 font-medium">
                {formatCurrency(stats.topCategory.amount, currency)} ({stats.topCategory.percentage.toFixed(0)}%)
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-slate-400">No Expenses</h3>
              <p className="text-[11px] text-slate-500 mt-1">Zero spending recorded</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
