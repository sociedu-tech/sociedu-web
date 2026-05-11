import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { isApiClientError } from '@/lib/api';
import { useBookingStore } from '../store/useBookingStore';
import { bookingFlowApi } from '../api/bookingFlowApi';
import type { CreateDraftBookingRequest } from '../types';

function useBookingConflictRecovery() {
  const queryClient = useQueryClient();

  return (mentorId?: string) => {
    toast.error('Khung giờ vừa được đặt bởi người khác. Vui lòng chọn lại.');
    if (mentorId) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingAvailabilityRoot(mentorId) });
    }
    useBookingStore.getState().setSchedule(undefined, undefined);
    useBookingStore.getState().transitionTo('SELECTING_SLOT');
  };
}

export function useCreateDraft() {
  const recoverConflict = useBookingConflictRecovery();

  return useMutation({
    mutationFn: (data: CreateDraftBookingRequest) => bookingFlowApi.createDraft(data),
    onError: (error, variables) => {
      if (isApiClientError(error) && error.status === 409) {
        recoverConflict(variables.mentorId);
        return;
      }
      toast.error(error instanceof Error ? error.message : 'Không thể giữ lịch hẹn.');
    },
  });
}

export function useConfirmBooking() {
  return useMutation({
    mutationFn: ({
      draftId,
      details,
    }: {
      draftId: string;
      details: Parameters<typeof bookingFlowApi.confirmBooking>[1];
    }) => bookingFlowApi.confirmBooking(draftId, details),
  });
}

export const useCheckoutBooking = () =>
  useMutation({
    mutationFn: bookingFlowApi.checkout,
  });

export const useCancelDraft = () =>
  useMutation({
    mutationFn: (draftId: string) => bookingFlowApi.cancelDraft(draftId),
  });

export const useCreatePaymentSession = () =>
  useMutation({
    mutationFn: (bookingId: string) => bookingFlowApi.createPaymentSession(bookingId),
  });

export const useVerifyPayment = () =>
  useMutation({
    mutationFn: (params: Record<string, string>) => bookingFlowApi.verifyPayment(params),
  });
