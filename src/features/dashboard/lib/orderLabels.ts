/** Nhãn & màu trạng thái đơn — khớp `order_status` trên sociedu-api. */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
  expired: 'Hết hạn thanh toán',
  canceled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

export function orderStatusLabel(status?: string | null): string {
  const key = String(status ?? '').toLowerCase();
  return ORDER_STATUS_LABELS[key] ?? (status?.trim() || '—');
}

export function orderStatusBadgeClass(status?: string | null): string {
  const key = String(status ?? '').toLowerCase();
  switch (key) {
    case 'paid':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'pending_payment':
      return 'bg-amber-50 text-amber-800 ring-amber-200';
    case 'failed':
      return 'bg-red-50 text-red-700 ring-red-200';
    case 'expired':
      return 'bg-orange-50 text-orange-800 ring-orange-200';
    case 'canceled':
      return 'bg-slate-100 text-slate-600 ring-slate-200';
    case 'refunded':
      return 'bg-blue-50 text-blue-700 ring-blue-200';
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-200';
  }
}

export function shortOrderId(id?: string | null): string {
  if (!id) return '—';
  const s = String(id);
  return s.length > 8 ? `#${s.slice(0, 8).toUpperCase()}` : `#${s}`;
}
