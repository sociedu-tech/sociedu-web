import { cn } from '@/lib/utils';

export function asMoney(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function formatVnd(amount: unknown): string {
  return `${asMoney(amount).toLocaleString('vi-VN')}đ`;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  PAID: 'Đã chuyển',
  REJECTED: 'Từ chối',
  FAILED: 'Thất bại',
  PROCESSING: 'Đang xử lý',
};

export function payoutStatusLabel(status?: string | null): string {
  if (!status) return '—';
  return STATUS_LABELS[status.toUpperCase()] ?? status;
}

export function payoutStatusBadgeClass(status?: string | null): string {
  const s = String(status ?? '').toUpperCase();
  if (s === 'PAID') return 'bg-emerald-50 text-emerald-800 ring-emerald-200';
  if (s === 'APPROVED' || s === 'PROCESSING') return 'bg-blue-50 text-blue-800 ring-blue-200';
  if (s === 'PENDING') return 'bg-amber-50 text-amber-900 ring-amber-200';
  if (s === 'REJECTED' || s === 'FAILED') return 'bg-red-50 text-red-800 ring-red-200';
  return 'bg-slate-50 text-slate-700 ring-slate-200';
}

export function PayoutStatusBadge({ status }: { status?: string | null }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        payoutStatusBadgeClass(status),
      )}
    >
      {payoutStatusLabel(status)}
    </span>
  );
}
