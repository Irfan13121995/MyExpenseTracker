'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { BottomNav } from '@/components/ui/BottomNav';
import { QuickAddModal } from '@/components/modals/QuickAddModal';
import { Transaction, Category, CurrencyCode } from '@/types';
import { DEFAULT_CATEGORIES, formatCurrency, formatDate } from '@/lib/utils';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { exportToCSV, exportToJSON, exportToPDF } from '@/lib/exportUtils';
import { offlineDB } from '@/lib/offline/db';
import { Search, Download, Trash2, FileText, Repeat, Split, Filter } from 'lucide-react';

export default function TransactionsPage() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  useEffect(() => {
    const loadTx = async () => {
      try {
        const local = await offlineDB.transactions.toArray();
        if (local && local.length > 0) {
          setTransactions(local);
        }
      } catch {
        // Fallback
      }
    };
    loadTx();
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

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await offlineDB.transactions.put(newTx);
  };

  const handleDeleteTransaction = async (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    await offlineDB.transactions.delete(id);
  };

  // Filtered transactions list
  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (methodFilter !== 'all' && t.payment_method !== methodFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const notesMatch = t.notes?.toLowerCase().includes(q);
      const categoryMatch = t.category?.name.toLowerCase().includes(q);
      const amountMatch = t.amount.toString().includes(q);
      return notesMatch || categoryMatch || amountMatch;
    }
    return true;
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
          {/* Header & Export Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Transaction Ledger
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Filter, edit, manage, or export past transactions to CSV, JSON, or PDF.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportToCSV(filteredTransactions, selectedCurrency)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => exportToJSON(filteredTransactions)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
              <button
                onClick={() => exportToPDF(filteredTransactions, selectedCurrency)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Summary</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search notes, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 text-slate-200 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-slate-900/90 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-700"
            >
              <option value="all">All Types (Expense & Income)</option>
              <option value="expense">Expense Only</option>
              <option value="income">Income Only</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900/90 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-700"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Payment Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-slate-900/90 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-700"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Transactions Table / List */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">No transactions match your active filters</p>
                <p className="text-xs text-slate-500">Try clearing filters or search query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredTransactions.map((t) => {
                      const isIncome = t.type === 'income';

                      return (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-slate-400 whitespace-nowrap">
                            {formatDate(t.date)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <CategoryBadge category={t.category} size="sm" />
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span>{t.notes || '-'}</span>
                              {t.is_recurring && (
                                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                                  <Repeat className="w-3 h-3" />
                                  <span>Recurring</span>
                                </span>
                              )}
                              {t.splits && t.splits.length > 0 && (
                                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                                  <Split className="w-3 h-3" />
                                  <span>Split ({t.splits.length})</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 uppercase tracking-wide text-slate-400 whitespace-nowrap">
                            {t.payment_method.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold whitespace-nowrap">
                            <span className={isIncome ? 'text-emerald-400' : 'text-slate-100'}>
                              {isIncome ? '+' : '-'}{formatCurrency(t.amount, selectedCurrency)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {t.receipt_url && (
                                <a
                                  href={t.receipt_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 text-slate-400 hover:text-blue-400"
                                >
                                  <FileText className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteTransaction(t.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
