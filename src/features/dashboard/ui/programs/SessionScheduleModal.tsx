'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  Check,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  Video,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardSessionRow } from '@/features/dashboard/types/booking';

export type MeetingLinkMode = 'google' | 'manual';

type Props = {
  session: DashboardSessionRow;
  scheduledAt: string;
  scheduledAtEnd: string;
  meetingUrl: string;
  scheduling: boolean;
  creatingMeet: boolean;
  onClose: () => void;
  onScheduledAt: (v: string) => void;
  onScheduledAtEnd: (v: string) => void;
  onMeetingUrl: (v: string) => void;
  onSaveManual: () => void;
  onCreateGoogleMeet: () => void;
};

const DURATION_PRESETS = [
  { label: '30 phút', minutes: 30 },
  { label: '60 phút', minutes: 60 },
  { label: '90 phút', minutes: 90 },
  { label: '120 phút', minutes: 120 },
] as const;

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15';

export function SessionScheduleModal({
  session,
  scheduledAt,
  scheduledAtEnd,
  meetingUrl,
  scheduling,
  creatingMeet,
  onClose,
  onScheduledAt,
  onScheduledAtEnd,
  onMeetingUrl,
  onSaveManual,
  onCreateGoogleMeet,
}: Props) {
  const busy = scheduling || creatingMeet;
  const [mode, setMode] = useState<MeetingLinkMode>(() =>
    session.meetingUrl?.trim() ? 'manual' : 'google',
  );
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (scheduledAt && !scheduledAtEnd) {
      onScheduledAtEnd(addMinutesToLocalInput(scheduledAt, durationMinutes));
    }
    // Chỉ chạy khi mở modal (key theo sessionId ở parent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schedulePreview = useMemo(
    () => formatSchedulePreview(scheduledAt, scheduledAtEnd),
    [scheduledAt, scheduledAtEnd],
  );

  const timeValid =
    Boolean(scheduledAt) &&
    (!scheduledAtEnd || new Date(scheduledAtEnd) > new Date(scheduledAt));

  const handleDuration = (minutes: number) => {
    setDurationMinutes(minutes);
    if (scheduledAt) {
      onScheduledAtEnd(addMinutesToLocalInput(scheduledAt, minutes));
    }
  };

  const handleStartChange = (value: string) => {
    onScheduledAt(value);
    if (value) {
      onScheduledAtEnd(addMinutesToLocalInput(value, durationMinutes));
    }
  };

  const handleCopyLink = async () => {
    if (!meetingUrl.trim()) return;
    try {
      await navigator.clipboard.writeText(meetingUrl.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handlePrimary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeValid) return;
    if (mode === 'google') {
      onCreateGoogleMeet();
    } else {
      onSaveManual();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-labelledby="schedule-modal-title"
        className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Lên lịch buổi học</p>
            <h2 id="schedule-modal-title" className="mt-0.5 truncate text-lg font-semibold text-slate-900">
              {session.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handlePrimary} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <CalendarClock className="size-3.5" aria-hidden />
                Thời gian
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Bắt đầu</span>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => handleStartChange(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Kết thúc</span>
                  <input
                    type="datetime-local"
                    value={scheduledAtEnd}
                    min={scheduledAt || undefined}
                    onChange={(e) => onScheduledAtEnd(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset.minutes}
                    type="button"
                    disabled={!scheduledAt || busy}
                    onClick={() => handleDuration(preset.minutes)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-semibold transition',
                      durationMinutes === preset.minutes
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {schedulePreview ? (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{schedulePreview}</p>
              ) : (
                <p className="text-sm text-slate-400">Chọn thời gian bắt đầu để xem tóm tắt lịch.</p>
              )}
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Video className="size-3.5" aria-hidden />
                Phòng học trực tuyến
              </h3>

              <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                <ModeTab
                  active={mode === 'google'}
                  onClick={() => setMode('google')}
                  icon={Video}
                  label="Google Meet"
                  hint="Tự tạo link"
                />
                <ModeTab
                  active={mode === 'manual'}
                  onClick={() => setMode('manual')}
                  icon={Link2}
                  label="Link có sẵn"
                  hint="Zoom, Meet, …"
                />
              </div>

              {mode === 'manual' ? (
                <div className="space-y-3">
                  {meetingUrl.trim() ? (
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5">
                      <span className="text-xs font-semibold text-emerald-800">Link hiện tại</span>
                      <a
                        href={meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 flex-1 truncate text-sm font-medium text-primary hover:underline"
                      >
                        {meetingUrl}
                      </a>
                      <button
                        type="button"
                        onClick={() => void handleCopyLink()}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                      >
                        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                        {copied ? 'Đã copy' : 'Copy'}
                      </button>
                      <a
                        href={meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                      >
                        <ExternalLink className="size-3" />
                        Mở
                      </a>
                    </div>
                  ) : null}

                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">URL phòng họp</span>
                    <input
                      type="url"
                      value={meetingUrl}
                      onChange={(e) => onMeetingUrl(e.target.value)}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className={inputClass}
                    />
                  </label>
                  <p className="text-xs text-slate-500">
                    Dán link Meet, Zoom hoặc Teams. Có thể chỉ cập nhật lịch mà không đổi link.
                  </p>
                </div>
              ) : null}
            </section>
          </div>

          <div className="mt-auto flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200/60 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={busy || !timeValid || (mode === 'manual' && !scheduledAt)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : mode === 'google' ? <Video className="size-4" /> : null}
              {creatingMeet
                ? 'Đang tạo Google Meet…'
                : scheduling
                  ? 'Đang lưu…'
                  : mode === 'google'
                    ? 'Tạo Google Meet & lưu'
                    : 'Lưu lịch & link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  icon: Icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Video;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg px-3 py-2.5 text-left transition',
        active ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900',
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className={cn('size-4', active ? 'text-primary' : 'text-slate-400')} aria-hidden />
        {label}
      </span>
      <span className="mt-0.5 block text-2xs text-slate-500">{hint}</span>
    </button>
  );
}

function addMinutesToLocalInput(start: string, minutes: number): string {
  const d = new Date(start);
  if (Number.isNaN(d.getTime())) return '';
  d.setMinutes(d.getMinutes() + minutes);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

function formatSchedulePreview(start: string, end: string): string | null {
  if (!start) return null;
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return null;

  const datePart = startDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const startTime = startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  if (!end) {
    return `${datePart} · bắt đầu ${startTime}`;
  }

  const endDate = new Date(end);
  if (Number.isNaN(endDate.getTime()) || endDate <= startDate) {
    return `${datePart} · bắt đầu ${startTime}`;
  }

  const endTime = endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const diffMin = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  return `${datePart} · ${startTime} – ${endTime} (${diffMin} phút)`;
}
