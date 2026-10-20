import React from 'react';
import { SkillMatchResult } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadges } from '../components/SkillBadges';
import { Download, RotateCcw, Lightbulb, MapPin, Tag, ArrowRight } from 'lucide-react';

interface ResultsPageProps {
  result: SkillMatchResult;
  onDownloadReport: () => void;
  onBackToMatcher: () => void;
  onNavigateToSuggestions: () => void;
  onNavigateToRoadmap: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  onDownloadReport,
  onBackToMatcher,
  onNavigateToSuggestions,
  onNavigateToRoadmap
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            Target Role Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {result.jobTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
            <span><strong>Source:</strong> {result.sourceFilename}</span>
            <span>•</span>
            <span><strong>Analyzed:</strong> {result.timestamp}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onDownloadReport}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (.txt)</span>
          </button>
          <button
            onClick={onBackToMatcher}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Match</span>
          </button>
        </div>
      </div>

      {/* 2-Column Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Score Gauge */}
        <div className="lg:col-span-1">
          <ScoreGauge
            score={result.similarityScore}
            skillCoverage={result.skillCoverage}
            matchedCount={result.matchedSkills.length}
            totalJobSkills={result.matchedSkills.length + result.missingSkills.length}
          />
        </div>

        {/* Right: Skill Breakdown & Keyword Highlights */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">
                Skill Overlap Summary
              </h3>
              <button
                onClick={onNavigateToRoadmap}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Bridge Missing Skills Roadmap →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Direct comparison between required job skills and detected resume proficiencies.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-center">
                <span className="text-2xl font-extrabold text-emerald-600 block">
                  {result.matchedSkills.length}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Matched Skills
                </span>
              </div>

              <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 text-center">
                <span className="text-2xl font-extrabold text-rose-600 block">
                  {result.missingSkills.length}
                </span>
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                  Missing Skills
                </span>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-center">
                <span className="text-2xl font-extrabold text-blue-600 block">
                  {result.additionalSkills.length}
                </span>
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  Bonus Skills
                </span>
              </div>
            </div>

            {/* Top Overlapping Keywords */}
            {result.topTerms.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Top Overlapping Technical Keywords:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.topTerms.map((term) => (
                    <span
                      key={term}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs rounded-lg"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Resume text: {result.resumeWordCount} words</span>
            <span>Job listing: {result.jobWordCount} words</span>
          </div>
        </div>

      </div>

      {/* Skills Grid: Green / Red / Blue + Discovered Phrases */}
      <SkillBadges
        matchedSkills={result.matchedSkills}
        missingSkills={result.missingSkills}
        additionalSkills={result.additionalSkills}
        discoveredPhrases={result.discoveredPhrases}
      />

      {/* Next Actions Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={onNavigateToRoadmap}
          className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
              Recommended Next Step
            </span>
            <h4 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
              Generate 4-Week Skill Gap Roadmap
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Step-by-step action plan with curated resources to learn the {result.missingSkills.length} missing skills.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
        </div>

        <div
          onClick={onNavigateToSuggestions}
          className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Deep Profile Audit
            </span>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              View AI Resume Suggestions
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Inspect your Resume Impact Score, ATS section completeness, and Google XYZ bullet rewrites.
            </p>
          </div>
          <Lightbulb className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform shrink-0 ml-3" />
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-3 mb-5">
          <h2 className="text-lg font-bold text-slate-900">Personalized Improvement Suggestions</h2>
          <p className="text-xs text-slate-500">
            Targeted recommendations based on missing skill clusters and linguistic alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white">
                  {rec.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {rec.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rec.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="text-center pt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onDownloadReport}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Full Report (.txt)
        </button>
        <button
          onClick={onBackToMatcher}
          className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          Analyze Another Resume
        </button>
      </div>

    </div>
  );
};
