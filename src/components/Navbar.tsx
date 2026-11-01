import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  MessageSquareCode,
  FileText,
  Users,
  BarChart3,
  User,
  LogOut,
  Flame,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onOpenTextbookHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenTextbookHub,
}) => {
  const { student, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'doubt-solver', label: 'AI Doubt Solver', icon: MessageSquareCode },
    { id: 'short-notes', label: 'Quick Notes', icon: FileText },
    { id: 'community', label: 'Peer Community', icon: Users },
    { id: 'analytics', label: 'My Progress', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNav = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav(student ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  Study<span className="text-indigo-600">Buddy</span>
                </span>
                {student && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {student.selectedClass}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Adaptive Learning · Classes 6–10
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          {student ? (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => handleNav('landing')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 cursor-pointer"
              >
                Sign In / Join Free
              </button>
            </div>
          )}

          {/* Right section: streak + user or CTA */}
          <div className="flex items-center gap-3">
            {onOpenTextbookHub && (
              <button
                onClick={onOpenTextbookHub}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>NCERT Books</span>
              </button>
            )}

            {student ? (
              <div className="flex items-center gap-2">
                <div
                  title="3-day learning streak!"
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>3 Days</span>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900">{student.fullName}</div>
                  <div className="text-[10px] text-slate-500">{student.selectedClass}</div>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="md:hidden inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            {student && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {student && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
