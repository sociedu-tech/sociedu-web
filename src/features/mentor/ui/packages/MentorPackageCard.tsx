import Link from 'next/link';
import { BadgeDollarSign, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MentorServicePackage } from '@/features/mentor/types/servicePackage';

type Props = {
  pkg: MentorServicePackage;
};

export function MentorPackageCard({ pkg }: Props) {
  return (
    <Link
      href={`/dashboard/packages/${pkg.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-primary">
            {pkg.name}
          </h3>
          <span
            className={cn(
              'inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
              pkg.isActive && !pkg.isArchived
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                : 'bg-slate-100 text-slate-600 ring-slate-500/10',
            )}
          >
            {pkg.isArchived ? 'Đã xóa' : pkg.isActive ? 'Hoạt động' : 'Tạm dừng'}
          </span>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
          {pkg.description || 'Chưa có mô tả chi tiết.'}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0 text-slate-400" />
            <span>{pkg.durationLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="size-3.5 shrink-0 text-slate-400" />
            <span>{pkg.curriculumCount} buổi lộ trình</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        <div className="flex items-center gap-1 text-sm font-semibold text-primary">
          <BadgeDollarSign className="size-4" />
          <span>{pkg.price.toLocaleString('vi-VN')}đ</span>
        </div>
        <span className="flex items-center gap-0.5 text-xs font-medium text-slate-500 transition group-hover:text-primary">
          Xem chi tiết
          <ChevronRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
