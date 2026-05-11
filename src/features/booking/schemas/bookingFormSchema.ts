import { z } from 'zod';
import { FIELD_LIMITS } from '../constants/bookingConfig';

export const bookingFormSchema = z.object({
  goals: z
    .string()
    .trim()
    .min(FIELD_LIMITS.GOALS_MIN, `Mục tiêu tối thiểu ${FIELD_LIMITS.GOALS_MIN} ký tự`)
    .max(FIELD_LIMITS.GOALS_MAX, `Mục tiêu tối đa ${FIELD_LIMITS.GOALS_MAX} ký tự`),
  questions: z
    .string()
    .trim()
    .max(FIELD_LIMITS.QUESTIONS_MAX, `Câu hỏi tối đa ${FIELD_LIMITS.QUESTIONS_MAX} ký tự`)
    .optional()
    .or(z.literal('')),
  portfolioUrl: z
    .string()
    .trim()
    .max(FIELD_LIMITS.PORTFOLIO_URL_MAX, `Link tối đa ${FIELD_LIMITS.PORTFOLIO_URL_MAX} ký tự`)
    .url('Link không hợp lệ')
    .optional()
    .or(z.literal('')),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
