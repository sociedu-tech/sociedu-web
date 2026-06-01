/** Booking + session rows for dashboard tables. */

export type DashboardSessionRow = {
  id: string;
  bookingId: string;
  sessionId: string;
  title: string;
  when: string;
  scheduledAtIso: string | null;
  counterparty: string;
  status: string;
  rawStatus: string;
  menteeCompletionAck: boolean | null;
  mentorCompletionAck: boolean | null;
  canConfirm: boolean;
  myAck: boolean | null;
};

export type DashboardProjectRow = {
  id: string;
  name: string;
  mentor: string;
  mentee?: string;
  status: string;
};

export type BookingApiSession = {
  id?: string;
  title?: string | null;
  scheduledAt?: string | null;
  completedAt?: string | null;
  status?: string | null;
  meetingUrl?: string | null;
  menteeCompletionAck?: boolean | null;
  mentorCompletionAck?: boolean | null;
  menteeAckAt?: string | null;
  mentorAckAt?: string | null;
};

export type BookingApi = {
  id?: string;
  buyerId?: string;
  mentorId?: string;
  status?: string | null;
  createdAt?: string | null;
  sessions?: BookingApiSession[] | null;
};

export type ConfirmSessionCompletionRequest = {
  completed: boolean;
};

export type BookingSessionDto = BookingApiSession & { id: string };
