import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  skillCoverage: number;
  matchedCount: number;
  totalJobSkills: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  skillCoverage,
  matchedCount,
  totalJobSkills
}) => {
  // Determine tier label and color
  let tierLabel = 'Low Match';
  let tierBadgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  let tierIcon = <AlertCircle className="w-3.5 h-3.5 text-rose-600 inline mr-1" />;
  let strokeColor = '#ef4444';

  if (score >= 70) {
    tierLabel = 'High Match';
    tierBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    tierIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />;
    strokeColor = '#10b981';
  } else if (score >= 40) {
    tierLabel = 'Moderate Match';
    tierBadgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    tierIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline mr-1" />;
    strokeColor = '#6366f1';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-slate-900">Estimated Text Similarity</h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tierBadgeBg}`}>
            {tierIcon}
            {tierLabel}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          TF-IDF Vectorization & Cosine Similarity score
        </p>
      </div>

      {/* Circular Progress Gauge */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div
          className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-inner"
          style={{
            background: `conic-gradient(${strokeColor} ${score * 3.6}deg, #e2e8f0 ${score * 3.6}deg 360deg)`
          }}
        >
          <div className="w-34 h-34 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-baseline">
              {score}
              <span className="text-xl font-bold text-indigo-600 ml-0.5">%</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              Cosine Sim
            </span>
          </div>
        </div>

        {/* Skill coverage mini bar */}
        <div className="w-full mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3">
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
            <span>Required Skill Coverage:</span>
            <span className="font-bold text-slate-900">
              {matchedCount} / {totalJobSkills} skills ({skillCoverage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, skillCoverage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory Accuracy & Hiring Probability Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          <strong>Scientific Accuracy Note:</strong> This percentage represents numerical text and keyword similarity calculated between document vectors. It does <em>not</em> represent human hiring probability or overall candidate competence.
        </p>
      </div>
    </div>
  );
};
