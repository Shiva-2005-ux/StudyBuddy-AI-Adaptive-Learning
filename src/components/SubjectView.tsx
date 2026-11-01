import React from 'react';
import { Subject } from '../types/curriculum.ts';
import { useProgress } from '../context/ProgressContext.tsx';
import { getChapterTopics } from '../data/curriculumData.ts';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle2, Award, FileText } from 'lucide-react';

interface SubjectViewProps {
  subject: Subject;
  onBack: () => void;
  onSelectChapter: (chapterId: string) => void;
}

export const SubjectView: React.FC<SubjectViewProps> = ({ subject, onBack, onSelectChapter }) => {
  const { isTopicLearned, isTopicMastered } = useProgress();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Subjects</span>
      </button>

      {/* Subject Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {subject.grade} NCERT Curriculum
              </span>
              {subject.pdfFilename && (
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>PDF Grounded</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {subject.name}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {subject.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Chapters ({subject.chapters.length})
          </h2>
          <span className="text-xs text-slate-400">
            60% score required on each topic quiz to unlock the next
          </span>
        </div>

        {subject.chapters.map((ch) => {
          const topics = getChapterTopics(ch);
          const chTotal = topics.length;
          const chLearned = topics.filter((t) => isTopicLearned(t.id)).length;
          const chMastered = topics.filter((t) => isTopicMastered(t.id)).length;
          const percent = chTotal > 0 ? Math.round((chMastered / chTotal) * 100) : 0;

          return (
            <div
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600">Chapter {ch.order}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {chTotal} Topics
                  </span>
                  {ch.pdfPageRange && (
                    <>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-[11px] text-slate-400">
                        {ch.pdfPageRange}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {ch.name}
                </h3>
                <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                  {ch.description}
                </p>

                {/* Topics preview pill list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {topics.map((t, idx) => {
                    const isM = isTopicMastered(t.id);
                    const isL = isTopicLearned(t.id);
                    return (
                      <span
                        key={t.id}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          isM
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isL
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        T{idx + 1}: {t.name.split(':')[0].substring(0, 24)}
                        {isM ? ' ✓' : ''}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    {chMastered}/{chTotal} Mastered
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {percent}% Complete
                  </div>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
