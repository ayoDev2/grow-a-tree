'use client';

import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { Howl } from 'howler';
import { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';
import Image from 'next/image';
import GrowingTree from '@/components/GrowingTree';
import StakingBox from '@/components/StakingBox';
import StakingDashboard from '@/components/StakingDashboard';
import { TOKEN_MINT, PUMPFUN_URL, TWITTER_LINK } from '@/config/token';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';


export default function Home() {
  const [soundOn, setSoundOn] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/assets/audio/christmas-song.mp3'],
      loop: true,
      volume: 0.5,
      autoplay: true,        // ← THIS MAKES IT START IMMEDIATELY
      preload: true,
    });
    setSoundOn(true);

     // Auto-play after first user interaction (works on mobile + Chrome)
     const unlockAudio = () => {
      if (soundRef.current && !soundOn) {
        soundRef.current.play();
        setSoundOn(true);
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
  
    // Proper cleanup
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      soundRef.current?.unload();
    };
  }, []);

  const toggleSound = () => {
    if (soundOn) {
      soundRef.current?.pause();
    } else {
      soundRef.current?.play();
    }
    setSoundOn(!soundOn);
  };

  const particlesInit = async (engine: any) => {  
    await loadSlim(engine);
  };

  // Load your original main.js only once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/assets/js/main.js';
    script.async = true;
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <>
      {/* SNOW */}
      <Particles
        id="snow"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 100 },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: { min: 0.3, max: 0.9 } },
            size: { value: { min: 1, max: 5 } },
            move: {
              enable: true,
              speed: { min: 1, max: 3 },
              direction: 'bottom',
              random: true,
            },
            wobble: { enable: true, distance: 10, speed: 15 },
          },
        }}
        className="fixed inset-0 -z-50 pointer-events-none"
      />

      {/* MUSIC BUTTON */}
      <button
        onClick={toggleSound}
        className="fixed bottom-8 right-8 z-50 bg-white/20 backdrop-blur-xl rounded-full p-6 shadow-2xl border border-white/30 hover:scale-110 transition-all"
      >
        {soundOn ? <Volume2 size={36} className="text-yellow-300" /> : <VolumeX size={36} className="text-white" />}
      </button>

      {/* CSS */}
      <link rel="stylesheet" href="/assets/css/styles.css" />
      <link href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" rel="stylesheet" />

      {/* SCROLL TOP */}
      <a href="#" className="scrolltop" id="scroll-top">
        <i className="bx bx-up-arrow-alt scrolltop__icon"></i>
      </a>

      {/* HEADER */}
      <header className="l-header fixed top-0 w-full z-40" id="header">
        <nav className="nav bd-container">
          <a href="#" className="nav__logo">Grow a Tree</a>

          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item"><a href="#home" className="nav__link active-link">Home</a></li>
              <li className="nav__item"><a href="#share" className="nav__link">Share</a></li>
              <li className="nav__item"><a href="#decoration" className="nav__link">How it works</a></li>
              <li className="nav__item"><a href="#accessory" className="nav__link">Accessory</a></li>
              <li className="nav__item"><a href="/leaderboard" className="nav__link">Leaderboard</a></li>
              <li><i className="bx bx-toggle-left change-theme" id="theme-button"></i></li>
            </ul>
          </div>

          <div className="nav__toggle" id="nav-toggle">
            <i className="bx bx-grid-alt"></i>
          </div>

          <WalletMultiButton className="!bg-gradient-to-r !from-red-600 !via-green-600 !to-yellow-600 !rounded-full !px-10 !py-4 !text-xl !font-bold !shadow-2xl" />
        </nav>
      </header>

      <main className="l-main">
        {/* HERO */}
        <section className="home" id="home">
          <div className="home__container bd-container bd-grid">
            <div className="home__img">
              <Image src="/assets/img/home.png" alt="" width={600} height={600} />
            </div>
            <div className="home__data">
              <h1 className="home__title">Grow A Tree For Christmas</h1>
              <p className="home__description">
                Before the holidays, we buy and decorate trees for christmas.<br />
                Join others, Grow your TREES ON-chain, Grab a Tree and start growing.
              </p>
              <a href="#" className="button">Grab A TREE</a>
            </div>
          </div>
        </section>

        {/* SHARE */}
        <section className="share section bd-container" id="share">
          <div className="share__container bd-grid">
            <div className="share__data">
              <h2 className="section-title-center">
                Share Tree Tokens <br /> with your loved Ones
              </h2>
              <p className="share__description">
                Sharing these holidays is the best form of love,<br />
                We will be gifting TREES back to the Community and Holders.
              </p>
              <a href="#" className="button">Send a Gift</a>
            </div>
            <div className="share__img">
              <Image src="/assets/img/shared.png" alt="" width={500} height={500} />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="decoration section bd-container" id="decoration">
          <h2 className="section-title">
            How to Grow Trees <br /> Earning Rewards In the process
          </h2>
          <div className="decoration__container bd-grid">
            <div className="decoration__data">
              <Image src="/assets/img/decoration1.png" alt="" width={200} height={200} className="decoration__img" />
              <h3 className="decoration__title">Buy some TREES. <br/> Enables you to climb the leaderboard</h3>
            </div>
            <div className="decoration__data">
              <Image src="/assets/img/decoration2.png" alt="" width={200} height={200} className="decoration__img" />
              <h3 className="decoration__title">Join the Community. <br/> Interact with other Growers/Tree holders </h3>
            </div>
            <div className="decoration__data">
              <Image src="/assets/img/decoration3.png" alt="" width={200} height={200} className="decoration__img" />
              <h3 className="decoration__title">Hold your Trees, Stake Tree Tokens and watch them Grow</h3>
            </div>
          </div>
        </section>

        {/* ACCESSORIES */}
        <section className="accessory section bd-container" id="accessory">
          <h2 className="section-title">New Christmas <br /> Accessories</h2>
          <div className="accessory__container bd-grid">
            {[
              { name: "Snow Globe", price: "$9.45", img: "accessory1.png" },
              { name: "Candy", price: "$2.52", img: "accessory2.png" },
              { name: "Angel", price: "$13.15", img: "accessory3.png" },
              { name: "Sphere", price: "$4.25", img: "accessory4.png" },
              { name: "Surprise gift", price: "$7.99", img: "accessory5.png" },
            ].map((item) => (
              <div key={item.name} className="accessory__content">
                <Image src={`/assets/img/${item.img}`} alt="" width={300} height={300} className="accessory__img" />
                <h3 className="accessory__title">{item.name}</h3>
                <span className="accessory__category">Accessory</span>
                <span className="accessory__preci">{item.price}</span>
                <a href="#" className="button accessory__button"><i className="bx bx-heart"></i></a>
              </div>
            ))}
          </div>
        </section>

        {/* SEND GIFT */}
        <section className="send section">
          <div className="send__container bd-container bd-grid">
            <div className="send__content">
              <h2 className="section-title-center send__title">Send Gift Now</h2>
              <p className="send__description">
                Start giving away before the holidays are over.
              </p>
              <form action="">
                <div className="send__direction">
                  <input type="text" placeholder="Wallet address" className="send__input" />
                  <a href="#" className="button">Send</a>
                </div>
              </form>
            </div>
            <div className="send__img">
              <Image src="/assets/img/send.png" alt="" width={500} height={500} />
            </div>
          </div>
        </section>

        {/* GROWING TREE + CA BOX */}
        <section className="py-32 bg-gradient-to-b from-black via-emerald-950 to-black">
          <div className="bd-container text-center">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent mb-16">
              Your Tree Is Growing
            </h2>
            <GrowingTree />
            <StakingBox />
            <StakingDashboard />

            <div className="mt-24 max-w-5xl mx-auto">
              <p className="text-4xl mb-10 text-green-300 font-bold">Contract Address</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 bg-black/70 backdrop-blur-xl border-4 border-yellow-600/50 rounded-3xl p-10 shadow-2xl">
                <code className="text-2xl font-mono text-yellow-300 break-all text-center sm:text-left">
                  {TOKEN_MINT.toBase58()}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(TOKEN_MINT.toBase58());
                    toast.success("CA Copied — Let's Moon!");
                  }}
                  className="p-6 bg-gradient-to-r from-yellow-500 to-green-500 rounded-2xl hover:scale-110 transition-all shadow-2xl"
                >
                  <Copy size={48} className="text-black" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer section py-20 bg-black/90 text-center">
        <p className="text-3xl text-yellow-400">© 2025 $TREES — Growing Forever</p>
        <a href={TWITTER_LINK} target="_blank" className="inline-block mt-4 text-5xl text-white hover:text-yellow-400 transition">
          <i className="bx bxl-twitter"></i>
        </a>
      </footer>

      <script src="https://unpkg.com/scrollreveal"></script>
    </>
  );
}