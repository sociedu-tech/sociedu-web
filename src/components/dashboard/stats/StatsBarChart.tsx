'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';
import type { StatsSeriesPoint } from './types';

type Props = {
  data: StatsSeriesPoint[];
  dataKey?: string;
  name?: string;
  height?: number;
  colorVar?: string;
  maxBarSize?: number;
  barRadius?: [number, number, number, number];
  /** Nhãn trục X dài: nghiêng (độ). */
  xTickAngle?: number;
  /** Chiều cao vùng trục X khi dùng nhãn nghiêng. */
  xAxisHeight?: number;
  tickFontSize?: number;
  yAllowDecimals?: boolean;
  formatTooltipValue?: (v: number | string | undefined) => string;
};

export function StatsBarChart({
  data,
  dataKey = 'value',
  name = 'Giá trị',
  height = 260,
  colorVar = 'var(--color-chart-1)',
  maxBarSize = 48,
  barRadius = [6, 6, 0, 0],
  xTickAngle,
  xAxisHeight,
  tickFontSize = 11,
  yAllowDecimals = true,
  formatTooltipValue = (v) => `${v ?? '—'}`,
}: Props) {
  const bottomMargin = xTickAngle ? Math.max(8, (xAxisHeight ?? 48) - 16) : 0;
  return (
    <div style={{ height }} className="w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -8, bottom: bottomMargin }}
          barCategoryGap="18%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: tickFontSize, fill: 'var(--color-chart-tick)' }}
            angle={xTickAngle}
            textAnchor={xTickAngle ? 'end' : 'middle'}
            height={xAxisHeight}
            interval={xTickAngle != null ? 0 : undefined}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
            allowDecimals={yAllowDecimals}
          />
          <Tooltip
            {...chartTooltipProps}
            formatter={(v) => [formatTooltipValue(typeof v === 'number' ? v : Number(v)), name]}
          />
          <Bar dataKey={dataKey} name={name} fill={colorVar} radius={barRadius} maxBarSize={maxBarSize} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
