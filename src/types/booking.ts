export interface MentorUpdateSessionRequest {
  version: number;
  meetingUrl?: string;
  scheduledAt?: string;
  mentorNote?: string;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
}

export interface MenteeUpdateSessionRequest {
  version: number;
  attendanceStatus?: 'PRESENT' | 'ABSENT';
  reportReason?: string;
  status?: 'CANCELED';
}

export interface AddEvidenceRequest {
  fileUrl: string;
  description?: string;
}
