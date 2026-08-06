'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { BottomNav } from '@/components/ui/BottomNav';
import { QuickAddModal } from '@/components/modals/QuickAddModal';
import { SpendingPieChart } from '@/components/dashboard/SpendingPieChart';
import { MonthlyTrendChart } from '@/components/dashboard/MonthlyTrendChart';
import { Transaction, Category, CurrencyCode } from '@/types';
import { DEFAULT_CATEGORIES, formatCurrency } from '@/lib/utils';
import { offlineDB } from '@/lib/offline/db';
import { PieChart as PieIcon, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

export default function AnalyticsPage() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const loadTx = async () => {
      try {
        const local = await offlineDB.transactions.toArray();
        if (local && local.length > 0) setTransactions(local);
      } catch {
        // Fallback
      }
    };
    loadTx();
  }, []);

  const handleAddTransaction = async (newTxData: any) => {
    const matchedCat = categories.find((c) => c.id === newTxData.category_id);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      user_id: 'user-demo',
      category_id: newTxData.category_id,
      type: newTxData.type,
      amount: newTxData.amount,
      currency: newTxData.currency,
      payment_method: newTxData.payment_method,
      date: newTxData.date,
      notes: newTxData.notes,
      is_recurring: newTxData.is_recurring,
      recurrence_interval: newTxData.recurrence_interval,
      splits: newTxData.splits,
      category: matchedCat,
      sync_status: 'synced',
    };
    setTransactions([newTx, ...transactions]);
    await offlineDB.transactions.put(newTx);
  };

  // Payment method breakdown
  const methodTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const m = t.payment_method.replace('_', ' ').toUpperCase();
      methodTotals[m] = (methodTotals[m] || 0) + Number(t.amount);
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Navbar
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto pb-20 md:pb-6">
        <Sidebar onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Visual Analytics & Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Deep dive into expense distributions, cash flows, and payment channel statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingPieChart transactions={transactions} currency={selectedCurrency} />
            <MonthlyTrendChart transactions={transactions} currency={selectedCurrency} />
          </div>

          {/* Payment Method Distribution Card */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Spending by Payment Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(methodTotals).map(([method, amount]) => (
                <div key={method} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs font-semibold text-slate-400">{method}</span>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(amount, selectedCurrency)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <BottomNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTransaction={handleAddTransaction}
        categories={categories}
        currency={selectedCurrency}
      />
    </div>
  );
}
