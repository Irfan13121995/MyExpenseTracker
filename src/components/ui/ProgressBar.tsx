'use client';

import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  label?: string;
  subLabel?: string;
}

export function ProgressBar({ percentage, showLabel = true, label, subLabel }: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Color Coding based on threshold: Green (<70%), Amber (70-80%), Red (>80%)
  let barColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  if (percentage >= 80) {
    barColor = 'bg-rose-500 animate-pulse';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (percentage >= 70) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">{label}</span>
          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${badgeColor}`}>
            {percentage.toFixed(0)}% spent
          </span>
        </div>
      )}

      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>

      {subLabel && <p className="text-[11px] text-slate-400">{subLabel}</p>}
    </div>
  );
}
