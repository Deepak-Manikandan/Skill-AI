export type AppPage = 'matcher' | 'results' | 'suggestions' | 'roadmap' | 'comparison';

export interface SkillMatchResult {
  jobTitle: string;
  sourceFilename: string;
  similarityScore: number;
  skillCoverage: number;
  matchedSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
  discoveredPhrases: string[];
  topTerms: string[];
  recommendations: Recommendation[];
  resumeWordCount: number;
  jobWordCount: number;
  timestamp: string;
}

export interface Recommendation {
  title: string;
  category: 'Skills' | 'Alignment' | 'Impact' | 'Optimization' | 'DevOps' | 'Formatting';
  detail: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  jobTitle: string;
  score: number;
  matchedCount: number;
  missingCount: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface ResumeAiSuggestions {
  primaryDomain: string;
  detectedSkills: string[];
  detectedPhrases: string[];
  impactScore: number;
  metricsPresent: boolean;
  actionVerbCount: number;
  strengths: string[];
  skillRecommendations: {
    skill: string;
    reason: string;
    category: string;
  }[];
  projectIdeas: {
    title: string;
    description: string;
    techStack: string[];
  }[];
  bulletRewrites: {
    before: string;
    after: string;
    principle: string;
  }[];
  sectionChecklist: {
    section: string;
    present: boolean;
    feedback: string;
  }[];
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  targetSkills: string[];
  milestones: string[];
  suggestedResource: {
    name: string;
    type: 'Documentation' | 'Course' | 'Interactive' | 'Project';
    url: string;
  };
  sampleProjectGoal: string;
}

export interface CertificationGuide {
  title: string;
  issuer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  relevance: string;
  link: string;
}
