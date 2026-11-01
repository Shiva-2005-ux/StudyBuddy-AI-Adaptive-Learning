import React, { useState } from 'react';
import { Chapter, Topic } from '../types/curriculum.ts';
import { useProgress } from '../context/ProgressContext.tsx';
import { getChapterTopics } from '../data/curriculumData.ts';
import {
  Lock,
  Unlock,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  Award,
  Play,
  FileQuestion,
  AlertCircle,
  Sparkles,
  PenTool,
  HelpCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface ChapterViewProps {
  chapter: Chapter;
  subjectName: string;
  onBack: () => void;
  onOpenTopic: (topicId: string, initialTab?: 'learn' | 'practice' | 'quiz') => void;
  onStartQuiz: (topic: Topic) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  subjectName,
  onBack,
  onOpenTopic,
  onStartQuiz,
}) => {
  const {
    isTopicLearned,
    isTopicMastered,
    isTopicUnlocked,
    getTopicHighestScore,
    getPracticeAttempt,
  } = useProgress();

  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const topics = getChapterTopics(chapter);
  const totalTopics = topics.length;
  const masteredCount = topics.filter((t) => isTopicMastered(t.id)).length;
  const learnedCount = topics.filter((t) => isTopicLearned(t.id)).length;
  const percentMastered = totalTopics > 0 ? Math.round((masteredCount / totalTopics) * 100) : 0;

  const handleTopicAccess = (
    topic: Topic,
    index: number,
    targetTab: 'learn' | 'practice' | 'quiz' = 'learn'
  ) => {
    const prevTopic = index > 0 ? topics[index - 1] : undefined;
    const unlocked = isTopicUnlocked(topic.id, chapter.order, topic.order, prevTopic?.id);

    if (!unlocked) {
      setLockedNotice(
        `Topic ${topic.order} is locked. Score at least 60% on the quiz for "${prevTopic?.name || 'the previous topic'}" to unlock it!`
      );
      setTimeout(() => setLockedNotice(null), 4500);
      return;
    }

    if (targetTab === 'quiz') {
      onStartQuiz(topic);
    } else {
      onOpenTopic(topic.id, targetTab);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {subjectName} Chapters</span>
      </button>

      {/* Chapter Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Chapter {chapter.order} · {subjectName}
              </span>
              {chapter.pdfSourceBook && (
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{chapter.pdfSourceBook}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {chapter.name}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {chapter.description}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Earn-to-Advance Rule:</strong> Score 60% or above in each topic mastery quiz to unlock the next topic.
              </span>
            </div>
          </div>

          {/* Chapter Mastery Metric Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center shrink-0 min-w-[180px]">
            <div className="text-3xl font-black text-indigo-600">
              {percentMastered}%
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              Chapter Mastery
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {masteredCount} of {totalTopics} Topics Mastered
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentMastered}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Locked Notice Alert Banner */}
      {lockedNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3 shadow-md animate-bounce">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Topic Locked
            </h4>
            <p className="text-sm font-semibold">{lockedNotice}</p>
          </div>
        </div>
      )}

      {/* Topic List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Chapter Topics & Progression ({totalTopics})
          </h2>
          <p className="text-xs text-slate-500">
            Study each topic, complete its practice sheet, and achieve &gt;= 60% on the quiz to advance.
          </p>
        </div>
      </div>

      {/* Sequential Topic Cards */}
      <div className="space-y-4">
        {topics.map((topic, index) => {
          const prevTopic = index > 0 ? topics[index - 1] : undefined;
          const unlocked = isTopicUnlocked(topic.id, chapter.order, topic.order, prevTopic?.id);
          const isLearned = isTopicLearned(topic.id);
          const isMastered = isTopicMastered(topic.id);
          const highestScore = getTopicHighestScore(topic.id);
          const practiceAttempt = getPracticeAttempt(topic.id);

          return (
            <div
              key={topic.id}
              className={`p-6 rounded-3xl border transition-all duration-200 overflow-hidden ${
                unlocked
                  ? isMastered
                    ? 'bg-white border-emerald-200 hover:border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                  : 'bg-slate-100/70 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Topic Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    {isMastered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>MASTERED ({highestScore}%)</span>
                      </span>
                    ) : isLearned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>LEARNED · QUIZ PENDING</span>
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                        <Lock className="w-3.5 h-3.5" />
                        <span>LOCKED</span>
                      </span>
                    )}

                    <span className="text-xs font-semibold text-slate-500">
                      Topic {topic.order} of {totalTopics}
                    </span>

                    {topic.pdfSource?.pageRange && (
                      <span className="text-[11px] text-slate-400">
                        · {topic.pdfSource.pageRange}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {topic.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {topic.summary}
                  </p>

                  {/* Practice sheet indicator */}
                  {practiceAttempt && (
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <PenTool className="w-3 h-3" />
                      <span>Practice completed: {practiceAttempt.score}/{practiceAttempt.totalMarks} marks ({practiceAttempt.percentage}%)</span>
                    </div>
                  )}

                  {!unlocked && prevTopic && (
                    <p className="text-[11px] text-amber-700 font-medium">
                      🔒 Pass the mastery quiz for "{prevTopic.name}" with &gt;= 60% to unlock this topic.
                    </p>
                  )}
                </div>

                {/* Action Buttons for this topic */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* Button 1: Learn Material */}
                  <button
                    onClick={() => handleTopicAccess(topic, index, 'learn')}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      unlocked
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Study Lesson</span>
                  </button>

                  {/* Button 2: Practice Sheet */}
                  <button
                    onClick={() => handleTopicAccess(topic, index, 'practice')}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      unlocked
                        ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Practice Sheet</span>
                  </button>

                  {/* Button 3: Mastery Quiz (60% Earn-to-Advance) */}
                  <button
                    onClick={() => handleTopicAccess(topic, index, 'quiz')}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                      unlocked
                        ? isMastered
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <FileQuestion className="w-3.5 h-3.5" />
                    <span>{isMastered ? 'Retake Quiz' : 'Mastery Quiz (60%)'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
