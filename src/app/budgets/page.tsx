'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { BottomNav } from '@/components/ui/BottomNav';
import { QuickAddModal } from '@/components/modals/QuickAddModal';
import { BudgetModal } from '@/components/modals/BudgetModal';
import { Budget, Transaction, Category, CurrencyCode } from '@/types';
import { DEFAULT_CATEGORIES, formatCurrency, getCurrentMonthYear } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { offlineDB } from '@/lib/offline/db';
import { Target, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function BudgetsPage() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const loadData = async () => {
      try {
        const localB = await offlineDB.budgets.toArray();
        if (localB && localB.length > 0) setBudgets(localB);

        const localTx = await offlineDB.transactions.toArray();
        if (localTx && localTx.length > 0) setTransactions(localTx);
      } catch {
        // Fallback
      }
    };
    loadData();
  }, []);

  const handleAddTransaction = async (newTxData: any) => {
    const matchedCategory = categories.find((c) => c.id === newTxData.category_id);
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
      category: matchedCategory,
      sync_status: 'synced',
    };
    setTransactions([newTx, ...transactions]);
    await offlineDB.transactions.put(newTx);
  };

  const handleSaveBudget = async (newBData: Partial<Budget>) => {
    const matchedCat = categories.find((c) => c.id === newBData.category_id);
    const budgetObj: Budget = {
      id: `b-${Date.now()}`,
      user_id: 'user-demo',
      category_id: newBData.category_id!,
      amount: newBData.amount!,
      month_year: newBData.month_year || getCurrentMonthYear(),
      category: matchedCat,
    };

    // Replace if exists for same category & month
    const filtered = budgets.filter(
      (b) => !(b.category_id === budgetObj.category_id && b.month_year === budgetObj.month_year)
    );
    const updated = [...filtered, budgetObj];
    setBudgets(updated);
    await offlineDB.budgets.put(budgetObj);
  };

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Budget Goals & Limits
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Set monthly spending targets per category and monitor visual warning thresholds (&gt;80%).
              </p>
            </div>

            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Set Budget Goal</span>
            </button>
          </div>

          {/* Budget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((b) => {
              const totalSpent = transactions
                .filter((t) => t.type === 'expense' && t.category_id === b.category_id)
                .reduce((sum, t) => sum + Number(t.amount), 0);

              const percentage = b.amount > 0 ? (totalSpent / b.amount) * 100 : 0;
              const isOver80 = percentage >= 80;

              return (
                <div
                  key={b.id}
                  className={`glass-card rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${
                    isOver80 ? 'border-rose-500/40 shadow-rose-500/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={b.category} size="md" />
                    <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      {b.month_year}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-slate-400">Spent:</span>
                      <span className="text-xl font-bold text-white">
                        {formatCurrency(totalSpent, selectedCurrency)}{' '}
                        <span className="text-xs text-slate-400 font-normal">
                          / {formatCurrency(b.amount, selectedCurrency)}
                        </span>
                      </span>
                    </div>

                    <ProgressBar percentage={percentage} showLabel={false} />
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {isOver80 ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>High Spending Warning (&gt;80%)</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Within Safe Limit</span>
                      </span>
                    )}

                    <span className="text-slate-400 font-medium">
                      {b.amount - totalSpent >= 0
                        ? `${formatCurrency(b.amount - totalSpent, selectedCurrency)} left`
                        : `${formatCurrency(Math.abs(b.amount - totalSpent), selectedCurrency)} over`}
                    </span>
                  </div>
                </div>
              );
            })}
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

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSaveBudget={handleSaveBudget}
        categories={categories}
        currency={selectedCurrency}
      />
    </div>
  );
}
