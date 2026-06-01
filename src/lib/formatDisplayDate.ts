const LOCALE = 'vi-VN';

export type DisplayDateInput = string | Date | null | undefined;

const parseDate = (raw: DisplayDateInput): Date | null => {
  if (raw == null || raw === '') return null;
  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isSameYear = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear();

/**
 * Hiển thị thời gian theo ngữ cảnh:
 * - Cùng ngày: chỉ giờ (HH:mm)
 * - Cùng năm: ngày/tháng (dd/MM)
 * - Khác năm: đầy đủ (dd/MM/yyyy HH:mm)
 */
export function formatDisplayDate(
  raw: DisplayDateInput,
  options?: { now?: Date; empty?: string },
): string {
  const empty = options?.empty ?? '—';
  const d = parseDate(raw);
  if (!d) {
    if (raw == null || raw === '') return empty;
    return String(raw);
  }

  const now = options?.now ?? new Date();

  if (isSameDay(d, now)) {
    return d.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
  }

  if (isSameYear(d, now)) {
    return d.toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit' });
  }

  return d.toLocaleString(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
