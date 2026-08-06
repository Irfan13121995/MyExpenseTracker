'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, PlusCircle, Target, PieChart } from 'lucide-react';

interface BottomNavProps {
  onOpenQuickAdd: () => void;
}

export function BottomNav({ onOpenQuickAdd }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: LayoutDashboard },
    { label: 'Ledger', href: '/transactions', icon: ReceiptText },
    { label: 'Budgets', href: '/budgets', icon: Target },
    { label: 'Analytics', href: '/analytics', icon: PieChart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-slate-800 px-4 py-2 flex items-center justify-around">
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Center Floating Quick Add Button */}
      <button
        onClick={onOpenQuickAdd}
        className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 active:scale-95 transition-transform"
        aria-label="Add Transaction"
      >
        <PlusCircle className="w-6 h-6 stroke-[2.5]" />
      </button>

      {navItems.slice(2, 4).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
