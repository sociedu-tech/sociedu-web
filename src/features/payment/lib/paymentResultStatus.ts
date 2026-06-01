export function normalizePaymentStatus(value: string | null | undefined): string {
  return String(value ?? '').trim().toLowerCase();
}

export function isPaidLikeStatus(value: string | null | undefined): boolean {
  const s = normalizePaymentStatus(value);
  return s === 'paid' || s === 'success' || s === 'completed';
}

export function isFailedLikeStatus(value: string | null | undefined): boolean {
  const s = normalizePaymentStatus(value);
  return s === 'failed' || s === 'expired' || s === 'canceled' || s === 'cancelled';
}

export function isUrlPaymentSuccess(
  status: string | null | undefined,
  code: string | null | undefined,
): boolean {
  if (code === '00') return true;
  return isPaidLikeStatus(status);
}

export function isUrlPaymentFailure(
  status: string | null | undefined,
  code: string | null | undefined,
): boolean {
  if (code != null && code !== '' && code !== '00') return true;
  return isFailedLikeStatus(status);
}
