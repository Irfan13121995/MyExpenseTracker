'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/types';

interface NavbarProps {
  onOpenQuickAdd: () => void;
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
}

export function Navbar({ onOpenQuickAdd, selectedCurrency, onCurrencyChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <Wallet className="w-5 h-5 text-slate-950 font-bold" />
        </div>
        <div>
          <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1">
            Expense<span className="text-emerald-400">Tracker</span>
          </span>
          <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wide">PWA EDITION</span>
        </div>
      </Link>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Currency Selector */}
        <select
          value={selectedCurrency}
          onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
          className="bg-slate-800/90 text-slate-200 border border-slate-700/70 text-xs rounded-xl px-2.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
              {c.symbol} {c.code}
            </option>
          ))}
        </select>

        {/* Quick Log Button (<5 sec entry) */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden xs:inline">Quick Log</span>
        </button>
      </div>
    </header>
  );
}
