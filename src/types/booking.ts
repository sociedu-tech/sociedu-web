export interface BookingSessionResponse {
  id: string;
  bookingId: string;
  orderIndex: number;
  title: string;
  scheduledAt?: string;
  actualStartedAt?: string;
  actualEndedAt?: string;
  meetingUrl?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  mentorNote?: string;
  version: number;
}

export interface BookingResponse {
  id: string;
  packageId: string;
  buyerId: string;
  mentorId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  totalPrice: number;
  sessions: BookingSessionResponse[];
  version: number;
}

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
