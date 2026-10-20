import React from 'react';
import { ResumeAiSuggestions } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Briefcase,
  Code2,
  TrendingUp,
  Download,
  Copy,
  Check
} from 'lucide-react';

interface AiSuggestionsViewProps {
  suggestions: ResumeAiSuggestions;
  sourceName: string;
  onBackToMatcher: () => void;
}

export const AiSuggestionsView: React.FC<AiSuggestionsViewProps> = ({
  suggestions,
  sourceName,
  onBackToMatcher
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadSuggestions = () => {
    const content = `============================================================
           SKILLMATCH AI – RESUME AI SUGGESTIONS REPORT         
============================================================
Source Resume   : ${sourceName}
Primary Domain  : ${suggestions.primaryDomain}
Impact Score    : ${suggestions.impactScore}/100
Action Verbs    : ${suggestions.actionVerbCount} detected
Metrics Status  : ${suggestions.metricsPresent ? 'Present (Quantified metrics found)' : 'Missing (Add % and numbers)'}
------------------------------------------------------------
1. IDENTIFIED STRENGTHS
${suggestions.strengths.map((s, i) => `   ${i + 1}. ${s}`).join('\n')}

------------------------------------------------------------
2. RECOMMENDED NEXT SKILLS TO LEARN
${suggestions.skillRecommendations.map((rec, i) => `   ${i + 1}. ${rec.skill} [${rec.category}]\n      Rationale: ${rec.reason}`).join('\n\n')}

------------------------------------------------------------
3. RECOMMENDED PORTFOLIO PROJECT IDEAS
${suggestions.projectIdeas.map((p, i) => `   ${i + 1}. ${p.title}\n      Tech Stack: ${p.techStack.join(', ')}\n      Overview: ${p.description}`).join('\n\n')}

------------------------------------------------------------
4. GOOGLE XYZ BULLET-POINT REWRITES (BEFORE & AFTER)
${suggestions.bulletRewrites.map((b, i) => `   Example ${i + 1}:\n   [BEFORE]: ${b.before}\n   [AFTER] : ${b.after}\n   [WHY]   : ${b.principle}`).join('\n\n')}

------------------------------------------------------------
5. RESUME SECTION COMPLETENESS AUDIT
${suggestions.sectionChecklist.map((c) => `   [${c.present ? 'PASS' : 'FLAG'}] ${c.section}\n          ${c.feedback}`).join('\n')}

============================================================
SkillMatch AI – Resume & Job Matcher
============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_AI_Suggestions_${suggestions.primaryDomain.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Resume Suggestions & Optimization
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Personalized Resume Analysis
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Targeted recommendations generated from your resume’s detected domain, language patterns, and technical proficiencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSuggestions}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Suggestions (.txt)</span>
            </button>
            <button
              onClick={onBackToMatcher}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Back to Matcher
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Detected Domain
            </span>
            <span className="text-xs sm:text-sm font-bold text-indigo-200 truncate block">
              {suggestions.primaryDomain}
            </span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Resume Impact Score
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 block">
              {suggestions.impactScore}/100
            </span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Action Verbs Found
            </span>
            <span className="text-sm sm:text-base font-extrabold text-white block">
              {suggestions.actionVerbCount} verbs
            </span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Metric Density
            </span>
            <span className={`text-xs sm:text-sm font-bold block ${suggestions.metricsPresent ? 'text-emerald-300' : 'text-amber-300'}`}>
              {suggestions.metricsPresent ? 'Quantified metrics found' : 'Needs more metrics'}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column: Strengths & Section Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Identified Resume Strengths
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Positive signals detected by our NLP analysis engine.
          </p>

          <div className="space-y-2.5">
            {suggestions.strengths.map((str, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section Completeness Audit */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Resume Section Completeness Audit
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Standard structure expected by recruiters and hiring managers.
          </p>

          <div className="space-y-2.5">
            {suggestions.sectionChecklist.map((check, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  check.present
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                {check.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-bold">{check.section}</strong>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {check.feedback}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recommended Next Skills to Learn */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-600" />
          Recommended Next Skills to Learn
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          High-demand complementary technologies that pair naturally with your current skillset.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suggestions.skillRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {rec.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {rec.skill}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rec.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* High-Impact Portfolio Project Ideas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Standout Portfolio Project Ideas
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Specific project concepts tailored to demonstrate real-world execution to interviewers.
        </p>

        <div className="space-y-4">
          {suggestions.projectIdeas.map((proj, idx) => (
            <div
              key={idx}
              className="p-4.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {idx + 1}. {proj.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-mono font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {proj.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Google XYZ Bullet Rewrites */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Google XYZ Formula Bullet-Point Rewrites
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Transform weak passive descriptions into impactful, metric-driven accomplishments: <em>"Accomplished [X], as measured by [Y], by doing [Z]"</em>.
        </p>

        <div className="space-y-4">
          {suggestions.bulletRewrites.map((bullet, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5"
            >
              <div className="flex items-start gap-2 text-xs">
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px] uppercase shrink-0">
                  Before
                </span>
                <span className="text-slate-500 line-through">{bullet.before}</span>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase shrink-0">
                  After
                </span>
                <span className="text-slate-900 font-medium leading-relaxed flex-1">
                  {bullet.after}
                </span>
                <button
                  onClick={() => handleCopyBullet(bullet.after, idx)}
                  className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  title="Copy rewritten bullet"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-indigo-600 font-medium pl-1 border-l-2 border-indigo-400">
                Rule Applied: {bullet.principle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="text-center pt-2">
        <button
          onClick={onBackToMatcher}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          Return to Matcher Workspace
        </button>
      </div>

    </div>
  );
};
