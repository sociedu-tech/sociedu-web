'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { AdminDashboardHomePage } from '@/features/admin/views/AdminDashboardHomePage';
import { MentorDashboardHomePage } from '@/features/mentor/views/MentorDashboardHomePage';
import { UserDashboardHomePage } from '@/features/user/views/UserDashboardHomePage';

/** Điều hướng tổng quan `/dashboard` theo role — UI chi tiết nằm trong `views/admin`, `views/mentor`, `views/user`. */
export function DashboardHomePage() {
  const { userRole } = useAuth();
  const r = normalizeRole(userRole);

  if (r === ROLES.MENTOR) {
    return <MentorDashboardHomePage />;
  }

  if (r === ROLES.ADMIN) {
    return <AdminDashboardHomePage />;
  }

  return <UserDashboardHomePage />;
}
