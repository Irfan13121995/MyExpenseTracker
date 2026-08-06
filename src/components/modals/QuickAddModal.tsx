'use client';

import React, { useState } from 'react';
import { X, Camera, Plus, Trash2, Repeat, CheckCircle, Split, Sparkles, Loader2 } from 'lucide-react';
import { Category, CurrencyCode, TransactionSplit } from '@/types';
import { DEFAULT_CATEGORIES, getCurrentMonthYear } from '@/lib/utils';
import { parseReceiptImage } from '@/lib/ocr/parseReceipt';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: any) => Promise<void>;
  categories?: Category[];
  currency: CurrencyCode;
}

export function QuickAddModal({
  isOpen,
  onClose,
  onAddTransaction,
  categories = DEFAULT_CATEGORIES,
  currency,
}: QuickAddModalProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'cat-1');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'bank_transfer' | 'other'>('cash');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  
  // Split expenses state
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [splits, setSplits] = useState<TransactionSplit[]>([
    { category_id: categories[0]?.id || 'cat-1', amount: 0, notes: '' },
    { category_id: categories[1]?.id || 'cat-2', amount: 0, notes: '' },
  ]);

  // OCR state
  const [isScanningOCR, setIsScanningOCR] = useState<boolean>(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningOCR(true);
    setOcrSuccessMsg(null);

    try {
      const result = await parseReceiptImage(file);
      if (result.amount) {
        setAmount(result.amount.toString());
      }
      if (result.merchant) {
        setNotes(result.merchant);
      }
      if (result.date) {
        setDate(result.date);
      }
      setOcrSuccessMsg(`Scanned: ${result.merchant || 'Receipt'} (${result.amount ? '$' + result.amount : ''})`);
    } catch (err) {
      console.error('OCR failed:', err);
    } finally {
      setIsScanningOCR(false);
    }
  };

  const handleAddSplitRow = () => {
    setSplits([...splits, { category_id: categories[0]?.id || 'cat-1', amount: 0, notes: '' }]);
  };

  const handleRemoveSplitRow = (index: number) => {
    setSplits(splits.filter((_, i) => i !== index));
  };

  const handleSplitChange = (index: number, field: keyof TransactionSplit, val: any) => {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], [field]: val };
    setSplits(newSplits);

    // Update total amount automatically from splits
    const totalSplitAmount = newSplits.reduce((sum, s) => sum + Number(s.amount || 0), 0);
    setAmount(totalSplitAmount.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddTransaction({
        type,
        amount: parseFloat(amount),
        category_id: isSplit ? null : categoryId,
        payment_method: paymentMethod,
        date: new Date(date).toISOString(),
        notes: notes.trim(),
        currency,
        is_recurring: isRecurring,
        recurrence_interval: isRecurring ? recurrenceInterval : null,
        splits: isSplit ? splits : null,
      });

      // Reset form
      setAmount('');
      setNotes('');
      setOcrSuccessMsg(null);
      setIsSplit(false);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-modal w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-700/60 relative my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Log Transaction</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                &lt;5s Entry
              </span>
            </h2>
            <p className="text-xs text-slate-400">Record an expense or income quickly</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
          </div>

          {/* OCR Scanner Button */}
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-3 rounded-2xl border border-purple-500/30">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-purple-200">Scan Receipt with OCR</p>
                <p className="text-[10px] text-purple-300/70">Auto-detect amount & merchant name</p>
              </div>
            </div>
            <label className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all">
              {isScanningOCR ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              <span>{isScanningOCR ? 'Scanning...' : 'Upload'}</span>
              <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
            </label>
          </div>

          {ocrSuccessMsg && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{ocrSuccessMsg}</span>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Amount ({currency})</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                disabled={isSplit}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900/90 text-white font-bold text-2xl px-4 py-3 rounded-2xl border border-slate-700/80 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-600"
              />
            </div>
          </div>

          {/* Split Expenses Toggle */}
          {type === 'expense' && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <Split className="w-4 h-4 text-blue-400" />
                <span>Split across multiple categories</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSplit(!isSplit)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  isSplit ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                    isSplit ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Category Selector (or Split rows) */}
          {!isSplit ? (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-900/90 text-slate-200 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <label className="text-xs font-semibold text-blue-300 block">Category Splits</label>
              {splits.map((s, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={s.category_id}
                    onChange={(e) => handleSplitChange(index, 'category_id', e.target.value)}
                    className="flex-1 bg-slate-900 text-xs px-2.5 py-2 rounded-lg border border-slate-700"
                  >
                    {filteredCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    value={s.amount || ''}
                    onChange={(e) => handleSplitChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-24 bg-slate-900 text-xs px-2.5 py-2 rounded-lg border border-slate-700 text-white font-bold"
                  />
                  {splits.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSplitRow(index)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSplitRow}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add split category</span>
              </button>
            </div>
          )}

          {/* Payment Method & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-900/90 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-700"
              >
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/90 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Notes / Merchant</label>
            <input
              type="text"
              placeholder="e.g. Starbucks coffee, Monthly Rent"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900/90 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-amber-400" />
              <span>Recurring transaction</span>
            </span>
            <button
              type="button"
              onClick={() => setIsRecurring(!isRecurring)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                isRecurring ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                  isRecurring ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {isRecurring && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Recurrence Frequency</label>
              <select
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(e.target.value as any)}
                className="w-full bg-slate-900/90 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm py-3 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 stroke-[3]" />}
            <span>Save Transaction</span>
          </button>
        </form>
      </div>
    </div>
  );
}
