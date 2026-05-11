import { api } from '@/lib/api';
import type {
  AvailabilityResponse,
  CheckoutBookingRequest,
  CheckoutBookingResponse,
  ConfirmBookingRequest,
  ConfirmBookingResponse,
  CreateDraftBookingRequest,
  DraftBookingResponse,
  PaymentSessionResponse,
  PaymentVerifyResponse,
} from '../types';

const BOOKINGS_BASE = '/api/v1/bookings';
const PAYMENTS_BASE = '/api/v1/payments';
const ORDERS_BASE = '/api/v1/orders';

export const bookingFlowApi = {
  getAvailability: async (
    mentorId: string,
    date: string,
    timezone: string,
  ): Promise<AvailabilityResponse> => {
    const qs = new URLSearchParams({ mentorId, date, timezone }).toString();
    const res = await api.get<AvailabilityResponse>(`${BOOKINGS_BASE}/availability?${qs}`);
    return res.data!;
  },

  createDraft: async (data: CreateDraftBookingRequest): Promise<DraftBookingResponse> => {
    const res = await api.post<DraftBookingResponse>(`${BOOKINGS_BASE}/draft`, data);
    return res.data!;
  },

  confirmBooking: async (
    draftId: string,
    details: ConfirmBookingRequest,
  ): Promise<ConfirmBookingResponse> => {
    const res = await api.post<ConfirmBookingResponse>(
      `${BOOKINGS_BASE}/${draftId}/confirm`,
      details,
    );
    return res.data!;
  },

  cancelDraft: async (draftId: string): Promise<void> => {
    await api.delete(`${BOOKINGS_BASE}/draft/${draftId}`);
  },

  checkout: async (data: CheckoutBookingRequest): Promise<CheckoutBookingResponse> => {
    const res = await api.post<CheckoutBookingResponse>(`${ORDERS_BASE}/checkout`, data);
    return res.data!;
  },

  createPaymentSession: async (bookingId: string): Promise<PaymentSessionResponse> => {
    const res = await api.post<PaymentSessionResponse>(
      `${PAYMENTS_BASE}/booking/${bookingId}/session`,
      {},
    );
    return res.data!;
  },

  verifyPayment: async (params: Record<string, string>): Promise<PaymentVerifyResponse> => {
    const qs = new URLSearchParams(params).toString();
    const res = await api.get<PaymentVerifyResponse>(`${PAYMENTS_BASE}/vnpay/return?${qs}`);
    return res.data!;
  },
};
