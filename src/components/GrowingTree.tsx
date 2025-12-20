'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TOKEN_MINT } from '@/config/token';

export default function GrowingTree() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected || !publicKey || !connection) {
      setBalance(0);
      setLoading(false);
      return;
    }

    const mint = new PublicKey(TOKEN_MINT);

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const resp = await connection.getParsedTokenAccountsByOwner(publicKey, { mint });
        if (resp.value.length === 0) {
          setBalance(0);
        } else {
          const total = resp.value.reduce(
            (sum, acc) => sum + (acc.account.data.parsed.info.tokenAmount.uiAmount || 0),
            0
          );
          setBalance(total);
        }
      } catch (err) {
        console.error("Token fetch error:", err);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Refresh every 10 seconds
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [publicKey, connected, connection]);

  const scale = Math.min(1 + balance / 1_500_000, 8);

  return (
    <div className="text-center my-16">
      <motion.div
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className="inline-block"
      >
        <Image
          src="/tree.png"
          alt="Your Growing Tree"
          width={350}
          height={550}
          className="mx-auto drop-shadow-2xl"
          priority
        />
      </motion.div>

      <p className="mt-8 text-4xl font-bold">
        {!connected ? (
          <span className="text-gray-400">Connect wallet to see your tree</span>
        ) : loading ? (
          <span className="text-yellow-400 animate-pulse">Loading your $TREES balance...</span>
        ) : balance === 0 ? (
          <span className="text-red-400">No $TREES found — buy some to grow your tree!</span>
        ) : (
          <span className="text-green-400">
            Growing strong! ({balance.toLocaleString(undefined, { maximumFractionDigits: 0 })} $TREES)
          </span>
        )}
      </p>

      {balance > 10_000_000 && (
        <p className="mt-4 text-4xl font-bold text-yellow-400 animate-pulse">
          TOP 100 HOLDER
        </p>
      )}
      {balance > 50_000_000 && (
        <p className="mt-4 text-5xl font-bold text-red-500 animate-pulse">
          WHALE DETECTED
        </p>
      )}
    </div>
  );
}