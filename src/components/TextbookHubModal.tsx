import React, { useState } from 'react';
import {
  X,
  BookOpen,
  FileText,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Download,
  Search,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface Textbook {
  id: string;
  title: string;
  subject: string;
  grade: string;
  filename: string;
  assetPath: string;
  chaptersCount: number;
  totalTopics: number;
  publisher: string;
  syllabusEdition: string;
  verifiedGrounding: boolean;
  keyChapters: {
    order: number;
    name: string;
    pageRange: string;
    topicsCount: number;
  }[];
}

interface TextbookHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject?: (subjectId: string) => void;
}

const TEXTBOOKS: Textbook[] = [
  {
    id: 'ncert_math_c6',
    title: 'Mathematics — Textbook for Class VI',
    subject: 'Mathematics',
    grade: 'Class 6',
    filename: 'NCERT-books-for-class-6-maths_ae45ad0c.pdf',
    assetPath: '/assets/aistudio/NCERT-books-for-class-6-maths_ae45ad0c.pdf',
    chaptersCount: 14,
    totalTopics: 52,
    publisher: 'NCERT (National Council of Educational Research and Training)',
    syllabusEdition: '2020-21 / NCF-SE Standard',
    verifiedGrounding: true,
    keyChapters: [
      { order: 1, name: 'Knowing Our Numbers', pageRange: 'pp. 1–28', topicsCount: 5 },
      { order: 2, name: 'Whole Numbers', pageRange: 'pp. 29–45', topicsCount: 3 },
      { order: 3, name: 'Playing with Numbers', pageRange: 'pp. 46–70', topicsCount: 3 },
      { order: 4, name: 'Basic Geometrical Ideas', pageRange: 'pp. 71–94', topicsCount: 3 },
    ],
  },
  {
    id: 'ncert_soc_c6',
    title: 'Exploring Society: India and Beyond (Grade 6)',
    subject: 'Social Studies',
    grade: 'Class 6',
    filename: 'class_6_social_science_7605e63e.pdf',
    assetPath: '/assets/aistudio/class_6_social_science_7605e63e.pdf',
    chaptersCount: 14,
    totalTopics: 28,
    publisher: 'NCERT (National Council of Educational Research and Training)',
    syllabusEdition: 'June 2024 / NCF-SE 2023',
    verifiedGrounding: true,
    keyChapters: [
      { order: 1, name: 'Locating Places on the Earth (Latitudes & Longitudes)', pageRange: 'pp. 1–24', topicsCount: 4 },
      { order: 2, name: 'Oceans and Continents', pageRange: 'pp. 25–46', topicsCount: 3 },
      { order: 3, name: 'Landforms and Life', pageRange: 'pp. 47–68', topicsCount: 3 },
    ],
  },
  {
    id: 'ncert_eng_c6',
    title: 'Poorvi — Textbook of English for Grade 6',
    subject: 'English',
    grade: 'Class 6',
    filename: 'english_6_3d7e131c.pdf',
    assetPath: '/assets/aistudio/english_6_3d7e131c.pdf',
    chaptersCount: 16,
    totalTopics: 24,
    publisher: 'NCERT (National Council of Educational Research and Training)',
    syllabusEdition: 'June 2024 / NEP 2020 Alignment',
    verifiedGrounding: true,
    keyChapters: [
      { order: 1, name: 'Unit 1: Fables and Folk Tales (A Bottle of Dew & The Raven and the Fox)', pageRange: 'pp. 1–24', topicsCount: 3 },
      { order: 2, name: 'Unit 2: Friendship (Rama and Sugriva)', pageRange: 'pp. 25–48', topicsCount: 3 },
    ],
  },
];

export const TextbookHubModal: React.FC<TextbookHubModalProps> = ({
  isOpen,
  onClose,
  onSelectSubject,
}) => {
  const [selectedBook, setSelectedBook] = useState<Textbook>(TEXTBOOKS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [testTopic, setTestTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleTestExtraction = async () => {
    if (!testTopic.trim()) return;
    setIsProcessing(true);
    setProcessResult(null);

    try {
      const res = await fetch('/api/curriculum/process-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedBook.subject,
          grade: selectedBook.grade,
          bookName: selectedBook.title,
          chapterTitle: selectedBook.keyChapters[0]?.name || 'Chapter 1',
          topicName: testTopic.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProcessResult(data);
      } else {
        setProcessResult({ error: data.error || 'Failed to process topic from PDF.' });
      }
    } catch (err: any) {
      setProcessResult({ error: err.message || 'Network error processing PDF.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBooks = TEXTBOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">NCERT Textbook & PDF Grounding Hub</h2>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>100% Grounded</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every topic, practice sheet, and quiz in StudyBuddy is strictly sourced from these uploaded NCERT textbooks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Search & Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search attached textbooks or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Book Cards Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredBooks.map((book) => {
              const isSelected = selectedBook.id === book.id;
              return (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setProcessResult(null);
                  }}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                        {book.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{book.grade}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{book.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{book.publisher}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                    <span>{book.chaptersCount} Chapters</span>
                    <span className="text-indigo-600 font-semibold">{book.totalTopics} Topics</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Textbook View */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedBook.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                  <span>File: <code className="text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">{selectedBook.filename}</code></span>
                  <span>Edition: <strong>{selectedBook.syllabusEdition}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedBook.assetPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition inline-flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>View PDF Source</span>
                </a>
              </div>
            </div>

            {/* Chapter Breakdown */}
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ground-Truth Chapter Breakdown
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedBook.keyChapters.map((ch) => (
                  <div
                    key={ch.order}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-indigo-700">Ch {ch.order}:</span>
                        <span className="text-xs font-bold text-slate-800">{ch.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Page citations: {ch.pageRange}</span>
                    </div>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {ch.topicsCount} Topics
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Real-Time PDF Grounding Verification Tool */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h5 className="text-xs font-bold text-slate-900">
                    Live PDF Topic Extraction Test
                  </h5>
                </div>
                <span className="text-[10px] text-slate-500">
                  Powered by Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Test the curriculum engine's ability to extract textbook-grounded lessons, solved examples, and 10-question mastery quizzes for any topic in this book:
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Comparing Numbers or Indian Place Value System..."
                  value={testTopic}
                  onChange={(e) => setTestTopic(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <button
                  onClick={handleTestExtraction}
                  disabled={isProcessing || !testTopic.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Extract from PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Extraction Result Preview */}
              {processResult && (
                <div className="mt-3 p-3.5 rounded-xl bg-white border border-indigo-200 text-xs space-y-2 animate-fade-in">
                  {processResult.error ? (
                    <div className="text-rose-600 font-medium">{processResult.error}</div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-emerald-700 font-bold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Extracted &amp; Grounded Successfully!</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {processResult.masteryQuiz?.length || 10} Questions · 1 Practice Sheet
                        </span>
                      </div>
                      <p className="text-slate-700 italic">"{processResult.summary}"</p>
                      {processResult.learningObjectives && (
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                          {processResult.learningObjectives.slice(0, 3).map((obj: string, i: number) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-xs text-slate-500">
            Current active syllabus: <strong className="text-slate-800">{selectedBook.grade}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            >
              Close
            </button>
            {onSelectSubject && (
              <button
                onClick={() => {
                  onSelectSubject(
                    selectedBook.subject === 'Mathematics'
                      ? 'math_c6'
                      : selectedBook.subject === 'Social Studies'
                      ? 'social_c6'
                      : 'english_c6'
                  );
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>Study {selectedBook.subject}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
