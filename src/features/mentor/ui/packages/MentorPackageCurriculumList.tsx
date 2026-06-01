import { Clock, ListOrdered } from 'lucide-react';
import type { PackageCurriculum } from '@/features/mentor/types/servicePackage';

type Props = {
  items: PackageCurriculum[];
};

export function MentorPackageCurriculumList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
        <ListOrdered className="mx-auto size-8 text-slate-300" strokeWidth={1.5} />
        <p className="mt-3 text-sm font-medium text-slate-600">Chưa có lộ trình nào</p>
        <p className="mt-1 text-xs text-slate-500">Gói dịch vụ này chưa được thiết lập lộ trình buổi học.</p>
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {item.orderIndex || index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-900">{item.title}</h4>
            {item.description ? (
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
            ) : null}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="size-3.5" />
              <span>{item.duration} phút</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
