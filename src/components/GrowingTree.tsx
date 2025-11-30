'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TOKEN_MINT } from '@/config/token';

export default function GrowingTree() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!publicKey) return setBalance(0);
    const mint = new PublicKey(TOKEN_MINT);
    connection.getParsedTokenAccountsByOwner(publicKey, { mint })
      .then(r => {
        const total = r.value.reduce((s, a) => s + (a.account.data.parsed.info.tokenAmount.uiAmount || 0), 0);
        setBalance(total);
      })
      .catch(() => setBalance(0));
  }, [publicKey, connection]);

  const scale = Math.min(1 + balance / 1_500_000, 8);

  return (
    <div className="text-center my-16">
      <motion.div animate={{ scale }} transition={{ type: "spring", stiffness: 70 }}>
        <Image src="/tree.png" alt="Your Tree" width={350} height={550} className="mx-auto drop-shadow-2xl" />
      </motion.div>
      <p className="mt-8 text-4xl font-bold text-green-400">
        {balance > 0
          ? `Growing strong! (${balance.toLocaleString()} $TREES)`
          : "Connect wallet & hold $TREES to watch it grow!"}
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