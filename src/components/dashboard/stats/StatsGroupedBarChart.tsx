'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';

export type StatsGroupedSeries = {
  dataKey: string;
  name: string;
  colorVar?: string;
  maxBarSize?: number;
  radius?: [number, number, number, number];
};

type Row = Record<string, string | number>;

type Props = {
  data: Row[];
  /** Trường làm nhãn trục X (thường là `label`). */
  xKey: string;
  series: StatsGroupedSeries[];
  height?: number;
  yAllowDecimals?: boolean;
};

export function StatsGroupedBarChart({
  data,
  xKey,
  series,
  height = 260,
  yAllowDecimals = false,
}: Props) {
  return (
    <div style={{ height }} className="w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barCategoryGap="18%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
            allowDecimals={yAllowDecimals}
          />
          <Tooltip {...chartTooltipProps} />
          {series.map((s) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name}
              fill={s.colorVar ?? 'var(--color-chart-1)'}
              radius={s.radius ?? [4, 4, 0, 0]}
              maxBarSize={s.maxBarSize ?? 28}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
