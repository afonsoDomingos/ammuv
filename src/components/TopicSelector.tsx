import React from 'react';
import type { LearningTopic, TopicCategory } from '../types/game';
import { TOPIC_CATEGORIES } from '../data/englishTopicsData';
import { soundFx } from '../utils/soundFx';
import { Sparkles, Utensils, Home, Plane, Briefcase, Clock, ChevronRight } from 'lucide-react';

interface TopicSelectorProps {
  selectedTopicId: TopicCategory;
  onSelectTopic: (topicId: TopicCategory) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopicId,
  onSelectTopic
}) => {
  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="topic-icon icon-emerald" />;
      case 'Utensils': return <Utensils className="topic-icon icon-amber" />;
      case 'Home': return <Home className="topic-icon icon-sky" />;
      case 'Plane': return <Plane className="topic-icon icon-purple" />;
      case 'Briefcase': return <Briefcase className="topic-icon icon-blue" />;
      case 'Clock': return <Clock className="topic-icon icon-rose" />;
      default: return <Sparkles className="topic-icon icon-emerald" />;
    }
  };

  return (
    <div className="topic-selector-wrapper">
      <h2 className="topic-section-label">Escolha o Tópico de Estudo</h2>
      <div className="topic-tabs-scroll">
        <div className="topic-tabs-track">
          {TOPIC_CATEGORIES.map((topic: LearningTopic) => {
            const isSelected = selectedTopicId === topic.id;

            return (
              <button
                key={topic.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectTopic(topic.id);
                }}
                className={`topic-tab-btn ${isSelected ? 'topic-tab-active' : 'topic-tab-inactive'}`}
              >
                {getTopicIcon(topic.icon)}
                <span className="topic-tab-title">{topic.title}</span>
                {isSelected && <ChevronRight className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
