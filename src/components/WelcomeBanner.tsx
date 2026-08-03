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
    <div className="welcome-banner-card">
      <div className="welcome-banner-content">
        
        {/* Mascot & Greeting Text */}
        <div className="welcome-left-group">
          <Mascot size="md" mood="wink" />

          <div className="welcome-text-group">
            <span className="welcome-tag-pill">
              <Sparkles className="w-3 h-3" /> APRENDA INGLÊS DIVERTINDO-SE
            </span>

            <h1 className="welcome-title text-xl sm:text-2xl">
              Hello, I'm Muv! 👋
            </h1>

            <p className="welcome-subtitle text-xs sm:text-sm">
              Pronto para dominar o Verbo <span className="welcome-highlight">"To Be"</span> hoje? Vamos aprender juntos de forma rápida e divertida!
            </p>

            <button
              onClick={speakGreeting}
              className="welcome-audio-btn"
            >
              <Volume2 className="w-4 h-4 animate-pulse" /> {hasSpoken ? 'Ouvir a saudação novamente' : 'Ouvir em viva voz'}
            </button>
          </div>
        </div>

        {/* Start Action Button */}
        <button
          onClick={() => {
            soundFx.playVictory();
            onStart();
          }}
          className="welcome-start-btn"
        >
          <Play className="w-6 h-6 fill-amber-950" /> COMEÇAR AGORA
        </button>

      </div>
    </div>
  );
};
