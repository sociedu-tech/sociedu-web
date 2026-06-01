import type { BookingProgramItem } from '@/features/dashboard/types/booking';

export type ProgramFilter = 'all' | 'active' | 'upcoming' | 'completed' | 'canceled';

/** @deprecated Use ProgramFilter */
export type MentorTeachingFilter = ProgramFilter;

export const PROGRAM_FILTERS: { id: ProgramFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Đang học' },
  { id: 'upcoming', label: 'Sắp diễn ra' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'canceled', label: 'Đã hủy' },
];

/** @deprecated Use PROGRAM_FILTERS */
export const MENTOR_TEACHING_FILTERS = PROGRAM_FILTERS;

export function filterProgramItems(items: BookingProgramItem[], filter: ProgramFilter): BookingProgramItem[] {
  if (filter === 'all') return items;

  return items.filter((item) => {
    const status = item.bookingStatus.toLowerCase();
    const canceled = status === 'canceled' || status === 'cancelled';

    if (filter === 'canceled') return canceled;
    if (filter === 'completed') {
      return !canceled && (item.progressPercent === 100 || status === 'completed');
    }
    if (filter === 'upcoming') {
      return !canceled && item.progressPercent < 100 && Boolean(item.nextSessionWhen);
    }
    if (filter === 'active') {
      return !canceled && item.progressPercent < 100;
    }
    return true;
  });
}

/** @deprecated Use filterProgramItems */
export const filterMentorTeachingItems = filterProgramItems;
