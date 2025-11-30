'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { 
    TOKEN_PROGRAM_ID, 
    createTransferInstruction, 
    getAssociatedTokenAddress 
  } from '@solana/spl-token';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { TOKEN_MINT } from '@/config/token';

const STAKING_VAULT = new PublicKey("FANKgbQxB2ajfaXUB5YMAW6TELQnmnZp3tXeXDLajovg"); // ← change to your wallet

export default function StakingBox() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState('');

  const stake = async () => {
    if (!publicKey) return toast.error("Connect wallet");
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return toast.error("Invalid amount");

    try {
      const mint = new PublicKey(TOKEN_MINT);
      const sourceATA = await getAssociatedTokenAddress(mint, publicKey);
      const destATA = await getAssociatedTokenAddress(mint, STAKING_VAULT);

      const tx = new Transaction().add(
        createTransferInstruction(
          sourceATA,
          destATA,
          publicKey,
          num * 1e9, // assuming 9 decimals
          []
        )
      );

      const sig = await sendTransaction(tx, connection);
      toast.success(`Staked ${num.toLocaleString()} $TREES!`);
      console.log("Staked:", sig);
    } catch (e) {
      toast.error("Stake failed");
    }
  };

  return (
    <div className="mt-20 max-w-2xl mx-auto bg-black/60 backdrop-blur-xl border-4 border-yellow-600/50 rounded-3xl p-10 shadow-2xl">
      <h3 className="text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent mb-8">
        Stake $TREES → Tree Grows 2× Faster!
      </h3>
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Amount (e.g. 5,000,000)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 px-6 py-4 bg-white/10 rounded-xl text-white text-xl"
        />
        <button
          onClick={stake}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-xl hover:scale-105 transition-all"
        >
          Stake Now
        </button>
      </div>
      <p className="text-center mt-6 text-yellow-300">Staked tokens = bigger tree + future rewards</p>
    </div>
  );
}