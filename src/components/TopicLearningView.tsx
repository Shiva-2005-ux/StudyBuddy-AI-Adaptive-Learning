import React, { useState } from 'react';
import { Topic } from '../types/curriculum.ts';
import { QuestionAnswer } from '../utils/masteryRules.ts';
import { useProgress } from '../context/ProgressContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  BookOpen,
  PenTool,
  FileQuestion,
  FileText,
  MessageSquareCode,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Send,
  Loader2,
  RotateCcw,
  Award,
  Check,
  BookmarkCheck,
  ChevronRight,
  Unlock,
  Lock,
} from 'lucide-react';

interface TopicLearningViewProps {
  topic: Topic;
  subjectName: string;
  chapterName: string;
  initialTab?: 'learn' | 'practice' | 'quiz' | 'revision' | 'ai';
  nextTopicId?: string | null;
  onBack: () => void;
  onNextTopic?: () => void;
  onPrevTopic?: () => void;
}

export const TopicLearningView: React.FC<TopicLearningViewProps> = ({
  topic,
  subjectName,
  chapterName,
  initialTab,
  nextTopicId,
  onBack,
  onNextTopic,
  onPrevTopic,
}) => {
  const { student } = useAuth();
  const {
    isTopicLearned,
    isTopicMastered,
    markTopicLearned,
    submitPracticeSheet,
    submitQuiz,
    getPracticeAttempt,
    getTopicHighestScore,
  } = useProgress();

  const isLearned = isTopicLearned(topic.id);
  const isMastered = isTopicMastered(topic.id);
  const highestScore = getTopicHighestScore(topic.id);
  const existingPractice = getPracticeAttempt(topic.id);

  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'quiz' | 'revision' | 'ai'>(
    initialTab || 'learn'
  );

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, topic.id]);

  // Practice Sheet State
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string | number>>(
    existingPractice?.answers || {}
  );
  const [practiceSubmitted, setPracticeSubmitted] = useState<boolean>(Boolean(existingPractice));
  const [practiceScore, setPracticeScore] = useState<number>(existingPractice?.score || 0);

  // Mastery Quiz State
  const quizQuestions = topic.masteryQuiz || topic.quizQuestions || [];
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{
    scorePercentage: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    weakConcepts: string[];
    revisionRecommendations: string[];
    metacognitiveFeedback: string;
  } | null>(null);

  // AI Doubt Solver State
  const [aiLanguage, setAiLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('Hinglish');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: `Namaste ${student?.fullName || 'friend'}! I am StudyBuddy AI. Ask me any doubt about "${topic.name}" from your NCERT textbook in English, Hindi, or Hinglish!`,
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Mark as Learned handler
  const handleMarkLearned = async () => {
    await markTopicLearned(topic.id);
  };

  // Practice Sheet submission
  const handlePracticeAnswerChange = (qId: string, answer: string | number) => {
    setPracticeAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handlePracticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    const questions = topic.practiceSheet?.questions || topic.practice || [];

    questions.forEach((q) => {
      const studentAns = practiceAnswers[q.id];
      if (studentAns !== undefined && studentAns !== '') {
        if (q.type === 'mcq' || q.type === 'true-false') {
          if (Number(studentAns) === Number(q.correctAnswer)) {
            score += q.marks || 2;
          }
        } else if (q.type === 'fill-blank' || q.type === 'concept') {
          const s = String(studentAns).trim().toLowerCase();
          const c = String(q.correctAnswer).trim().toLowerCase();
          if (s === c || s.includes(c)) {
            score += q.marks || 2;
          }
        }
      }
    });

    const totalMarks = topic.practiceSheet?.totalMarks || questions.length * 2;
    setPracticeScore(score);
    setPracticeSubmitted(true);
    await submitPracticeSheet(topic.id, practiceAnswers, score, totalMarks);
  };

  const handleResetPractice = () => {
    setPracticeSubmitted(false);
    setPracticeAnswers({});
    setPracticeScore(0);
  };

  // Mastery Quiz submission
  const handleQuizAnswerSelect = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quizLoading) return;

    if (Object.keys(quizAnswers).length < quizQuestions.length) {
      alert(`Please answer all ${quizQuestions.length} questions before submitting.`);
      return;
    }

    setQuizLoading(true);

    try {
      const formattedAnswers: QuestionAnswer[] = quizQuestions.map((q) => ({
        questionId: q.id,
        selectedOptionIndex: quizAnswers[q.id] ?? -1,
        correctOptionIndex: q.correctOptionIndex,
        topicId: topic.id,
        topicName: topic.name,
        conceptTag: q.conceptTag,
      }));

      const res = await submitQuiz(topic.id, formattedAnswers, nextTopicId);
      setQuizResult(res);
      setQuizSubmitted(true);
    } catch (err: any) {
      alert(err?.message || 'Quiz submission failed. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizSubmitted(false);
    setQuizAnswers({});
    setQuizResult(null);
  };

  // AI Doubt Solver submission
  const handleSendAiDoubt = async (customPrompt?: string) => {
    const queryText = customPrompt || aiQuestion;
    if (!queryText.trim() || aiLoading) return;

    const userMessage = { role: 'user' as const, text: queryText };
    setAiChat((prev) => [...prev, userMessage]);
    if (!customPrompt) setAiQuestion('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/ai/doubt-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryText,
          studentClass: student?.selectedClass || 'Class 6',
          subject: subjectName,
          chapter: chapterName,
          topic: topic.name,
          language: aiLanguage,
          history: aiChat,
        }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setAiChat((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setAiChat((prev) => [
          ...prev,
          {
            role: 'model',
            text:
              data.error ||
              'Could not connect to AI solver. Please check that GEMINI_API_KEY is active.',
          },
        ]);
      }
    } catch {
      setAiChat((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Network error communicating with server. Please try again.',
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const practiceQuestions = topic.practiceSheet?.questions || topic.practice || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chapter Topics</span>
        </button>

        <div className="flex items-center gap-2">
          {onPrevTopic && (
            <button
              onClick={onPrevTopic}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Previous Topic
            </button>
          )}
          {onNextTopic && (
            <button
              onClick={onNextTopic}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1"
            >
              <span>Next Topic</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Topic Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {subjectName} · Chapter: {chapterName}
              </span>
              {topic.pdfSource?.bookName && (
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{topic.pdfSource.bookName}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Topic {topic.order}: {topic.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {topic.summary}
            </p>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-3 shrink-0">
            {isMastered ? (
              <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-right">
                <div className="text-xs font-bold flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Topic Mastered</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold">
                  Highest Score: {highestScore}%
                </div>
              </div>
            ) : isLearned ? (
              <div className="px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-right">
                <div className="text-xs font-bold flex items-center justify-end gap-1">
                  <BookmarkCheck className="w-4 h-4 text-blue-600" />
                  <span>Learned</span>
                </div>
                <div className="text-[11px] text-blue-600">Mastery Quiz Pending</div>
              </div>
            ) : (
              <div className="px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-right">
                <div className="text-xs font-bold flex items-center justify-end gap-1">
                  <Unlock className="w-4 h-4 text-indigo-600" />
                  <span>Unlocked</span>
                </div>
                <div className="text-[11px] text-indigo-600">Study to begin</div>
              </div>
            )}
          </div>
        </div>

        {/* Learning Cycle Tracker */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">1</span>
            <span>Learn</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[11px]">2</span>
            <span>Practise</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[11px]">3</span>
            <span>Test (60% Quiz)</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px]">4</span>
            <span>Unlock Next</span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Pass Quiz (&gt;= 60%) to unlock the subsequent topic
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex flex-wrap border-b border-slate-200 bg-white rounded-2xl p-1 shadow-xs gap-1">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'learn'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>A. Learn Material</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>B. Practice Sheet</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>C. Mastery Quiz (60%)</span>
        </button>

        <button
          onClick={() => setActiveTab('revision')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'revision'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>D. Quick Revision</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquareCode className="w-4 h-4" />
          <span>E. AI Tutor Doubt</span>
        </button>
      </div>

      {/* TAB 1: LEARN MATERIAL */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          {/* Section A: Topic Introduction */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A. Topic Introduction</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Overview & Context
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {topic.learn.introduction}
            </p>

            {/* Learning Objectives */}
            {topic.learn.learningObjectives && topic.learn.learningObjectives.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  What You Will Learn
                </h3>
                <ul className="space-y-1.5 text-xs text-indigo-950 font-medium">
                  {topic.learn.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section B: Detailed Explanation with Subsections */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>B. Detailed Textbook Explanation</span>
            </div>

            <div className="space-y-6">
              {topic.learn.coreConcepts.map((concept, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span>{concept.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {concept.description}
                  </p>

                  {concept.bulletPoints && concept.bulletPoints.length > 0 && (
                    <ul className="space-y-1.5 pl-2 text-xs text-slate-600">
                      {concept.bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {concept.formula && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs text-indigo-800 font-bold">
                      Formula / Key Rule: {concept.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Step-by-Step Textbook Solved Example */}
            {topic.learn.stepByStepExample && (
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Textbook Solved Example
                  </h3>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-slate-800">
                  {topic.learn.stepByStepExample.problem}
                </div>

                <div className="space-y-2">
                  {topic.learn.stepByStepExample.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {st.stepNumber}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">{st.instruction}</span>
                        <p className="text-slate-600 mt-0.5">{st.reasoning}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  Result: {topic.learn.stepByStepExample.finalAnswer}
                </div>
              </div>
            )}

            {/* Definitions & Difficult Terminology */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Important Definitions
                </h4>
                <div className="space-y-2">
                  {topic.learn.definitions.map((def, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-bold text-indigo-700">{def.term}: </span>
                      <span className="text-slate-600">{def.definition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {topic.learn.difficultTerminology && topic.learn.difficultTerminology.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Difficult Terminology Explained
                  </h4>
                  <div className="space-y-2">
                    {topic.learn.difficultTerminology.map((term, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-bold text-slate-900">{term.term}: </span>
                        <span className="text-slate-600">{term.meaning} </span>
                        <span className="text-[10px] text-slate-400 italic">({term.context})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Real World Application */}
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Where Is This Used in Daily Life? </strong>
                <span>{topic.learn.realWorldApplication}</span>
              </div>
            </div>
          </div>

          {/* Section D: Learning Completion */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-slate-900">
                Done Studying This Lesson?
              </h3>
              <p className="text-xs text-slate-500">
                Click below to record your progress. (Remember: next topic unlocks after passing the 60% mastery quiz).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkLearned}
                disabled={isLearned}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isLearned
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLearned ? 'Marked as Learned ✓' : 'Mark as Learned'}</span>
              </button>

              <button
                onClick={() => setActiveTab('practice')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <span>Go to Practice Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPIC-WISE PRACTICE SHEET */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Topic-Wise Practice Sheet</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {topic.name} — Interactive Practice
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Practise MCQs, fill-in-the-blanks, true/false, and conceptual textbook exercises.
                </p>
              </div>

              {/* Sheet Metadata Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                  {practiceQuestions.length} Questions
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                  {topic.practiceSheet?.totalMarks || practiceQuestions.length * 2} Marks
                </span>
                <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                  {topic.practiceSheet?.difficulty || 'Comprehensive'}
                </span>
              </div>
            </div>

            {/* Score review if already submitted */}
            {practiceSubmitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-sm">
                      Practice Score: {practiceScore} / {topic.practiceSheet?.totalMarks || practiceQuestions.length * 2} Marks
                    </span>
                    <p className="text-[11px] text-emerald-700">
                      Great job practising! Review the detailed answer key below or retake to reinforce mastery.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetPractice}
                  className="px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-100/50 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Practise Sheet</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Question List Form */}
          <form onSubmit={handlePracticeSubmit} className="space-y-4">
            {practiceQuestions.map((q, idx) => {
              const studentAnswer = practiceAnswers[q.id];
              const isAnswered = studentAnswer !== undefined && studentAnswer !== '';

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl bg-white border transition-all duration-150 space-y-4 ${
                    practiceSubmitted
                      ? 'border-slate-200'
                      : 'border-slate-200 hover:border-indigo-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Question {idx + 1} · {q.type.toUpperCase()} ({q.marks || 2} Marks)
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {q.difficulty || 'medium'}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {q.question}
                  </h3>

                  {/* MCQ Options */}
                  {(q.type === 'mcq' || q.type === 'true-false') && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = Number(studentAnswer) === optIdx;
                        const isCorrect = Number(q.correctAnswer) === optIdx;

                        return (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                              practiceSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                  : isSelected
                                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                                  : 'bg-white border-slate-200 text-slate-600 opacity-70'
                                : isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`practice_${q.id}`}
                              disabled={practiceSubmitted}
                              checked={isSelected}
                              onChange={() => handlePracticeAnswerChange(q.id, optIdx)}
                              className="text-indigo-600 focus:ring-indigo-600"
                            />
                            <span>{opt}</span>
                            {practiceSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />
                            )}
                            {practiceSubmitted && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 ml-auto shrink-0" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Fill in the blanks or Short Answer */}
                  {(q.type === 'fill-blank' || q.type === 'concept' || q.type === 'application') && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        disabled={practiceSubmitted}
                        value={studentAnswer !== undefined ? String(studentAnswer) : ''}
                        onChange={(e) => handlePracticeAnswerChange(q.id, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none disabled:bg-slate-50"
                      />
                    </div>
                  )}

                  {/* Explanation after submission */}
                  {practiceSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Textbook Answer & Explanation:</span>
                      </div>
                      <p>{q.explanation}</p>
                      {q.hint && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">Hint: {q.hint}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {!practiceSubmitted && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100 cursor-pointer"
                >
                  Submit Practice Sheet
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: ADAPTIVE 60% TOPIC MASTERY QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              <FileQuestion className="w-3.5 h-3.5 text-amber-600" />
              <span>Adaptive Topic Mastery Assessment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {topic.name} — Mastery Quiz
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Answer all 10 questions. <strong>Core Rule:</strong> You must score at least <strong>60%</strong> to advance and unlock the next topic in the syllabus.
            </p>

            {/* Quiz Result View if submitted */}
            {quizSubmitted && quizResult && (
              <div
                className={`p-6 rounded-3xl border-2 space-y-4 ${
                  quizResult.passed
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {quizResult.passed ? (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                        ✓
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-xl">
                        ✗
                      </div>
                    )}
                    <div>
                      <div className="text-xl font-extrabold">
                        {quizResult.scorePercentage}% Score ({quizResult.correctCount}/{quizResult.totalQuestions} Correct)
                      </div>
                      <div className="text-xs font-semibold">
                        {quizResult.passed ? 'TOPIC MASTERED · NEXT TOPIC UNLOCKED!' : 'MASTERY THRESHOLD (>= 60%) NOT MET'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRetakeQuiz}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>

                    {quizResult.passed && onNextTopic && (
                      <button
                        onClick={onNextTopic}
                        className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <span>Continue to Next Topic</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs leading-relaxed font-medium">
                  {quizResult.metacognitiveFeedback}
                </p>

                {/* Weak concepts & recommendations if below 60% */}
                {!quizResult.passed && quizResult.weakConcepts.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-2 text-xs">
                    <h4 className="font-bold text-rose-800 uppercase tracking-wider">
                      Concepts Requiring Revision:
                    </h4>
                    <ul className="space-y-1 text-slate-700 pl-2">
                      {quizResult.revisionRecommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('learn')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                      >
                        ← Return to Learning Material to Revise
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 10 Questions Form */}
          <form onSubmit={handleQuizSubmit} className="space-y-4">
            {quizQuestions.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Question {idx + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = q.correctOptionIndex === optIdx;

                      return (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : isSelected
                                ? 'bg-rose-50 border-rose-300 text-rose-900'
                                : 'bg-white border-slate-200 text-slate-500 opacity-60'
                              : isSelected
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz_${q.id}`}
                            disabled={quizSubmitted}
                            checked={isSelected}
                            onChange={() => handleQuizAnswerSelect(q.id, optIdx)}
                            className="text-indigo-600 focus:ring-indigo-600"
                          />
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />
                          )}
                          {quizSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 ml-auto shrink-0" />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Show explanation after submission */}
                  {quizSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950">
                      <strong className="text-indigo-800">Explanation: </strong>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {!quizSubmitted && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={quizLoading}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-md shadow-amber-100 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {quizLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluating Mastery...</span>
                    </>
                  ) : (
                    <span>Submit Mastery Quiz (10 Questions)</span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 4: QUICK REVISION */}
      {activeTab === 'revision' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <FileText className="w-3.5 h-3.5" />
            <span>C. Quick Revision Notes</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            {topic.name} — Summary & Formulas
          </h2>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Key Takeaways
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {topic.revisionNotes.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {topic.revisionNotes.formulasAndRules.length > 0 && (
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Formulas & Ground Rules
                </h3>
                <div className="space-y-1 font-mono text-xs text-indigo-800 font-bold">
                  {topic.revisionNotes.formulasAndRules.map((rule, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white border border-indigo-200">
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topic.revisionNotes.commonMistakes.length > 0 && (
              <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-2">
                <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Common Mistakes to Avoid
                </h3>
                <div className="space-y-2">
                  {topic.revisionNotes.commonMistakes.map((cm, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="text-rose-700 font-semibold">❌ Mistake: {cm.mistake}</div>
                      <div className="text-emerald-700 font-semibold">✓ Correction: {cm.correction}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: AI TUTOR DOUBT SOLVER */}
      {activeTab === 'ai' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
                <MessageSquareCode className="w-3.5 h-3.5" />
                <span>AI Doubt Solver companion</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Ask StudyBuddy about "{topic.name}"
              </h2>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Language:</span>
              {(['English', 'Hindi', 'Hinglish'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setAiLanguage(lang)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    aiLanguage === lang
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {aiChat.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white ml-8 sm:ml-16 rounded-br-none'
                    : 'bg-slate-100 text-slate-800 mr-8 sm:mr-16 rounded-bl-none whitespace-pre-wrap'
                }`}
              >
                <div className="font-bold text-[10px] mb-1 opacity-80 uppercase tracking-wider">
                  {msg.role === 'user' ? 'You' : 'StudyBuddy AI'}
                </div>
                {msg.text}
              </div>
            ))}
            {aiLoading && (
              <div className="p-4 rounded-2xl bg-slate-100 text-slate-500 text-xs flex items-center gap-2 mr-16">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>StudyBuddy AI is thinking step-by-step in {aiLanguage}...</span>
              </div>
            )}
          </div>

          {/* Question Input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiDoubt()}
              placeholder={`Ask any doubt about ${topic.name} in ${aiLanguage}...`}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
            />
            <button
              onClick={() => handleSendAiDoubt()}
              disabled={aiLoading || !aiQuestion.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
