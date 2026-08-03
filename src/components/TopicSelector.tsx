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
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'Home': return <Home className="w-5 h-5 text-sky-500" />;
      case 'Plane': return <Plane className="w-5 h-5 text-purple-500" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'Clock': return <Clock className="w-5 h-5 text-rose-500" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="topic-selector-tabs mb-6 overflow-x-auto pb-2">
      <div className="flex gap-2.5 min-w-max">
        {TOPIC_CATEGORIES.map((topic: LearningTopic) => {
          const isSelected = selectedTopicId === topic.id;

          return (
            <button
              key={topic.id}
              onClick={() => {
                soundFx.playClick();
                onSelectTopic(topic.id);
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-black text-sm transition-all border-2 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {getTopicIcon(topic.icon)}
              <span>{topic.title}</span>
              {isSelected && <ChevronRight className="w-4 h-4 text-emerald-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
