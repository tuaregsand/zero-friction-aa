"use client";

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Wagmi } from '../src/wagmi';
import { ToastContainer } from '../src/toast';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Wagmi>
        {children}
        <ToastContainer position="top-right" />
      </Wagmi>
    </QueryClientProvider>
  );
}
