'use client';

import React from 'react';
import { useMentorMarketplace } from '@/features/mentor/hooks';
import { MentorMarketplaceView } from '@/features/mentor/ui/MentorMarketplaceView';

export const MentorMarketplace = () => {
  const vm = useMentorMarketplace();
  return <MentorMarketplaceView {...vm} />;
};
