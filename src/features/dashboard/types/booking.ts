/** Booking + session rows for dashboard tables. */

export type DashboardSessionRow = {
  id: string;
  bookingId: string;
  title: string;
  when: string;
  counterparty: string;
  status: string;
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
};

export type BookingApi = {
  id?: string;
  buyerId?: string;
  mentorId?: string;
  status?: string | null;
  createdAt?: string | null;
  sessions?: BookingApiSession[] | null;
};
