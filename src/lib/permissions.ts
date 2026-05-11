import { User } from '@/types';
// We don't have BookingSession defined in types yet, assuming a basic interface
// In a real app this would be imported from booking.ts
interface BookingSession {
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  [key: string]: any;
}

export const permissions = {
  canCompleteSession: (user: User, session: BookingSession) => {
    return user.role === 'mentor' && session.status === 'IN_PROGRESS';
  },

  canCancelSession: (user: User, session: BookingSession) => {
    return session.status === 'SCHEDULED' || session.status === 'IN_PROGRESS';
  },

  canEditMeetingUrl: (user: User, session: BookingSession) => {
    return user.role === 'mentor' && session.status !== 'CANCELED' && session.status !== 'COMPLETED';
  },

  canReportAbsence: (user: User, session: BookingSession) => {
    return user.role === 'user' && session.status === 'IN_PROGRESS';
  },

  canAddEvidence: (user: User, session: BookingSession) => {
    // Both mentor and mentee might add evidence, but strictly mentor when completing.
    // Adjust based on your business rule.
    return user.role === 'mentor' && session.status === 'COMPLETED';
  }
};
