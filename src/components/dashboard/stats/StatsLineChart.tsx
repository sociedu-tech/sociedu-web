'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';
import type { StatsSeriesPoint } from './types';

type Props = {
  data: StatsSeriesPoint[];
  dataKey?: string;
  name?: string;
  height?: number;
  colorVar?: string;
  /** Giới hạn trục Y (ví dụ [0, 100] cho %). */
  yDomain?: [number, number];
  /** Định dạng tick trục Y. */
  yTickFormatter?: (v: number) => string;
  yAllowDecimals?: boolean;
  /** Bán kính điểm trên đường. */
  dotRadius?: number;
  /** Định dạng giá trị trong tooltip. */
  formatTooltipValue?: (v: number | string | undefined) => string;
};

export function StatsLineChart({
  data,
  dataKey = 'value',
  name = 'Giá trị',
  height = 260,
  colorVar = 'var(--color-chart-line)',
  yDomain,
  yTickFormatter,
  yAllowDecimals = true,
  dotRadius = 3,
  formatTooltipValue = (v) => `${v ?? '—'}`,
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
          <YAxis
            domain={yDomain}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
            tickFormatter={yTickFormatter}
            allowDecimals={yAllowDecimals}
          />
          <Tooltip
            {...chartTooltipProps}
            formatter={(v) => [formatTooltipValue(typeof v === 'number' ? v : Number(v)), name]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={colorVar}
            strokeWidth={2}
            dot={{ r: dotRadius, fill: colorVar, strokeWidth: 2, stroke: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
