export type ExerciseType = 'multiple_choice' | 'sentence_builder' | 'fill_blank' | 'image_choice';

export type VerbToBeCategory = 'affirmative' | 'negative' | 'interrogative' | 'mixed';

export interface OptionItem {
  text: string;
  icon?: string; // Emoji / Icon representation for image_choice
  hint?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  badgeTag?: string; // e.g. "PALAVRA NOVA", "REVISÃO", "PRÁTICA DO TO BE"
  question: string;
  speakerText?: string; // Text spoken by character in speech bubble
  contextPt?: string; // Translation hint
  options?: OptionItem[]; // Rich options with optional icons
  correctAnswer: string; // Correct answer string
  words?: string[]; // Scrambled word chips for sentence builder
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
