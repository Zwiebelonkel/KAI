
export type DifficultyLevel = 'Einsteiger' | 'Basics' | 'Fortgeschritten';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
  minLevel: DifficultyLevel;
}

export interface UserProgress {
  level: DifficultyLevel | null;
  completedModules: string[];
  quizScores: Record<string, number>;
  totalProgress: number;
}
