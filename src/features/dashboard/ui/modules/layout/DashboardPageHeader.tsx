'use client';

import React from 'react';
import { DashboardViewHeader } from './DashboardViewHeader';

export function DashboardPageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return <DashboardViewHeader title={title} action={action} layout="compact" />;
}
