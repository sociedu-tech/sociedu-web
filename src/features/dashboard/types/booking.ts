/** Booking + session rows for dashboard tables. */

export type DashboardSessionRow = {
  id: string;
  bookingId: string;
  sessionId: string;
  title: string;
  when: string;
  startAt: string;
  endAt: string;
  scheduledAtIso: string | null;
  scheduledAtEndIso?: string | null;
  counterparty: string;
  status: string;
  rawStatus: string;
  menteeCompletionAck: boolean | null;
  mentorCompletionAck: boolean | null;
  canConfirm: boolean;
  myAck: boolean | null;
  meetingUrl?: string | null;
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
  scheduledAtEnd?: string | null;
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
  orderId?: string | null;
  buyerId?: string;
  mentorId?: string;
  packageId?: string | null;
  status?: string | null;
  createdAt?: string | null;
  progressPercent?: number | null;
  sessions?: BookingApiSession[] | null;
};

export type BookingProgramItem = {
  bookingId: string;
  orderId: string | null;
  packageId: string | null;
  packageLabel: string;
  /** Tên hiển thị đối tác (học viên hoặc mentor tùy góc nhìn). */
  counterpartyLabel: string;
  buyerId: string | null;
  mentorId: string | null;
  chatPeerId: string | null;
  counterpartyRoleLabel: string;
  sessionPerspective: 'buyer' | 'mentor';
  createdAt: string;
  bookingStatus: string;
  bookingStatusLabel: string;
  totalSessions: number;
  completedSessions: number;
  progressPercent: number;
  sessionRows: DashboardSessionRow[];
  nextSessionWhen: string | null;
  startAt: string;
  endAt: string;
  endAtIsEstimated: boolean;
};

/** @deprecated Use BookingProgramItem */
export type MentorTeachingItem = BookingProgramItem;

export type ConfirmSessionCompletionRequest = {
  completed: boolean;
};

export type BookingSessionDto = BookingApiSession & { id: string };
