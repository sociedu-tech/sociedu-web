export interface AvailableSlot {
  startTime: string;
  endTime: string;
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
  scheduledAt: string;
  timezone: string;
}

export interface DraftBookingResponse {
  draftBookingId: string;
  expiresAt: string;
}

export interface CheckoutBookingRequest {
  servicePackageVersionId: string;
  orderInfo?: string;
}

export interface CheckoutBookingResponse {
  id: string;
  buyerId: string;
  serviceId: string;
  status: 'pending_payment' | 'paid' | 'failed' | 'canceled' | 'refunded' | string;
  totalAmount: number;
  paidAt?: string;
  createdAt: string;
  paymentUrl?: string;
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
  id: string;
  orderId: string;
  provider: string;
  transactionRef: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'PENDING' | 'SUCCESS' | 'FAILED' | string;
  createdAt: string;
  paymentUrl?: string;
  message?: string;
}

export interface PendingBookingIntent {
  mentorId: string;
  packageId?: string;
}
