'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { BottomNav } from '@/components/ui/BottomNav';
import { QuickAddModal } from '@/components/modals/QuickAddModal';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/types';
import { DEFAULT_CATEGORIES } from '@/lib/utils';
import { Globe, User, ShieldCheck, Smartphone, Download } from 'lucide-react';

export default function SettingsPage() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [name, setName] = useState<string>('Alex Johnson');
  const [email, setEmail] = useState<string>('alex.johnson@example.com');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage your default currency, profile information, and PWA installation options.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
              Settings updated successfully!
            </div>
          )}

          {/* User Profile Form */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              <span>User Profile</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Default Display Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                  className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.symbol} - {c.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all"
              >
                Save Preferences
              </button>
            </form>
          </div>

          {/* PWA Mobile Installation Section */}
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <span>Mobile PWA Installation</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This app is fully PWA-enabled. You can install it directly onto your iOS or Android home screen for instant full-screen launching and offline expense tracking.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li>
                <strong>iOS Safari:</strong> Tap Share icon → Select <em>"Add to Home Screen"</em>.
              </li>
              <li>
                <strong>Android Chrome:</strong> Tap menu options (⋮) → Select <em>"Install App"</em> or <em>"Add to Home Screen"</em>.
              </li>
            </ul>
          </div>
        </main>
      </div>

      <BottomNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTransaction={async () => {}}
        categories={DEFAULT_CATEGORIES}
        currency={selectedCurrency}
      />
    </div>
  );
}
