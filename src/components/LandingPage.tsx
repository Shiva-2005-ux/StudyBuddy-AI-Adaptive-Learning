import React from 'react';
import { GradeClass } from '../types/curriculum.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  MessageSquare,
  Lock,
  Unlock,
  CheckCircle2,
  TrendingUp,
  Compass,
  PlayCircle,
  HelpCircle,
  Users2,
  Lightbulb,
  BookOpen,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: () => void;
  onSelectClassDemo: (grade: GradeClass) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onSelectClassDemo }) => {
  const { student } = useAuth();

  return (
    <div className="bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Adaptive Learning for Classes 6 to 10</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Learn at Your Pace. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600">
              Grow with Confidence.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            In every classroom, some students grasp a concept immediately while others need time.
            StudyBuddy adapts to your unique learning speed with mastery gates, targeted revision, and
            contextual doubt solving in English, Hindi, and Hinglish.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 hover:shadow-indigo-300 cursor-pointer"
            >
              <span>{student ? 'Go to Dashboard' : 'Start Learning Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectClassDemo('Class 6')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition shadow-xs cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-indigo-600" />
              <span>Explore Class 6 Demo</span>
            </button>
          </div>

          {/* Quick Class Selector Pills for Testing */}
          <div className="mt-10 pt-8 border-t border-slate-200/60 max-w-xl mx-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              One-Click Instant Student Demos by Class:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {(['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'] as GradeClass[]).map((grade) => (
                <button
                  key={grade}
                  onClick={() => onSelectClassDemo(grade)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition cursor-pointer"
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Adaptive Learning Cycle */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              The StudyBuddy Loop
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              The 6-Step Adaptive Learning Cycle
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              One connected loop instead of fragmented study apps. Every step diagnoses understanding and prepares you for what comes next.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                step: '1. Learn',
                title: 'Concepts & Video',
                desc: 'Step-by-step explanations, NCERT examples, definitions, and curated video lessons.',
                icon: BookOpen,
                color: 'bg-blue-50 text-blue-700 border-blue-200',
              },
              {
                step: '2. Solve',
                title: 'Active Practice',
                desc: 'Interactive MCQs, fill-in-blanks, and hints with instantaneous reasoning.',
                icon: BrainCircuit,
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              },
              {
                step: '3. Test',
                title: 'Topic Set Quiz',
                desc: 'Assessments given after every 3 topics to test genuine retention.',
                icon: ShieldCheck,
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              },
              {
                step: '4. Analyse',
                title: 'Metacognitive Insights',
                desc: 'Shows exactly where your thinking went wrong, not just a score mark.',
                icon: TrendingUp,
                color: 'bg-amber-50 text-amber-700 border-amber-200',
              },
              {
                step: '5. Revise',
                title: 'Targeted Revision',
                desc: 'Quick formula notes, common mistake warnings, and targeted weak-concept pointers.',
                icon: Compass,
                color: 'bg-rose-50 text-rose-700 border-rose-200',
              },
              {
                step: '6. Progress',
                title: '> 60% Mastery Gate',
                desc: 'Score strictly above 60% to unlock the next 3-topic set and advance.',
                icon: Unlock,
                color: 'bg-purple-50 text-purple-700 border-purple-200',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${item.color} flex flex-col justify-between transition hover:-translate-y-1 shadow-xs`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider">{item.step}</span>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Innovation: 60% Earn to Advance */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
                <Lock className="w-3.5 h-3.5" />
                <span>The Core StudyBuddy Innovation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                The 60% Earn-to-Advance Pathway
              </h2>
              <p className="text-base text-slate-600 mt-4 leading-relaxed">
                In standard classrooms, testing happens only at the end of the chapter — weeks after
                gaps have already formed. StudyBuddy organizes every chapter into compact sets of
                <strong> THREE topics</strong>.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Score &gt; 60% to Unlock the Next Set</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Achieving 61% or higher proves conceptual readiness. The next topic set immediately unlocks
                      with celebration and verified progress saved to your cloud profile.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Score 60% or Below Keeps Next Set Locked</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      60% is not sufficient to advance. Rather than leaving you confused in later chapters,
                      StudyBuddy pinpoints your exact weak concepts, recommends quick revision, and gives you a
                      fresh quiz retake.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Demonstration Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-xs font-semibold text-slate-500 uppercase">Interactive Progression Preview</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">Chapter 1</span>
              </div>

              <div className="space-y-4">
                {/* Set 1: Unlocked */}
                <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Unlock className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-slate-900">Topic Set 1 (Topics 1, 2, 3)</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      UNLOCKED
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Learn the 3 foundational topics, complete active practice, and take the topic set quiz.
                  </p>
                </div>

                {/* Score threshold illustration */}
                <div className="relative py-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-slate-300"></div>
                  </div>
                  <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-xs">
                    <span>Target: Score &gt; 60%</span>
                  </div>
                </div>

                {/* Set 2: Locked */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 opacity-90">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-bold text-slate-700">Topic Set 2 (Topics 4, 5, 6)</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                      LOCKED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    "Complete the previous topic set and score above 60% to unlock this section."
                  </p>
                </div>

                {/* Set 3: Locked */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 opacity-75">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-600">Topic Set 3 (Topics 7, 8, 9)</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      LOCKED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    "Complete the previous topic set and score above 60% to unlock this section."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multilingual AI Tutor & Lightest Support First */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Human-Centric AI
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              Hinglish-First Doubt Solving & "Lightest Support First"
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              We never overwhelm students with confusing tools. When you struggle, StudyBuddy recommends
              the lightest support that actually works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Level 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Quick Notes</h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                Often, a simple glance at a formula, a high-yield takeaway, or a common mistake warning is
                enough to self-correct. No heavy lectures required.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-indigo-600">
                Lightest & fastest intervention
              </div>
            </div>

            {/* Level 2 */}
            <div className="p-6 rounded-2xl border-2 border-indigo-600 bg-indigo-50/30 transition shadow-md flex flex-col relative">
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                Gemini AI
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. AI Doubt Solver</h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                Context-aware tutor that understands your exact class and topic. Explains step-by-step in
                <strong> English, Hindi (हिंदी), or Hinglish</strong> ("Dekho, fractions samajhne ke liye...").
              </p>
              <div className="mt-4 pt-4 border-t border-indigo-100 text-xs font-semibold text-indigo-700">
                Instant interactive tutor available 24/7
              </div>
            </div>

            {/* Level 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Peer Community</h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                Post academic doubts to fellow students in your class. Share alternative explanations and
                learn collaboratively in a safe, moderated environment where student emails are never exposed.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-teal-600">
                Peer-to-peer collaborative growth
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to master your syllabus at your own pace?
          </h2>
          <p className="mt-4 text-base text-indigo-100 max-w-xl mx-auto">
            Choose your class, study your first topic, and experience how 60% Earn-to-Advance builds genuine confidence.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onOpenAuth}
              className="px-8 py-3.5 rounded-xl text-base font-bold bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg transition cursor-pointer"
            >
              Get Started with StudyBuddy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
