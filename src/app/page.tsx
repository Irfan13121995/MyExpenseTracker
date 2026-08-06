'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { BottomNav } from '@/components/ui/BottomNav';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SpendingPieChart } from '@/components/dashboard/SpendingPieChart';
import { MonthlyTrendChart } from '@/components/dashboard/MonthlyTrendChart';
import { BudgetProgressWidget } from '@/components/dashboard/BudgetProgressWidget';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickAddModal } from '@/components/modals/QuickAddModal';
import { Transaction, Budget, Category, CurrencyCode, SummaryStats } from '@/types';
import { DEFAULT_CATEGORIES, getCurrentMonthYear } from '@/lib/utils';
import { offlineDB } from '@/lib/offline/db';

export default function DashboardPage() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Initial Sample Transactions for stunning zero-config presentation
  const initialDemoTransactions: Transaction[] = [
    {
      id: 'demo-1',
      user_id: 'user-demo',
      category_id: 'cat-8',
      type: 'income',
      amount: 4500,
      currency: 'USD',
      payment_method: 'bank_transfer',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: 'Monthly Tech Salary',
      is_recurring: true,
      category: DEFAULT_CATEGORIES.find((c) => c.id === 'cat-8'),
    },
    {
      id: 'demo-2',
      user_id: 'user-demo',
      category_id: 'cat-1',
      type: 'expense',
      amount: 145.5,
      currency: 'USD',
      payment_method: 'credit_card',
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      notes: 'Fine Dining Steakhouse',
      is_recurring: false,
      category: DEFAULT_CATEGORIES.find((c) => c.id === 'cat-1'),
    },
    {
      id: 'demo-3',
      user_id: 'user-demo',
      category_id: 'cat-5',
      type: 'expense',
      amount: 1200,
      currency: 'USD',
      payment_method: 'bank_transfer',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      notes: 'Downtown Apartment Rent',
      is_recurring: true,
      category: DEFAULT_CATEGORIES.find((c) => c.id === 'cat-5'),
    },
    {
      id: 'demo-4',
      user_id: 'user-demo',
      category_id: 'cat-3',
      type: 'expense',
      amount: 65,
      currency: 'USD',
      payment_method: 'credit_card',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      notes: 'Uber ride & gas refill',
      is_recurring: false,
      category: DEFAULT_CATEGORIES.find((c) => c.id === 'cat-3'),
    },
    {
      id: 'demo-5',
      user_id: 'user-demo',
      category_id: 'cat-4',
      type: 'expense',
      amount: 320,
      currency: 'USD',
      payment_method: 'credit_card',
      date: new Date().toISOString(),
      notes: 'New noise-canceling headphones',
      is_recurring: false,
      category: DEFAULT_CATEGORIES.find((c) => c.id === 'cat-4'),
    },
  ];

  const initialDemoBudgets: Budget[] = [
    {
      id: 'b-1',
      user_id: 'user-demo',
      category_id: 'cat-1',
      amount: 400,
      month_year: getCurrentMonthYear(),
      category: DEFAULT_CATEGORIES.find((c) => c.id === 'cat-1'),
    },
    {
      id: 'b-2',
      user_id: 'user-demo',
      category_id: 'cat-4',
      amount: 350,
      month_year: getCurrentMonthYear(),
      category: DEFAULT_CATEGORIES.find((c) => c.id === 'cat-4'),
    },
    {
      id: 'b-3',
      user_id: 'user-demo',
      category_id: 'cat-3',
      amount: 200,
      month_year: getCurrentMonthYear(),
      category: DEFAULT_CATEGORIES.find((c) => c.id === 'cat-3'),
    },
  ];

  useEffect(() => {
    // Load local storage / IndexedDB offline state
    const loadState = async () => {
      try {
        const localTx = await offlineDB.transactions.toArray();
        if (localTx && localTx.length > 0) {
          setTransactions(localTx);
        } else {
          setTransactions(initialDemoTransactions);
          // Pre-populate IndexedDB
          await offlineDB.transactions.bulkPut(initialDemoTransactions);
        }

        const localBudgets = await offlineDB.budgets.toArray();
        if (localBudgets && localBudgets.length > 0) {
          setBudgets(localBudgets);
        } else {
          setBudgets(initialDemoBudgets);
          await offlineDB.budgets.bulkPut(initialDemoBudgets);
        }
      } catch {
        setTransactions(initialDemoTransactions);
        setBudgets(initialDemoBudgets);
      }
    };

    loadState();
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
      sync_status: navigator.onLine ? 'synced' : 'pending',
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);

    // Save to IndexedDB
    try {
      await offlineDB.transactions.put(newTx);
    } catch (err) {
      console.error(err);
    }

    // Try posting to API route if online
    if (navigator.onLine) {
      fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTxData),
      }).catch(() => {});
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    try {
      await offlineDB.transactions.delete(id);
    } catch (err) {
      console.error(err);
    }
    if (navigator.onLine) {
      fetch(`/api/transactions/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  // Compute stats
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // Find top spending category
  const expenseCatTotals: Record<string, { name: string; amount: number; color: string }> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const catName = t.category?.name || 'Uncategorized';
      const catColor = t.category?.color || '#64748b';
      if (!expenseCatTotals[catName]) {
        expenseCatTotals[catName] = { name: catName, amount: 0, color: catColor };
      }
      expenseCatTotals[catName].amount += Number(t.amount);
    });

  const sortedCats = Object.values(expenseCatTotals).sort((a, b) => b.amount - a.amount);
  const topCat = sortedCats[0]
    ? {
        name: sortedCats[0].name,
        amount: sortedCats[0].amount,
        color: sortedCats[0].color,
        percentage: totalExpense > 0 ? (sortedCats[0].amount / totalExpense) * 100 : 0,
      }
    : null;

  const stats: SummaryStats = {
    totalIncome,
    totalExpense,
    netBalance,
    topCategory: topCat,
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
          {/* Top Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Financial Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Track income, manage category budgets, and analyze spending habits.
              </p>
            </div>
          </div>

          {/* Summary Metric Cards */}
          <SummaryCards stats={stats} currency={selectedCurrency} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingPieChart transactions={transactions} currency={selectedCurrency} />
            <MonthlyTrendChart transactions={transactions} currency={selectedCurrency} />
          </div>

          {/* Budget Limits & Recent Ledger Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BudgetProgressWidget budgets={budgets} transactions={transactions} currency={selectedCurrency} />
            </div>
            <div className="lg:col-span-2">
              <RecentTransactions
                transactions={transactions}
                currency={selectedCurrency}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        </main>
      </div>

      <BottomNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      {/* Quick Add Entry Modal */}
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
