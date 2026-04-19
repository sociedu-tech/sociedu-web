'use client';

import React, { createContext, useContext } from 'react';
import { useAdminData } from '@/hooks/useAdminData';

type AdminDataContextValue = ReturnType<typeof useAdminData>;

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

/** Một lần fetch dữ liệu quản trị cho toàn khu route admin dưới `/dashboard` (stats, mentor-requests, …). */
export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const value = useAdminData();
  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminSectionData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminSectionData must be used under AdminDataProvider');
  }
  return ctx;
}
