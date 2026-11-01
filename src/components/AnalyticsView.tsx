import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useProgress } from '../context/ProgressContext.tsx';
import { CURRICULUM_DATA, getChapterTopics } from '../data/curriculumData.ts';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Lock,
  Flame,
  Award,
  Sparkles,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

interface AnalyticsViewProps {
  onNavigateToNotes: () => void;
  onNavigateToDoubtSolver: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onNavigateToNotes,
  onNavigateToDoubtSolver,
}) => {
  const { student } = useAuth();
  const {
    completedTopicIds,
    masteredTopicIds,
    quizAttempts,
    isTopicMastered,
    isTopicUnlocked,
  } = useProgress();

  if (!student) return null;

  const subjects = CURRICULUM_DATA[student.selectedClass] || [];

  let totalTopics = 0;
  let masteredCount = 0;
  let inProgressCount = 0;
  let lockedCount = 0;

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
        } else {
          lockedCount++;
        }
      });
    });
  });

  const completedCount = masteredCount;
  const overallPercentage =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Weak concepts collection
  const weakConceptMap = new Map<string, number>();
  quizAttempts.forEach((attempt) => {
    if (!attempt.passed && Array.isArray(attempt.weakConcepts)) {
      attempt.weakConcepts.forEach((wc) => {
        weakConceptMap.set(wc, (weakConceptMap.get(wc) || 0) + 1);
      });
    }
  });
  const weakConcepts = Array.from(weakConceptMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  // Dynamic metacognitive feedback tailored to actual student data
  let personalizedMetacognitiveAdvice = '';
  if (completedCount === 0 && quizAttempts.length === 0) {
    personalizedMetacognitiveAdvice =
      'Welcome to StudyBuddy! Begin by studying your first topic in Mathematics or Science. Complete the practice questions to test your initial understanding.';
  } else if (weakConcepts.length > 0) {
    const topWeak = weakConcepts[0].name;
    personalizedMetacognitiveAdvice = `You understand the introductory concepts well, but "${topWeak}" needs more targeted practice. Let's revise that concept in Quick Notes or ask StudyBuddy AI before attempting your next quiz retake.`;
  } else if (quizAttempts.some((q) => q.passed)) {
    personalizedMetacognitiveAdvice =
      'Superb work! You have cleared your assessments with scores above 60%, successfully unlocking higher topic sets. Keep maintaining your 3-day learning streak!';
  } else {
    personalizedMetacognitiveAdvice =
      'You are making steady progress through the curriculum. Remember: StudyBuddy requires strictly greater than 60% (>60%) to earn progression to the next topic set.';
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Real-Time Learning Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Personalized Learning Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Tracking your topic mastery, quiz accuracy, and metacognitive improvement points for {student.selectedClass}.
        </p>
      </div>

      {/* Metacognitive Recommendation Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 via-teal-50 to-white border-2 border-indigo-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>StudyBuddy Metacognitive Feedback</span>
          </span>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            "{personalizedMetacognitiveAdvice}"
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={onNavigateToNotes}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition cursor-pointer"
          >
            Quick Notes
          </button>
          <button
            onClick={onNavigateToDoubtSolver}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
          >
            Ask AI
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Mastery Rate</span>
          <div className="text-3xl font-black text-indigo-600 mt-2">{overallPercentage}%</div>
          <p className="text-[11px] text-slate-500 mt-1">{completedCount} of {totalTopics} completed</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Quizzes Attempted</span>
          <div className="text-3xl font-black text-slate-900 mt-2">{quizAttempts.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {quizAttempts.filter((q) => q.passed).length} sets unlocked (&gt;60%)
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Learning Streak</span>
          <div className="text-3xl font-black text-amber-500 mt-2 flex items-center gap-1">
            <span>3</span>
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Days active this week</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Weak Concepts</span>
          <div className="text-3xl font-black text-rose-600 mt-2">{weakConcepts.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Targeted for revision</p>
        </div>
      </div>

      {/* Visual Progress Breakdown */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Topic State Distribution</h3>
        <p className="text-xs text-slate-500">
          Showing topics categorized by active status according to the 60% Earn-to-Advance rules
        </p>

        {/* Visual Progress Bar */}
        <div className="h-6 rounded-xl bg-slate-100 flex overflow-hidden p-1 gap-1">
          <div
            style={{ width: `${totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0}%` }}
            title={`Completed: ${completedCount}`}
            className="bg-emerald-500 rounded-lg h-full transition-all"
          />
          <div
            style={{ width: `${totalTopics > 0 ? (inProgressCount / totalTopics) * 100 : 0}%` }}
            title={`In Progress: ${inProgressCount}`}
            className="bg-indigo-500 rounded-lg h-full transition-all"
          />
          <div
            style={{ width: `${totalTopics > 0 ? (lockedCount / totalTopics) * 100 : 0}%` }}
            title={`Locked: ${lockedCount}`}
            className="bg-slate-300 rounded-lg h-full transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Completed ({completedCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="font-semibold text-slate-700">In Progress ({inProgressCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="font-semibold text-slate-700">Locked / Awaiting &gt;60% ({lockedCount})</span>
          </div>
        </div>
      </div>

      {/* Quiz History Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recent Quiz Assessment History</h3>

        {quizAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Topic Set</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Outcome</th>
                  <th className="p-3">Weak Concepts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quizAttempts.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{q.topicSetId}</td>
                    <td className="p-3 font-semibold">
                      {q.score}/{q.total} ({q.percentage}%)
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {q.passed ? 'PASSED (≥60%)' : 'RETRY (<60%)'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {q.passed ? 'Next Topic Unlocked 🎉' : 'Remains Locked (Needs ≥60%)'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {q.weakConcepts && q.weakConcepts.length > 0
                        ? q.weakConcepts.join(', ')
                        : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
            No quiz attempts recorded yet. Open a chapter and take your first topic set assessment!
          </div>
        )}
      </div>
    </div>
  );
};
