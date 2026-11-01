import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CURRICULUM_DATA } from '../data/curriculumData.ts';
import {
  MessageSquareCode,
  Send,
  Loader2,
  Sparkles,
  RotateCcw,
  BookOpen,
  Languages,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const DoubtSolverView: React.FC = () => {
  const { student } = useAuth();
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('Hinglish');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [customTopic, setCustomTopic] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: `Namaste ${student?.fullName || 'friend'}! I am StudyBuddy, your adaptive AI tutor. I am set to help you in ${student?.selectedClass || 'Class 6'}. You can ask any doubt in Mathematics, Science, Social Studies, or English. Which concept would you like to explore today?`,
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    setErrorMsg('');
    const userMsg = { role: 'user' as const, text: textToSend };
    setChatHistory((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/doubt-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          studentClass: student?.selectedClass || 'Class 6',
          subject: selectedSubject,
          topic: customTopic || 'General Chapter Concept',
          language,
          history: chatHistory,
        }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setChatHistory((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        const errorText =
          data.error || 'Failed to generate explanation. Please try asking again.';
        setErrorMsg(errorText);
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'model',
            text:
              data.fallbackReply ||
              `Could not complete response: ${errorText}. Please verify the Gemini API key in Settings > Secrets.`,
          },
        ]);
      }
    } catch (err: any) {
      setErrorMsg('Network error communicating with AI server.');
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Network issue. Your question was preserved—please click send again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setChatHistory([
      {
        role: 'model',
        text: `Chat refreshed! Ask any doubt in ${language} for ${student?.selectedClass || 'Class 6'} ${selectedSubject}.`,
      },
    ]);
  };

  const samplePrompts = [
    {
      label: 'Why is 60% not enough to pass in StudyBuddy?',
      prompt: 'Can you explain why StudyBuddy requires strictly greater than 60% to unlock the next set, and how this prevents cumulative learning gaps?',
    },
    {
      label: 'Fractions vs Decimals (Hinglish)',
      prompt: 'Mujhe Fractions aur Decimals ka connection simple Hinglish mein ek real-world pizza example ke saath samjhao.',
    },
    {
      label: 'Difference between Rotation and Revolution',
      prompt: 'Explain the difference between Earth rotation and revolution with a simple comparison table.',
    },
    {
      label: 'Active vs Passive Voice Trick',
      prompt: 'Give me an easy trick to identify Transitive verbs and convert sentences from Active to Passive voice.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Tutor · {student?.selectedClass || 'Class 6'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            StudyBuddy AI Doubt Solver
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Get step-by-step reasoning, real-life examples, and mistakes explained in English, Hindi, or Hinglish.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Control Strip: Language & Subject */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Subject Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 outline-none focus:border-indigo-600"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Social Studies">Social Studies</option>
            <option value="English">English</option>
          </select>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
            <Languages className="w-4 h-4 text-indigo-600" />
            <span>Language:</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['English', 'Hindi', 'Hinglish'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  language === lang
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'Hindi' ? 'हिंदी' : lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Quick Doubts */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Suggested Topics & Doubts:
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sp.prompt)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 text-xs font-medium transition cursor-pointer"
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Window */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col h-[520px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {chatHistory.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    SB
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 shadow-xs rounded-tl-none font-normal'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-700 font-semibold w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>StudyBuddy is preparing step-by-step reasoning in {language}...</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input Box */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask any question in ${language}... (e.g. "Explain with an example")`}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputQuery.trim()}
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition flex items-center gap-2 text-xs font-bold cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};
