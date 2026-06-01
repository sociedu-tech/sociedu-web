'use client';

import React from 'react';
import { ErrorMessage } from './ErrorMessage';
import { PageLoadingState, type PageLoadingVariant } from './PageLoadingState';

type DataGateProps<T> = {
  loading: boolean;
  error?: string | null;
  data: T | null | undefined;
  onRetry?: () => void;
  loadingLabel?: string;
  loadingVariant?: PageLoadingVariant;
  /** When true, render children only after first successful load */
  emptyFallback?: React.ReactNode;
  children: (data: T) => React.ReactNode;
};

/** Blocks children until async data is ready — avoids flashing empty/default UI. */
export function DataGate<T>({
  loading,
  error,
  data,
  onRetry,
  loadingLabel,
  loadingVariant = 'spinner',
  emptyFallback,
  children,
}: DataGateProps<T>) {
  if (loading) {
    return <PageLoadingState label={loadingLabel} variant={loadingVariant} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (data == null) {
    return emptyFallback ?? null;
  }

  return <>{children(data)}</>;
}
