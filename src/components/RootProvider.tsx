'use client';

import { useAuthListener } from '@/hooks/useAuthListener';
import { ErrorBoundary } from './ErrorBoundary';

export function RootProvider({ children }: { children: React.ReactNode }) {
  useAuthListener();

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
