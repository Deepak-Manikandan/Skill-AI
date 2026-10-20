import React from 'react';
import { FileText, History, Sparkles, Lightbulb, MapPin, CheckCircle, BarChart3 } from 'lucide-react';
import { AppPage } from '../types';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  hasResult: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  hasResult,
  historyCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('matcher')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
              SkillMatch<span className="text-indigo-600">AI</span>
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Resume & Job Matcher
            </div>
          </div>
        </div>

        {/* Page Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
          
          <button
            onClick={() => onNavigate('matcher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentPage === 'matcher'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Matcher</span>
          </button>

          {hasResult && (
            <button
              onClick={() => onNavigate('results')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                currentPage === 'results'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Results</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('suggestions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentPage === 'suggestions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Suggestions</span>
          </button>

          <button
            onClick={() => onNavigate('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentPage === 'roadmap'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span>Roadmap</span>
          </button>

          <button
            onClick={() => onNavigate('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentPage === 'comparison'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Compare</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

      </div>
    </header>
  );
};
