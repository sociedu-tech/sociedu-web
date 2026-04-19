'use client';

import React from 'react';
import { Card } from '@/components/ui';

/** Khối nội dung — bọc `Card` variant dashboard. */
export function DashboardCard({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <Card variant="dashboard" padding={padding} className={className}>
      {children}
    </Card>
  );
}
