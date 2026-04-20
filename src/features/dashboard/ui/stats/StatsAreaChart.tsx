'use client';

import React, { useId } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { chartTooltipProps } from '@/features/dashboard/ui/overview/chartPrimitives';
import type { StatsSeriesPoint } from './types';

type Props = {
  data: StatsSeriesPoint[];
  dataKey?: string;
  name?: string;
  height?: number;
  /** CSS color for stroke/fill */
  colorVar?: string;
  /** Định dạng giá trị trong tooltip (ví dụ thêm đơn vị). */
  formatTooltipValue?: (v: number | string | undefined) => string;
};

export function StatsAreaChart({
  data,
  dataKey = 'value',
  name = 'Giá trị',
  height = 260,
  colorVar = 'var(--color-chart-area-stroke)',
  formatTooltipValue = (v) => `${v ?? '—'}`,
}: Props) {
  const uid = useId().replace(/:/g, '');
  const gradId = `stats-area-${uid}`;

  return (
    <div style={{ height }} className="w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorVar} stopOpacity={0.2} />
              <stop offset="95%" stopColor={colorVar} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
          <Tooltip
            {...chartTooltipProps}
            formatter={(v) => [formatTooltipValue(typeof v === 'number' ? v : Number(v)), name]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={colorVar}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
