'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';

const DEFAULT_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

type Row = { name: string; value: number };

type Props = {
  data: Row[];
  height?: number;
  colors?: string[];
};

export function AdminDonutChart({ data, height = 240, colors = DEFAULT_COLORS }: Props) {
  return (
    <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center">
      <div style={{ height }} className="min-h-0 w-full min-w-0 sm:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={data[i].name} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip {...chartTooltipProps} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-1 flex-col justify-center gap-2 sm:pl-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="truncate font-medium text-slate-800">{d.name}</span>
            </span>
            <span className="shrink-0 tabular-nums text-slate-600">{d.value.toLocaleString('vi-VN')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
