'use client';

import { useParams } from 'next/navigation';
import { BookOpen, Clock, Loader2, Package, Power, Trash2 } from 'lucide-react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  DashboardPage,
  DashboardSurface,
  DashboardViewHeader,
} from '@/features/dashboard/ui/DashboardPrimitives';
import { useMentorPackageDetail } from '@/features/mentor/hooks/useMentorPackageDetail';
import { MentorPackageCurriculumList } from '@/features/mentor/ui/packages/MentorPackageCurriculumList';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export function MentorPackageDetailPage() {
  const params = useParams();
  const packageId = String(params?.packageId ?? '');
  const toast = useToast();
  const { pkg, loading, error, actionLoading, refresh, toggleActive, remove } =
    useMentorPackageDetail(packageId);

  if (!packageId) {
    return <ErrorMessage message="Không xác định được gói dịch vụ." />;
  }

  if (loading && !pkg) {
    return <PageLoadingState label="Đang tải chi tiết gói dịch vụ…" />;
  }

  if (error && !pkg) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!pkg) {
    return <ErrorMessage message="Không tìm thấy gói dịch vụ." onRetry={refresh} />;
  }

  const defaultVersion = pkg.versions.find((v) => v.isDefault) ?? pkg.versions[0];
  const curriculums = defaultVersion?.curriculums ?? [];

  const handleToggle = async () => {
    try {
      const updated = await toggleActive();
      toast.success(
        updated?.isActive ? 'Đã kích hoạt gói dịch vụ.' : 'Đã tạm dừng gói dịch vụ.',
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa gói dịch vụ này? Hành động không thể hoàn tác.')) {
      return;
    }
    try {
      await remove();
      toast.success('Đã xóa gói dịch vụ.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể xóa gói dịch vụ.');
    }
  };

  return (
    <DashboardPage>
      {!pkg.isArchived ? (
        <DashboardViewHeader
          action={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleToggle()}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Power className="size-4" />
                )}
                {pkg.isActive ? 'Tạm dừng' : 'Kích hoạt'}
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Xóa
              </button>
            </div>
          }
        />
      ) : null}

      <div className="space-y-6">
        <DashboardSurface className="p-4 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Package className="size-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">{pkg.name}</h2>
                  <span
                    className={cn(
                      'inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
                      pkg.isActive && !pkg.isArchived
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : 'bg-slate-100 text-slate-600 ring-slate-500/10',
                    )}
                  >
                    {pkg.isArchived ? 'Đã xóa' : pkg.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {pkg.description || 'Chưa có mô tả chi tiết.'}
                </p>
              </div>
            </div>

            <dl className="grid shrink-0 grid-cols-2 gap-4 text-sm sm:grid-cols-3 lg:gap-6">
              <div>
                <dt className="text-xs font-medium text-slate-500">Giá</dt>
                <dd className="mt-1 text-lg font-semibold text-primary">
                  {pkg.price.toLocaleString('vi-VN')}đ
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Thời lượng</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-medium text-slate-900">
                  <Clock className="size-4 text-slate-400" />
                  {pkg.durationLabel}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Số buổi</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-medium text-slate-900">
                  <BookOpen className="size-4 text-slate-400" />
                  {curriculums.length} buổi
                </dd>
              </div>
            </dl>
          </div>
        </DashboardSurface>

        <DashboardSurface className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">Lộ trình buổi học</h3>
            <p className="mt-1 text-sm text-slate-500">
              Danh sách các buổi mentoring trong gói này, theo thứ tự thực hiện.
            </p>
          </div>
          <MentorPackageCurriculumList items={curriculums} />
        </DashboardSurface>
      </div>
    </DashboardPage>
  );
}
