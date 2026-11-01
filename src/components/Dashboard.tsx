import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useProgress } from '../context/ProgressContext.tsx';
import { CURRICULUM_DATA, getChapterTopics } from '../data/curriculumData.ts';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Flame,
  Award,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Target,
  Play,
  Calculator,
  Atom,
  Globe,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface DashboardProps {
  onSelectSubject: (subjectId: string) => void;
  onOpenTopic: (topicId: string) => void;
  onNavigate: (view: string) => void;
  onOpenTextbookHub?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectSubject,
  onOpenTopic,
  onNavigate,
  onOpenTextbookHub,
}) => {
  const { student } = useAuth();
  const {
    completedTopicIds,
    masteredTopicIds,
    learnedTopicIds,
    quizAttempts,
    isTopicMastered,
    isTopicLearned,
    isTopicUnlocked,
  } = useProgress();

  if (!student) return null;

  const subjects = CURRICULUM_DATA[student.selectedClass] || [];

  // Calculate actual statistics across all subjects of the student's selected class
  let totalTopics = 0;
  let masteredCount = 0;
  let inProgressCount = 0;
  let lockedCount = 0;

  // Track first uncompleted topic to feature as "Continue Learning"
  let firstUnfinishedTopic: {
    topicId: string;
    topicName: string;
    chapterName: string;
    subjectName: string;
    subjectId: string;
  } | null = null;

  subjects.forEach((sub) => {
    sub.chapters.forEach((ch) => {
      const topics = getChapterTopics(ch);
      topics.forEach((top, idx) => {
        totalTopics++;
        const isMastered = isTopicMastered(top.id);
        const prevTopic = idx > 0 ? topics[idx - 1] : undefined;
        const isUnlocked = isTopicUnlocked(top.id, ch.order, top.order, prevTopic?.id);

        if (isMastered) {
          masteredCount++;
        } else if (isUnlocked) {
          inProgressCount++;
          if (!firstUnfinishedTopic) {
            firstUnfinishedTopic = {
              topicId: top.id,
              topicName: top.name,
              chapterName: ch.name,
              subjectName: sub.name,
              subjectId: sub.id,
            };
          }
        } else {
          lockedCount++;
        }
      });
    });
  });

  const completedCount = masteredCount;
  const overallPercentage =
    totalTopics > 0 ? Math.min(100, Math.round((masteredCount / totalTopics) * 100)) : 0;

  // Average quiz score
  const avgQuizScore =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / quizAttempts.length
        )
      : 0;

  // Collect weak concepts from failed quiz attempts (<= 60%)
  const weakConceptsMap = new Map<string, number>();
  quizAttempts.forEach((attempt) => {
    if (!attempt.passed && Array.isArray(attempt.weakConcepts)) {
      attempt.weakConcepts.forEach((wc) => {
        weakConceptsMap.set(wc, (weakConceptsMap.get(wc) || 0) + 1);
      });
    }
  });
  const weakConceptsList = Array.from(weakConceptsMap.entries()).map(([concept, count]) => ({
    concept,
    count,
  }));

  // Icon helper
  const getSubjectIcon = (name: string) => {
    switch (name) {
      case 'Mathematics':
        return Calculator;
      case 'Science':
        return Atom;
      case 'Social Studies':
        return Globe;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enrolled in {student.selectedClass}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {student.fullName}!
          </h1>
          <p className="mt-2 text-sm text-indigo-100 leading-relaxed">
            "Every student learns differently. StudyBuddy helps every student learn at their own pace."
            Score above 60% on your topic sets to unlock advanced pathways!
          </p>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Overall Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Overall Progress
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-600">{overallPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Completed Topics */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{completedCount}</div>
          <span className="text-[11px] text-slate-500 mt-1">of {totalTopics} topics</span>
        </div>

        {/* Topics In Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{inProgressCount}</div>
          <span className="text-[11px] text-indigo-600 font-medium mt-1">Ready to study</span>
        </div>

        {/* Locked Topics */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Locked</span>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-700">{lockedCount}</div>
          <span className="text-[11px] text-slate-400 mt-1">Needs &gt;60% pass</span>
        </div>

        {/* Avg Quiz Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Quiz Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {avgQuizScore > 0 ? `${avgQuizScore}%` : '—'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">{quizAttempts.length} quizzes taken</span>
        </div>

        {/* Learning Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">3 Days</div>
          <span className="text-[11px] text-amber-700 font-medium mt-1">Consistency pays!</span>
        </div>
      </div>

      {/* Continue Learning Card */}
      {firstUnfinishedTopic ? (
        <div className="p-6 rounded-3xl bg-white border-2 border-indigo-600/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                Continue Learning
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {(firstUnfinishedTopic as any).subjectName} · {(firstUnfinishedTopic as any).chapterName}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{(firstUnfinishedTopic as any).topicName}</h3>
            <p className="text-xs text-slate-600">
              Pick up right where you left off with step-by-step explanations and active practice.
            </p>
          </div>
          <button
            onClick={() => onOpenTopic((firstUnfinishedTopic as any).topicId)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Topic</span>
          </button>
        </div>
      ) : null}

      {/* NCERT Textbooks Grounding Banner */}
      {onOpenTextbookHub && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <BookOpen className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Verified NCERT Curriculum
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>100% PDF Grounded</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Official Textbook Library &amp; Page-by-Page Grounding
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Inspect attached NCERT PDFs for Mathematics, Social Science &amp; English with authentic exercises, page citations, and live AI extraction.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenTextbookHub}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-indigo-50 transition cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Open Textbook Hub</span>
          </button>
        </div>
      )}

      {/* 4 Subject Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Class Subjects</h2>
            <p className="text-xs text-slate-500">
              NCERT aligned curriculum for {student.selectedClass}
            </p>
          </div>
          <button
            onClick={() => onNavigate('subjects')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Chapters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((sub) => {
            const Icon = getSubjectIcon(sub.name);

            // Compute subject-level completion
            let subTotal = 0;
            let subCompleted = 0;
            sub.chapters.forEach((ch) => {
              const topics = getChapterTopics(ch);
              topics.forEach((t) => {
                subTotal++;
                if (isTopicMastered(t.id)) subCompleted++;
              });
            });
            const subPercent = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sub.tagline}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Progress:</span>
                      <span className="font-bold text-slate-900">
                        {subCompleted}/{subTotal} Topics ({subPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${subPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectSubject(sub.id)}
                  className="mt-6 w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Chapters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Sections: Weak Concepts & Recent Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Topics Requiring Revision / Weak Concepts */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Topics Requiring Revision</h3>
              <p className="text-xs text-slate-500">
                Concepts flagged from quizzes where score was &le; 60%
              </p>
            </div>
          </div>

          {weakConceptsList.length > 0 ? (
            <div className="space-y-3">
              {weakConceptsList.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900">{item.concept}</span>
                    <p className="text-[11px] text-amber-700">Missed in {item.count} quiz attempt(s)</p>
                  </div>
                  <button
                    onClick={() => onNavigate('short-notes')}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white text-amber-800 border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
                  >
                    Quick Revise
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="font-medium text-slate-700">No weak concepts detected!</p>
              <p className="text-slate-500 mt-0.5">Keep learning and attempting topic set quizzes.</p>
            </div>
          )}
        </div>

        {/* Daily Learning Goals & Achievements */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Learning Goals</h3>
              <p className="text-xs text-slate-500">Consistency leads to permanent retention</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-medium text-slate-700">Complete 1 topic in Mathematics</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-medium text-slate-700">Ask 1 doubt to StudyBuddy AI Tutor</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              <span className="font-medium text-slate-600">
                Achieve &gt; 60% on your next Topic Set assessment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
