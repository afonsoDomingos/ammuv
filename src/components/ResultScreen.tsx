import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/soundFx';
import { Trophy, Star, ArrowRight, RotateCcw, Zap, Heart } from 'lucide-react';

interface ResultScreenProps {
  moduleTitle: string;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  heartsRemaining: number;
  onNextModule: () => void;
  onRetryModule: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  moduleTitle,
  correctAnswers,
  totalQuestions,
  xpEarned,
  heartsRemaining,
  onNextModule,
  onRetryModule
}) => {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  // Calculate 1 to 3 stars
  let stars = 1;
  if (accuracy >= 90) stars = 3;
  else if (accuracy >= 60) stars = 2;

  useEffect(() => {
    soundFx.playVictory();

    // Trigger colorful celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="result-container">
      <div className="result-card">
        {/* Animated Trophy Icon */}
        <div className="trophy-wrapper">
          <Trophy className="w-16 h-16 text-black fill-amber-400 animate-bounce" />
        </div>

        <h1 className="result-title">Módulo Concluído!</h1>
        <p className="result-subtitle">{moduleTitle}</p>

        {/* Stars Earned */}
        <div className="result-stars">
          {[1, 2, 3].map((starNum) => (
            <Star 
              key={starNum}
              className={`w-10 h-10 ${
                starNum <= stars 
                  ? 'text-amber-500 fill-amber-500 scale-110' 
                  : 'text-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="metrics-grid">
          <div className="metric-box">
            <Zap className="w-6 h-6 text-black fill-amber-400" />
            <span className="metric-value">+{xpEarned} XP</span>
            <span className="metric-label">XP Ganho</span>
          </div>

          <div className="metric-box">
            <span className="metric-value text-emerald-600">{accuracy}%</span>
            <span className="metric-label">Precisão</span>
          </div>

          <div className="metric-box">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <span className="metric-value">{heartsRemaining}</span>
            <span className="metric-label">Vidas Restantes</span>
          </div>
        </div>

        {/* Actions */}
        <div className="result-actions">
          <button 
            onClick={() => { soundFx.playClick(); onRetryModule(); }} 
            className="secondary-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refazer Módulo</span>
          </button>

          <button 
            onClick={() => { soundFx.playClick(); onNextModule(); }} 
            className="primary-btn"
          >
            <span>Continuar</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
