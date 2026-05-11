import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  MentorUpdateSessionRequest,
  MenteeUpdateSessionRequest,
  AddEvidenceRequest,
} from '@/types';
import { toast } from 'sonner';

export const useMentorBookings = () => {
  return useQuery({
    queryKey: QUERY_KEYS.bookingsMentor,
    queryFn: () => bookingService.listAsMentor(),
  });
};

export const useBuyerBookings = () => {
  return useQuery({
    queryKey: QUERY_KEYS.bookingsBuyer,
    queryFn: () => bookingService.listAsBuyer(),
  });
};

export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.bookingDetail(id),
    queryFn: () => bookingService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateSessionMentor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      sessionId,
      data,
    }: {
      bookingId: string;
      sessionId: string;
      data: MentorUpdateSessionRequest;
    }) => bookingService.updateSessionAsMentor(bookingId, sessionId, data),
    onError: (err: any, variables) => {
      // Handle 409 Optimistic Lock Conflict
      if (err.status === 409) {
        toast.error('Phiên học đã được cập nhật bởi người khác. Đang đồng bộ lại...');
        // Refetch to sync state
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingDetail(variables.bookingId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingsMentor });
      } else {
        toast.error(err.message || 'Lỗi cập nhật phiên học');
      }
    },
    onSuccess: (_, variables) => {
      toast.success('Cập nhật phiên học thành công');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingDetail(variables.bookingId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingsMentor });
    },
  });
};

export const useUpdateSessionMentee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      sessionId,
      data,
    }: {
      bookingId: string;
      sessionId: string;
      data: MenteeUpdateSessionRequest;
    }) => bookingService.updateSessionAsMentee(bookingId, sessionId, data),
    onError: (err: any, variables) => {
      if (err.status === 409) {
        toast.error('Phiên học đã được cập nhật. Đang đồng bộ lại...');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingDetail(variables.bookingId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingsBuyer });
      } else {
        toast.error(err.message || 'Lỗi cập nhật phiên học');
      }
    },
    onSuccess: (_, variables) => {
      toast.success('Đã gửi báo cáo');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingDetail(variables.bookingId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingsBuyer });
    },
  });
};

export const useAddSessionEvidence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      sessionId,
      data,
    }: {
      bookingId: string;
      sessionId: string;
      data: AddEvidenceRequest;
    }) => bookingService.addSessionEvidence(bookingId, sessionId, data),
    onSuccess: (_, variables) => {
      toast.success('Thêm minh chứng thành công');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingDetail(variables.bookingId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookingsMentor });
    },
  });
};
