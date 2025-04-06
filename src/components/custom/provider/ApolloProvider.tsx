// components/ApolloProvider.js
'use client';

import { createApolloClient } from '@/lib/apollo-client';
import { ApolloProvider as Provider } from '@apollo/client';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function ApolloProvider({ children }: ProvidersProps) {
  const client = createApolloClient();
  return <Provider client={client}>{children}</Provider>;
}
