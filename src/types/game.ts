export type ExerciseType = 
  | 'multiple_choice' 
  | 'sentence_builder' 
  | 'fill_blank' 
  | 'image_choice' 
  | 'true_false' 
  | 'listening' 
  | 'pair_matching' 
  | 'audio_dictation';

export type TopicCategory = 
  | 'verb_to_be' 
  | 'food_vocab' 
  | 'family_house' 
  | 'travel_places' 
  | 'jobs_careers' 
  | 'daily_routine';

export interface MatchingPair {
  id: string;
  en: string;
  pt: string;
}

export interface OptionItem {
  text: string;
  icon?: string;
  hint?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  badgeTag?: string; // e.g. "PALAVRA NOVA", "REVISÃO", "ESCUTE E RESPONDA", "CORRESPONDA OS PARES"
  question: string;
  speakerText?: string; // Spoken text for audio listening questions
  contextPt?: string; // Translation hint
  options?: OptionItem[];
  pairs?: MatchingPair[]; // For pair_matching mode
  correctAnswer: string;
  words?: string[]; // Scrambled chips
  explanation: string; // Pedagogical explanation
}

export interface LearningTopic {
  id: TopicCategory;
  title: string;
  description: string;
  icon: string;
  badgeColor: string;
  modulesCount: number;
}

export interface LearningModule {
  id: string;
  topicId?: TopicCategory;
  title: string;
  description: string;
  category: string;
  level: number;
  icon: string;
  unlocked: boolean;
  exercises: Exercise[];
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  completedModules: Record<string, { stars: number; highScore: number }>;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}
