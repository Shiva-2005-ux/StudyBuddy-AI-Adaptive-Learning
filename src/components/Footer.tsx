import React from 'react';
import { GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">StudyBuddy</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Every student learns differently. StudyBuddy helps every student learn at their own pace."
            </p>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Classes 6, 7, 8, 9, 10</span>
            </div>
          </div>

          {/* Pedagogy */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Adaptive Loop
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition">1. Learn (Step-by-step)</li>
              <li className="hover:text-white transition">2. Solve (Interactive Practice)</li>
              <li className="hover:text-white transition">3. Test (Topic-Set Assessment)</li>
              <li className="hover:text-white transition">4. Analyse (Metacognitive Feedback)</li>
              <li className="hover:text-white transition">5. Revise (Lightest Support First)</li>
              <li className="hover:text-white transition">6. Progress (&gt;60% Mastery Gate)</li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Subjects Covered
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition">NCERT Mathematics</li>
              <li className="hover:text-white transition">NCERT Science</li>
              <li className="hover:text-white transition">NCERT Social Studies</li>
              <li className="hover:text-white transition">NCERT English</li>
            </ul>
          </div>

          {/* AI Support */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Multi-Language AI
            </h4>
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              Doubt solver powered by Gemini API supports English, Hindi (हिंदी), and Hinglish.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-cheating Answer Validation</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} StudyBuddy. Built for Indian classrooms and curious young minds.</p>
          <div className="flex gap-6">
            <span>Learn at Your Pace. Grow with Confidence.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
