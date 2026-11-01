import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ProgressProvider, useProgress } from './context/ProgressContext.tsx';
import {
  CURRICULUM_DATA,
  getChapterTopics,
  getNextTopicInChapter,
  getPrevTopicInChapter,
} from './data/curriculumData.ts';
import { GradeClass, TopicSet, Chapter, Subject, Topic } from './types/curriculum.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { SubjectView } from './components/SubjectView.tsx';
import { ChapterView } from './components/ChapterView.tsx';
import { TopicLearningView } from './components/TopicLearningView.tsx';
import { QuizModal } from './components/QuizModal.tsx';
import { DoubtSolverView } from './components/DoubtSolverView.tsx';
import { ShortNotesView } from './components/ShortNotesView.tsx';
import { CommunityView } from './components/CommunityView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { TextbookHubModal } from './components/TextbookHubModal.tsx';

function MainApp() {
  const { student } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialClass, setAuthInitialClass] = useState<GradeClass>('Class 6');
  const [textbookHubOpen, setTextbookHubOpen] = useState(false);
  const [selectedTopicTab, setSelectedTopicTab] = useState<
    'learn' | 'practice' | 'quiz' | 'revision' | 'ai'
  >('learn');

  // Navigation targets
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Active Quiz Modal
  const [activeQuiz, setActiveQuiz] = useState<{
    isOpen: boolean;
    topic: Topic | null;
    topicSet: TopicSet | null;
    chapterId: string | null;
    nextTopicId?: string | null;
  }>({
    isOpen: false,
    topic: null,
    topicSet: null,
    chapterId: null,
    nextTopicId: null,
  });

  // Switch to dashboard automatically when user logs in
  useEffect(() => {
    if (student && currentView === 'landing') {
      setCurrentView('dashboard');
    } else if (!student && currentView !== 'landing') {
      setCurrentView('landing');
    }
  }, [student]);

  const handleSelectClassDemo = (grade: GradeClass) => {
    setAuthInitialClass(grade);
    setAuthModalOpen(true);
  };

  const handleOpenSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setCurrentView('subject');
  };

  const handleOpenChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setCurrentView('chapter');
  };

  const handleOpenTopic = (
    topicId: string,
    initialTab: 'learn' | 'practice' | 'quiz' | 'revision' | 'ai' = 'learn'
  ) => {
    setSelectedTopicId(topicId);
    setSelectedTopicTab(initialTab);
    setCurrentView('topic');
  };

  // Find active subject, chapter, topic entities
  const studentClass = student?.selectedClass || 'Class 6';
  const subjects = CURRICULUM_DATA[studentClass] || [];
  const currentSubject: Subject | undefined =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  let currentChapter: Chapter | undefined;
  if (currentSubject) {
    currentChapter =
      currentSubject.chapters.find((c) => c.id === selectedChapterId) ||
      currentSubject.chapters[0];
  }

  // Find topic across all chapters of current subject (or all subjects)
  let foundTopic: Topic | undefined;
  let topicSubjectName = currentSubject?.name || 'Mathematics';
  let topicChapterName = currentChapter?.name || 'Chapter 1';

  if (selectedTopicId) {
    for (const sub of subjects) {
      for (const ch of sub.chapters) {
        const topics = getChapterTopics(ch);
        const t = topics.find((item) => item.id === selectedTopicId);
        if (t) {
          foundTopic = t;
          topicSubjectName = sub.name;
          topicChapterName = ch.name;
          currentChapter = ch;
          break;
        }
      }
      if (foundTopic) break;
    }
  }

  // Fallback first topic if on topic view but none found
  if (!foundTopic && subjects.length > 0 && subjects[0].chapters.length > 0) {
    const firstTopics = getChapterTopics(subjects[0].chapters[0]);
    if (firstTopics.length > 0) {
      foundTopic = firstTopics[0];
      topicSubjectName = subjects[0].name;
      topicChapterName = subjects[0].chapters[0].name;
      currentChapter = subjects[0].chapters[0];
    }
  }

  // Find next/prev topic in currentChapter
  let nextTopicInChapter: Topic | undefined;
  let prevTopicInChapter: Topic | undefined;
  if (currentChapter && foundTopic) {
    nextTopicInChapter = getNextTopicInChapter(currentChapter, foundTopic.id);
    prevTopicInChapter = getPrevTopicInChapter(currentChapter, foundTopic.id);
  }

  const handleStartQuiz = (topicOrTopicSet: Topic | TopicSet, chapterId?: string) => {
    if (
      'masteryQuiz' in topicOrTopicSet ||
      'learn' in topicOrTopicSet ||
      !('setNumber' in topicOrTopicSet)
    ) {
      const topic = topicOrTopicSet as Topic;
      let nextTopic: Topic | undefined;
      if (currentChapter) {
        nextTopic = getNextTopicInChapter(currentChapter, topic.id);
      }
      setActiveQuiz({
        isOpen: true,
        topic,
        topicSet: null,
        chapterId: currentChapter?.id || '',
        nextTopicId: nextTopic?.id || null,
      });
    } else {
      setActiveQuiz({
        isOpen: true,
        topic: null,
        topicSet: topicOrTopicSet as TopicSet,
        chapterId: chapterId || '',
        nextTopicId: null,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenTextbookHub={() => setTextbookHubOpen(true)}
      />

      <main className="flex-1">
        {/* Landing View */}
        {currentView === 'landing' && (
          <LandingPage
            onOpenAuth={() => setAuthModalOpen(true)}
            onSelectClassDemo={handleSelectClassDemo}
          />
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <Dashboard
            onSelectSubject={handleOpenSubject}
            onOpenTopic={handleOpenTopic}
            onNavigate={(view) => setCurrentView(view)}
            onOpenTextbookHub={() => setTextbookHubOpen(true)}
          />
        )}

        {/* Subjects Listing View */}
        {currentView === 'subjects' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {studentClass} NCERT Curriculum
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">Select a Subject to Study</h1>
              <p className="text-xs text-slate-500 mt-1">
                Every chapter contains 3 Topic Sets structured in groups of three.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleOpenSubject(sub.id)}
                  className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">
                      {sub.chapters.length} Chapter(s)
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500">{sub.tagline}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
                    →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subject Detail View */}
        {currentView === 'subject' && currentSubject && (
          <SubjectView
            subject={currentSubject}
            onBack={() => setCurrentView('subjects')}
            onSelectChapter={handleOpenChapter}
          />
        )}

        {/* Chapter Detail View (Topic Sets 1, 2, 3) */}
        {currentView === 'chapter' && currentChapter && (
          <ChapterView
            chapter={currentChapter}
            subjectName={currentSubject?.name || 'Subject'}
            onBack={() => setCurrentView('subject')}
            onOpenTopic={handleOpenTopic}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {/* Topic Learning View (5 Sections) */}
        {currentView === 'topic' && foundTopic && (
          <TopicLearningView
            topic={foundTopic}
            subjectName={topicSubjectName}
            chapterName={topicChapterName}
            initialTab={selectedTopicTab}
            nextTopicId={nextTopicInChapter?.id}
            onBack={() => setCurrentView('chapter')}
            onNextTopic={
              nextTopicInChapter
                ? () => handleOpenTopic(nextTopicInChapter!.id, 'learn')
                : undefined
            }
            onPrevTopic={
              prevTopicInChapter
                ? () => handleOpenTopic(prevTopicInChapter!.id, 'learn')
                : undefined
            }
          />
        )}

        {/* Dedicated Gemini AI Doubt Solver View */}
        {currentView === 'doubt-solver' && <DoubtSolverView />}

        {/* Short Notes View */}
        {currentView === 'short-notes' && (
          <ShortNotesView onOpenTopic={handleOpenTopic} />
        )}

        {/* Peer Community View */}
        {currentView === 'community' && <CommunityView />}

        {/* Analytics & Progress View */}
        {currentView === 'analytics' && (
          <AnalyticsView
            onNavigateToNotes={() => setCurrentView('short-notes')}
            onNavigateToDoubtSolver={() => setCurrentView('doubt-solver')}
          />
        )}

        {/* Profile View */}
        {currentView === 'profile' && <ProfileView />}
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialClass={authInitialClass}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Active Quiz Modal */}
      {activeQuiz.isOpen && (activeQuiz.topic || activeQuiz.topicSet) && (
        <QuizModal
          topic={activeQuiz.topic}
          topicSet={activeQuiz.topicSet}
          chapterId={activeQuiz.chapterId || ''}
          nextTopicId={activeQuiz.nextTopicId}
          isOpen={activeQuiz.isOpen}
          onClose={() =>
            setActiveQuiz({
              isOpen: false,
              topic: null,
              topicSet: null,
              chapterId: null,
              nextTopicId: null,
            })
          }
          onNavigateToNotes={() => setCurrentView('short-notes')}
          onNavigateToDoubtSolver={() => setCurrentView('doubt-solver')}
          onNextTopic={
            activeQuiz.nextTopicId
              ? () => {
                  const targetId = activeQuiz.nextTopicId!;
                  setActiveQuiz({
                    isOpen: false,
                    topic: null,
                    topicSet: null,
                    chapterId: null,
                    nextTopicId: null,
                  });
                  handleOpenTopic(targetId, 'learn');
                }
              : undefined
          }
        />
      )}

      {/* NCERT Textbook & PDF Grounding Hub Modal */}
      <TextbookHubModal
        isOpen={textbookHubOpen}
        onClose={() => setTextbookHubOpen(false)}
        onSelectSubject={handleOpenSubject}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <MainApp />
      </ProgressProvider>
    </AuthProvider>
  );
}
