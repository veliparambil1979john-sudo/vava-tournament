"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { TEAMS } from '@/data/tournamentData';

export default function SplashScreen() {
  const [phase, setPhase] = useState<'congrats' | 'details' | 'hidden'>('congrats');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Fire continuous confetti for 3 seconds
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#facc15', '#4ade80', '#22d3ee', '#f472b6', '#a78bfa']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#facc15', '#4ade80', '#22d3ee', '#f472b6', '#a78bfa']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // After 7 seconds, show details
    const timer1 = setTimeout(() => {
      setPhase('details');
    }, 7000);

    // After 14 seconds total, hide splash
    const timer2 = setTimeout(() => {
      setPhase('hidden');
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!mounted) return null;

  const mightyKickers = TEAMS.find(t => t.name === "Mighty Kickers");

  return (
    <AnimatePresence>
      {phase !== 'hidden' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
          <AnimatePresence mode="wait">
            {phase === 'congrats' && (
              <motion.div
                key="congrats"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                className="text-center px-4 w-full"
              >
                <div className="inline-block relative w-full">
                   <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-30 rounded-full" />
                   <h1 className="relative text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 uppercase tracking-tighter drop-shadow-2xl mb-4 leading-tight">
                     Congratulations
                   </h1>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold text-white uppercase tracking-widest mt-2">
                  Mighty Kickers
                </h2>
                <p className="text-green-400 mt-4 sm:mt-6 text-sm sm:text-base font-semibold tracking-[0.2em] uppercase">Champions of Season 3</p>
              </motion.div>
            )}

            {phase === 'details' && mightyKickers && (
              <motion.div
                key="details"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl w-[calc(100%-2rem)] mx-auto p-5 sm:p-8 bg-gradient-to-br from-green-900/80 to-black border border-green-500/30 rounded-3xl shadow-[0_0_50px_rgba(74,222,128,0.2)] text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">The Winning Squad</h3>
                  
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {mightyKickers.players.map((player, idx) => (
                      <div key={idx} className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-black/50 backdrop-blur-md rounded-full text-green-300 font-bold border border-green-500/20 shadow-lg uppercase text-[10px] sm:text-sm tracking-wider">
                        {player}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center border-t border-white/10 pt-6 sm:pt-8">
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-1 sm:mb-2">Coach</p>
                      <p className="text-lg sm:text-2xl font-black text-white">{mightyKickers.captain}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-1 sm:mb-2">Representing</p>
                      <p className="text-lg sm:text-2xl font-black text-white flex items-center justify-center gap-2 sm:gap-3">
                        <img src={`https://flagcdn.com/w40/${mightyKickers.countryCode}.png`} alt="flag" className="w-6 sm:w-8 rounded-sm shadow-md" />
                        <span className="truncate">{mightyKickers.country}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
