'use client';

import { ConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL!;

export function Providers({ children }: { children: ReactNode }) {
  const [convexClient] = useState(() => new ConvexReactClient(CONVEX_URL));
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ConvexProvider client={convexClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ConvexProvider>
  );
}