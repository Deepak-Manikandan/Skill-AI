"""
SkillMatch AI – Resume & Job Matcher (Enhanced NLP Edition)
Author: AI & Data Science Engineering Student Portfolio Project
Description: Advanced Natural Language Processing (NLP) pipeline combining POS tagging,
             Noun-Phrase (NP) chunking, contextual action-verb relevance scoring,
             and Skill-Weighted TF-IDF Vectorization with Cosine Similarity.
"""

import os
import re
import io
import math
from datetime import datetime
from collections import defaultdict
from flask import Flask, render_template, request, flash, redirect, url_for, Response, jsonify
from werkzeug.utils import secure_filename
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pypdf import PdfReader

# NLP Library: NLTK for POS Tagging, Tokenization & Phrase Chunking
try:
    import nltk
    from nltk.tokenize import word_tokenize, sent_tokenize
    from nltk.tag import pos_tag
    from nltk.chunk import RegexpParser
    from nltk.corpus import stopwords
    
    # Download required NLTK data quietly if missing
    for resource in ['punkt', 'punkt_tab', 'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng', 'stopwords']:
        try:
            nltk.download(resource, quiet=True)
        except Exception:
            pass
    NLTK_AVAILABLE = True
except Exception:
    NLTK_AVAILABLE = False

# Initialize Flask Application
app = Flask(__name__)

# Security & Upload Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'skillmatch-ai-insecure-dev-key-change-in-prod')
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5 MB max upload
ALLOWED_EXTENSIONS = {'pdf'}

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# =====================================================================
# Curated Technical Ontology & Normalization Map
# =====================================================================
SKILL_DICTIONARY = {
    # Programming Languages
    'python': ['python', 'py'],
    'java': ['java'],
    'c++': ['c++', 'cpp'],
    'c': ['c language'],
    'c#': ['c#', 'csharp', 'c-sharp'],
    'javascript': ['javascript', 'js', 'es6', 'ecmascript'],
    'typescript': ['typescript', 'ts'],
    'r': ['r programming', 'r-lang', 'r language'],
    'go': ['golang', 'go language'],
    'rust': ['rust'],
    'php': ['php'],
    'ruby': ['ruby'],

    # Web & Frameworks
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

    # Data Science & Machine Learning
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

    # Databases & Big Data
    'sql': ['sql', 'mysql', 'structured query language'],
    'postgresql': ['postgresql', 'postgres'],
    'mongodb': ['mongodb', 'mongo'],
    'redis': ['redis'],
    'sqlite': ['sqlite'],
    'spark': ['apache spark', 'pyspark', 'spark'],
    'hadoop': ['hadoop', 'apache hadoop'],

    # Cloud & DevOps
    'aws': ['aws', 'amazon web services'],
    'azure': ['azure', 'microsoft azure'],
    'gcp': ['gcp', 'google cloud', 'google cloud platform'],
    'docker': ['docker', 'containerization'],
    'kubernetes': ['kubernetes', 'k8s'],
    'git': ['git', 'github', 'gitlab', 'version control'],
    'ci/cd': ['ci/cd', 'cicd', 'continuous integration', 'jenkins', 'github actions'],
    'linux': ['linux', 'bash', 'shell scripting', 'unix'],

    # Business Intelligence & Tools
    'power bi': ['power bi', 'powerbi'],
    'tableau': ['tableau'],
    'excel': ['excel', 'advanced excel', 'microsoft excel'],
    'jira': ['jira'],
    'rest api': ['rest api', 'restful api', 'api development', 'apis']
}

# Contextual Action Verbs signifying active application of skills in projects
ACTION_VERBS = {
    'developed', 'built', 'engineered', 'architected', 'implemented', 'trained',
    'optimized', 'deployed', 'designed', 'created', 'modeled', 'fine-tuned',
    'scaled', 'configured', 'evaluated', 'analyzed', 'automated', 'integrated',
    'refactored', 'administered', 'programmed', 'authored'
}

# In-memory storage for exportable report
LATEST_ANALYSIS = {}


# =====================================================================
# PDF Extraction & Helper Functions
# =====================================================================

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_pdf(file_stream):
    """
    Extract text content from an uploaded PDF stream using pypdf.
    Handles corrupt, empty, or unreadable PDF streams safely.
    """
    try:
        reader = PdfReader(file_stream)
        text_content = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_content.append(page_text)
        
        extracted = "\n".join(text_content).strip()
        if not extracted:
            return None, "The uploaded PDF appears to be empty or contains scanned images without selectable text."
        return extracted, None
    except Exception as e:
        return None, f"Unable to read PDF file. Error: {str(e)}"


def clean_text(text):
    """
    Normalize text while preserving technical syntax (C++, .NET, CI/CD, etc.)
    """
    if not text:
        return ""
    cleaned = text.lower()
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned.strip()


# =====================================================================
# Enhanced NLP Skill Extraction Pipeline (POS Tagging & NP Chunking)
# =====================================================================

def extract_pos_noun_phrases(text):
    """
    NLP Noun-Phrase (NP) Chunking:
    Uses Part-of-Speech tagging to identify multi-word technical concepts
    matching patterns such as:
    - Adjective + Noun (e.g. 'predictive modeling', 'exploratory analysis', 'neural network')
    - Noun + Noun (e.g. 'feature engineering', 'data pipeline', 'cloud deployment')
    - Multi-noun technical compounds (e.g. 'object oriented programming', 'microservices architecture')
    """
    noun_phrases = []
    
    if NLTK_AVAILABLE:
        try:
            # Sentence tokenization and POS tagging
            sentences = sent_tokenize(text)
            # Regex Chunk Grammar: optional modifiers + one or more nouns
            chunk_grammar = r"""
                NP: {<JJ|JJR|JJS>*<NN|NNS|NNP|NNPS>+}
            """
            chunk_parser = RegexpParser(chunk_grammar)

            for sentence in sentences:
                tokens = word_tokenize(sentence)
                tagged = pos_tag(tokens)
                tree = chunk_parser.parse(tagged)

                for subtree in tree.subtrees():
                    if subtree.label() == 'NP':
                        words = [w.lower() for w, t in subtree.leaves() if len(w) > 2]
                        if 1 < len(words) <= 4:  # Compound phrases of 2-4 words
                            phrase = " ".join(words)
                            # Filter out non-technical generic stop words
                            if not any(w in {'year', 'month', 'experience', 'day', 'time', 'team', 'work'} for w in words):
                                noun_phrases.append(phrase)
        except Exception:
            pass

    # Regex Fallback Heuristic for compound domain phrases if NLTK is unavailable
    if not noun_phrases:
        pattern = r'\b(?:deep|machine|data|cloud|neural|supervised|unsupervised|predictive|agile|version|continuous)\s+[a-z]{3,}\b'
        for match in re.finditer(pattern, text.lower()):
            noun_phrases.append(match.group(0))

    return list(set(noun_phrases))


def analyze_contextual_relevance(text, identified_skills):
    """
    Contextual Relevance Scoring:
    Evaluates whether an identified skill appears in active project contexts
    (near strong action verbs like 'trained', 'implemented', 'optimized')
    or merely inside a passive list.
    
    Returns:
        context_scores (dict): mapping skill -> score (0.0 to 1.0)
    """
    context_scores = {}
    sentences = re.split(r'[.\n!?]+', text.lower())

    for skill in identified_skills:
        skill_relevance = 0.5  # Base presence score
        
        for sent in sentences:
            if skill in sent:
                # Check for proximity to action verbs
                has_action = any(verb in sent for verb in ACTION_VERBS)
                has_metric = bool(re.search(r'\b(?:\d+%|\d+x|\$\d+|\d+\s*(?:ms|seconds|users|records|gb))\b', sent))
                
                if has_action and has_metric:
                    skill_relevance = max(skill_relevance, 1.0)
                elif has_action:
                    skill_relevance = max(skill_relevance, 0.85)

        context_scores[skill] = skill_relevance

    return context_scores


def extract_skills_nlp(text):
    """
    Robust NLP Skill Extraction Pipeline:
    1. Knowledge-based Regex Matching with boundary checking & alias resolution.
    2. NLTK Part-of-Speech (POS) Noun-Phrase Chunking for open-vocabulary discovery.
    3. Contextual relevance assessment against action verbs.
    
    Returns:
        canonical_skills (list): Standardized technical skills found
        discovered_phrases (list): Meaningful technical noun-phrases discovered via NLP chunking
        context_relevance (dict): Action-verb context score per skill
    """
    cleaned_lower = f" {clean_text(text)} "
    canonical_skills = set()

    # 1. Taxonomy & Alias Matching
    for canonical_name, aliases in SKILL_DICTIONARY.items():
        for alias in aliases:
            escaped_alias = re.escape(alias)
            pattern = rf'(?:\b|(?<=[^a-zA-Z0-9])){escaped_alias}(?=\b|(?=[^a-zA-Z0-9]))'
            if re.search(pattern, cleaned_lower):
                canonical_skills.add(canonical_name)
                break

    sorted_canonical = sorted(list(canonical_skills))

    # 2. POS Noun-Phrase Chunking for Domain Phrases
    discovered_phrases = extract_pos_noun_phrases(text)
    # Deduplicate discovered phrases that already match a canonical skill
    discovered_phrases = [
        p for p in discovered_phrases 
        if p not in sorted_canonical and not any(s in p for s in sorted_canonical)
    ][:8]  # Keep top 8 informative domain phrases

    # 3. Contextual Relevance Scoring
    context_relevance = analyze_contextual_relevance(text, sorted_canonical)

    return sorted_canonical, discovered_phrases, context_relevance


# =====================================================================
# Skill-Weighted TF-IDF & Cosine Similarity Engine
# =====================================================================

def compute_skill_weighted_tfidf_similarity(resume_text, job_text, resume_skills, job_skills):
    """
    Enhanced TF-IDF & Cosine Similarity:
    Incorporates richer skill representations by applying an adaptive domain
    multiplier (1.8x) to verified technical skills and extracted noun-phrases,
    ensuring cosine similarity reflects technical alignment rather than common vocabulary.
    """
    cleaned_resume = clean_text(resume_text)
    cleaned_job = clean_text(job_text)

    token_pattern = r'(?u)\b[a-zA-Z0-9_+#.-]+\b'

    vectorizer = TfidfVectorizer(
        stop_words='english',
        token_pattern=token_pattern,
        ngram_range=(1, 2),
        sublinear_tf=True
    )

    tfidf_matrix = vectorizer.fit_transform([cleaned_resume, cleaned_job]).toarray()
    feature_names = vectorizer.get_feature_names_out()

    resume_vec = tfidf_matrix[0]
    job_vec = tfidf_matrix[1]

    # Combine known technical skills and noun phrases for domain boosting
    technical_domain_terms = set(resume_skills + job_skills)

    # Apply Skill-Weighting Boost to features
    weighted_resume_vec = []
    weighted_job_vec = []

    for idx, feature in enumerate(feature_names):
        weight_multiplier = 1.0
        # Boost features that match technical skills or multi-word skill components
        for skill in technical_domain_terms:
            if skill in feature or feature in skill:
                weight_multiplier = 1.85
                break

        weighted_resume_vec.append(resume_vec[idx] * weight_multiplier)
        weighted_job_vec.append(job_vec[idx] * weight_multiplier)

    # Compute Cosine Similarity between the skill-boosted vectors
    dot_product = sum(r * j for r, j in zip(weighted_resume_vec, weighted_job_vec))
    norm_resume = math.sqrt(sum(r * r for r in weighted_resume_vec))
    norm_job = math.sqrt(sum(j * j for j in weighted_job_vec))

    similarity_score = 0.0
    if norm_resume > 0 and norm_job > 0:
        similarity = dot_product / (norm_resume * norm_job)
        similarity_score = round(float(min(1.0, max(0.0, similarity))) * 100, 1)

    # Extract Top Informative Overlapping Terms
    overlapping = []
    for idx, term in enumerate(feature_names):
        if resume_vec[idx] > 0 and job_vec[idx] > 0:
            score = weighted_resume_vec[idx] * weighted_job_vec[idx]
            overlapping.append((term, score))

    overlapping.sort(key=lambda x: x[1], reverse=True)
    top_terms = [item[0] for item in overlapping[:12]]

    return similarity_score, top_terms


def generate_nlp_recommendations(missing_skills, matched_skills, similarity_score, context_scores, discovered_phrases):
    """
    Generate contextual, rule-based career recommendations incorporating NLP context.
    """
    recommendations = []

    # 1. Missing Technical Competencies
    if missing_skills:
        top_missing = missing_skills[:5]
        recommendations.append({
            'title': 'Bridge Key Technical Skill Gaps',
            'category': 'Skills',
            'detail': f"The role explicitly specifies {', '.join([s.title() for s in top_missing])}. If you have academic or project experience with these, explicitly feature them in your Skills inventory and Project descriptions."
        })

    # 2. Contextual Action Evidence Check
    low_context_skills = [s for s, score in context_scores.items() if score < 0.7 and s in matched_skills]
    if low_context_skills:
        sample_low = low_context_skills[:3]
        recommendations.append({
            'title': 'Deepen Context for Listed Skills',
            'category': 'Context',
            'detail': f"Skills like {', '.join([s.title() for s in sample_low])} appear passively in your resume. Pair them with active action verbs (e.g. 'Architected with...', 'Trained model using...') and quantify project impact (e.g., latency, dataset size, accuracy)."
        })

    # 3. Score-Specific Guidance
    if similarity_score < 40.0:
        recommendations.append({
            'title': 'Align Vocabulary with Job Posting',
            'category': 'Alignment',
            'detail': "Estimated similarity is low (<40%). Mirror the industry phrasing in the job description across your project bullet points to improve alignment."
        })
    elif similarity_score < 70.0:
        recommendations.append({
            'title': 'Quantify Outcomes & Frame Accomplishments',
            'category': 'Impact',
            'detail': "Solid foundation! Frame your accomplishments using the Google XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]' to elevate into the high-alignment tier."
        })
    else:
        recommendations.append({
            'title': 'Strong Semantic & Technical Alignment',
            'category': 'Optimization',
            'detail': "Outstanding match (>70%)! Ensure hyperlinks to your GitHub, demo websites, and contact channels are verified and prominently placed."
        })

    # 4. DevOps & Cloud Check
    cloud_devops = {'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd'}
    missing_cloud = [s for s in missing_skills if s in cloud_devops]
    if missing_cloud:
        recommendations.append({
            'title': 'Demonstrate Deployment & Containerization',
            'category': 'DevOps',
            'detail': f"Containerization is a frequent hiring differentiator. Containerize one of your machine learning or backend projects with Docker or deploy to {missing_cloud[0].upper()}."
        })

    return recommendations


# =====================================================================
# Routes & Controllers
# =====================================================================

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    job_title = request.form.get('job_title', '').strip() or 'Target Role'
    job_description = request.form.get('job_description', '').strip()
    resume_text = request.form.get('resume_text', '').strip()
    resume_file = request.files.get('resume_file')

    # Input validation
    if not job_description or len(job_description.split()) < 15:
        flash("Please provide a meaningful job description (at least 15 words) for accurate analysis.", "error")
        return redirect(url_for('index'))

    extracted_text = ""
    source_filename = "Pasted Resume Text"

    if resume_file and resume_file.filename != '':
        if not allowed_file(resume_file.filename):
            flash("Invalid file format. Please upload a PDF resume (.pdf).", "error")
            return redirect(url_for('index'))
        
        source_filename = secure_filename(resume_file.filename)
        file_stream = io.BytesIO(resume_file.read())
        pdf_text, error = extract_text_from_pdf(file_stream)
        
        if error:
            flash(error, "error")
            return redirect(url_for('index'))
        extracted_text = pdf_text
    elif resume_text:
        extracted_text = resume_text
    else:
        flash("Please either upload a PDF resume or paste your resume text.", "error")
        return redirect(url_for('index'))

    if len(extracted_text.split()) < 20:
        flash("The resume contains too little readable text (less than 20 words). Please provide a fuller resume.", "error")
        return redirect(url_for('index'))

    # =====================================================================
    # NLP & Machine Learning Pipeline
    # =====================================================================
    # 1. Robust NLP Skill Extraction (POS Tagging + NP Chunking + Context)
    resume_skills, resume_phrases, resume_context = extract_skills_nlp(extracted_text)
    job_skills, job_phrases, _ = extract_skills_nlp(job_description)

    # 2. Skill-Weighted TF-IDF Cosine Similarity
    similarity_score, top_terms = compute_skill_weighted_tfidf_similarity(
        extracted_text, job_description, resume_skills, job_skills
    )

    # 3. Skill Categorization
    matched_skills = [s for s in job_skills if s in resume_skills]
    missing_skills = [s for s in job_skills if s not in resume_skills]
    additional_skills = [s for s in resume_skills if s not in job_skills]

    skill_coverage = 0.0
    if job_skills:
        skill_coverage = round((len(matched_skills) / len(job_skills)) * 100, 1)

    # 4. Generate NLP-Aware Recommendations
    recommendations = generate_nlp_recommendations(
        missing_skills, matched_skills, similarity_score, resume_context, resume_phrases
    )

    # Store analysis data in session dictionary for export
    global LATEST_ANALYSIS
    LATEST_ANALYSIS = {
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'job_title': job_title,
        'source_filename': source_filename,
        'similarity_score': similarity_score,
        'skill_coverage': skill_coverage,
        'matched_skills': matched_skills,
        'missing_skills': missing_skills,
        'additional_skills': additional_skills,
        'discovered_phrases': resume_phrases,
        'top_terms': top_terms,
        'recommendations': recommendations,
        'resume_word_count': len(extracted_text.split()),
        'job_word_count': len(job_description.split())
    }

    return render_template(
        'results.html',
        job_title=job_title,
        source_filename=source_filename,
        similarity_score=similarity_score,
        skill_coverage=skill_coverage,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        additional_skills=additional_skills,
        discovered_phrases=resume_phrases,
        top_terms=top_terms,
        recommendations=recommendations,
        timestamp=LATEST_ANALYSIS['timestamp']
    )


@app.route('/export-report')
def export_report():
    if not LATEST_ANALYSIS:
        flash("No recent analysis found to download. Please run a match first.", "error")
        return redirect(url_for('index'))

    report_lines = [
        "============================================================",
        "          SKILLMATCH AI – RESUME & JOB MATCH REPORT         ",
        "                Enhanced NLP & POS Chunking Edition         ",
        "============================================================",
        f"Generated At    : {LATEST_ANALYSIS['timestamp']}",
        f"Target Role     : {LATEST_ANALYSIS['job_title']}",
        f"Resume Source   : {LATEST_ANALYSIS['source_filename']}",
        "------------------------------------------------------------",
        "1. SCORES & NLP METRICS",
        f"   - Skill-Weighted Text Similarity : {LATEST_ANALYSIS['similarity_score']}% (TF-IDF + Domain Boost)",
        f"   - Required Skill Coverage        : {LATEST_ANALYSIS['skill_coverage']}% ({len(LATEST_ANALYSIS['matched_skills'])} of {len(LATEST_ANALYSIS['matched_skills']) + len(LATEST_ANALYSIS['missing_skills'])} skills found)",
        "",
        "   * Scientific Accuracy Note: Measures mathematical text similarity between",
        "     weighted vocabulary vectors. Does not represent hiring probability.",
        "------------------------------------------------------------",
        "2. SKILL GAP BREAKDOWN",
        f"   [+] Matched Skills ({len(LATEST_ANALYSIS['matched_skills'])}):",
        f"       {', '.join([s.title() for s in LATEST_ANALYSIS['matched_skills']]) if LATEST_ANALYSIS['matched_skills'] else 'None detected'}",
        "",
        f"   [-] Missing Job Skills ({len(LATEST_ANALYSIS['missing_skills'])}):",
        f"       {', '.join([s.title() for s in LATEST_ANALYSIS['missing_skills']]) if LATEST_ANALYSIS['missing_skills'] else 'None! All identified skills found.'}",
        "",
        f"   [*] Additional Resume Skills ({len(LATEST_ANALYSIS['additional_skills'])}):",
        f"       {', '.join([s.title() for s in LATEST_ANALYSIS['additional_skills']]) if LATEST_ANALYSIS['additional_skills'] else 'None'}",
        "------------------------------------------------------------",
        "3. NLP DISCOVERED TECHNICAL PHRASES (POS Chunking)",
        f"   {', '.join(LATEST_ANALYSIS['discovered_phrases']) if LATEST_ANALYSIS['discovered_phrases'] else 'None'}",
        "------------------------------------------------------------",
        "4. TOP OVERLAPPING TECHNICAL KEYWORDS",
        f"   {', '.join(LATEST_ANALYSIS['top_terms']) if LATEST_ANALYSIS['top_terms'] else 'N/A'}",
        "------------------------------------------------------------",
        "5. PERSONALIZED NLP RECOMMENDATIONS",
    ]

    for idx, rec in enumerate(LATEST_ANALYSIS['recommendations'], 1):
        report_lines.append(f"   {idx}. [{rec['category']}] {rec['title']}")
        report_lines.append(f"      {rec['detail']}")
        report_lines.append("")

    report_lines.extend([
        "============================================================",
        "SkillMatch AI – Developed with Python, Flask, NLTK, and scikit-learn",
        "Portfolio Project for AI & Data Science Engineering"
    ])

    report_text = "\n".join(report_lines)
    return Response(
        report_text,
        mimetype="text/plain",
        headers={"Content-Disposition": f"attachment;filename=SkillMatch_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"}
    )


# Error Handlers
@app.errorhandler(413)
def file_too_large(e):
    flash("The uploaded file exceeds the 5 MB maximum size limit. Please upload a smaller file.", "error")
    return redirect(url_for('index')), 413


@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html'), 404


@app.errorhandler(500)
def server_error(e):
    flash("An unexpected error occurred while processing the request. Please try again with valid text or PDF.", "error")
    return redirect(url_for('index')), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
