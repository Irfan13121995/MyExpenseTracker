'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, CurrencyCode } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SpendingPieChartProps {
  transactions: Transaction[];
  currency: CurrencyCode;
}

export function SpendingPieChart({ transactions, currency }: SpendingPieChartProps) {
  // Aggregate expenses by category
  const categoryTotals: Record<string, { name: string; amount: number; color: string }> = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const catName = t.category?.name || 'Uncategorized';
      const catColor = t.category?.color || '#64748b';

      if (!categoryTotals[catName]) {
        categoryTotals[catName] = { name: catName, amount: 0, color: catColor };
      }
      categoryTotals[catName].amount += Number(t.amount);
    });

  const data = Object.values(categoryTotals).sort((a, b) => b.amount - a.amount);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-slate-400 font-medium text-sm">No expense data for chart visualization.</p>
        <p className="text-slate-500 text-xs mt-1">Add your first expense to see spending distribution.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight">Spending Breakdown</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [
                formatCurrency(Number(value) || 0, currency),
                'Spent',
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
