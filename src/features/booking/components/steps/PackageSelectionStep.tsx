'use client';

import { CheckCircle2, Clock, PackageOpen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useBookingStore } from '../../store/useBookingStore';
import { usePackagesForBooking } from '../../hooks/usePackagesForBooking';
import { getDisplayVersion } from '../../services/slotService';
import { PackageSkeleton } from '../skeletons/PackageSkeleton';

function formatPrice(amount: number) {
  if (amount === 0) return 'Miễn phí';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function PackageSelectionStep() {
  const queryClient = useQueryClient();
  const { mentorId, selectedPackageId, setPackage, transitionTo } = useBookingStore();
  const { data: packages, isLoading, isError, refetch } = usePackagesForBooking(mentorId);

  const handleSelect = (packageId: string, versionId: string) => {
    setPackage(packageId, versionId);
    if (mentorId) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingAvailabilityRoot(mentorId) });
    }
    transitionTo('SELECTING_SLOT');
  };

  if (isLoading) return <PackageSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <h3 className="text-sm font-bold text-red-700">Không thể tải gói mentoring</h3>
        <p className="mt-1 text-sm text-red-600">Vui lòng thử lại sau ít phút.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-700"
        >
          Tải lại
        </button>
      </div>
    );
  }

  if (!packages?.length) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
        <PackageOpen className="h-10 w-10 text-gray-300" aria-hidden />
        <h3 className="mt-4 text-base font-bold text-gray-900">Mentor chưa có gói đang mở</h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Bạn có thể nhắn tin cho mentor hoặc quay lại khi mentor mở lịch đặt gói.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Chọn gói mentoring</h3>
        <p className="mt-1 text-sm text-gray-500">
          Hệ thống chỉ hiển thị các gói đang hoạt động và chưa lưu trữ.
        </p>
      </div>

      <div className="space-y-3">
        {packages.map((pkg) => {
          const version = getDisplayVersion(pkg);
          const selected = pkg.id === selectedPackageId;

          return (
            <article
              key={pkg.id}
              className={cn(
                'rounded-2xl border bg-white p-4 transition-colors',
                selected ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/40',
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-gray-900">{pkg.name}</h4>
                    {selected && <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {pkg.description}
                  </p>
                  {version && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        {version.durationInMinutes} phút
                      </span>
                      {pkg.category && <span>{pkg.category}</span>}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-end justify-between gap-4 sm:block sm:text-right">
                  <div>
                    <p className="text-lg font-black text-gray-900">
                      {version ? formatPrice(version.price) : 'Chưa có giá'}
                    </p>
                    {version?.title && (
                      <p className="mt-0.5 text-xs font-medium text-gray-500">{version.title}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={!version}
                    onClick={() => version && handleSelect(pkg.id, version.id)}
                    className={cn(
                      'rounded-xl px-4 py-2.5 text-sm font-bold transition-colors',
                      selected
                        ? 'bg-primary text-white'
                        : 'bg-gray-900 text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300',
                    )}
                  >
                    {selected ? 'Đã chọn' : 'Chọn gói'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
