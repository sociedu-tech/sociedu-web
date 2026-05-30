import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import type { ProfileReview } from '@/services/profileService';

type Props = {
  reviews: ProfileReview[];
  ratingAvg: number;
  ratingCount: number;
};

export function ProfileReviewsSection({ reviews, ratingAvg, ratingCount }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Đánh giá từ học viên</h2>
        {ratingCount > 0 ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-900 ring-1 ring-amber-100">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {ratingAvg.toFixed(1)} · {ratingCount} đánh giá
          </div>
        ) : null}
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
          Chưa có đánh giá công khai.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{review.reviewerName}</p>
                  <p className="text-xs text-slate-500">{review.date}</p>
                </div>
                <div className="flex items-center gap-0.5" aria-label={`${review.rating} sao`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment ? (
                <p className="mt-3 flex gap-2 text-sm leading-relaxed text-slate-700">
                  <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-slate-300" />
                  <span>{review.comment}</span>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
