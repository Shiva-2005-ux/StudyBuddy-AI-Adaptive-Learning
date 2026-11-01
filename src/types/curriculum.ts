export type GradeClass = 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10';

export interface PracticeQuestion {
  id: string;
  type: 'mcq' | 'fill-blank' | 'true-false' | 'concept' | 'application';
  difficulty: 'easy' | 'medium' | 'challenging';
  marks: number;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint: string;
  conceptTag: string;
}

export interface PracticeSheet {
  topicId: string;
  topicName: string;
  totalQuestions: number;
  totalMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Challenging' | 'Comprehensive';
  questions: PracticeQuestion[];
}

export interface LearnContent {
  introduction: string;
  learningObjectives?: string[];
  coreConcepts: {
    title: string;
    description: string;
    bulletPoints?: string[];
    formula?: string;
    diagram?: string;
  }[];
  stepByStepExample: {
    problem: string;
    steps: {
      stepNumber: number;
      instruction: string;
      reasoning: string;
    }[];
    finalAnswer: string;
  };
  definitions: {
    term: string;
    definition: string;
  }[];
  difficultTerminology?: {
    term: string;
    meaning: string;
    context: string;
  }[];
  importantFacts?: string[];
  diagramPrompt?: string;
  diagramSvg?: string;
  realWorldApplication: string;
}

export interface RevisionNote {
  keyTakeaways: string[];
  keyDefinitions?: { term: string; definition: string }[];
  formulasAndRules: string[];
  commonMistakes: {
    mistake: string;
    correction: string;
  }[];
  examBoosterTips: string[];
}

export interface VideoLesson {
  title: string;
  duration: string;
  videoUrl: string;
  instructor: string;
  summary: string;
  keyTimestamps?: {
    time: string;
    topic: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number; // 0-3
  explanation: string;
  topicId: string;
  topicName: string;
  conceptTag: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Topic {
  id: string;
  name: string;
  order: number;
  chapterId: string;
  topicSetNumber?: number; // backwards compatibility
  summary: string;
  pdfSource?: {
    bookName: string;
    chapterName: string;
    sectionNumber?: string;
    pageRange?: string;
  };
  learn: LearnContent;
  practiceSheet: PracticeSheet;
  practice?: PracticeQuestion[]; // backwards compatibility
  masteryQuiz: QuizQuestion[]; // 10 questions strictly grounded in PDF
  quizQuestions?: QuizQuestion[]; // backwards compatibility
  revisionNotes: RevisionNote;
  video?: VideoLesson;
}

export interface TopicSet {
  setNumber: number;
  name: string;
  description: string;
  topics: Topic[];
  quizQuestions: QuizQuestion[];
}

export interface Chapter {
  id: string;
  name: string;
  order: number;
  subjectId: string;
  grade: GradeClass;
  iconName: string;
  description: string;
  pdfSourceBook?: string;
  pdfPageRange?: string;
  topics: Topic[];
  topicSets?: TopicSet[]; // backwards compatibility
}

export interface Subject {
  id: string;
  name: 'Mathematics' | 'Science' | 'Social Studies' | 'English';
  grade: GradeClass;
  tagline: string;
  color: string;
  icon: string;
  pdfFilename?: string;
  chapters: Chapter[];
}
