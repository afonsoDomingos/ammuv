import type { Exercise, LearningModule, TopicCategory } from '../types/game';
import { ALL_LEARNING_MODULES } from '../data/englishTopicsData';

export interface CustomQuestionItem {
  question: Exercise;
  topicId: TopicCategory;
  moduleId: string;
  createdAt: string;
}

const STORAGE_KEY = 'muvlern_custom_questions';

/**
 * Fetch all custom questions saved in localStorage
 */
export function getCustomQuestions(): CustomQuestionItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading custom questions from localStorage:', error);
    return [];
  }
}

/**
 * Save a new or edited custom question to localStorage
 */
export function saveCustomQuestion(
  exercise: Exercise,
  topicId: TopicCategory,
  moduleId: string
): CustomQuestionItem[] {
  const current = getCustomQuestions();
  
  // Check if updating existing
  const existingIdx = current.findIndex(item => item.question.id === exercise.id);
  const newItem: CustomQuestionItem = {
    question: exercise,
    topicId,
    moduleId,
    createdAt: new Date().toISOString()
  };

  let updated: CustomQuestionItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newItem;
  } else {
    updated = [newItem, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving custom question to localStorage:', error);
  }

  return updated;
}

/**
 * Delete a custom question by ID
 */
export function deleteCustomQuestion(questionId: string): CustomQuestionItem[] {
  const current = getCustomQuestions();
  const updated = current.filter(item => item.question.id !== questionId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting custom question:', error);
  }
  return updated;
}

/**
 * Export custom questions as JSON string
 */
export function exportCustomQuestionsJson(): string {
  const current = getCustomQuestions();
  return JSON.stringify(current, null, 2);
}

/**
 * Import custom questions from JSON string
 */
export function importCustomQuestionsJson(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing custom questions JSON:', error);
    return false;
  }
}

/**
 * Returns all learning modules combined with user-created custom questions.
 */
export function getCombinedModules(): LearningModule[] {
  const customItems = getCustomQuestions();
  
  // Clone native modules structure
  const modulesCopy: LearningModule[] = JSON.parse(JSON.stringify(ALL_LEARNING_MODULES));

  // Merge custom exercises into respective target modules
  customItems.forEach(custom => {
    const targetModule = modulesCopy.find(m => m.id === custom.moduleId);
    if (targetModule) {
      // Check if question already exists to prevent duplication
      const exists = targetModule.exercises.some(e => e.id === custom.question.id);
      if (!exists) {
        targetModule.exercises.push(custom.question);
      }
    }
  });

  return modulesCopy;
}
