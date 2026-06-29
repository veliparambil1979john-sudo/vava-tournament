"use client";
import React from 'react';
import confetti from 'canvas-confetti';
import { PartyPopper } from 'lucide-react';

export default function ConfettiButton() {
  const handleFireConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#009c3b', '#ffdf00', '#002776']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#009c3b', '#ffdf00', '#002776']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <button
      onClick={handleFireConfetti}
      className="fixed bottom-6 right-6 z-[45] flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#009c3b] to-green-700 border-2 border-[#ffdf00] rounded-full shadow-[0_0_20px_rgba(255,223,0,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(255,223,0,0.6)] active:scale-95 transition-all duration-300 group"
      title="More Poppers!"
    >
      <PartyPopper className="w-6 h-6 text-[#ffdf00] group-hover:rotate-12 transition-transform duration-300" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#002776] rounded-full border border-white" />
    </button>
  );
}
