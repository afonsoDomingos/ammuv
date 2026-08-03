import React from 'react';
import type { UserStats } from '../types/game';
import { soundFx } from '../utils/soundFx';
import { Volume2, VolumeX, Flame, Heart, BookOpen, Award, Bot } from 'lucide-react';

interface NavbarProps {
  stats: UserStats;
  onOpenGrammar: () => void;
  onOpenBadges: () => void;
  onOpenAiTutor: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  onOpenGrammar,
  onOpenBadges,
  onOpenAiTutor,
  isMuted,
  onToggleMute,
  onGoHome
}) => {
  const currentXpInLevel = stats.xp % 100;
  const levelProgress = currentXpInLevel; // 0 to 100%

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo with custom MUVLOGO.png */}
        <div className="brand-logo" onClick={onGoHome} role="button" tabIndex={0}>
          <img 
            src="/MUVLOGO.png" 
            alt="MuvLern Logo" 
            className="h-9 sm:h-11 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform" 
          />
        </div>

        {/* User Stats Bar */}
        <div className="stats-group">
          {/* Level & XP */}
          <div className="stat-card level-card">
            <span className="level-badge text-xs sm:text-sm">Nv {stats.level}</span>
            <div className="xp-bar-outer hidden sm:block">
              <div 
                className="xp-bar-inner" 
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <span className="xp-text text-xs sm:text-sm">{stats.xp} XP</span>
          </div>

          {/* Streak */}
          <div className="stat-card streak-card" title="Sequência de acertos seguidos!">
            <Flame className={`w-4 h-4 sm:w-5 sm:h-5 ${stats.streak > 0 ? 'text-amber-500 fill-amber-500 animate-bounce' : 'text-slate-400'}`} />
            <span className="stat-value">{stats.streak}</span>
          </div>

          {/* Hearts */}
          <div className="stat-card heart-card" title="Vidas restantes">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500" />
            <span className="stat-value">{stats.hearts}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-group">
          <button 
            onClick={() => { soundFx.playClick(); onOpenAiTutor(); }}
            className="action-btn ai-btn text-purple-700 font-extrabold border-purple-300 bg-purple-50"
            title="Tutor de Inteligência Artificial Muvy AI"
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span className="btn-label hidden lg:inline">Tutor IA</span>
          </button>

          <button 
            onClick={() => { soundFx.playClick(); onOpenGrammar(); }}
            className="action-btn grammar-btn"
            title="Guia Gramatical do Verbo To Be"
          >
            <BookOpen className="w-4 h-4 text-black" />
            <span className="btn-label hidden lg:inline">Gramática</span>
          </button>

          <button 
            onClick={() => { soundFx.playClick(); onOpenBadges(); }}
            className="action-btn badge-btn"
            title="Ver Conquistas"
          >
            <Award className="w-4 h-4 text-black" />
            <span className="btn-label hidden lg:inline">Conquistas</span>
          </button>

          <button 
            onClick={onToggleMute}
            className="action-btn sound-btn"
            title={isMuted ? "Ativar som" : "Desativar som"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-black" />}
          </button>
        </div>
      </div>
    </header>
  );
};
