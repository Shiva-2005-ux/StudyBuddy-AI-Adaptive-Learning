/**
 * StudyBuddy Core Mastery & Progression Engine
 * 60% Earn-to-Advance Boundary Logic
 * 
 * Boundary specification (per user requirement):
 * IF score >= 60:
 *   Mark current topic as mastered.
 *   Unlock the next topic.
 *   Save the result.
 * ELSE:
 *   Keep the next topic locked.
 *   Show areas requiring improvement.
 *   Recommend revising current topic.
 *   Allow another attempt.
 */

export interface QuestionAnswer {
  questionId: string;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  topicId: string;
  topicName: string;
  conceptTag: string;
}

export interface MasteryEvaluationResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  scorePercentage: number;
  passed: boolean; // strictly scorePercentage >= 60
  unlockedNextTopic: boolean;
  nextTopicId?: string | null;
  weakConcepts: string[];
  revisionRecommendations: string[];
  metacognitiveFeedback: string;
}

export const PASSING_THRESHOLD_PERCENT = 60;

/**
 * Evaluates a student's quiz submission against stored correct answers.
 * Implements the exact >= 60% pass threshold.
 */
export function evaluateQuizSubmission(
  answers: QuestionAnswer[],
  nextTopicId?: string | null
): MasteryEvaluationResult {
  if (!answers || answers.length === 0) {
    return {
      totalQuestions: 0,
      correctCount: 0,
      incorrectCount: 0,
      scorePercentage: 0,
      passed: false,
      unlockedNextTopic: false,
      nextTopicId: null,
      weakConcepts: [],
      revisionRecommendations: [],
      metacognitiveFeedback: "No answers were submitted. Please attempt the quiz."
    };
  }

  const totalQuestions = answers.length;
  let correctCount = 0;
  const weakConceptMap = new Map<string, number>();

  for (const ans of answers) {
    if (ans.selectedOptionIndex === ans.correctOptionIndex) {
      correctCount++;
    } else {
      const tag = ans.conceptTag || ans.topicName || "General Concept";
      weakConceptMap.set(tag, (weakConceptMap.get(tag) || 0) + 1);
    }
  }

  const incorrectCount = totalQuestions - correctCount;
  // Calculate percentage without rounding upward below 60%
  const scorePercentage = Math.floor((correctCount / totalQuestions) * 1000) / 10;

  // Exact 60% threshold: >= 60% is a PASS, < 60% is a FAIL
  const passed = scorePercentage >= PASSING_THRESHOLD_PERCENT;
  const unlockedNextTopic = passed;

  const weakConcepts = Array.from(weakConceptMap.keys());
  const revisionRecommendations = weakConcepts.map(
    concept => `Review "${concept}" in the Learning Material or Quick Notes before retaking the quiz.`
  );

  let metacognitiveFeedback = "";
  if (passed) {
    if (scorePercentage === 100) {
      metacognitiveFeedback = "Perfect Score! You demonstrated complete conceptual mastery of this topic. The next topic has been unlocked!";
    } else {
      metacognitiveFeedback = `Congratulations! You scored ${scorePercentage}%, meeting the 60% mastery threshold. You have unlocked the next topic in your learning journey!`;
    }
  } else {
    metacognitiveFeedback = `You scored ${scorePercentage}%. To advance, a score of at least 60% is required. Please revise the highlighted weak concepts and try the quiz again!`;
  }

  return {
    totalQuestions,
    correctCount,
    incorrectCount,
    scorePercentage,
    passed,
    unlockedNextTopic,
    nextTopicId: passed ? nextTopicId : null,
    weakConcepts,
    revisionRecommendations,
    metacognitiveFeedback
  };
}

/**
 * Determines whether a given topic is unlocked for a student.
 * - Topic 1 of Chapter 1 is always unlocked by default.
 * - Any topic is unlocked if it's explicitly present in unlockedTopicIds.
 * - A topic is unlocked if the immediately preceding topic has been mastered (score >= 60%).
 */
export function isTopicUnlocked(
  topicId: string,
  topicOrder: number,
  chapterOrder: number,
  masteredTopicIds: string[],
  unlockedTopicIds: string[],
  prevTopicId?: string
): boolean {
  // First topic of the first chapter is always unlocked
  if (topicOrder === 1 && chapterOrder === 1) return true;

  // Explicitly unlocked
  if (unlockedTopicIds.includes(topicId)) return true;

  // If previous topic in sequence is mastered
  if (prevTopicId && masteredTopicIds.includes(prevTopicId)) return true;

  return false;
}

/**
 * Finds the ID of the next topic in order within the chapter.
 */
export function getNextTopicInChapter(
  currentTopicId: string,
  topics: { id: string; order: number }[]
): string | null {
  const sorted = [...topics].sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex(t => t.id === currentTopicId);
  if (currentIndex >= 0 && currentIndex < sorted.length - 1) {
    return sorted[currentIndex + 1].id;
  }
  return null;
}
