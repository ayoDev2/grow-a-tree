// src/app/WalletProviders.tsx
'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletProviders({ children }: { children: React.ReactNode }) {
  // FAST, RELIABLE RPCs (pick one — all free & no 403 errors)
  const endpoint = useMemo(() => {
    return "https://mainnet.helius-rpc.com/?api-key=611584bd-b14b-48ef-8aad-70cced37a255"; // ← BEST ONE (fast, no rate limits)
    // Alternatives if you want to switch:
    // "https://solana-mainnet.rpc.extrnode.com"
    // "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY" (free tier available)
    // "https://api.mainnet-beta.solana.com" (official, but rate-limited)
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}