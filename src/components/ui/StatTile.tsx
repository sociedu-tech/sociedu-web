import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StatTileProps = {
  value: ReactNode;
  label: string;
  className?: string;
};

/** Ô số liệu + nhãn (hero landing, lưới thống kê tương tự). */
export function StatTile({ value, label, className }: StatTileProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-white/95 px-3 py-4 text-center backdrop-blur-sm md:px-4 md:py-5',
        className,
      )}
    >
      <div className="text-xl font-black tracking-tight text-primary md:text-2xl">{value}</div>
      <div className="mt-1.5 text-[11px] font-medium leading-snug text-gray md:text-xs">{label}</div>
    </div>
  );
}
