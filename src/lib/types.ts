
export type DifficultyLevel = 'Einsteiger' | 'Basics' | 'Fortgeschritten';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Exotic';

export interface Trophy {
  id: string;
  emoji: string;
  name: string;
  rarity: Rarity;
}

export interface LessonImage {
  id: string;
  imageUrl: string;
  alt: string;
  placement: 'after-description' | 'after-content' | 'before-glossary' | 'before-quiz';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  glossary: GlossaryItem[];
  quiz: QuizQuestion[];
  lessonImages?: LessonImage[];
  minLevel: DifficultyLevel;
}

export interface UserProgress {
  displayName?: string | null;
  email?: string | null;
  level: DifficultyLevel | null;
  completedModules: string[];
  quizScores: Record<string, number>;
  totalProgress: number;
  trophies: Trophy[];
}
