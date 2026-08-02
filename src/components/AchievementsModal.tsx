import React from 'react';
import type { UserStats } from '../types/game';
import { GAME_BADGES } from '../data/verbToBeData';
import { X, Award, Target, Flame, Crown, CheckCircle } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  stats
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-8 h-8 ${isUnlocked ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Target': return <Target className={iconClass} />;
      case 'Flame': return <Flame className={iconClass} />;
      case 'Crown': return <Crown className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card max-w-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-black" />
            <h2 className="modal-title">Suas Conquistas & Medalhas</h2>
          </div>
          <button 
            className="close-btn" 
            onClick={() => { soundFx.playClick(); onClose(); }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="badges-grid">
          {GAME_BADGES.map((badge) => {
            const isUnlocked = badge.condition(stats);
            return (
              <div 
                key={badge.id} 
                className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-icon-wrapper">
                  {renderIcon(badge.icon, isUnlocked)}
                  {isUnlocked && (
                    <div className="unlocked-check">
                      <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                    </div>
                  )}
                </div>
                <div className="badge-info">
                  <h4 className="badge-title">{badge.title}</h4>
                  <p className="badge-desc">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="secondary-btn w-full" onClick={() => { soundFx.playClick(); onClose(); }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
