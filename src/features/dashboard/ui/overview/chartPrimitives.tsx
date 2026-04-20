'use client';

import React from 'react';

/** Tooltip recharts — bo góc, đồng bộ dashboard */
export const chartTooltipProps = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid var(--color-border)',
    boxShadow: 'none',
    fontSize: 12,
  },
} as const;

export function ChartPanel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 ${className ?? ''}`}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs text-gray">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
