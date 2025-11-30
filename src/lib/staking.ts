// src/lib/staking.ts
import { PublicKey } from '@solana/web3.js';

export const TOKEN_MINT = new PublicKey("YOUR_REAL_MINT_HERE_WHEN_LAUNCHED");
export const STAKING_VAULT = new PublicKey("YOUR_WALLET_ADDRESS_HERE"); // ← your main wallet

// Fake on-chain staking data (replace later with real PDA if you want)
export interface Staker {
  address: string;
  staked: number;
  lastClaim: number;
}

export let stakingData: Staker[] = [
  { address: "Whale1...abc", staked: 150_000_000, lastClaim: Date.now() },
  { address: "Dev", staked: 50_000_000, lastClaim: Date.now() },
];

// Daily reward: 0.5% of staked amount per day
export const DAILY_REWARD_RATE = 0.005;