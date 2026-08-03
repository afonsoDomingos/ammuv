import React, { useEffect, useState } from 'react';
import { Mascot } from './Mascot';
import { Sparkles, Play, Volume2 } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface WelcomeBannerProps {
  onStart: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onStart }) => {
  const [hasSpoken, setHasSpoken] = useState(false);

  const speakGreeting = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Hello! I'm Muv! Welcome to MuvLern!");
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      setHasSpoken(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakGreeting();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="welcome-banner-card bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 border-b-8 border-emerald-800 relative overflow-hidden">
      {/* Decorative background sparkles */}
      <div className="absolute top-3 right-4 opacity-20 pointer-events-none">
        <Sparkles className="w-32 h-32" />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Mascot Greeting */}
        <div className="flex items-center gap-4">
          <Mascot size="lg" mood="wink" />

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/30 text-emerald-100 font-extrabold text-xs mb-2 border border-emerald-300/40">
              <Sparkles className="w-3.5 h-3.5" /> APRENDA INGLÊS DIVERTINDO-SE
            </div>

            <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight drop-shadow-sm flex items-center gap-2">
              Hello, I'm Muv! 👋
            </h1>

            <p className="text-emerald-100 font-extrabold text-sm sm:text-base mt-1.5 max-w-md">
              Pronto para dominar o Verbo <span className="underline decoration-wavy decoration-yellow-300">"To Be"</span> hoje? Vamos aprender juntos de forma rápida e divertida!
            </p>

            <button
              onClick={speakGreeting}
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 hover:text-amber-200 mt-2 cursor-pointer transition"
            >
              <Volume2 className="w-4 h-4 animate-pulse" /> {hasSpoken ? 'Ouvir a saudação novamente' : 'Ouvir áudio'}
            </button>
          </div>
        </div>

        {/* Start Action Button */}
        <button
          onClick={() => {
            soundFx.playVictory();
            onStart();
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:translate-y-1 text-amber-950 font-black text-lg sm:text-xl shadow-xl border-b-4 border-amber-600 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-amber-950" /> COMEÇAR AGORA
        </button>

      </div>
    </div>
  );
};
