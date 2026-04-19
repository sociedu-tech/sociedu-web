'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';
import type { AdminSeriesPoint } from './types';

type Props = {
  data: AdminSeriesPoint[];
  dataKey?: string;
  name?: string;
  height?: number;
  colorVar?: string;
};

export function AdminBarChart({
  data,
  dataKey = 'value',
  name = 'Giá trị',
  height = 260,
  colorVar = 'var(--color-chart-1)',
}: Props) {
  return (
    <div style={{ height }} className="w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barCategoryGap="18%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
          <Tooltip {...chartTooltipProps} formatter={(v) => [`${v ?? '—'}`, name]} />
          <Bar dataKey={dataKey} name={name} fill={colorVar} radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
