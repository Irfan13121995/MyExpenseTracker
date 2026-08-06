'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, CurrencyCode } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface MonthlyTrendChartProps {
  transactions: Transaction[];
  currency: CurrencyCode;
}

export function MonthlyTrendChart({ transactions, currency }: MonthlyTrendChartProps) {
  // Group transactions by date
  const dateMap: Record<string, { date: string; income: number; expense: number }> = {};

  // Sort transactions by date ascending
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  sorted.forEach((t) => {
    const formattedDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dateMap[formattedDate]) {
      dateMap[formattedDate] = { date: formattedDate, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      dateMap[formattedDate].income += Number(t.amount);
    } else {
      dateMap[formattedDate].expense += Number(t.amount);
    }
  });

  const data = Object.values(dateMap);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-slate-400 font-medium text-sm">No transaction trend data available.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight">Cash Flow Trends</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              formatter={(value: any, name: any) => [
                formatCurrency(Number(value) || 0, currency),
                name === 'income' ? 'Income' : 'Expense',
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
