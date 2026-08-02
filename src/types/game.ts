export type ExerciseType = 'multiple_choice' | 'sentence_builder' | 'fill_blank' | 'image_choice' | 'true_false' | 'listening';

export type VerbToBeCategory = 'affirmative' | 'negative' | 'interrogative' | 'mixed';

export interface OptionItem {
  text: string;
  icon?: string;
  hint?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  badgeTag?: string; // e.g. "PALAVRA NOVA", "REVISÃO", "ESCUTE E RESPONDA"
  question: string;
  speakerText?: string; // Spoken text for audio listening questions
  contextPt?: string; // Translation hint
  options?: OptionItem[];
  correctAnswer: string;
  words?: string[]; // Scrambled chips
  explanation: string; // Pedagogical explanation
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: VerbToBeCategory;
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
