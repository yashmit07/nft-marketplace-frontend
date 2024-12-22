// src/app/providers.tsx
'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sepolia } from 'wagmi/chains';
import { http } from 'viem';
import { 
  metaMask,
  coinbaseWallet,
  walletConnect,
} from 'wagmi/connectors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

function createWagmiConfig() {
  if (typeof window === 'undefined') return null;

  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
  if (!projectId) throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');

  return createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http()
    },
    connectors: [
      metaMask(),
      coinbaseWallet({
        appName: 'NFT Marketplace',
      }),
      walletConnect({
        projectId,
        metadata: {
          name: 'NFT Marketplace',
          description: 'NFT Marketplace Application',
          url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          icons: ['https://avatars.githubusercontent.com/u/37784886']
        }
      })
    ]
  });
}

export function Providers({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);
  const [wagmiConfig] = useState(() => createWagmiConfig());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !wagmiConfig) return null;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}