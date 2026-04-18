'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { AdminDashboardHomePage } from '@/views/admin/AdminDashboardHomePage';
import { MentorDashboardHomePage } from '@/views/mentor/MentorDashboardHomePage';
import { UserDashboardHomePage } from '@/views/user/UserDashboardHomePage';

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
