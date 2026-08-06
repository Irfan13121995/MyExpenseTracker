'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Target, PieChart, Settings, PlusCircle } from 'lucide-react';

interface SidebarProps {
  onOpenQuickAdd: () => void;
}

export function Sidebar({ onOpenQuickAdd }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Transactions', href: '/transactions', icon: ReceiptText },
    { label: 'Budgets', href: '/budgets', icon: Target },
    { label: 'Analytics', href: '/analytics', icon: PieChart },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 glass-card border-r border-slate-800/80 min-h-[calc(100vh-65px)] p-4 space-y-6">
      {/* Quick Entry Action */}
      <button
        onClick={onOpenQuickAdd}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
      >
        <PlusCircle className="w-5 h-5 stroke-[2.5]" />
        <span>Add Transaction</span>
      </button>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* PWA Info Widget */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
        <p className="font-semibold text-slate-300">PWA Offline Mode</p>
        <p className="text-slate-400 text-[11px]">Install on your mobile home screen to log expenses even without internet.</p>
      </div>
    </aside>
  );
}
