'use client';

import { motion } from 'framer-motion';
import { TOKEN_MINT } from '@/config/token';
import { useEffect, useState } from 'react';
import { Trophy, Crown, Gift, Snowflake } from 'lucide-react';

interface Holder {
  address: string;
  amount: number;
  percentage: number;
}

export default function Leaderboard() {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const res = await fetch(
          `https://public-api.birdeye.so/defi/token_holders/${TOKEN_MINT.toBase58()}?limit=50`
        );
        const data = await res.json();
        setHolders((data.data?.items || []).map((h: any) => ({
          address: h.owner,
          amount: h.amount / 1e9,
          percentage: h.percentage
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
    const interval = setInterval(fetchHolders, 25000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown size={80} className="text-yellow-400 drop-shadow-2xl animate-pulse" />;
    if (rank === 1) return <Trophy size={70} className="text-yellow-600 drop-shadow-2xl" />;
    if (rank === 2) return <Trophy size={60} className="text-orange-600 drop-shadow-2xl" />;
    return <span className="text-6xl font-black text-white">#{rank + 1}</span>;
  };

  const getRankGlow = (rank: number) => {
    if (rank === 0) return "from-yellow-600 via-yellow-400 to-orange-500";
    if (rank === 1) return "from-yellow-700 to-orange-600";
    if (rank === 2) return "from-orange-700 to-red-600";
    return "from-green-600 to-emerald-500";
  };

  return (
    <>
      <link rel="stylesheet" href="/assets/css/styles.css" />
      <link href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" rel="stylesheet" />

      <div className="min-h-screen bg-gradient-to-b from-red-950 via-black to-emerald-950 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-red-600 via-green-600 via-yellow-500 to-blue-600 animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-green-600 via-red-600 via-yellow-500 to-purple-600 animate-pulse" />
        </div>

        <section className="py-32 relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
            className="text-center mb-20"
          >
            <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-yellow-400 via-red-500 to-green-500 bg-clip-text text-transparent drop-shadow-2xl">
              TOP TREE GROWERS
            </h1>
            <div className="flex justify-center gap-8 mt-8">
              <Gift size={60} className="text-red-500 animate-bounce" />
              <Snowflake size={60} className="text-cyan-400 animate-spin" />
              <Gift size={60} className="text-green-500 animate-bounce delay-300" />
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center text-5xl text-yellow-400 animate-pulse">
              Loading the biggest Christmas whales...
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-8 grid gap-8">
              {holders.map((h, i) => (
                <motion.div
                  key={h.address}
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                  className={`relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r ${getRankGlow(i)}`}
                >
                  <div className="bg-black/90 backdrop-blur-2xl rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between border-4 border-white/20">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                      <div className="flex justify-center md:justify-start items-center gap-6">
                        {getRankIcon(i)}
                        <code className="text-2xl md:text-3xl font-mono text-cyan-300 break-all">
                          {h.address.slice(0, 10)}...{h.address.slice(-8)}
                        </code>
                      </div>
                    </div>

                    <div className="text-center md:text-right">
                      <p className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
                        {(h.amount / 1_000_000).toFixed(1)}M $TREES
                      </p>
                      <p className="text-3xl text-green-400 mt-4">
                        {h.percentage.toFixed(3)}% of supply
                      </p>
                    </div>
                  </div>

                  {i < 3 && (
                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-32">
            <motion.a
              href="/"
              whileHover={{ scale: 1.2, rotate: 360 }}
              className="inline-block px-20 py-10 bg-gradient-to-r from-green-600 via-red-600 to-yellow-600 rounded-full text-5xl font-black shadow-2xl hover:shadow-red-500/50"
            >
              Back to Tree
            </motion.a>
          </div>
        </section>
      </div>
    </>
  );
}