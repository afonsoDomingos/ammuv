import React from 'react';
import type { LearningModule, UserStats } from '../types/game';
import { Sparkles, ShieldAlert, HelpCircle, Trophy, Lock, Check, Star, Crown } from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import { Mascot } from './Mascot';

interface ModuleSelectorProps {
  modules: LearningModule[];
  stats: UserStats;
  onSelectModule: (module: LearningModule) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  modules,
  stats,
  onSelectModule
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-8 h-8" />;
      case 'ShieldAlert': return <ShieldAlert className="w-8 h-8" />;
      case 'HelpCircle': return <HelpCircle className="w-8 h-8" />;
      case 'Trophy': return <Trophy className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  return (
    <div className="module-selector-container">
      {/* Duolingo Mascot Greeting Banner */}
      <div className="flex justify-center mb-8">
        <Mascot 
          mood="happy"
          size="lg"
          speechBubble="Olá! Vamos aprender o Verbo To Be hoje? Escolha a primeira lição abaixo!"
        />
      </div>

      <div className="hero-banner">
        <h1 className="hero-title">Verbo "To Be" - Trilha de Aprendizado</h1>
        <p className="hero-subtitle">Conclua cada etapa para avançar e ganhar coroas!</p>
      </div>

      {/* Duolingo Skill Tree Path */}
      <div className="skill-tree-path">
        {modules.map((mod, index) => {
          const isCompleted = stats.completedModules[mod.id] !== undefined;
          const starsEarned = stats.completedModules[mod.id]?.stars || 0;
          const isUnlocked = index === 0 || stats.completedModules[modules[index - 1].id] !== undefined;

          let nodeClass = 'node-locked';
          if (isCompleted) nodeClass = 'node-completed';
          else if (isUnlocked) nodeClass = 'node-unlocked';

          return (
            <div key={mod.id} className="skill-node-wrapper">
              {isCompleted && (
                <div className="crown-badge" title="Coroa de Conclusão!">
                  <Crown className="w-5 h-5 fill-amber-300 text-amber-600" />
                </div>
              )}

              <button
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    soundFx.playClick();
                    onSelectModule(mod);
                  }
                }}
                className={`skill-node-btn ${nodeClass}`}
                title={mod.title}
              >
                {!isUnlocked ? (
                  <Lock className="w-8 h-8" />
                ) : isCompleted ? (
                  <Check className="w-9 h-9 stroke-[3]" />
                ) : (
                  getIcon(mod.icon)
                )}

                {/* Stars Badge on Node */}
                {isUnlocked && (
                  <div className="stars-pill">
                    {[1, 2, 3].map((starNum) => (
                      <Star 
                        key={starNum}
                        className={`w-3.5 h-3.5 ${
                          starNum <= starsEarned 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>

              <div className="skill-node-title">
                {mod.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
