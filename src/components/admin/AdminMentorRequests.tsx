import React from 'react';
import Image from 'next/image';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { User } from '@/types';

interface AdminMentorRequestsProps {
  requests: User[];
  onApprove: (id: string) => void;
}

export const AdminMentorRequests = ({ requests, onApprove }: AdminMentorRequestsProps) => {
  if (requests.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-sm text-slate-500">Không có yêu cầu nào đang chờ.</p>
      </div>
    );
  }

  return (
    <div className="p-0">
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/90 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-5 py-3.5">Người dùng</th>
            <th className="px-5 py-3.5">Chuyên môn</th>
            <th className="px-5 py-3.5">Ngày yêu cầu</th>
            <th className="px-5 py-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((req) => (
            <tr key={req.id} className="transition-colors hover:bg-slate-50/80">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                    <Image
                      src={req.avatar}
                      className="size-full object-cover"
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{req.name}</p>
                    <p className="truncate text-xs text-slate-500">{req.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="font-medium text-slate-800">{req.mentorInfo?.headline ?? '—'}</p>
                <p className="mt-0.5 text-xs text-slate-500">{(req.mentorInfo?.expertise ?? []).join(', ')}</p>
              </td>
              <td className="px-5 py-4 text-slate-600">{req.joinedDate}</td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onApprove(req.id)}
                    className="rounded-xl p-2.5 text-emerald-600 transition-colors hover:bg-emerald-50"
                    aria-label="Duyệt"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button
                    type="button"
                    className="rounded-xl p-2.5 text-rose-600 transition-colors hover:bg-rose-50"
                    aria-label="Từ chối"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="divide-y divide-slate-100 md:hidden">
        {requests.map((req) => (
          <div key={req.id} className="space-y-4 p-4">
            <div className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-slate-200">
                <Image
                  src={req.avatar}
                  className="size-full object-cover"
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{req.name}</p>
                <p className="text-xs text-slate-500">{req.email}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Chuyên môn</p>
              <p className="mt-1 font-medium text-slate-800">{req.mentorInfo?.headline ?? '—'}</p>
              <p className="mt-0.5 text-xs text-slate-500">{(req.mentorInfo?.expertise ?? []).join(', ')}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">{req.joinedDate}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(req.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
                >
                  <CheckCircle2 size={16} /> Duyệt
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                >
                  <XCircle size={16} /> Từ chối
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
