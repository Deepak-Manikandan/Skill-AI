import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface HistoryDrawerProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onClearHistory,
  onSelectHistoryItem
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Session Analysis History</h2>
          <p className="text-xs text-slate-500">
            Compare past resume matches performed during your current browser session.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <p className="text-sm font-medium">No resume analyses recorded yet in this session.</p>
          <p className="text-xs text-slate-500 mt-1">
            Run an analysis from the Analyzer tab to log comparisons.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-sm ${
                  item.score >= 70
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : item.score >= 40
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  <span>{item.score}%</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.jobTitle}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>{item.timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> {item.matchedCount} matched
                    </span>
                    <span className="flex items-center gap-1 text-rose-600 font-medium">
                      <XCircle className="w-3 h-3" /> {item.missingCount} missing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
