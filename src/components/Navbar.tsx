import React from 'react';
import type { UserStats } from '../types/game';
import { soundFx } from '../utils/soundFx';
import { Volume2, VolumeX, Flame, Heart, BookOpen, Award, Zap, Bot } from 'lucide-react';

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
        {/* Brand Logo */}
        <div className="brand-logo" onClick={onGoHome} role="button" tabIndex={0}>
          <div className="logo-badge">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <span className="logo-text">Muv<span className="logo-highlight">Lern</span></span>
          <span className="tag-pill">Verb "To Be"</span>
        </div>

        {/* User Stats Bar */}
        <div className="stats-group">
          {/* Level & XP */}
          <div className="stat-card level-card">
            <span className="level-badge">Nível {stats.level}</span>
            <div className="xp-bar-outer">
              <div 
                className="xp-bar-inner" 
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <span className="xp-text">{stats.xp} XP</span>
          </div>

          {/* Streak */}
          <div className="stat-card streak-card" title="Sequência de dias/respostas corretas!">
            <Flame className={`w-5 h-5 ${stats.streak > 0 ? 'text-amber-500 fill-amber-500 animate-bounce' : 'text-slate-400'}`} />
            <span className="stat-value">{stats.streak}</span>
          </div>

          {/* Hearts */}
          <div className="stat-card heart-card" title="Vidas restantes">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="stat-value">{stats.hearts} / {stats.maxHearts}</span>
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
            <span className="btn-label">Tutor IA</span>
          </button>

          <button 
            onClick={() => { soundFx.playClick(); onOpenGrammar(); }}
            className="action-btn grammar-btn"
            title="Guia Gramatical do Verbo To Be"
          >
            <BookOpen className="w-4 h-4 text-black" />
            <span className="btn-label">Gramática</span>
          </button>

          <button 
            onClick={() => { soundFx.playClick(); onOpenBadges(); }}
            className="action-btn badge-btn"
            title="Ver Conquistas"
          >
            <Award className="w-4 h-4 text-black" />
            <span className="btn-label">Conquistas</span>
          </button>

          <button 
            onClick={onToggleMute}
            className="action-btn sound-btn"
            title={isMuted ? "Ativar som" : "Desativar som"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-black" />}
          </button>
        </div>
      </div>
    </header>
  );
};
