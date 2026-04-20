'use client';

import React from 'react';
import Image from 'next/image';
import { Shield, UserCircle, UserPlus, Ban, CheckCircle2 } from 'lucide-react';
import type { AdminUserRow, UserAccountStatus } from '@/types';
import type { User } from '@/types';
import { cn } from '@/lib/utils';
import { useAdminUsersManagementView } from '@/features/admin/hooks';

function roleLabel(role: User['role']) {
  switch (role) {
    case 'admin':
      return 'Quản trị';
    case 'mentor':
      return 'Mentor';
    default:
      return 'Học viên';
  }
}

function accountLabel(s: UserAccountStatus) {
  switch (s) {
    case 'active':
      return 'Hoạt động';
    case 'suspended':
      return 'Tạm khóa';
    case 'pending':
      return 'Chờ duyệt';
  }
}

const accountStyles: Record<UserAccountStatus, string> = {
  active: 'bg-emerald-50 text-emerald-900 ring-emerald-100',
  suspended: 'bg-rose-50 text-rose-900 ring-rose-100',
  pending: 'bg-amber-50 text-amber-900 ring-amber-100',
};

export function AdminUsersManagementView({ initialUsers }: { initialUsers: AdminUserRow[] }) {
  const { users, roleFilter, setRoleFilter, statusFilter, setStatusFilter, filtered, setStatus, promoteToMentor } =
    useAdminUsersManagementView(initialUsers);

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <UserCircle className="size-12 text-slate-300" strokeWidth={1.25} />
        <p className="text-sm text-slate-500">Chưa có người dùng.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">Mọi vai trò</option>
            <option value="user">Học viên</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Quản trị</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">Mọi trạng thái tài khoản</option>
            <option value="active">Hoạt động</option>
            <option value="suspended">Tạm khóa</option>
            <option value="pending">Chờ duyệt</option>
          </select>
        </div>
        <p className="text-xs text-slate-500">
          Thao tác lưu cục bộ trên trình duyệt (demo). Kết nối API để đồng bộ server.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="hidden min-w-[880px] w-full text-left text-sm md:table">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Người dùng</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Tài khoản</th>
              <th className="px-4 py-3">Tham gia</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                      <Image src={u.avatar} alt="" width={40} height={40} className="size-full object-cover" unoptimized />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{u.name}</p>
                      <p className="truncate text-xs text-slate-500">{u.email}</p>
                      {u.adminNote ? <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">{u.adminNote}</p> : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                      u.role === 'mentor' && 'bg-violet-100 text-violet-800',
                      u.role === 'admin' && 'bg-rose-100 text-rose-800',
                      u.role === 'user' && 'bg-slate-100 text-slate-700',
                    )}
                  >
                    {u.role === 'admin' ? <Shield className="size-3" /> : null}
                    {roleLabel(u.role)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                      accountStyles[u.accountStatus],
                    )}
                  >
                    {accountLabel(u.accountStatus)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{u.joinedDate}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {u.role === 'user' && u.accountStatus === 'active' ? (
                      <button
                        type="button"
                        onClick={() => promoteToMentor(u.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        <UserPlus className="size-3.5" />
                        Cấp mentor
                      </button>
                    ) : null}
                    {u.accountStatus !== 'suspended' ? (
                      <button
                        type="button"
                        onClick={() => setStatus(u.id, 'suspended')}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Ban className="size-3.5" />
                        Khóa
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setStatus(u.id, 'active')}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Mở khóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {filtered.map((u) => (
          <div key={u.id} className="space-y-3 p-4">
            <div className="flex gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-slate-200">
                <Image src={u.avatar} alt="" width={48} height={48} className="size-full object-cover" unoptimized />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{u.name}</p>
                <p className="truncate text-xs text-slate-500">{u.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-slate-600">{roleLabel(u.role)}</span>
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium ring-1', accountStyles[u.accountStatus])}>
                    {accountLabel(u.accountStatus)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {u.role === 'user' && u.accountStatus === 'active' ? (
                <button
                  type="button"
                  onClick={() => promoteToMentor(u.id)}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  Cấp mentor
                </button>
              ) : null}
              {u.accountStatus !== 'suspended' ? (
                <button type="button" onClick={() => setStatus(u.id, 'suspended')} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium">
                  Tạm khóa
                </button>
              ) : (
                <button type="button" onClick={() => setStatus(u.id, 'active')} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                  Mở khóa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
