'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { Category } from '@/types';

interface CategoryBadgeProps {
  category?: Category;
  name?: string;
  color?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, name, color, icon, size = 'md' }: CategoryBadgeProps) {
  const catName = category?.name || name || 'General';
  const catColor = category?.color || color || '#64748b';
  const iconName = category?.icon || icon || 'Tag';

  // Dynamic Lucide Icon mapping
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || Icons.Tag;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${sizeClasses}`}
      style={{
        backgroundColor: `${catColor}15`, // 15% opacity tint
        borderColor: `${catColor}40`,
        color: catColor,
      }}
    >
      <IconComponent className={iconSizes} />
      <span>{catName}</span>
    </span>
  );
}
