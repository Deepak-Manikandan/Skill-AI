/**
 * SkillMatch AI – Enhanced NLP & Skill-Weighted TF-IDF Cosine Similarity Engine
 * Incorporates POS Noun-Phrase Chunking, Contextual Action-Verb Relevance,
 * and Domain-Weighted TF-IDF Vectorization.
 */

import { SkillMatchResult, Recommendation, ResumeAiSuggestions } from '../types';

// Curated Technical Skill Dictionary with Normalization Aliases
export const SKILL_DICTIONARY: Record<string, string[]> = {
  // Programming Languages
  'python': ['python', 'py'],
  'java': ['java'],
  'c++': ['c++', 'cpp'],
  'c': ['c language'],
  'c#': ['c#', 'csharp', 'c-sharp'],
  'javascript': ['javascript', 'js', 'es6', 'ecmascript'],
  'typescript': ['typescript', 'ts'],
  'r': ['r programming', 'r-lang', 'r language'],
  'golang': ['golang', 'go language', 'go lang'],
  'rust': ['rust'],
  'php': ['php'],
  'ruby': ['ruby'],

  // Web & Frameworks
  'html': ['html', 'html5'],
  'css': ['css', 'css3'],
  'react': ['react', 'react.js', 'reactjs'],
  'angular': ['angular', 'angularjs'],
  'vue': ['vue', 'vue.js', 'vuejs'],
  'flask': ['flask'],
  'django': ['django'],
  'fastapi': ['fastapi', 'fast-api'],
  'node.js': ['node.js', 'nodejs', 'node'],
  'express': ['express', 'express.js', 'expressjs'],
  'spring boot': ['spring boot', 'springboot', 'spring framework'],
  'tailwind css': ['tailwind', 'tailwindcss', 'tailwind css'],
  'bootstrap': ['bootstrap'],

  // Data Science & Machine Learning
  'machine learning': ['machine learning', 'ml'],
  'deep learning': ['deep learning', 'dl'],
  'data analysis': ['data analysis', 'data analytics'],
  'scikit-learn': ['scikit-learn', 'scikit learn', 'sklearn'],
  'pandas': ['pandas'],
  'numpy': ['numpy'],
  'tensorflow': ['tensorflow', 'tf'],
  'pytorch': ['pytorch', 'torch'],
  'keras': ['keras'],
  'nlp': ['nlp', 'natural language processing'],
  'computer vision': ['computer vision', 'cv', 'opencv'],
  'data visualization': ['data visualization', 'data viz'],
  'matplotlib': ['matplotlib'],
  'seaborn': ['seaborn'],
  'statsmodels': ['statsmodels'],
  'generative ai': ['generative ai', 'genai', 'llm', 'large language models'],

  // Databases & Big Data
  'sql': ['sql', 'mysql', 'structured query language'],
  'postgresql': ['postgresql', 'postgres'],
  'mongodb': ['mongodb', 'mongo'],
  'redis': ['redis'],
  'sqlite': ['sqlite'],
  'spark': ['apache spark', 'pyspark', 'spark'],
  'hadoop': ['hadoop', 'apache hadoop'],

  // Cloud & DevOps
  'aws': ['aws', 'amazon web services'],
  'azure': ['azure', 'microsoft azure'],
  'gcp': ['gcp', 'google cloud', 'google cloud platform'],
  'docker': ['docker', 'containerization'],
  'kubernetes': ['kubernetes', 'k8s'],
  'git': ['git', 'github', 'gitlab', 'version control'],
  'ci/cd': ['ci/cd', 'cicd', 'continuous integration', 'jenkins', 'github actions'],
  'linux': ['linux', 'bash', 'shell scripting', 'unix'],

  // Business Intelligence & Productivity
  'power bi': ['power bi', 'powerbi'],
  'tableau': ['tableau'],
  'excel': ['excel', 'advanced excel', 'microsoft excel'],
  'jira': ['jira'],
  'rest api': ['rest api', 'restful api', 'api development', 'apis']
};

const ACTION_VERBS = new Set([
  'developed', 'built', 'engineered', 'architected', 'implemented', 'trained',
  'optimized', 'deployed', 'designed', 'created', 'modeled', 'fine-tuned',
  'scaled', 'configured', 'evaluated', 'analyzed', 'automated', 'integrated',
  'refactored', 'administered', 'programmed', 'authored'
]);

const ENGLISH_STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant',
  'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having',
  'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is',
  'isnt', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor',
  'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'she', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'were', 'werent', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Clean text preserving technical punctuation (C++, .NET, scikit-learn, etc.)
 */
export function cleanText(text: string): string {
  if (!text) return '';
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Extract technical terms from text using boundary-safe regex pattern matching
 */
export function extractSkills(text: string): string[] {
  const cleaned = ` ${cleanText(text)} `;
  const found = new Set<string>();

  for (const [canonical, aliases] of Object.entries(SKILL_DICTIONARY)) {
    for (const alias of aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:\\b|(?<=[^a-zA-Z0-9]))${escaped}(?=\\b|(?=[^a-zA-Z0-9]))`, 'i');
      if (regex.test(cleaned)) {
        found.add(canonical);
        break;
      }
    }
  }

  return Array.from(found).sort();
}

/**
 * NLP Noun-Phrase (NP) Chunking Heuristic:
 * Extracts compound domain phrases (e.g. 'predictive modeling', 'exploratory data analysis',
 * 'continuous integration', 'data pipeline', 'microservice architecture')
 */
export function extractNounPhrases(text: string, knownSkills: string[]): string[] {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const candidatePhrases: string[] = [];

  const technicalAdjectives = new Set([
    'predictive', 'exploratory', 'statistical', 'neural', 'convolutional', 'recurrent',
    'distributed', 'continuous', 'relational', 'supervised', 'unsupervised', 'agile',
    'modular', 'scalable', 'asynchronous', 'automated', 'generative', 'full-stack'
  ]);

  const technicalNouns = new Set([
    'model', 'models', 'modeling', 'pipeline', 'pipelines', 'dataset', 'datasets',
    'architecture', 'infrastructure', 'deployment', 'engineering', 'analytics',
    'classifier', 'classification', 'regression', 'clustering', 'microservice',
    'microservices', 'integration', 'endpoint', 'endpoints', 'warehouse', 'optimization'
  ]);

  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];

    if (
      (technicalAdjectives.has(w1) && (technicalNouns.has(w2) || words[i + 2])) ||
      (technicalNouns.has(w1) && technicalNouns.has(w2)) ||
      (w1 === 'data' && (w2 === 'pipeline' || w2 === 'preprocessing' || w2 === 'cleaning' || w2 === 'engineering')) ||
      (w1 === 'feature' && w2 === 'engineering') ||
      (w1 === 'customer' && w2 === 'churn')
    ) {
      const phrase = `${w1} ${w2}`;
      if (!knownSkills.includes(phrase)) {
        candidatePhrases.push(phrase);
      }
    }
  }

  // Deduplicate and select top unique domain phrases
  const unique = Array.from(new Set(candidatePhrases));
  return unique.slice(0, 8);
}

/**
 * Contextual Action-Verb Proximity Scoring
 */
export function analyzeContextualRelevance(text: string, skills: string[]): Record<string, number> {
  const scores: Record<string, number> = {};
  const sentences = text.toLowerCase().split(/[.\n!?]+/);

  for (const skill of skills) {
    let bestScore = 0.5; // Base passive score
    for (const sent of sentences) {
      if (sent.includes(skill)) {
        let hasAction = false;
        for (const verb of ACTION_VERBS) {
          if (sent.includes(verb)) {
            hasAction = true;
            break;
          }
        }
        const hasMetric = /\b(?:\d+%|\d+x|\$\d+|\d+\s*(?:ms|seconds|users|records|gb))\b/.test(sent);

        if (hasAction && hasMetric) {
          bestScore = Math.max(bestScore, 1.0);
        } else if (hasAction) {
          bestScore = Math.max(bestScore, 0.85);
        }
      }
    }
    scores[skill] = bestScore;
  }

  return scores;
}

/**
 * Tokenize document into unigrams and bigrams, filtering stop words
 */
function tokenize(text: string): string[] {
  const rawTokens = text.toLowerCase().match(/\b[a-zA-Z0-9_+#.-]+\b/g) || [];
  const validTokens: string[] = [];

  for (const token of rawTokens) {
    if (!ENGLISH_STOP_WORDS.has(token) && token.length > 1) {
      validTokens.push(token);
    }
  }

  const allTokens = [...validTokens];
  for (let i = 0; i < validTokens.length - 1; i++) {
    allTokens.push(`${validTokens[i]} ${validTokens[i + 1]}`);
  }

  return allTokens;
}

/**
 * Compute Skill-Weighted TF-IDF & Cosine Similarity
 */
export function computeSkillWeightedTfidfSimilarity(
  resumeText: string,
  jobText: string,
  resumeSkills: string[],
  jobSkills: string[]
): { similarityScore: number; topTerms: string[] } {
  const resumeTokens = tokenize(cleanText(resumeText));
  const jobTokens = tokenize(cleanText(jobText));

  if (resumeTokens.length === 0 || jobTokens.length === 0) {
    return { similarityScore: 0, topTerms: [] };
  }

  const vocabulary = new Set([...resumeTokens, ...jobTokens]);
  const resumeTokenSet = new Set(resumeTokens);
  const jobTokenSet = new Set(jobTokens);

  const resumeTF: Record<string, number> = {};
  for (const t of resumeTokens) resumeTF[t] = (resumeTF[t] || 0) + 1;

  const jobTF: Record<string, number> = {};
  for (const t of jobTokens) jobTF[t] = (jobTF[t] || 0) + 1;

  // Technical domain terms for 1.85x adaptive domain boosting
  const domainSkills = new Set([...resumeSkills, ...jobSkills]);

  const N = 2;
  let dotProduct = 0;
  let normResumeSq = 0;
  let normJobSq = 0;

  const overlappingTermScores: { term: string; score: number }[] = [];

  for (const term of vocabulary) {
    let df = 0;
    if (resumeTokenSet.has(term)) df++;
    if (jobTokenSet.has(term)) df++;

    const idf = Math.log((1 + N) / (1 + df)) + 1;

    // Sublinear TF: 1 + ln(tf)
    const rCount = resumeTF[term] || 0;
    const rTf = rCount > 0 ? 1 + Math.log(rCount) : 0;

    const jCount = jobTF[term] || 0;
    const jTf = jCount > 0 ? 1 + Math.log(jCount) : 0;

    // Domain Boost: 1.85x multiplier if the term matches any technical skill
    let domainMultiplier = 1.0;
    for (const skill of domainSkills) {
      if (skill.includes(term) || term.includes(skill)) {
        domainMultiplier = 1.85;
        break;
      }
    }

    const rWeight = rTf * idf * domainMultiplier;
    const jWeight = jTf * idf * domainMultiplier;

    normResumeSq += rWeight * rWeight;
    normJobSq += jWeight * jWeight;

    if (rWeight > 0 && jWeight > 0) {
      const termContribution = rWeight * jWeight;
      dotProduct += termContribution;
      overlappingTermScores.push({ term, score: termContribution });
    }
  }

  const normResume = Math.sqrt(normResumeSq);
  const normJob = Math.sqrt(normJobSq);

  let cosineSim = 0;
  if (normResume > 0 && normJob > 0) {
    cosineSim = dotProduct / (normResume * normJob);
  }

  cosineSim = Math.max(0, Math.min(1, cosineSim));
  const similarityScore = Math.round(cosineSim * 1000) / 10;

  overlappingTermScores.sort((a, b) => b.score - a.score);
  const topTerms = overlappingTermScores.slice(0, 10).map((item) => item.term);

  return { similarityScore, topTerms };
}

/**
 * Generate Actionable Recommendations incorporating NLP Context
 */
export function generateNlpRecommendations(
  missingSkills: string[],
  matchedSkills: string[],
  similarityScore: number,
  contextScores: Record<string, number>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // 1. Missing Technical Skills
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 5).map((s) => s.toUpperCase());
    recommendations.push({
      title: 'Bridge Key Technical Skill Gaps',
      category: 'Skills',
      detail: `The job description explicitly emphasizes ${topMissing.join(', ')}. If you possess hands-on exposure from coursework or independent projects, explicitly add these keywords under your Skills and Project bullet points.`
    });
  }

  // 2. Low Context Evidence Check
  const lowContext = matchedSkills.filter((s) => (contextScores[s] || 0) < 0.7);
  if (lowContext.length > 0) {
    const sample = lowContext.slice(0, 3).map((s) => s.toUpperCase());
    recommendations.push({
      title: 'Deepen Action Context for Listed Skills',
      category: 'Impact',
      detail: `Skills like ${sample.join(', ')} appear in passive context in your resume. Pair them with active verbs (e.g. 'Trained model using...', 'Architected API with...') and quantify results (e.g., latency, dataset size, validation accuracy).`
    });
  }

  // 3. Score Alignment
  if (similarityScore < 40) {
    recommendations.push({
      title: 'Tailor Vocabulary to Role Requirements',
      category: 'Alignment',
      detail: 'Your estimated skill-weighted similarity is low (<40%). Mirror the industry terminology and phrasing found in the job posting (e.g., specific framework names and lifecycle stages) within your project accomplishments.'
    });
  } else if (similarityScore < 70) {
    recommendations.push({
      title: 'Quantify Achievements & Deepen Keyword Context',
      category: 'Impact',
      detail: 'Strong baseline match! Elevate your score by quantifying your project outcomes (e.g., "Reduced latency by 30%" or "Trained model to 91% validation accuracy") alongside the core tech stack.'
    });
  } else {
    recommendations.push({
      title: 'High Semantic Alignment',
      category: 'Optimization',
      detail: 'Outstanding keyword alignment (>70%)! Ensure links to GitHub repositories, live deployments, and contact info are clean and prominently placed.'
    });
  }

  // 4. DevOps & Cloud Check
  const cloudSkills = new Set(['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd']);
  const missingCloud = missingSkills.filter((s) => cloudSkills.has(s));
  if (missingCloud.length > 0) {
    recommendations.push({
      title: 'Demonstrate Cloud & Deployment Competency',
      category: 'DevOps',
      detail: `Employers value deployment ability. Consider containerizing one of your existing academic projects with Docker or deploying an API to ${missingCloud[0].toUpperCase()} to satisfy the ${missingCloud.map((s) => s.toUpperCase()).join(', ')} requirement.`
    });
  }

  // 5. Formatting
  recommendations.push({
    title: 'Structure Bullets with Google XYZ Formula',
    category: 'Formatting',
    detail: "Format bullet points as: 'Accomplished [X], as measured by [Y], by doing [Z]'. Start each line with strong verbs like Engineered, Architected, Optimized, or Deployed rather than passive phrases."
  });

  return recommendations;
}

/**
 * Complete Match Evaluation Pipeline with Enhanced NLP
 */
export function analyzeResumeAndJob(
  resumeText: string,
  jobText: string,
  jobTitle: string = 'Target Role',
  sourceFilename: string = 'Resume Text'
): SkillMatchResult {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobText);

  // NLP Noun-Phrase Chunking for open-vocabulary discovery
  const discoveredPhrases = extractNounPhrases(resumeText, resumeSkills);

  // Contextual relevance scoring against action verbs
  const contextScores = analyzeContextualRelevance(resumeText, resumeSkills);

  // Skill-Weighted TF-IDF Vectorization
  const { similarityScore, topTerms } = computeSkillWeightedTfidfSimilarity(
    resumeText,
    jobText,
    resumeSkills,
    jobSkills
  );

  const matchedSkills = jobSkills.filter((s) => resumeSkills.includes(s));
  const missingSkills = jobSkills.filter((s) => !resumeSkills.includes(s));
  const additionalSkills = resumeSkills.filter((s) => !jobSkills.includes(s));

  const skillCoverage = jobSkills.length > 0
    ? Math.round((matchedSkills.length / jobSkills.length) * 1000) / 10
    : 0;

  const recommendations = generateNlpRecommendations(
    missingSkills,
    matchedSkills,
    similarityScore,
    contextScores
  );

  const now = new Date();
  const timestamp = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString()}`;

  return {
    jobTitle: jobTitle || 'Target Role',
    sourceFilename,
    similarityScore,
    skillCoverage,
    matchedSkills,
    missingSkills,
    additionalSkills,
    discoveredPhrases,
    topTerms,
    recommendations,
    resumeWordCount: resumeText.trim().split(/\s+/).length,
    jobWordCount: jobText.trim().split(/\s+/).length,
    timestamp
  };
}

/**
 * AI Suggestions Generator based directly on the candidate's Resume
 */
export function generateResumeAiSuggestions(resumeText: string): ResumeAiSuggestions {
  const lower = resumeText.toLowerCase();
  const detectedSkills = extractSkills(resumeText);
  const detectedPhrases = extractNounPhrases(resumeText, detectedSkills);

  // Domain Detection Heuristics
  const mlKeywords = ['machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'nlp', 'data science', 'keras'];
  const webKeywords = ['react', 'html', 'css', 'javascript', 'typescript', 'vue', 'angular', 'frontend', 'tailwind', 'bootstrap'];
  const backendKeywords = ['flask', 'django', 'fastapi', 'node.js', 'express', 'spring boot', 'sql', 'postgresql', 'mongodb', 'rest api', 'microservice'];
  const biKeywords = ['power bi', 'tableau', 'excel', 'data analysis', 'sql', 'business intelligence'];

  const mlScore = mlKeywords.filter((k) => lower.includes(k)).length;
  const webScore = webKeywords.filter((k) => lower.includes(k)).length;
  const backendScore = backendKeywords.filter((k) => lower.includes(k)).length;
  const biScore = biKeywords.filter((k) => lower.includes(k)).length;

  let primaryDomain = 'Software Engineering';
  if (mlScore >= webScore && mlScore >= backendScore && mlScore >= biScore && mlScore > 0) {
    primaryDomain = 'Artificial Intelligence & Machine Learning';
  } else if (backendScore >= webScore && backendScore >= biScore && backendScore > 0) {
    primaryDomain = 'Backend & Distributed Systems';
  } else if (webScore >= biScore && webScore > 0) {
    primaryDomain = 'Frontend & Full-Stack Development';
  } else if (biScore > 0) {
    primaryDomain = 'Data Analytics & Business Intelligence';
  }

  // Action verbs and metrics count
  let actionVerbCount = 0;
  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = resumeText.match(regex);
    if (matches) actionVerbCount += matches.length;
  }

  const metricsMatches = resumeText.match(/\b(?:\d+%(?:\s+increase|\s+reduction|\s+accuracy)?|\d+x|\$\d+|\d+\s*(?:ms|seconds|users|records|gb|mb))\b/gi) || [];
  const metricsPresent = metricsMatches.length > 0;

  // Section checklist verification
  const hasContact = /\b(?:github\.com|linkedin\.com|email|@|phone|\+?\d{10,})\b/i.test(resumeText);
  const hasSkills = /\b(?:skills|technical skills|technologies|proficiencies|tech stack)\b/i.test(resumeText);
  const hasProjects = /\b(?:projects|portfolio|personal projects|academic projects)\b/i.test(resumeText);
  const hasEducation = /\b(?:education|bachelor|b\.tech|degree|university|college|gpa|cgpa)\b/i.test(resumeText);
  const hasExperience = /\b(?:experience|work experience|internship|intern|employment)\b/i.test(resumeText);

  const sectionChecklist = [
    {
      section: 'Contact & Links (GitHub / LinkedIn)',
      present: hasContact,
      feedback: hasContact ? 'Professional links (GitHub / LinkedIn / email) are present.' : 'Missing explicit GitHub/LinkedIn links or portfolio URL.'
    },
    {
      section: 'Technical Skills Section',
      present: hasSkills,
      feedback: hasSkills ? 'Skills section is clearly delineated and categorizable.' : 'Recommend adding a dedicated Technical Skills section at the top.'
    },
    {
      section: 'Projects & Implementations',
      present: hasProjects,
      feedback: hasProjects ? 'Academic or personal projects section detected.' : 'Crucial: Add 2-3 detailed project breakdowns with measurable outcomes.'
    },
    {
      section: 'Education & Degree Information',
      present: hasEducation,
      feedback: hasEducation ? 'Academic credentials and degree information found.' : 'Ensure degree, branch (AI & DS), CGPA, and expected year are stated.'
    },
    {
      section: 'Experience / Practical Training',
      present: hasExperience,
      feedback: hasExperience ? 'Practical experience or internship section present.' : 'Optional for students, but recommended to list industrial training or club technical roles.'
    }
  ];

  // Impact score calculation
  let score = 45;
  if (detectedSkills.length >= 5) score += 15;
  if (actionVerbCount >= 3) score += 15;
  if (metricsPresent) score += 15;
  if (hasContact && hasProjects && hasEducation) score += 10;
  const impactScore = Math.min(95, Math.max(35, score));

  // Strengths
  const strengths: string[] = [];
  if (detectedSkills.length >= 5) {
    strengths.push(`Broad technical profile with ${detectedSkills.length} identified competencies.`);
  }
  if (actionVerbCount >= 3) {
    strengths.push(`Active voice utilized (${actionVerbCount} engineering action verbs detected).`);
  }
  if (metricsPresent) {
    strengths.push(`Quantified impact markers identified (${metricsMatches.slice(0, 3).join(', ')}).`);
  }
  if (detectedPhrases.length > 0) {
    strengths.push(`Strong domain phrasing: ${detectedPhrases.slice(0, 3).join(', ')}.`);
  }
  if (strengths.length === 0) {
    strengths.push('Clean foundational layout with extractable technical text.');
  }

  // Recommended next skills to learn
  const skillRecs = [];
  if (detectedSkills.includes('python') && !detectedSkills.includes('docker')) {
    skillRecs.push({
      skill: 'Docker & Containerization',
      category: 'DevOps & Deployment',
      reason: 'Recruiters favor candidates who can containerize applications so they run reliably across staging and production.'
    });
  }
  if ((detectedSkills.includes('machine learning') || detectedSkills.includes('scikit-learn')) && !detectedSkills.includes('fastapi')) {
    skillRecs.push({
      skill: 'FastAPI / Flask Model Serving',
      category: 'Model Deployment',
      reason: 'Expose ML models via REST APIs so frontend clients and microservices can consume inference predictions.'
    });
  }
  if (detectedSkills.includes('machine learning') && !detectedSkills.includes('pytorch') && !detectedSkills.includes('tensorflow')) {
    skillRecs.push({
      skill: 'PyTorch',
      category: 'Deep Learning',
      reason: 'Standard framework for modern computer vision, NLP transformers, and deep learning engineering.'
    });
  }
  if (detectedSkills.includes('sql') && !detectedSkills.includes('postgresql')) {
    skillRecs.push({
      skill: 'PostgreSQL',
      category: 'Databases',
      reason: 'Industry-standard relational database with advanced JSONB, indexing, and window functions.'
    });
  }
  if (!detectedSkills.includes('git')) {
    skillRecs.push({
      skill: 'Git & GitHub Actions (CI/CD)',
      category: 'Version Control',
      reason: 'Essential baseline for engineering teams; showcases ability to collaborate in pull request workflows.'
    });
  }
  if (detectedSkills.includes('react') && !detectedSkills.includes('typescript')) {
    skillRecs.push({
      skill: 'TypeScript',
      category: 'Frontend Reliability',
      reason: 'Most modern React positions require TypeScript for type safety and large-scale refactoring.'
    });
  }
  if (skillRecs.length === 0) {
    skillRecs.push({
      skill: 'AWS / Cloud Deployment',
      category: 'Cloud Engineering',
      reason: 'Deploy applications to AWS EC2 or Lambda to demonstrate real-world cloud competence.'
    });
  }

  // Tailored Project Ideas
  let projectIdeas = [];
  if (primaryDomain.includes('Machine Learning') || primaryDomain.includes('Artificial Intelligence')) {
    projectIdeas = [
      {
        title: 'End-to-End ML Pipeline with Model Serving & Validation',
        description: 'Build a predictive model (e.g., churn or fraud detection) using scikit-learn, serve predictions with a FastAPI microservice, and package with Docker.',
        techStack: ['Python', 'scikit-learn', 'FastAPI', 'Docker', 'Postman']
      },
      {
        title: 'NLP Semantic Text Analysis & Recommendation Engine',
        description: 'Develop a text analysis tool utilizing TF-IDF and transformer embeddings to rank and classify feedback, featuring a clean visual dashboard.',
        techStack: ['Python', 'NLTK', 'scikit-learn', 'Pandas', 'Flask/FastAPI']
      }
    ];
  } else if (primaryDomain.includes('Backend')) {
    projectIdeas = [
      {
        title: 'Scalable RESTful API with Role-Based Access Control',
        description: 'Design a modular microservice with database persistence, JWT authentication, rate limiting, and an automated testing suite.',
        techStack: ['Python', 'Flask/Django', 'PostgreSQL', 'Docker', 'Git']
      },
      {
        title: 'Asynchronous Task Queue & Cache Layer',
        description: 'Implement a background worker processing scheduled and heavy tasks with Redis and database state persistence.',
        techStack: ['Python', 'Redis', 'PostgreSQL', 'REST API']
      }
    ];
  } else {
    projectIdeas = [
      {
        title: 'Interactive Full-Stack Analytics Dashboard',
        description: 'Build a responsive web application connecting a database to a clean interface, with live KPI aggregations, CSV exports, and dynamic filtering.',
        techStack: ['JavaScript/TypeScript', 'React', 'Node.js/Flask', 'SQL']
      },
      {
        title: 'Automated Data Extraction & ETL Pipeline',
        description: 'Create an automated pipeline extracting data from APIs, transforming schemas with Pandas, and writing cleaned records to a database.',
        techStack: ['Python', 'SQL', 'Pandas', 'REST API']
      }
    ];
  }

  // Bullet Rewrites following Google XYZ formula
  const bulletRewrites = [
    {
      before: 'Worked on machine learning model for dataset analysis.',
      after: 'Engineered an end-to-end predictive classification pipeline with scikit-learn and Pandas, achieving 88% ROC-AUC and reducing false positives by 18%.',
      principle: 'Google XYZ Formula: Stated the accomplishment, the quantitative metric, and the tech stack.'
    },
    {
      before: 'Responsible for building backend endpoints and database queries.',
      after: 'Architected 12+ RESTful API endpoints in Flask and PostgreSQL with JWT authorization, handling 200+ req/sec with sub-50ms latency.',
      principle: 'Action verb replacement: Replaced passive "Responsible for" with "Architected" + scale metrics.'
    },
    {
      before: 'Made a dashboard for sales data visualization.',
      after: 'Designed an interactive Power BI dashboard tracking revenue KPIs across 4 regions, uncovering $35K in inventory cost optimization.',
      principle: 'Business Impact: Tied data visualization directly to financial / decision-making value.'
    }
  ];

  return {
    primaryDomain,
    detectedSkills,
    detectedPhrases,
    impactScore,
    metricsPresent,
    actionVerbCount,
    strengths,
    skillRecommendations: skillRecs.slice(0, 4),
    projectIdeas,
    bulletRewrites,
    sectionChecklist
  };
}
