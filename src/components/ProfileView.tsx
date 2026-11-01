import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useProgress } from '../context/ProgressContext.tsx';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Flame,
  ShieldCheck,
  RotateCcw,
  LogOut,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { student, logout } = useAuth();
  const { resetProgress, completedTopicIds, quizAttempts } = useProgress();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!student) return null;

  const handleReset = async () => {
    await resetProgress();
    setResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-indigo-100">
            {student.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{student.fullName}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{student.email}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mt-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{student.selectedClass} Student</span>
            </div>
          </div>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Learning progress and quiz attempts reset successfully for testing!</span>
        </div>
      )}

      {/* Account Details Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Student Profile Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Full Name</span>
            <p className="text-sm font-bold text-slate-900">{student.fullName}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Email Address</span>
            <p className="text-sm font-bold text-slate-900">{student.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Enrolled Class</span>
            <p className="text-sm font-bold text-indigo-600">{student.selectedClass}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Study Streak</span>
            <p className="text-sm font-bold text-amber-600 flex items-center gap-1">
              <span>3 Days Active</span>
              <Flame className="w-4 h-4 fill-amber-500" />
            </p>
          </div>
        </div>
      </div>

      {/* Strict Class Rule Notice Card */}
      <div className="p-6 rounded-3xl bg-indigo-50/60 border-2 border-indigo-200 text-xs text-indigo-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Class Selection Integrity Policy</span>
        </div>
        <p className="leading-relaxed text-indigo-900">
          To protect academic continuity and maintain your 60% Earn-to-Advance pathways, class
          selection is locked during your active learning session. A "Change Class" button is
          intentionally not shown in your dashboard or profile.
        </p>
        <p className="text-indigo-800 font-medium">
          If you are moving to a new grade, please log out to the login screen where returning students
          can select their updated class before entering the dashboard.
        </p>
      </div>

      {/* Account Actions */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Testing & Session Controls
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          {resetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer"
              >
                Confirm Reset Progress
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Topic Progress & Quizzes</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
