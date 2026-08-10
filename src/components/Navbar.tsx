import React from 'react';
import type { UserStats } from '../types/game';
import { soundFx } from '../utils/soundFx';
import { Volume2, VolumeX, Flame, Heart, BookOpen, Award, Bot, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  stats: UserStats;
  onOpenGrammar: () => void;
  onOpenBadges: () => void;
  onOpenAiTutor: () => void;
  onOpenAdmin: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  onOpenGrammar,
  onOpenBadges,
  onOpenAiTutor,
  onOpenAdmin,
  isMuted,
  onToggleMute,
  onGoHome
}) => {
  const currentXpInLevel = stats.xp % 100;
  const levelProgress = currentXpInLevel;

  return (
    <header className="navbar-container">
      {/* Primary Top Bar */}
      <div className="navbar-content">
        
        {/* Brand Logo */}
        <div className="brand-logo" onClick={onGoHome} role="button" tabIndex={0}>
          <img 
            src="/MUVLOGO.png" 
            alt="MuvLern Logo Icon" 
            className="brand-logo-img" 
          />
          <span className="brand-logo-text">
            Muv<span className="brand-logo-highlight">Lern</span>
          </span>
        </div>

        {/* User Stats Bar */}
        <div className="stats-group">
          {/* Level & XP */}
          <div className="stat-card level-card" title="Nível atual e pontos de XP">
            <span className="level-badge">Nv {stats.level}</span>
            <div className="xp-bar-outer">
              <div 
                className="xp-bar-inner" 
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <span className="xp-text">{stats.xp} XP</span>
          </div>

          {/* Streak */}
          <div className="stat-card streak-card" title="Sequência de acertos seguidos!">
            <Flame className={`stat-icon ${stats.streak > 0 ? 'fire-active' : 'fire-inactive'}`} />
            <span className="stat-value">{stats.streak}</span>
          </div>

          {/* Hearts */}
          <div className="stat-card heart-card" title="Vidas restantes">
            <Heart className="stat-icon heart-active" />
            <span className="stat-value">{stats.hearts}</span>
          </div>
        </div>

        {/* Desktop Quick Actions (>= 640px) */}
        <div className="actions-group desktop-only">
          <button 
            onClick={() => { soundFx.playClick(); onOpenGrammar(); }}
            className="action-btn grammar-btn"
            title="Guia Gramatical"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span className="btn-label">Gramática</span>
          </button>

          <button 
            onClick={() => { soundFx.playClick(); onOpenBadges(); }}
            className="action-btn badge-btn"
            title="Ver Conquistas"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span className="btn-label">Conquistas</span>
          </button>

          <button 
            onClick={() => { soundFx.playClick(); onOpenAiTutor(); }}
            className="action-btn ai-btn"
            title="Tutor de Inteligência Artificial Muvy AI"
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span className="btn-label">Tutor IA</span>
          </button>

          <button 
            onClick={() => { soundFx.playClick(); onOpenAdmin(); }}
            className="action-btn admin-btn"
            title="Painel de Administração de Perguntas"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="btn-label">Admin</span>
          </button>

          <button 
            onClick={onToggleMute}
            className="action-btn sound-btn"
            title={isMuted ? "Ativar som" : "Desativar som"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Bar Actions (< 640px) */}
      <div className="mobile-actions-subbar">
        <button 
          onClick={() => { soundFx.playClick(); onOpenGrammar(); }}
          className="subbar-btn"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
          <span>Gramática</span>
        </button>

        <button 
          onClick={() => { soundFx.playClick(); onOpenBadges(); }}
          className="subbar-btn"
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Conquistas</span>
        </button>

        <button 
          onClick={() => { soundFx.playClick(); onOpenAiTutor(); }}
          className="subbar-btn subbar-ai"
        >
          <Bot className="w-3.5 h-3.5 text-purple-600" />
          <span>Tutor IA</span>
        </button>

        <button 
          onClick={() => { soundFx.playClick(); onOpenAdmin(); }}
          className="subbar-btn subbar-admin"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Admin</span>
        </button>

        <button 
          onClick={onToggleMute}
          className="subbar-btn subbar-sound"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
