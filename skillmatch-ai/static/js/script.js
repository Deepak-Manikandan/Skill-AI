/**
 * SkillMatch AI – Client-Side Interactions & Sample Presets
 */

// Sample Data Library for Testing and Demonstration
const SAMPLE_PRESETS = {
    ml_intern: {
        title: "Machine Learning Engineering Intern",
        jobDescription: `Role: Machine Learning Intern (6-Month Placement)
Location: Remote / Hybrid

About the Role:
We are looking for an enthusiastic Machine Learning Intern with foundational knowledge of Artificial Intelligence and Data Science. You will assist our AI engineering team in data preprocessing, feature engineering, and model prototyping.

Key Responsibilities:
- Build and evaluate predictive models using Python, scikit-learn, and Pandas.
- Prepare, clean, and analyze tabular datasets using NumPy and SQL.
- Implement machine learning algorithms (Random Forest, Gradient Boosting, Linear Regression).
- Collaborate with engineers using Git for version control.
- Experience with Deep Learning (TensorFlow or PyTorch) and Natural Language Processing (NLP) is a plus.
- Exposure to containerization (Docker) and AWS is desirable.

Required Qualifications:
- Pursuing a Degree in Computer Science, Artificial Intelligence, Data Science, or related field.
- Proficiency in Python programming and standard data science libraries (NumPy, Pandas, scikit-learn).
- Basic understanding of SQL queries and relational databases.
- Familiarity with Git, GitHub, and collaborative workflows.`,
        resume: `JOHNATHAN DOE
AI & Data Science Engineering Student | GitHub: github.com/johndoe-ai | LinkedIn: linkedin.com/in/johndoe

EDUCATION
Bachelor of Technology in Artificial Intelligence and Data Science (Third Year)
CGPA: 8.9 / 10.0 | Expected Graduation: 2026

TECHNICAL SKILLS
- Languages: Python, Java, C++, SQL
- Libraries & ML: scikit-learn, Pandas, NumPy, Matplotlib, Seaborn
- Core Concepts: Machine Learning, Data Analysis, Natural Language Processing (NLP), Data Preprocessing
- Developer Tools: Git, GitHub, VS Code, Jupyter Notebook

ACADEMIC & PORTFOLIO PROJECTS
1. Predictive Customer Churn Analysis
   - Developed end-to-end machine learning pipeline using Python, Pandas, and scikit-learn.
   - Performed exploratory data analysis (EDA) with Seaborn and Matplotlib; engineered 12 new features.
   - Evaluated Random Forest and XGBoost classifiers, achieving 87% ROC-AUC score.
   
2. Sentiment Classifier for Movie Reviews
   - Built an NLP text classification system with TF-IDF vectorization and Logistic Regression.
   - Processed 50,000 text records, achieving 89% test accuracy; tracked changes using Git.

3. Student Database Query Tool
   - Created relational database schemas using SQL and MySQL; wrote complex joins and aggregation queries.`
    },
    python_dev: {
        title: "Junior Python Backend Developer",
        jobDescription: `Position: Junior Python Backend Developer
Department: Engineering

We are seeking a Junior Python Developer to assist in building RESTful APIs and backend microservices.

Requirements:
- Strong foundations in Python, Flask, or Django framework.
- Experience designing and querying SQL databases (PostgreSQL, MySQL).
- Understanding of HTML, CSS, JavaScript, and REST APIs.
- Experience with Git and version control best practices.
- Exposure to Docker and Linux environments is preferred.
- Ability to write clean, maintainable, and modular Python code.`,
        resume: `ALEX RIVERA
Software Developer & Student | Portfolio: alexrivera.dev

TECHNICAL PROFILE
Languages: Python, JavaScript, SQL, HTML, CSS
Frameworks & Libraries: Flask, Django, Express, Node.js
Databases: PostgreSQL, SQLite
Tools & Environments: Git, GitHub, Docker, Linux, Postman

EXPERIENCE & PROJECTS
- RESTful Task Management API: Built backend service in Python using Flask and PostgreSQL. Implemented JWT authentication and CRUD endpoints.
- E-Commerce Microservice: Created catalog service using Django and Docker containers.
- Version Control: Managed multi-branch Git workflow and automated testing scripts on Linux.`
    },
    data_analyst: {
        title: "Junior Data Analyst",
        jobDescription: `Job Opportunity: Junior Data Analyst
Organization: FinAnalytics Global

Requirements:
- Bachelor's degree in Data Science, Statistics, Mathematics, or Computer Science.
- High proficiency in SQL, Excel, and Python for data analysis.
- Experience creating executive dashboards in Power BI or Tableau.
- Knowledge of Pandas, NumPy, and Data Visualization techniques.
- Strong analytical mindset with ability to present data-driven findings.`,
        resume: `SARAH CHEN
Data Analyst | B.Tech Artificial Intelligence & Data Science

SUMMARY
Data-driven student with solid experience in SQL data manipulation, Python exploratory analysis, and business intelligence visualization.

TECHNICAL SKILLS
- Analysis & Querying: SQL, Python, Advanced Excel, Pandas, NumPy
- Business Intelligence: Power BI, Tableau, Matplotlib, Seaborn
- Core Competencies: Data Analysis, Data Cleaning, Statistical Modeling
- Other: Git, Jupyter Notebooks

PROJECTS
- Retail Sales Dashboard: Built interactive Power BI dashboard tracking monthly revenue and churn across 15 regions.
- Exploratory COVID-19 Dataset Analysis: Cleaned and analyzed 100k+ rows with Pandas; generated charts with Seaborn.`
    }
};

// Tab Switching (Upload PDF vs Paste Text)
function switchResumeTab(mode) {
    const uploadBtn = document.getElementById('tabUploadBtn');
    const pasteBtn = document.getElementById('tabPasteBtn');
    const uploadPane = document.getElementById('uploadPane');
    const pastePane = document.getElementById('pastePane');
    const resumeFileInput = document.getElementById('resumeFileInput');
    const resumeTextArea = document.getElementById('resume_text');

    if (!uploadBtn || !pasteBtn) return;

    if (mode === 'upload') {
        uploadBtn.classList.add('active');
        pasteBtn.classList.remove('active');
        uploadPane.classList.add('active');
        pastePane.classList.remove('active');
    } else {
        pasteBtn.classList.add('active');
        uploadBtn.classList.remove('active');
        pastePane.classList.add('active');
        uploadPane.classList.remove('active');
    }
}

// File Drag & Drop Handling
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('resumeFileInput');
    const filePreview = document.getElementById('filePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const matchForm = document.getElementById('matchForm');

    if (dropZone && fileInput) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('dragover');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                    fileInput.files = files;
                    showFilePreview(file.name);
                } else {
                    alert('Please select a valid PDF file (.pdf).');
                }
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files.length > 0) {
                showFilePreview(fileInput.files[0].name);
            }
        });
    }

    // Form submission validation
    if (matchForm) {
        matchForm.addEventListener('submit', (e) => {
            const jobDesc = document.getElementById('job_description')?.value.trim() || '';
            const resumeText = document.getElementById('resume_text')?.value.trim() || '';
            const fileInput = document.getElementById('resumeFileInput');
            const hasFile = fileInput && fileInput.files && fileInput.files.length > 0;

            if (!jobDesc) {
                e.preventDefault();
                alert('Please provide a job description.');
                return;
            }

            if (!hasFile && !resumeText) {
                e.preventDefault();
                alert('Please upload a PDF resume or paste your resume text before analyzing.');
                return;
            }
        });
    }
});

function showFilePreview(fileName) {
    const filePreview = document.getElementById('filePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const dropContent = document.querySelector('.drop-content');
    if (filePreview && fileNameDisplay) {
        fileNameDisplay.textContent = fileName;
        filePreview.style.display = 'inline-flex';
        if (dropContent) dropContent.style.opacity = '0.35';
    }
}

function removeSelectedFile(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const fileInput = document.getElementById('resumeFileInput');
    const filePreview = document.getElementById('filePreview');
    const dropContent = document.querySelector('.drop-content');
    if (fileInput) fileInput.value = '';
    if (filePreview) filePreview.style.display = 'none';
    if (dropContent) dropContent.style.opacity = '1';
}

// Quick Sample Preset Loader
function loadSample(key) {
    const preset = SAMPLE_PRESETS[key];
    if (!preset) return;

    // Switch to paste tab so the user can see the populated resume text
    switchResumeTab('paste');
    removeSelectedFile();

    const titleField = document.getElementById('job_title');
    const descField = document.getElementById('job_description');
    const resumeField = document.getElementById('resume_text');

    if (titleField) titleField.value = preset.title;
    if (descField) descField.value = preset.jobDescription;
    if (resumeField) resumeField.value = preset.resume;
}

// Clear all inputs
function clearFields() {
    const titleField = document.getElementById('job_title');
    const descField = document.getElementById('job_description');
    const resumeField = document.getElementById('resume_text');

    if (titleField) titleField.value = '';
    if (descField) descField.value = '';
    if (resumeField) resumeField.value = '';
    removeSelectedFile();
}
