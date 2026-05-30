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
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-marketing-fg">Đánh giá từ học viên</h2>
        {ratingCount > 0 ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900 ring-1 ring-amber-100">
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
            {ratingAvg.toFixed(1)} · {ratingCount} đánh giá
          </div>
        ) : null}
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-xl border border-dashed border-marketing-border-dashed bg-marketing-canvas/80 px-4 py-10 text-center text-sm text-marketing-fg-muted">
          Chưa có đánh giá công khai.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-marketing-border bg-marketing-canvas/40 p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-marketing-fg">{review.reviewerName}</p>
                  <p className="text-xs text-marketing-fg-muted">{review.date}</p>
                </div>
                <div className="flex items-center gap-0.5" aria-label={`${review.rating} sao`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-marketing-border'}`}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
              {review.comment ? (
                <p className="mt-3 flex gap-2 text-sm leading-relaxed text-marketing-body">
                  <MessageSquareQuote
                    className="mt-0.5 size-4 shrink-0 text-marketing-fg-subtle"
                    aria-hidden
                  />
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
