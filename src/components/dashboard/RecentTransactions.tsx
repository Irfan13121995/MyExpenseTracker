'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, FileText, ArrowDownLeft, ArrowUpRight, Repeat, Split } from 'lucide-react';
import { Transaction, CurrencyCode } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: CurrencyCode;
  onDeleteTransaction: (id: string) => void;
}

export function RecentTransactions({ transactions, currency, onDeleteTransaction }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">No transactions recorded yet</p>
        <p className="text-xs text-slate-500">Tap Quick Log above to record your first income or expense.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight">Recent Activity</h3>
        <Link href="/transactions" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">
          View All ({transactions.length}) →
        </Link>
      </div>

      <div className="divide-y divide-slate-800/60">
        {transactions.slice(0, 7).map((t) => {
          const isIncome = t.type === 'income';

          return (
            <div key={t.id} className="py-3 flex items-center justify-between gap-3 group">
              {/* Left Side: Icon & Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={t.category} size="sm" />
                    {t.is_recurring && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Repeat className="w-3 h-3" />
                        <span>Recurring</span>
                      </span>
                    )}
                    {t.splits && t.splits.length > 0 && (
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Split className="w-3 h-3" />
                        <span>Split</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 truncate mt-1">
                    {t.notes || t.payment_method.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-[10px] text-slate-500">{formatDate(t.date)}</p>
                </div>
              </div>

              {/* Right Side: Amount & Delete button */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span
                    className={`font-bold text-sm block ${
                      isIncome ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {t.payment_method.replace('_', ' ')}
                  </span>
                </div>

                {t.receipt_url && (
                  <a
                    href={t.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                    title="View Receipt"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => onDeleteTransaction(t.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
