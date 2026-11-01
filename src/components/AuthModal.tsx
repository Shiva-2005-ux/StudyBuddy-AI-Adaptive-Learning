import React, { useState } from 'react';
import { GradeClass } from '../types/curriculum.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { X, GraduationCap, AlertCircle, CheckCircle2, User, Mail, ShieldAlert, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClass?: GradeClass;
}

const AVAILABLE_CLASSES: GradeClass[] = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialClass = 'Class 6' }) => {
  const { loginOrRegister, loginWithGoogle, loginDemoStudent, loading } = useAuth();
  const [tab, setTab] = useState<'form' | 'demo'>('form');

  // Form states - EXACTLY 3 fields: Full Name, Email, Class Selection
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedClass, setSelectedClass] = useState<GradeClass>(initialClass);
  const [errorMsg, setErrorMsg] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      await loginOrRegister(fullName, email, selectedClass);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle(selectedClass);
      onClose();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || 'Google sign-in was not completed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoSelect = async (grade: GradeClass) => {
    setErrorMsg('');
    try {
      await loginDemoStudent(grade);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Demo login failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-white/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">StudyBuddy Student Entry</h2>
          </div>
          <p className="text-xs text-indigo-100">
            Sign in to access your class curriculum, adaptive quizzes, and AI doubt solver.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setTab('form')}
            className={`flex-1 py-3 text-xs font-bold transition text-center cursor-pointer border-b-2 ${
              tab === 'form'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Sign In / Register
          </button>
          <button
            onClick={() => setTab('demo')}
            className={`flex-1 py-3 text-xs font-bold transition text-center cursor-pointer border-b-2 ${
              tab === 'demo'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            One-Click Class Demos
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === 'form' ? (
            <div className="space-y-4">
              {/* Google Sign-in Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{googleLoading ? 'Signing in with Google...' : `Continue with Google (${selectedClass})`}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                  or enter credentials
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field 1: Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    1. Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                </div>

                {/* Field 2: Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    2. Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@school.edu or gmail"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                </div>

                {/* Field 3: Class Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      3. Select Class
                    </label>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Locked during session
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {AVAILABLE_CLASSES.map((cls) => (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        className={`py-2 rounded-xl text-xs font-bold transition text-center cursor-pointer border ${
                          selectedClass === cls
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {cls.replace('Class ', 'C')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Critical Class Rule Notice */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Class Rule:</strong> You can select or change your class only on this login screen.
                    Once logged in, all subjects and curriculum are locked to your class.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Entering...' : `Enter ${selectedClass} Dashboard`}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                Select any class below to immediately test the full student journey, locked topic sets,
                and quiz assessments:
              </p>
              {AVAILABLE_CLASSES.map((cls) => (
                <button
                  key={cls}
                  onClick={() => handleDemoSelect(cls)}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/50 hover:border-indigo-300 transition flex items-center justify-between text-left group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                        {cls} Student Profile
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Maths, Science, Social Studies & English syllabus
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
