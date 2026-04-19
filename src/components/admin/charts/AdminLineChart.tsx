'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';
import type { AdminSeriesPoint } from './types';

type Props = {
  data: AdminSeriesPoint[];
  dataKey?: string;
  name?: string;
  height?: number;
  colorVar?: string;
};

export function AdminLineChart({
  data,
  dataKey = 'value',
  name = 'Giá trị',
  height = 260,
  colorVar = 'var(--color-chart-line)',
}: Props) {
  return (
    <div style={{ height }} className="w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
          <Tooltip {...chartTooltipProps} formatter={(v) => [`${v ?? '—'}`, name]} />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={colorVar}
            strokeWidth={2}
            dot={{ r: 3, fill: colorVar, strokeWidth: 2, stroke: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
