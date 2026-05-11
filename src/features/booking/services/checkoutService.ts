import type { BookingFormData } from '../schemas/bookingFormSchema';

export function buildCheckoutOrderInfo(packageName: string | undefined, details: BookingFormData) {
  const parts = ['Mentoree booking'];
  if (packageName?.trim()) {
    parts.push(packageName.trim());
  }
  const goals = details.goals.trim();
  if (goals) {
    parts.push(goals.length > 80 ? `${goals.slice(0, 77)}...` : goals);
  }
  return parts.join(' - ');
}

export function isSuccessfulPaymentStatus(status: string | undefined) {
  return status?.toLowerCase() === 'success';
}
