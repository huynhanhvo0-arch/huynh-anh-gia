export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type Goal = 'TOEIC' | 'IELTS' | 'General';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  level: Level;
  goal: Goal;
  targetScore: string;
  dailyGoalMinutes: number;
  streak: number;
  lastStudyDate?: string;
  totalLessonsCompleted: number;
  points: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'Vocabulary' | 'Grammar' | 'Pronunciation' | 'Listening' | 'Speaking' | 'Reading' | 'Writing';
  level: Level;
  content: any;
}

export interface Progress {
  lessonId: string;
  userId: string;
  completed: boolean;
  score?: number;
  completedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
