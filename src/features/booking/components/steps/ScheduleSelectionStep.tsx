'use client';

import { ArrowLeft, CalendarDays, Clock, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useBookingStore } from '../../store/useBookingStore';
import { useAvailability } from '../../hooks/useAvailability';
import { useCreateDraft } from '../../hooks/useBookingMutations';
import { getTimezoneNotice } from '../../utils/timezoneHelper';
import { groupSlotsByPartOfDay } from '../../services/slotService';
import { CalendarSkeleton } from '../skeletons/CalendarSkeleton';
import { SlotSkeleton } from '../skeletons/SlotSkeleton';
import type { AvailableSlot } from '../../types';

const SLOT_GROUPS = [
  { key: 'morning', label: 'Buổi sáng' },
  { key: 'afternoon', label: 'Buổi chiều' },
  { key: 'evening', label: 'Buổi tối' },
] as const;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildDateOptions() {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return {
      value: toDateKey(date),
      weekday: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
      day: date.getDate(),
    };
  });
}

export function ScheduleSelectionStep() {
  const {
    mentorId,
    selectedPackageId,
    selectedVersionId,
    selectedDate,
    selectedTimeSlot,
    timezone,
    setSchedule,
    setDraft,
    transitionTo,
  } = useBookingStore();
  const createDraft = useCreateDraft();
  const dateOptions = useMemo(buildDateOptions, []);
  const activeDate = selectedDate ?? dateOptions[0]?.value;
  const availability = useAvailability(mentorId, activeDate, timezone);

  const availableSlots = useMemo(
    () => availability.data?.slots.filter((slot) => slot.available) ?? [],
    [availability.data?.slots],
  );
  const groupedSlots = useMemo(() => groupSlotsByPartOfDay(availableSlots), [availableSlots]);

  const handleCreateDraft = async () => {
    if (!mentorId || !selectedPackageId || !selectedVersionId || !activeDate || !selectedTimeSlot) {
      return;
    }

    const draft = await createDraft.mutateAsync({
      mentorId,
      packageId: selectedPackageId,
      versionId: selectedVersionId,
      scheduledAt: selectedTimeSlot,
      timezone,
    });
    setDraft(draft.draftBookingId);
    transitionTo('FILLING_DETAILS');
  };

  if (!selectedPackageId || !selectedVersionId) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <h3 className="text-sm font-bold text-amber-800">Bạn cần chọn gói trước</h3>
        <p className="mt-1 text-sm text-amber-700">Quay lại bước chọn gói để tiếp tục đặt lịch.</p>
        <button
          type="button"
          onClick={() => transitionTo('SELECTING_PACKAGE')}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-amber-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Chọn gói
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Chọn lịch hẹn</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-500">
          <Clock className="h-4 w-4" aria-hidden />
          {getTimezoneNotice(timezone)}
        </p>
      </div>

      {availability.isLoading && !availability.data ? (
        <CalendarSkeleton />
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {dateOptions.map((option) => {
            const selected = activeDate === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSchedule(option.value, undefined)}
                className={cn(
                  'h-16 rounded-xl border text-center transition-colors',
                  selected
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-100 bg-white text-gray-700 hover:border-primary/40',
                )}
              >
                <span className="block text-[11px] font-semibold uppercase">{option.weekday}</span>
                <span className="mt-1 block text-lg font-black">{option.day}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Khung giờ trống</h4>
            <p className="mt-0.5 text-xs text-gray-500">Chỉ hiển thị slot backend trả về.</p>
          </div>
          <CalendarDays className="h-5 w-5 text-gray-300" aria-hidden />
        </div>

        {availability.isLoading ? (
          <SlotSkeleton />
        ) : availability.isError ? (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Không thể tải lịch trống. Vui lòng thử lại.
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
            Chưa có khung giờ trống trong ngày này.
          </div>
        ) : (
          <div className="space-y-5">
            {SLOT_GROUPS.map(({ key, label }) => {
              const slots = groupedSlots[key];
              if (!slots.length) return null;

              return (
                <div key={key}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    {label}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {slots.map((slot: AvailableSlot) => {
                      const selected = selectedTimeSlot === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          onClick={() => setSchedule(activeDate, slot.startTime)}
                          className={cn(
                            'rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors',
                            selected
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-primary/40 hover:bg-white',
                          )}
                        >
                          {formatTime(slot.startTime)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => transitionTo('SELECTING_PACKAGE')}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Quay lại
        </button>
        <button
          type="button"
          onClick={handleCreateDraft}
          disabled={!selectedTimeSlot || createDraft.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
        >
          {createDraft.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Giữ lịch và tiếp tục
        </button>
      </div>
    </div>
  );
}
