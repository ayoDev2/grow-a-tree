'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { TOKEN_MINT } from '@/config/token';

const STAKING_VAULT = new PublicKey("FANKgbQxB2ajfaXUB5YMAW6TELQnmnZp3tXeXDLajovg"); // ← change this

export default function StakingDashboard() {
  const { connection, publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState('');

  const stake = async () => {
    if (!publicKey || !amount) return toast.error("Connect wallet & enter amount");

    const num = BigInt(Math.floor(parseFloat(amount) * 1_000_000_000)); // 9 decimals

    try {
      const mint = new PublicKey(TOKEN_MINT);
      const sourceATA = getAssociatedTokenAddressSync(mint, publicKey);
      const vaultATA = getAssociatedTokenAddressSync(mint, STAKING_VAULT);

      const tx = new Transaction();

      // Create vault ATA if not exists
      try {
        await connection.getAccountInfo(vaultATA);
      } catch {
        tx.add(createAssociatedTokenAccountInstruction(
          publicKey,
          vaultATA,
          STAKING_VAULT,
          mint
        ));
      }

      tx.add(createTransferInstruction(
        sourceATA,
        vaultATA,
        publicKey,
        num
      ));

      const sig = await sendTransaction(tx, connection);
      toast.success(`${amount}M $TREES staked! Tx: ${sig.slice(0,8)}...`);
      setAmount('');
    } catch (err) {
      console.error(err);
      toast.error("Stake failed — try again");
    }
  };

  return (
    <div className="mt-32 max-w-6xl mx-auto px-8 text-center">
      <h2 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-16">
        STAKE $TREES → GROW 2× FASTER + DAILY REWARDS
      </h2>

      <div className="grid md:grid-cols-3 gap-10 mb-20">
        <div className="bg-gradient-to-br from-purple-900/60 to-black rounded-3xl p-10 border-2 border-purple-600">
          <p className="text-3xl text-purple-300">Your Staked</p>
          <p className="text-7xl font-bold text-white mt-6">0M</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/60 to-black rounded-3xl p-10 border-2 border-yellow-600">
          <p className="text-3xl text-yellow-300">Daily Reward</p>
          <p className="text-7xl font-bold text-white mt-6">0.5%</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/60 to-black rounded-3xl p-10 border-2 border-green-600">
          <p className="text-3xl text-green-300">Pending</p>
          <p className="text-7xl font-bold text-white mt-6">0M</p>
        </div>
      </div>

      <div className="space-y-8">
        <input
          type="number"
          placeholder="Amount in millions (e.g. 10)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-12 py-8 text-4xl bg-white/10 rounded-3xl text-white text-center w-full max-w-md"
        />
        <button
          onClick={stake}
          className="px-20 py-10 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl text-4xl font-black hover:scale-110 transition-all shadow-2xl"
        >
          STAKE NOW
        </button>
      </div>
    </div>
  );
}