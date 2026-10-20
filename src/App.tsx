/**
 * SkillMatch AI – Resume & Job Matcher
 * Multi-Page Application Architecture
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MatcherPage } from './pages/MatcherPage';
import { ResultsPage } from './pages/ResultsPage';
import { AiSuggestionsPage } from './pages/AiSuggestionsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { analyzeResumeAndJob, generateResumeAiSuggestions } from './utils/nlpEngine';
import { AppPage, SkillMatchResult, HistoryItem, ResumeAiSuggestions } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('matcher');

  // Input State
  const [resumeMode, setResumeMode] = useState<'upload' | 'paste'>('paste');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Results & Intelligence State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SkillMatchResult | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<ResumeAiSuggestions | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppPage;
      if (['matcher', 'results', 'suggestions', 'roadmap', 'comparison'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execute Match Analysis Pipeline
  const handleAnalyze = async () => {
    setErrorMessage(null);

    const cleanJob = jobDescription.trim();
    const cleanResume = resumeText.trim();

    if (!cleanResume || cleanResume.split(/\s+/).length < 20) {
      setErrorMessage('Please upload a PDF resume or paste your resume text (at least 20 words).');
      return;
    }

    if (!cleanJob || cleanJob.split(/\s+/).length < 15) {
      setErrorMessage('Please provide a complete job description (at least 15 words) for accurate analysis.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const sourceName = selectedFile ? selectedFile.name : 'Pasted Resume Text';
      const newResult = analyzeResumeAndJob(cleanResume, cleanJob, jobTitle, sourceName);

      setResult(newResult);
      setIsProcessing(false);

      // Pre-compute AI suggestions so user can jump straight to them
      const suggestions = generateResumeAiSuggestions(cleanResume);
      setAiSuggestions(suggestions);

      // Add to session history
      const historyEntry: HistoryItem = {
        id: Date.now().toString(),
        timestamp: newResult.timestamp,
        jobTitle: newResult.jobTitle,
        score: newResult.similarityScore,
        matchedCount: newResult.matchedSkills.length,
        missingCount: newResult.missingSkills.length,
        matchedSkills: newResult.matchedSkills,
        missingSkills: newResult.missingSkills
      };
      setHistory((prev) => [historyEntry, ...prev.slice(0, 9)]);

      // Navigate to dedicated results page!
      navigateTo('results');
    }, 350);
  };

  // Download TXT Report
  const handleDownloadReport = () => {
    if (!result) return;

    const reportContent = `============================================================
          SKILLMATCH AI – RESUME & JOB MATCH REPORT         
============================================================
Generated At    : ${result.timestamp}
Target Role     : ${result.jobTitle}
Resume Source   : ${result.sourceFilename}
------------------------------------------------------------
1. SCORES & METRICS
   - Estimated Text Similarity : ${result.similarityScore}% (TF-IDF Cosine Similarity)
   - Required Skill Coverage   : ${result.skillCoverage}% (${result.matchedSkills.length} of ${result.matchedSkills.length + result.missingSkills.length} skills found)

   * Important Disclaimer: The text similarity percentage measures vocabulary
     and technical keyword overlap using mathematical cosine similarity.
     It does not guarantee candidate qualification or represent hiring probability.
------------------------------------------------------------
2. SKILL GAP BREAKDOWN
   [+] Matched Skills (${result.matchedSkills.length}):
       ${result.matchedSkills.length ? result.matchedSkills.map(s => s.toUpperCase()).join(', ') : 'None detected'}

   [-] Missing Job Skills (${result.missingSkills.length}):
       ${result.missingSkills.length ? result.missingSkills.map(s => s.toUpperCase()).join(', ') : 'None! All identified skills found.'}

   [*] Additional Resume Skills (${result.additionalSkills.length}):
       ${result.additionalSkills.length ? result.additionalSkills.map(s => s.toUpperCase()).join(', ') : 'None'}
------------------------------------------------------------
3. NLP DISCOVERED DOMAIN PHRASES (POS Chunking)
   ${result.discoveredPhrases.length ? result.discoveredPhrases.join(', ') : 'None'}
------------------------------------------------------------
4. TOP OVERLAPPING TECHNICAL KEYWORDS
   ${result.topTerms.length ? result.topTerms.join(', ') : 'N/A'}
------------------------------------------------------------
5. ACTIONABLE RECOMMENDATIONS
${result.recommendations.map((rec, i) => `   ${i + 1}. [${rec.category}] ${rec.title}\n      ${rec.detail}`).join('\n\n')}

============================================================
SkillMatch AI – Intelligent Resume & Job Matcher
============================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillMatch_Report_${result.jobTitle.replace(/[^a-zA-Z0-9]/g, '_') || 'Analysis'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* Navbar with Page Links */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        hasResult={Boolean(result)}
        historyCount={history.length}
      />

      {/* Dynamic Page Router */}
      <main className="flex-1 pb-16">
        {currentPage === 'matcher' && (
          <MatcherPage
            resumeMode={resumeMode}
            setResumeMode={setResumeMode}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            resumeText={resumeText}
            setResumeText={setResumeText}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            isProcessing={isProcessing}
            onAnalyze={handleAnalyze}
            onNavigateToSuggestions={() => navigateTo('suggestions')}
          />
        )}

        {currentPage === 'results' && result && (
          <ResultsPage
            result={result}
            onDownloadReport={handleDownloadReport}
            onBackToMatcher={() => navigateTo('matcher')}
            onNavigateToSuggestions={() => navigateTo('suggestions')}
            onNavigateToRoadmap={() => navigateTo('roadmap')}
          />
        )}

        {currentPage === 'suggestions' && (
          <AiSuggestionsPage
            resumeText={resumeText}
            setResumeText={setResumeText}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            aiSuggestions={aiSuggestions}
            setAiSuggestions={setAiSuggestions}
            onNavigateToMatcher={() => navigateTo('matcher')}
          />
        )}

        {currentPage === 'roadmap' && (
          <RoadmapPage
            missingSkills={result ? result.missingSkills : []}
            jobTitle={result ? result.jobTitle : jobTitle}
            onNavigateToMatcher={() => navigateTo('matcher')}
          />
        )}

        {currentPage === 'comparison' && (
          <ComparisonPage
            history={history}
            onClearHistory={() => setHistory([])}
            onNavigateToMatcher={() => navigateTo('matcher')}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong className="text-slate-800">SkillMatch AI</strong> • Natural Language Processing Resume Matcher & Career Optimization
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <button
              onClick={() => navigateTo('matcher')}
              className={`hover:text-indigo-600 cursor-pointer ${currentPage === 'matcher' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Matcher
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('suggestions')}
              className={`hover:text-indigo-600 cursor-pointer ${currentPage === 'suggestions' ? 'text-indigo-600 font-bold' : ''}`}
            >
              AI Suggestions
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('roadmap')}
              className={`hover:text-indigo-600 cursor-pointer ${currentPage === 'roadmap' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Skill Roadmap
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('comparison')}
              className={`hover:text-indigo-600 cursor-pointer ${currentPage === 'comparison' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Role Comparison
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
