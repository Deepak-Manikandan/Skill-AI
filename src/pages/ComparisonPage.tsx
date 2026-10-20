import React from 'react';
import { HistoryItem } from '../types';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Trash2,
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface ComparisonPageProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onNavigateToMatcher: () => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  history,
  onClearHistory,
  onNavigateToMatcher
}) => {
  // Find highest scoring job
  const topMatch = history.length > 0
    ? [...history].sort((a, b) => b.score - a.score)[0]
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              Multi-Role Resume Comparison
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Target Job Comparison Matrix
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Compare your resume’s alignment across multiple job descriptions to find where your natural profile matches best.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="px-3.5 py-2 bg-rose-900/60 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Records</span>
              </button>
            )}
            <button
              onClick={onNavigateToMatcher}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Compare Another Job</span>
            </button>
          </div>
        </div>

        {/* Highest match highlight */}
        {topMatch && (
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Strongest Alignment: </span>
              <strong className="text-white">{topMatch.jobTitle}</strong>
              <span className="text-emerald-400 font-bold ml-1.5">({topMatch.score}% match)</span>
            </div>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
          <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No Job Comparisons Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Analyze target job descriptions in the Resume Matcher to log and compare your match scores side-by-side here.
          </p>
          <button
            onClick={onNavigateToMatcher}
            className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Start First Match Analysis
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Analyzed Positions ({history.length})
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {history.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-extrabold text-base shrink-0 shadow-xs ${
                    item.score >= 70
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : item.score >= 40
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    <span>{item.score}%</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Match
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.jobTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.matchedCount} matched skills
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-rose-600 font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        {item.missingCount} missing
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={onNavigateToMatcher}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View in Matcher</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
