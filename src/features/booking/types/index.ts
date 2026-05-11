/**
 * Booking flow UI types — extend from existing backend types in @/types/booking
 */

export interface AvailableSlot {
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime
  available: boolean;
}

export interface AvailabilityResponse {
  mentorId: string;
  date: string;
  timezone: string;
  slots: AvailableSlot[];
}

export interface CreateDraftBookingRequest {
  mentorId: string;
  packageId: string;
  versionId: string;
  scheduledAt: string; // ISO datetime of the selected slot
  timezone: string;
}

export interface DraftBookingResponse {
  draftBookingId: string;
  expiresAt: string; // ISO datetime — khi nào slot hold hết hạn
}

export interface ConfirmBookingRequest {
  goals: string;
  questions?: string;
  portfolioUrl?: string;
}

export interface ConfirmBookingResponse {
  bookingId: string;
  status: 'PENDING' | 'CONFIRMED';
  requiresPayment: boolean;
  paymentUrl?: string;
}

export interface PaymentSessionResponse {
  paymentUrl: string;
  orderId: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  bookingId: string;
  status: 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED';
  message?: string;
}

/** Booking intent — lưu lại khi user chưa login */
export interface PendingBookingIntent {
  mentorId: string;
  packageId?: string;
}
