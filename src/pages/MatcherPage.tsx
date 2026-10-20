import React, { useRef } from 'react';
import { Upload, CheckCircle, ArrowRight, Layers, Lightbulb, FileText } from 'lucide-react';
import { extractTextFromPdf } from '../utils/pdfExtractor';

interface MatcherPageProps {
  resumeMode: 'upload' | 'paste';
  setResumeMode: (mode: 'upload' | 'paste') => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  resumeText: string;
  setResumeText: (val: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  isProcessing: boolean;
  onAnalyze: () => void;
  onNavigateToSuggestions: () => void;
}

export const MatcherPage: React.FC<MatcherPageProps> = ({
  resumeMode,
  setResumeMode,
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  resumeText,
  setResumeText,
  selectedFile,
  setSelectedFile,
  errorMessage,
  setErrorMessage,
  isProcessing,
  onAnalyze,
  onNavigateToSuggestions
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please upload a valid PDF file (.pdf).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 5 MB limit. Please select a smaller PDF.');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);

    const { text, error } = await extractTextFromPdf(file);
    if (error) {
      setErrorMessage(error);
    } else {
      setResumeText(text);
    }
  };

  const scrollToInputs = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-white to-slate-50 border-b border-slate-200/80 pt-14 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            AI-Powered Resume & Job Alignment Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Your Skills. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Your Next Opportunity.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Evaluate your resume against target job postings using <strong>TF-IDF vectorization</strong>, <strong>cosine similarity</strong>, and get personalized <strong>AI Suggestions</strong> to elevate your profile.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={scrollToInputs}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Analyze Resume Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToSuggestions}
              className="px-6 py-3.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-sm font-semibold shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Get AI Resume Suggestions</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Interactive Form Workspace */}
      <div ref={inputSectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* Error Message Callout */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Column 1: Resume Upload / Paste */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Candidate Resume</h2>
                    <p className="text-xs text-slate-500">Upload a PDF or paste plain text</p>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setResumeMode('upload')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      resumeMode === 'upload'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Upload PDF
                  </button>
                  <button
                    onClick={() => setResumeMode('paste')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      resumeMode === 'paste'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>
              </div>

              {resumeMode === 'upload' ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[280px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">
                    {selectedFile ? selectedFile.name : 'Click to select or drag and drop PDF'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedFile
                      ? `Extracted ${resumeText.split(/\s+/).filter(Boolean).length} words • PDF processed`
                      : 'Standard PDF format • Up to 5 MB'}
                  </p>
                  {selectedFile && (
                    <span className="mt-3 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> PDF Loaded
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={11}
                    className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-y"
                    placeholder="Paste full resume text, skills, education, and project bullet points here..."
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
                    <span>Include technical stack, tools, and quantified metrics</span>
                    <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Suggestions Quick Trigger in Resume Card */}
            {resumeText.trim().length > 30 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Want suggestions for this resume?</span>
                <button
                  onClick={onNavigateToSuggestions}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Generate AI Suggestions →
                </button>
              </div>
            )}
          </div>

          {/* Column 2: Job Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Job Description</h2>
                  <p className="text-xs text-slate-500">Paste target position requirements</p>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Title <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Junior Machine Learning Engineer or Python Developer"
                  className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Requirements & Qualifications <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-y"
                  placeholder="Paste requirements, responsibilities, and qualifications from the job posting..."
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
                  <span>Requires at least 15 words</span>
                  <span>{jobDescription.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={onAnalyze}
            disabled={isProcessing}
            className="px-8 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 hover:from-slate-800 hover:to-indigo-800 text-white rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 inline-flex items-center gap-2.5 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Alignment...</span>
              </>
            ) : (
              <>
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Analyze Match & Skill Gap</span>
              </>
            )}
          </button>

          <button
            onClick={onNavigateToSuggestions}
            className="px-6 py-3.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-base font-bold shadow-2xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>AI Suggestions for Resume</span>
          </button>
        </div>

      </div>
    </div>
  );
};
