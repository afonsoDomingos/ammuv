import React, { useState } from 'react';
import type { LearningModule, UserStats, TopicCategory } from '../types/game';
import { Sparkles, ShieldAlert, HelpCircle, Trophy, Lock, Check, Star, Crown, Utensils, Home, Plane, Briefcase, Clock } from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import { WelcomeBanner } from './WelcomeBanner';
import { TopicSelector } from './TopicSelector';
import { TOPIC_CATEGORIES } from '../data/englishTopicsData';

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
  const [selectedTopicId, setSelectedTopicId] = useState<TopicCategory>('verb_to_be');

  const filteredModules = modules.filter(m => m.topicId === selectedTopicId || (!m.topicId && selectedTopicId === 'verb_to_be'));
  const currentTopic = TOPIC_CATEGORIES.find(t => t.id === selectedTopicId) || TOPIC_CATEGORIES[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-8 h-8" />;
      case 'ShieldAlert': return <ShieldAlert className="w-8 h-8" />;
      case 'HelpCircle': return <HelpCircle className="w-8 h-8" />;
      case 'Trophy': return <Trophy className="w-8 h-8" />;
      case 'Utensils': return <Utensils className="w-8 h-8" />;
      case 'Home': return <Home className="w-8 h-8" />;
      case 'Plane': return <Plane className="w-8 h-8" />;
      case 'Briefcase': return <Briefcase className="w-8 h-8" />;
      case 'Clock': return <Clock className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  const handleStartFirstUnlocked = () => {
    const firstUnlocked = filteredModules.find((_m, i) => i === 0 || stats.completedModules[filteredModules[i - 1].id] !== undefined);
    if (firstUnlocked) {
      onSelectModule(firstUnlocked);
    }
  };

  return (
    <div className="module-selector-container">
      {/* Friendly Muv Greeting Banner */}
      <WelcomeBanner onStart={handleStartFirstUnlocked} />

      {/* Topic Switcher Tabs */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Escolha o Tópico de Estudo</h2>
        <TopicSelector 
          selectedTopicId={selectedTopicId}
          onSelectTopic={(topicId) => setSelectedTopicId(topicId)}
        />
      </div>

      <div className="hero-banner">
        <h1 className="hero-title">{currentTopic.title}</h1>
        <p className="hero-subtitle">{currentTopic.description}</p>
      </div>

      {/* Duolingo Skill Tree Path */}
      <div className="skill-tree-path">
        {filteredModules.map((mod, index) => {
          const isCompleted = stats.completedModules[mod.id] !== undefined;
          const starsEarned = stats.completedModules[mod.id]?.stars || 0;
          const isUnlocked = index === 0 || stats.completedModules[filteredModules[index - 1].id] !== undefined;

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
