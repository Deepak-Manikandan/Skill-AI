import React, { useRef } from 'react';
import { ResumeAiSuggestions } from '../types';
import { AiSuggestionsView } from '../components/AiSuggestionsView';
import { generateResumeAiSuggestions } from '../utils/nlpEngine';
import { extractTextFromPdf } from '../utils/pdfExtractor';
import { Upload, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface AiSuggestionsPageProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  aiSuggestions: ResumeAiSuggestions | null;
  setAiSuggestions: (sug: ResumeAiSuggestions | null) => void;
  onNavigateToMatcher: () => void;
}

export const AiSuggestionsPage: React.FC<AiSuggestionsPageProps> = ({
  resumeText,
  setResumeText,
  selectedFile,
  setSelectedFile,
  aiSuggestions,
  setAiSuggestions,
  onNavigateToMatcher
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // If suggestions don't exist yet but resume text exists, generate them automatically!
  React.useEffect(() => {
    if (!aiSuggestions && resumeText.trim().split(/\s+/).length >= 20) {
      const generated = generateResumeAiSuggestions(resumeText);
      setAiSuggestions(generated);
    }
  }, [resumeText, aiSuggestions, setAiSuggestions]);

  const handleFileChange = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please upload a valid PDF file (.pdf).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 5 MB limit. Please select a smaller PDF.');
      return;
    }

    setSelectedFile(file);
    setErrorMsg(null);

    const { text, error } = await extractTextFromPdf(file);
    if (error) {
      setErrorMsg(error);
    } else {
      setResumeText(text);
      const generated = generateResumeAiSuggestions(text);
      setAiSuggestions(generated);
    }
  };

  const handlePasteAnalyze = () => {
    const clean = resumeText.trim();
    if (clean.split(/\s+/).length < 20) {
      setErrorMsg('Please provide a complete resume (at least 20 words) for meaningful AI suggestions.');
      return;
    }
    setErrorMsg(null);
    const generated = generateResumeAiSuggestions(clean);
    setAiSuggestions(generated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {aiSuggestions ? (
        <AiSuggestionsView
          suggestions={aiSuggestions}
          sourceName={selectedFile ? selectedFile.name : 'Candidate Resume'}
          onBackToMatcher={onNavigateToMatcher}
        />
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI Resume Suggestions & Optimization
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Get Personalized AI Suggestions for Your Resume
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              Upload your PDF resume or paste plain text below. Our NLP engine will analyze your impact metrics, career domain, missing complementary skills, and generate Google XYZ formula rewrites.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                Upload your resume PDF to analyze
              </p>
              <p className="text-xs text-slate-400">
                PDF format only • Up to 5 MB
              </p>
            </div>

            <div className="relative text-center my-2">
              <span className="bg-white px-3 text-xs text-slate-400 uppercase font-semibold">
                Or Paste Resume Content
              </span>
            </div>

            <div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Paste your resume sections, skills, work history, and projects here..."
              />
            </div>

            <button
              onClick={handlePasteAnalyze}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Suggestions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
