import React, { useState } from 'react';
import { Topic, TopicSet, QuizQuestion } from '../types/curriculum.ts';
import { useProgress } from '../context/ProgressContext.tsx';
import { QuestionAnswer, MasteryEvaluationResult } from '../utils/masteryRules.ts';
import confetti from 'canvas-confetti';
import {
  X,
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  Unlock,
  Lock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Loader2,
  Check,
  XCircle,
} from 'lucide-react';

interface QuizModalProps {
  topic?: Topic | null;
  topicSet?: TopicSet | null;
  chapterId: string;
  nextTopicId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToNotes?: () => void;
  onNavigateToDoubtSolver?: () => void;
  onNextTopic?: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  topic,
  topicSet,
  chapterId,
  nextTopicId,
  isOpen,
  onClose,
  onNavigateToNotes,
  onNavigateToDoubtSolver,
  onNextTopic,
}) => {
  const { submitQuiz } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<MasteryEvaluationResult | null>(null);

  if (!isOpen) return null;

  // Determine questions: prefer topic.masteryQuiz, fallback to topicSet.quizQuestions
  const questions: QuizQuestion[] =
    topic?.masteryQuiz ||
    topic?.quizQuestions ||
    topicSet?.quizQuestions ||
    [];

  const title = topic ? `Topic: ${topic.name}` : topicSet?.name || 'Mastery Quiz';
  const targetId = topic ? topic.id : `${chapterId}_set${topicSet?.setNumber || 1}`;
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    const answersPayload: QuestionAnswer[] = questions.map((q) => ({
      questionId: q.id,
      selectedOptionIndex: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
      correctOptionIndex: q.correctOptionIndex,
      topicId: q.topicId || targetId,
      topicName: q.topicName || title,
      conceptTag: q.conceptTag,
    }));

    setEvaluating(true);
    try {
      const evalResult = await submitQuiz(targetId, answersPayload, nextTopicId);
      setResult(evalResult);

      if (evalResult.passed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.error('Quiz submission failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Adaptive Mastery Assessment · 60% Passing Rule
            </span>
            <h2 className="text-base sm:text-lg font-bold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {evaluating ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                Evaluating Answers Authoritatively
              </h3>
              <p className="text-xs text-slate-500">
                Checking against stored NCERT textbook answer keys...
              </p>
            </div>
          ) : result ? (
            /* Result Screen */
            <div className="space-y-6">
              {/* Banner: Pass vs Fail */}
              <div
                className={`p-6 rounded-3xl text-center border-2 ${
                  result.passed
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-amber-50 border-amber-500 text-amber-950'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 ${
                    result.passed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                  }`}
                >
                  {result.passed ? (
                    <Unlock className="w-7 h-7" />
                  ) : (
                    <Lock className="w-7 h-7" />
                  )}
                </div>

                <div className="text-2xl font-black mb-1">
                  {result.passed ? 'TOPIC MASTERED!' : 'KEEP PRACTISING!'}
                </div>

                <div className="text-3xl font-black mb-2">
                  {result.scorePercentage}%
                </div>

                <p className="text-xs max-w-md mx-auto leading-relaxed">
                  {result.metacognitiveFeedback}
                </p>

                {result.passed ? (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Next Topic Successfully Unlocked</span>
                  </div>
                ) : (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Next Topic Remains Locked (Requires &gt;= 60%)</span>
                  </div>
                )}
              </div>

              {/* Weak concepts & recommendations */}
              {result.weakConcepts.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Targeted Revision Plan
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {result.revisionRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>

                {result.passed && onNextTopic ? (
                  <button
                    onClick={() => {
                      onClose();
                      onNextTopic();
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Proceed to Next Topic</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Close Assessment
                  </button>
                )}
              </div>
            </div>
          ) : currentQuestion ? (
            /* Question Stepper */
            <div className="space-y-6">
              {/* Stepper info */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {Object.keys(selectedAnswers).length}/{questions.length} Answered
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {currentQuestion.conceptTag || 'Conceptual Understanding'}
                </span>
                <h3 className="text-base font-bold text-slate-900 pt-1">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, optIndex) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === optIndex;
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => handleSelectOption(optIndex)}
                      className={`w-full p-4 rounded-2xl border text-xs font-semibold text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stepper navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    Submit Quiz for Evaluation
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No questions found for this topic.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
