'use client';

import React from 'react';
import { useMentorMarketplace } from '@/features/mentor/hooks';
import { MentorMarketplaceView } from '@/features/mentor/ui/MentorMarketplaceView';

type MentorMarketplaceProps = {
  variant?: 'marketing' | 'dashboard';
};

export const MentorMarketplace = ({ variant = 'marketing' }: MentorMarketplaceProps) => {
  const vm = useMentorMarketplace();
  return <MentorMarketplaceView {...vm} variant={variant} />;
};
