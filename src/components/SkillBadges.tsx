import React from 'react';
import { Check, X, Plus } from 'lucide-react';

interface SkillBadgesProps {
  matchedSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
  discoveredPhrases?: string[];
}

export const SkillBadges: React.FC<SkillBadgesProps> = ({
  matchedSkills,
  missingSkills,
  additionalSkills,
  discoveredPhrases = []
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900">Technical Skill Gap Breakdown</h2>
        <p className="text-xs text-slate-500">
          Derived by matching your resume against the job description using SkillMatch AI's normalized skill dictionary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Matched Skills (Green) */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                <Check className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Matched Skills</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full ml-auto">
                {matchedSkills.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3.5">
              Present in both your resume and the job listing.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs hover:bg-emerald-100 transition-colors"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    {skill.toUpperCase()}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic py-2">
                  No predefined skills matched.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Missing Skills (Red/Orange) */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
                <X className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Missing Job Skills</h3>
              <span className="text-xs font-semibold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full ml-auto">
                {missingSkills.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3.5">
              Required by the job post, but absent from your resume.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs hover:bg-rose-100 transition-colors"
                  >
                    <X className="w-3 h-3 text-rose-600" />
                    {skill.toUpperCase()}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-700 font-semibold py-2">
                  🎉 100% of required skills found in resume!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Additional Resume Skills (Blue) */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Bonus Resume Skills</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full ml-auto">
                {additionalSkills.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3.5">
              Extra technical proficiencies detected in your resume.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {additionalSkills.length > 0 ? (
                additionalSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                    {skill.toUpperCase()}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic py-2">
                  No additional skills found.
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* NLP Discovered Domain Phrases */}
      {discoveredPhrases.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              ✦ NLP Discovered Domain Phrases
            </span>
            <span className="text-xs text-slate-400">
              (Extracted via Part-of-Speech noun-phrase chunking beyond predefined dictionaries)
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {discoveredPhrases.map((phrase) => (
              <span
                key={phrase}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-50 text-indigo-800 border border-indigo-200/80 shadow-2xs"
              >
                ✦ {phrase}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
