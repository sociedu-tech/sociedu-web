'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DashboardTabItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
};

export function DashboardTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: {
  tabs: DashboardTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Chuyển tab"
      className={cn(
        'flex w-full gap-1 overflow-x-auto rounded-xl border border-slate-200/90 bg-white p-1 shadow-sm sm:inline-flex sm:w-auto',
        className,
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:flex-initial',
              active
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            {Icon ? <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden /> : null}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
