import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.tsx';
import { db, auth } from '../firebase.ts';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { QuizAttemptRecord, PracticeSheetAttempt } from '../types/student.ts';
import { QuestionAnswer, MasteryEvaluationResult, isTopicUnlocked as checkTopicUnlocked } from '../utils/masteryRules.ts';

interface ProgressContextType {
  learnedTopicIds: string[];
  masteredTopicIds: string[];
  unlockedTopicIds: string[];
  quizAttempts: QuizAttemptRecord[];
  practiceAttempts: Record<string, PracticeSheetAttempt>;
  // Status check methods
  isTopicLearned: (topicId: string) => boolean;
  isTopicMastered: (topicId: string) => boolean;
  isTopicUnlocked: (topicId: string, chapterOrder: number, topicOrder: number, prevTopicId?: string) => boolean;
  // Student Actions
  markTopicLearned: (topicId: string) => Promise<void>;
  submitPracticeSheet: (topicId: string, answers: Record<string, string | number>, score: number, totalMarks: number) => Promise<void>;
  submitQuiz: (topicId: string, answers: QuestionAnswer[], nextTopicId?: string | null) => Promise<MasteryEvaluationResult>;
  getPracticeAttempt: (topicId: string) => PracticeSheetAttempt | undefined;
  getTopicAttempts: (topicId: string) => QuizAttemptRecord[];
  getTopicHighestScore: (topicId: string) => number;
  resetProgress: () => Promise<void>;
  // Backwards compatibility aliases
  completedTopicIds: string[];
  unlockedSetIds: string[];
  isTopicCompleted: (topicId: string) => boolean;
  isSetUnlocked: (chapterId: string, setNumber: number) => boolean;
  markTopicComplete: (topicId: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { student } = useAuth();
  const [learnedTopicIds, setLearnedTopicIds] = useState<string[]>([]);
  const [masteredTopicIds, setMasteredTopicIds] = useState<string[]>([]);
  const [unlockedTopicIds, setUnlockedTopicIds] = useState<string[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptRecord[]>([]);
  const [practiceAttempts, setPracticeAttempts] = useState<Record<string, PracticeSheetAttempt>>({});

  // Backwards compatibility alias for topic sets
  const [unlockedSetIds, setUnlockedSetIds] = useState<string[]>([]);

  // Load progress from Firestore or LocalStorage when student changes
  useEffect(() => {
    if (!student) {
      setLearnedTopicIds([]);
      setMasteredTopicIds([]);
      setUnlockedTopicIds([]);
      setQuizAttempts([]);
      setPracticeAttempts({});
      setUnlockedSetIds([]);
      return;
    }

    const loadData = async () => {
      const studentKey = `studybuddy_progress_${student.studentId}`;
      const cached = localStorage.getItem(studentKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setLearnedTopicIds(parsed.learnedTopicIds || parsed.completedTopicIds || []);
          setMasteredTopicIds(parsed.masteredTopicIds || []);
          setUnlockedTopicIds(parsed.unlockedTopicIds || []);
          setQuizAttempts(parsed.quizAttempts || []);
          setPracticeAttempts(parsed.practiceAttempts || {});
          setUnlockedSetIds(parsed.unlockedSetIds || []);
        } catch {
          // ignore cache error
        }
      }

      // Sync from Firestore only if Firebase user is actively authenticated
      if (auth.currentUser) {
        try {
          const progQuery = query(collection(db, 'studentProgress'), where('studentId', '==', student.studentId));
          const progSnap = await getDocs(progQuery);
          const learned: string[] = [];
          const mastered: string[] = [];
          progSnap.forEach((d) => {
            const data = d.data();
            if (data.completed && data.topicId) learned.push(data.topicId);
            if (data.mastered && data.topicId) mastered.push(data.topicId);
          });

          const unlockQuery = query(collection(db, 'topicUnlocks'), where('studentId', '==', student.studentId));
          const unlockSnap = await getDocs(unlockQuery);
          const unlIds: string[] = [];
          const unlSets: string[] = [];
          unlockSnap.forEach((d) => {
            const data = d.data();
            if (data.isUnlocked) {
              if (data.topicId) unlIds.push(data.topicId);
              if (data.topicSetId) unlSets.push(data.topicSetId);
            }
          });

          const quizQuery = query(collection(db, 'quizAttempts'), where('studentId', '==', student.studentId));
          const quizSnap = await getDocs(quizQuery);
          const attempts: QuizAttemptRecord[] = [];
          quizSnap.forEach((d) => {
            attempts.push(d.data() as QuizAttemptRecord);
          });

          if (learned.length > 0) setLearnedTopicIds((prev) => Array.from(new Set([...prev, ...learned])));
          if (mastered.length > 0) setMasteredTopicIds((prev) => Array.from(new Set([...prev, ...mastered])));
          if (unlIds.length > 0) setUnlockedTopicIds((prev) => Array.from(new Set([...prev, ...unlIds])));
          if (unlSets.length > 0) setUnlockedSetIds((prev) => Array.from(new Set([...prev, ...unlSets])));
          if (attempts.length > 0) setQuizAttempts(attempts);
        } catch (err) {
          console.warn('Firestore progress load warning:', err);
        }
      }
    };

    loadData();
  }, [student]);

  // Persist locally whenever state changes
  useEffect(() => {
    if (student) {
      const studentKey = `studybuddy_progress_${student.studentId}`;
      localStorage.setItem(
        studentKey,
        JSON.stringify({
          learnedTopicIds,
          masteredTopicIds,
          unlockedTopicIds,
          quizAttempts,
          practiceAttempts,
          unlockedSetIds,
          completedTopicIds: learnedTopicIds, // alias
        })
      );
    }
  }, [student, learnedTopicIds, masteredTopicIds, unlockedTopicIds, quizAttempts, practiceAttempts, unlockedSetIds]);

  const isTopicLearned = (topicId: string) => {
    return learnedTopicIds.includes(topicId);
  };

  const isTopicMastered = (topicId: string) => {
    return masteredTopicIds.includes(topicId);
  };

  /**
   * Adaptive Topic Unlocking:
   * 1. Topic 1 of Chapter 1 is unlocked by default.
   * 2. Any topic explicitly in unlockedTopicIds is unlocked.
   * 3. Any topic whose previous topic was mastered (score >= 60%) is unlocked.
   */
  const isTopicUnlocked = (
    topicId: string,
    chapterOrder: number,
    topicOrder: number,
    prevTopicId?: string
  ) => {
    return checkTopicUnlocked(
      topicId,
      topicOrder,
      chapterOrder,
      masteredTopicIds,
      unlockedTopicIds,
      prevTopicId
    );
  };

  /**
   * "Mark as Learned" button logic:
   * Records that student completed studying the topic material.
   * CRITICAL: Does NOT unlock the next topic. Next topic remains locked until quiz is passed!
   */
  const markTopicLearned = async (topicId: string) => {
    if (!student) return;
    if (!learnedTopicIds.includes(topicId)) {
      setLearnedTopicIds((prev) => [...prev, topicId]);
    }

    if (auth.currentUser) {
      const progressId = `${student.studentId}_${topicId}`;
      try {
        await setDoc(
          doc(db, 'studentProgress', progressId),
          {
            progressId,
            studentId: student.studentId,
            topicId,
            completed: true,
            completedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Firestore progress save warning:', err);
      }
    }
  };

  /**
   * Saves practice sheet completion and allows review
   */
  const submitPracticeSheet = async (
    topicId: string,
    answers: Record<string, string | number>,
    score: number,
    totalMarks: number
  ) => {
    if (!student) return;
    const attemptId = `practice_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    const record: PracticeSheetAttempt = {
      attemptId,
      studentId: student.studentId,
      topicId,
      score,
      totalMarks,
      percentage,
      answers,
      submittedAt: new Date().toISOString(),
    };

    setPracticeAttempts((prev) => ({
      ...prev,
      [topicId]: record,
    }));
  };

  /**
   * Authoritative Topic Mastery Quiz evaluation via backend /api/quiz/evaluate.
   * Strict 60% rule: score >= 60% unlocks next topic!
   * score < 60% keeps next topic locked with revision recommendations.
   */
  const submitQuiz = async (
    topicId: string,
    answers: QuestionAnswer[],
    nextTopicId?: string | null
  ): Promise<MasteryEvaluationResult> => {
    if (!student) {
      throw new Error('Must be logged in to submit a quiz.');
    }

    const response = await fetch('/api/quiz/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers,
        topicId,
        nextTopicId,
        studentId: student.studentId,
      }),
    });

    if (!response.ok) {
      throw new Error('Server quiz evaluation failed.');
    }

    const result: MasteryEvaluationResult = await response.json();

    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const attemptRecord: QuizAttemptRecord = {
      attemptId,
      studentId: student.studentId,
      topicId,
      score: result.correctCount,
      total: result.totalQuestions,
      percentage: result.scorePercentage,
      passed: result.passed,
      attemptedAt: new Date().toISOString(),
      weakConcepts: result.weakConcepts,
    };

    setQuizAttempts((prev) => [attemptRecord, ...prev]);

    // Save attempt to Firestore if authenticated
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'quizAttempts', attemptId), attemptRecord);
      } catch (err) {
        console.warn('Firestore quizAttempt write warning:', err);
      }
    }

    // STRICT 60% EARN-TO-ADVANCE LOGIC:
    // If passed (score >= 60%), mark as mastered and unlock the next topic!
    if (result.passed) {
      if (!masteredTopicIds.includes(topicId)) {
        setMasteredTopicIds((prev) => [...prev, topicId]);
      }

      // Automatically mark as learned if not already
      if (!learnedTopicIds.includes(topicId)) {
        setLearnedTopicIds((prev) => [...prev, topicId]);
      }

      // Unlock next topic if provided
      if (nextTopicId && !unlockedTopicIds.includes(nextTopicId)) {
        setUnlockedTopicIds((prev) => [...prev, nextTopicId]);

        if (auth.currentUser) {
          const unlockId = `${student.studentId}_${nextTopicId}`;
          try {
            await setDoc(doc(db, 'topicUnlocks', unlockId), {
              unlockId,
              studentId: student.studentId,
              topicId: nextTopicId,
              isUnlocked: true,
              unlockedAt: new Date().toISOString(),
              unlockedByScore: result.scorePercentage,
            });
          } catch (err) {
            console.warn('Firestore topicUnlock write warning:', err);
          }
        }
      }

      // Also persist mastery status to studentProgress
      if (auth.currentUser) {
        const progressId = `${student.studentId}_${topicId}`;
        try {
          await setDoc(
            doc(db, 'studentProgress', progressId),
            {
              progressId,
              studentId: student.studentId,
              topicId,
              completed: true,
              mastered: true,
              highestScore: result.scorePercentage,
              masteredAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Firestore progress mastery update warning:', err);
        }
      }
    }

    return result;
  };

  const getPracticeAttempt = (topicId: string) => {
    return practiceAttempts[topicId];
  };

  const getTopicAttempts = (topicId: string) => {
    return quizAttempts.filter((a) => a.topicId === topicId);
  };

  const getTopicHighestScore = (topicId: string) => {
    const attempts = getTopicAttempts(topicId);
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map((a) => a.percentage));
  };

  const resetProgress = async () => {
    if (!student) return;
    setLearnedTopicIds([]);
    setMasteredTopicIds([]);
    setUnlockedTopicIds([]);
    setQuizAttempts([]);
    setPracticeAttempts({});
    setUnlockedSetIds([]);
    const studentKey = `studybuddy_progress_${student.studentId}`;
    localStorage.removeItem(studentKey);
  };

  // Backwards compatibility aliases
  const completedTopicIds = learnedTopicIds;
  const isTopicCompleted = isTopicLearned;
  const markTopicComplete = markTopicLearned;
  const isSetUnlocked = (_chapterId: string, setNumber: number) => {
    if (setNumber === 1) return true;
    return unlockedSetIds.includes(`${_chapterId}_set${setNumber}`);
  };

  return (
    <ProgressContext.Provider
      value={{
        learnedTopicIds,
        masteredTopicIds,
        unlockedTopicIds,
        quizAttempts,
        practiceAttempts,
        isTopicLearned,
        isTopicMastered,
        isTopicUnlocked,
        markTopicLearned,
        submitPracticeSheet,
        submitQuiz,
        getPracticeAttempt,
        getTopicAttempts,
        getTopicHighestScore,
        resetProgress,
        // Aliases
        completedTopicIds,
        unlockedSetIds,
        isTopicCompleted,
        isSetUnlocked,
        markTopicComplete,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
