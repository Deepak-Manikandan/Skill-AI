import React, { useState } from 'react';
import { generateSkillRoadmap } from '../utils/roadmapGenerator';
import {
  MapPin,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Download,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RoadmapPageProps {
  missingSkills: string[];
  jobTitle: string;
  onNavigateToMatcher: () => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  missingSkills,
  jobTitle,
  onNavigateToMatcher
}) => {
  const { weeks, certifications } = generateSkillRoadmap(missingSkills);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  const toggleMilestone = (key: string) => {
    setCompletedMilestones(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDownloadRoadmap = () => {
    const text = `============================================================
       SKILLMATCH AI – 4-WEEK SKILL GAP & LEARNING ROADMAP      
============================================================
Target Opportunity  : ${jobTitle || 'Target Role'}
Identified Gaps     : ${missingSkills.length ? missingSkills.join(', ').toUpperCase() : 'General Industry Readiness'}
------------------------------------------------------------
${weeks.map(w => `WEEK ${w.weekNumber}: ${w.title}
Target Skills : ${w.targetSkills.join(', ').toUpperCase()}
Milestones    :
${w.milestones.map((m, i) => `  [ ] ${i + 1}. ${m}`).join('\n')}
Resource      : ${w.suggestedResource.name} (${w.suggestedResource.type}) - ${w.suggestedResource.url}
Weekly Goal   : ${w.sampleProjectGoal}
`).join('\n------------------------------------------------------------\n')}

RECOMMENDED INDUSTRY CERTIFICATIONS
${certifications.map((c, i) => `${i + 1}. ${c.title} (${c.issuer}) [${c.difficulty}]
   Relevance: ${c.relevance}
   URL: ${c.link}`).join('\n\n')}

============================================================
SkillMatch AI – Career Acceleration Engine
============================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillGap_Roadmap_${(jobTitle || 'Career').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Skill Gap Bridge & Learning Pathway
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              4-Week Personalized Learning Roadmap
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Structured study plan designed to bridge the technical requirements identified between your resume and {jobTitle || 'your target position'}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadRoadmap}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Plan (.txt)</span>
            </button>
            <button
              onClick={onNavigateToMatcher}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Back to Matcher
            </button>
          </div>
        </div>

        {/* Targeted Missing Skills Badges */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
            Targeted Gaps to Bridge:
          </span>
          {missingSkills.length > 0 ? (
            missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold"
              >
                {skill.toUpperCase()}
              </span>
            ))
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              Advanced Industry Skills
            </span>
          )}
        </div>
      </div>

      {/* Week-by-Week Interactive Action Plan */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            30-Day Step-by-Step Curriculum
          </h2>
          <span className="text-xs text-slate-500">
            Click milestones to mark progress
          </span>
        </div>

        <div className="space-y-4">
          {weeks.map((week) => (
            <div
              key={week.weekNumber}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                    W{week.weekNumber}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {week.title}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Focus: {week.targetSkills.join(', ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
                    Week {week.weekNumber} Plan
                  </span>
                </div>
              </div>

              {/* Milestones Checklist */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Actionable Milestones:
                </span>
                <div className="space-y-2">
                  {week.milestones.map((milestone, mIdx) => {
                    const key = `w${week.weekNumber}-m${mIdx}`;
                    const isDone = Boolean(completedMilestones[key]);
                    return (
                      <div
                        key={mIdx}
                        onClick={() => toggleMilestone(key)}
                        className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {milestone}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Curated Resource & Capstone Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Recommended Learning Resource
                    </span>
                    <a
                      href={week.suggestedResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-0.5"
                    >
                      <span>{week.suggestedResource.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      End of Week Practical Goal
                    </span>
                    <span className="text-xs text-slate-700 block mt-0.5">
                      {week.sampleProjectGoal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Certifications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Recommended Industry Certifications
        </h2>
        <p className="text-xs text-slate-500">
          Certifications that carry recognized credential weight during campus and off-campus tech hiring drives.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {cert.issuer}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    cert.difficulty === 'Beginner'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {cert.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {cert.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {cert.relevance}
                </p>
              </div>

              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start cursor-pointer"
              >
                <span>View Program Details</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
