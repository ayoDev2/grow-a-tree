'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { TOKEN_MINT } from '@/config/token';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function GrowingTree() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [tapCount, setTapCount] = useState(0);
  const [isTapping, setIsTapping] = useState(false);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

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
        const total = resp.value.reduce(
          (sum, acc) => sum + (acc.account.data.parsed.info.tokenAmount.uiAmount || 0),
          0
        );
        setBalance(total);
      } catch (err) {
        console.error("Token fetch error:", err);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [publicKey, connected, connection]);

  // Tree image based on balance
  const getTreeImage = () => {
    if (balance === 0) return "/assets/img/tree0.png";
    if (balance < 20_000_000) return "/assets/img/tree1.png";
    return "/assets/img/tree2.png";
  };

  // Base scale from balance
  const baseScale = Math.min(1 + balance / 1_500_000, 8);

  // Tap handler
  const handleTap = () => {
    setTapCount(prev => prev + 1);
    setIsTapping(true);

    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    tapTimeout.current = setTimeout(() => {
      setIsTapping(false);
      setTapCount(0);
    }, 1000);
  };

  // Current scale
  const currentScale = isTapping ? baseScale * 1.2 : baseScale;

  // Has tokens for effects
  const hasTokens = balance > 0;

  // Snow intensity based on balance
  const snowParticleCount = hasTokens ? (balance > 20_000_000 ? 150 : 100) : 0;

  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  // Determine current level
  const currentLevel = balance === 0 ? 0 : balance < 20_000_000 ? 1 : 2;

  return (
    <div className="text-center my-20 relative overflow-hidden">
      {/* FALLING SNOW STORM — ONLY WHEN BALANCE > 0 */}
      {hasTokens && (
        <Particles
          id="tree-snow"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            particles: {
              number: { value: snowParticleCount },
              color: { value: "#ffffff" },
              shape: { type: "circle" },
              opacity: { value: { min: 0.5, max: 1 } },
              size: { value: { min: 2, max: 6 } },
              move: {
                enable: true,
                speed: { min: 2, max: 6 },
                direction: "bottom",
                random: true,
                straight: false,
              },
              wobble: { enable: true, distance: 10, speed: 20 },
            },
            background: { color: "transparent" },
          }}
          className="absolute inset-0 -z-10 pointer-events-none"
        />
      )}

      {/* TAPPABLE TREE WITH HEARTBEAT GLOW */}
      <motion.div
        animate={{ scale: currentScale }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="inline-block relative cursor-pointer select-none"
        onClick={handleTap}
        onTouchStart={handleTap}
        whileTap={{ scale: currentScale * 1.1 }}
        whileHover={{ scale: currentScale * 1.05 }}
      >
        {/* PULSING HEARTBEAT GLOW */}
        {hasTokens && (
          <>
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 60px rgba(74, 222, 128, 0.6)",
                  "0 0 100px rgba(74, 222, 128, 0.8)",
                  "0 0 60px rgba(74, 222, 128, 0.6)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full -z-10"
            />
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 80px rgba(34, 197, 94, 0.8)",
                  "0 0 140px rgba(34, 197, 94, 1)",
                  "0 0 80px rgba(34, 197, 94, 0.8)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full -z-10 opacity-0 hover:opacity-100 transition-opacity"
            />
          </>
        )}

        <Image
          src={getTreeImage()}
          alt="Your Growing Christmas Tree"
          width={400}
          height={600}
          className="mx-auto drop-shadow-2xl"
          priority
        />

        {/* Floating tap numbers */}
        <AnimatePresence>
          {tapCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black text-yellow-400 pointer-events-none"
            >
              +{tapCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* LEVEL INDICATOR */}
      <div className="mt-10">
        <AnimatePresence mode="wait">
          {currentLevel === 0 && (
            <motion.p
              key="level0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-4xl font-bold text-gray-500"
            >
              LEVEL 0 — Starter Tree
            </motion.p>
          )}
          {currentLevel === 1 && (
            <motion.p
              key="level1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="text-5xl font-bold text-green-400 animate-pulse"
            >
              LEVEL 1 UNLOCKED 🌱
            </motion.p>
          )}
          {currentLevel === 2 && (
            <motion.p
              key="level2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.3 }}
              exit={{ opacity: 0 }}
              className="text-6xl font-black text-yellow-400 animate-pulse drop-shadow-2xl"
            >
              LEVEL 2 ACHIEVED 🎄✨
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Status text */}
      <p className="mt-10 text-4xl font-bold">
        {!connected ? (
          <span className="text-gray-400">Connect wallet to see your tree</span>
        ) : loading ? (
          <span className="text-yellow-400 animate-pulse">Loading your $TREES balance...</span>
        ) : balance === 0 ? (
          <span className="text-red-400">No $TREES yet — buy some to grow your tree!</span>
        ) : (
          <span className="text-green-400">
            Growing strong!<br />
            {balance.toLocaleString(undefined, { maximumFractionDigits: 0 })} $TREES. <br/> Buy more $Trees to Unlock new Levels.
          </span>
        )}
      </p>

      {balance > 10_000_000 && (
        <p className="mt-6 text-4xl font-bold text-yellow-400 animate-pulse">
          TOP 100 HOLDER
        </p>
      )}
      {balance > 50_000_000 && (
        <p className="mt-6 text-5xl font-bold text-red-500 animate-pulse drop-shadow-glow">
          LEGENDARY WHALE
        </p>
      )}
    </div>
  );
}