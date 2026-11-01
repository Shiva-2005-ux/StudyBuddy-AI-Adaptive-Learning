import { GradeClass } from './curriculum.ts';

export interface StudentProfile {
  studentId: string;
  fullName: string;
  email: string;
  selectedClass: GradeClass;
  createdAt: string;
  lastLoginAt: string;
}

export interface StudentProgressRecord {
  progressId: string;
  studentId: string;
  topicId: string;
  completed: boolean; // Learned
  completedAt: string;
  mastered?: boolean;
  masteredAt?: string;
  highestScore?: number;
  practiceScore?: number;
}

export interface TopicUnlockRecord {
  unlockId: string;
  studentId: string;
  topicId: string; // The topic ID that has been unlocked
  topicSetId?: string; // backwards compatibility
  isUnlocked: boolean;
  unlockedAt: string;
  unlockedByScore: number;
}

export interface PracticeSheetAttempt {
  attemptId: string;
  studentId: string;
  topicId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  answers: Record<string, string | number>;
  submittedAt: string;
}

export interface QuizAttemptRecord {
  attemptId: string;
  studentId: string;
  topicId: string; // The specific topic tested
  topicSetId?: string; // backwards compatibility
  topicName?: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  attemptedAt: string;
  weakConcepts: string[];
}

export interface CommunityReply {
  replyId: string;
  postId: string;
  studentId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  postId: string;
  studentId: string;
  authorName: string;
  studentClass: GradeClass;
  subjectId: string;
  chapterId?: string;
  topicId?: string;
  title: string;
  content: string;
  createdAt: string;
  likesCount: number;
  repliesCount: number;
  replies?: CommunityReply[];
}

export interface AnalyticsSummary {
  totalTopics: number;
  completedTopics: number;
  masteredTopics: number;
  inProgressTopics: number;
  lockedTopics: number;
  overallProgressPercentage: number;
  averageQuizScore: number;
  totalQuizzesAttempted: number;
  learningStreakDays: number;
  weakConcepts: { concept: string; occurrences: number; subject: string }[];
  recommendedRevisions: {
    topicId: string;
    topicName: string;
    chapterName: string;
    subjectName: string;
    reason: string;
  }[];
}
