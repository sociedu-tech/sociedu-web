import { api } from '@/lib/api';

export interface ProgressReport {
  id: number;
  menteeId: number;
  mentorId: number;
  menteeName?: string;
  mentorName?: string;
  title: string;
  content: string;
  attachmentUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'REJECTED';
  mentorFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  mentorId: number;
  title: string;
  content: string;
  attachmentUrl?: string;
}

export interface ReviewReportRequest {
  status: 'PENDING' | 'REVIEWED' | 'REJECTED';
  mentorFeedback: string;
}

export const reportService = {
  // Mentee Methods
  getMyReports: async () => {
    const res = await api.get('/api/v1/mentee/reports');
    return res.data as ProgressReport[];
  },
  
  submitReport: async (data: CreateReportRequest) => {
    const res = await api.post('/api/v1/mentee/reports', data);
    return res.data as ProgressReport;
  },

  // Mentor Methods
  getAssignedReports: async () => {
    const res = await api.get('/api/v1/mentors/me/reports');
    return res.data as ProgressReport[];
  },

  reviewReport: async (id: number | string, data: ReviewReportRequest) => {
    const res = await api.put(`/api/v1/mentors/me/reports/${id}/feedback`, data);
    return res.data as ProgressReport;
  }
};
