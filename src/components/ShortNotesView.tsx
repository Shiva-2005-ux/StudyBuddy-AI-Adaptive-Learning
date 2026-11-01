import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CURRICULUM_DATA, getChapterTopics } from '../data/curriculumData.ts';
import {
  FileText,
  Search,
  Sparkles,
  BookOpen,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ShortNotesViewProps {
  onOpenTopic: (topicId: string) => void;
}

export const ShortNotesView: React.FC<ShortNotesViewProps> = ({ onOpenTopic }) => {
  const { student } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!student) return null;

  const subjects = CURRICULUM_DATA[student.selectedClass] || [];

  // Filter topics
  const allNotes: {
    subjectName: string;
    chapterName: string;
    topicId: string;
    topicName: string;
    summary: string;
    takeaways: string[];
    commonMistakes: { mistake: string; correction: string }[];
    examTips: string[];
  }[] = [];

  subjects.forEach((sub) => {
    if (selectedSubjectId !== 'all' && sub.id !== selectedSubjectId) return;

    sub.chapters.forEach((ch) => {
      const topics = getChapterTopics(ch);
      topics.forEach((t) => {
        const matchesSearch =
          searchQuery.trim() === '' ||
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.revisionNotes?.keyTakeaways &&
            t.revisionNotes.keyTakeaways.some((k) =>
              k.toLowerCase().includes(searchQuery.toLowerCase())
            ));

        if (matchesSearch) {
          allNotes.push({
            subjectName: sub.name,
            chapterName: ch.name,
            topicId: t.id,
            topicName: t.name,
            summary: t.summary,
            takeaways: t.revisionNotes?.keyTakeaways || [],
            commonMistakes: t.revisionNotes?.commonMistakes || [],
            examTips: t.revisionNotes?.examBoosterTips || [],
          });
        }
      });
    });
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lightest Support First · Quick Revision</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {student.selectedClass} Quick Revision Notes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          High-yield formulas, key takeaways, and common mistakes distilled from NCERT textbooks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Subject Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedSubjectId === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedSubjectId === s.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas or concepts..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Revision Cards Grid */}
      <div className="space-y-4">
        {allNotes.length > 0 ? (
          allNotes.map((note) => (
            <div
              key={note.topicId}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-200 transition space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {note.subjectName} · {note.chapterName}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{note.topicName}</h3>
                </div>

                <button
                  onClick={() => onOpenTopic(note.topicId)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Topic</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Takeaways */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Key Points & Formulas</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                  {note.takeaways.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              {note.commonMistakes.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 text-xs space-y-1">
                  <h4 className="font-bold text-rose-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Watch Out (Common Mistake):</span>
                  </h4>
                  <p className="text-rose-900">❌ {note.commonMistakes[0].mistake}</p>
                  <p className="text-emerald-800 font-semibold">
                    ✅ {note.commonMistakes[0].correction}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200">
            No notes matched your search query. Try searching for "fractions", "motion", or "pronouns".
          </div>
        )}
      </div>
    </div>
  );
};
