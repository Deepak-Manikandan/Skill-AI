# SkillMatch AI – Resume & Job Matcher
**AI/ML Portfolio Project for Third-Year Artificial Intelligence & Data Science Engineering Students**
*(Enhanced NLP & Part-of-Speech Chunking Edition)*

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Framework-Flask_3.0-lightgrey.svg)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/Machine%20Learning-scikit--learn-orange.svg)](https://scikit-learn.org/)
[![NLTK](https://img.shields.io/badge/NLP-NLTK_POS_Chunking-brightgreen.svg)](https://www.nltk.org/)
[![TF-IDF](https://img.shields.io/badge/Vectorization-Skill--Weighted_TF--IDF-blueviolet.svg)](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 1. Project Overview

**SkillMatch AI** is an intelligent career-technology web application that bridges the gap between job seekers and target employment opportunities. Built with **Python, Flask, NLTK, and scikit-learn**, it allows candidates to upload a resume in PDF format (or paste plain text) and evaluate it against a target job description.

Unlike simplistic keyword-matching scripts, SkillMatch AI employs a multi-stage **Natural Language Processing (NLP)** pipeline:
1. **Part-of-Speech (POS) Tagging & Noun-Phrase (NP) Chunking:** Discovers domain phrases dynamically without relying exclusively on hardcoded dictionaries.
2. **Contextual Action-Verb Relevance Scoring:** Assesses whether candidate skills appear in active project achievements (e.g., *"trained"*, *"architected"*, *"optimized"*) rather than passive bullet points.
3. **Skill-Weighted TF-IDF Vectorization:** Applies an adaptive domain boost to technical competencies, ensuring cosine similarity measures true technical alignment instead of common vocabulary overlap.

---

## 2. Advanced NLP Architecture & Workflow

```text
+-----------------------+                +-------------------------+
|     Resume Input      |                | Job Description Input   |
| (PDF via pypdf stream |                | (Plain Text via Form)   |
|  or Pasted Text)      |                |                         |
+-----------+-----------+                +------------+------------+
            |                                         |
            v                                         v
+------------------------------------------------------------------+
|           Text Preprocessing & Technical Token Normalization     |
| (Preserves C++, .NET, scikit-learn, Node.js, and CI/CD syntax)   |
+-------------------------------+----------------------------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
        v                                               v
+-------------------------------+       +---------------------------------+
|  NLTK POS Tagging & Chunking  |       | Knowledge-Based Ontology        |
|  Pattern: {<JJ>*<NN|NNP>+}    |       | (45+ Canonical Skills with      |
|  Extracts multi-word domain   |       |  Boundary-Safe Alias Mapping)   |
|  compounds (e.g. 'predictive  |       +---------------+-----------------+
|  modeling', 'data pipeline')  |                       |
+---------------+---------------+                       |
                |                                       |
                +-------------------+-------------------+
                                    |
                                    v
+------------------------------------------------------------------+
|         Contextual Relevance & Action-Verb Proximity Scoring     |
| (Evaluates proximity to verbs: 'engineered', 'trained', 'built') |
+-----------------------------------+------------------------------+
                                    |
                                    v
+------------------------------------------------------------------+
|               Skill-Weighted TF-IDF Vectorizer                   |
| - Sublinear Term Frequency: 1 + ln(TF)                           |
| - Smoothed IDF: ln((1 + N)/(1 + df)) + 1                         |
| - Domain Skill Multiplier: 1.85x weight on technical entities    |
+-----------------------------------+------------------------------+
                                    |
                                    v
+------------------------------------------------------------------+
|                  Cosine Similarity Computation                   |
|                 cos(θ) = (A·B) / (||A||₂ × ||B||₂)               |
|            => 0.0% to 100.0% Estimated Text Similarity           |
+-----------------------------------+------------------------------+
                                    |
                                    v
+------------------------------------------------------------------+
|                  Flask Results Dashboard & Export                |
| (Circular Gauge, Green/Red/Blue Badges, NLP Phrases, TXT Report) |
+------------------------------------------------------------------+
```

---

## 3. Benefits of NLP Over Naive Keyword Dictionaries

| Dimension | Naive Dictionary Matching | SkillMatch AI Enhanced NLP Pipeline |
| :--- | :--- | :--- |
| **Open Vocabulary** | Fails on new/emerging skills absent from the list. | **POS Noun-Phrase Chunking** captures unseen multi-word technical compounds (e.g. *"transfer learning"*, *"distributed caching"*). |
| **Grammatical Disambiguation** | Confuses homographs (e.g., *"train"* as a verb vs. vehicle; *"lead"* as verb vs. role). | **POS Tagging (`NN`, `NNP`, `JJ`)** verifies syntactic category before candidate selection. |
| **Contextual Evidence** | Treats a passive word in a list identically to a deployed project. | **Action-Verb Proximity** evaluates active implementation verbs (*"architected"*, *"trained"*, *"optimized"*). |
| **Vector Weighting** | Standard TF-IDF weighs all terms equally by document frequency. | **Skill-Boosted TF-IDF** applies a $1.85\times$ domain multiplier to domain entities, driving cosine similarity by genuine tech alignment. |

---

## 4. Mathematical Foundations

### A. Skill-Boosted TF-IDF Weighting
For each term $t$ in document $d$:
$$\text{TF-IDF}_{\text{boosted}}(t, d) = \omega(t) \times \left(1 + \ln(\text{TF}(t, d))\right) \times \left(\ln\left(\frac{1 + N}{1 + \text{df}(t)}\right) + 1\right)$$

Where the domain factor $\omega(t)$ is defined as:
$$\omega(t) = \begin{cases} 
1.85 & \text{if } t \in \text{Domain Skills} \cup \text{POS Extracted Noun-Phrases} \\
1.00 & \text{otherwise}
\end{cases}$$

### B. Cosine Similarity Formula
Cosine similarity measures the angle between the enriched vector representations:
$$\text{Similarity}(\mathbf{A}, \mathbf{B}) = \cos(\theta) = \frac{\sum_{i=1}^{m} A_i B_i}{\sqrt{\sum_{i=1}^{m} A_i^2} \sqrt{\sum_{i=1}^{m} B_i^2}}$$

---

## 5. Project Directory Structure

```text
skillmatch-ai/
│
├── app.py                     # Flask application with NLTK POS chunking & weighted TF-IDF
├── requirements.txt           # Python dependencies (Flask, scikit-learn, nltk, pypdf)
├── README.md                  # Comprehensive documentation and interview guide
├── .gitignore                 # Ignores venv, uploads, pycache
│
├── templates/                 # Jinja2 HTML Templates
│   ├── index.html             # Upload form, drag-and-drop, and sample presets
│   └── results.html           # Results dashboard, gauge, and NLP phrase cards
│
├── static/                    # Static Assets
│   ├── css/
│   │   └── style.css          # Deep navy & electric indigo modern SaaS styling
│   └── js/
│       └── script.js          # Tab switching, preset loader, client validation
│
└── uploads/                   # Temporary directory for file uploads
    └── .gitkeep
```

---

## 6. Step-by-Step Setup Guide (Windows / VS Code)

### Step 1: Open Folder in VS Code
1. Open Visual Studio Code.
2. Select **File > Open Folder...** and choose `skillmatch-ai`.

### Step 2: Open Terminal
Press `` Ctrl + ` `` or go to **Terminal > New Terminal**.

### Step 3: Create & Activate Virtual Environment
```powershell
# Create environment
python -m venv venv

# Activate on Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# (Or on macOS/Linux)
source venv/bin/activate
```

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```
*(Includes `Flask`, `scikit-learn`, `nltk`, `pypdf`, `pandas`, `numpy`)*

### Step 5: Run the Flask Application
```bash
python app.py
```
*(NLTK will automatically download required tokenizers `punkt` and `averaged_perceptron_tagger` quietly on first run)*.

### Step 6: Open in Browser
Navigate to:
```
http://127.0.0.1:5000
```

---

## 7. Testing Presets & Expected Outputs

1. **Preset: Machine Learning Intern**
   - Click the **"ML Intern"** button on the home page.
   - Click **"Analyze Match & Skill Gap"**.
   - **Expected Output:**
     - **Skill-Weighted Similarity:** ~55%–68% (Moderate/High Match).
     - **Matched Skills (Green):** Python, SQL, scikit-learn, Pandas, NumPy, Machine Learning, NLP.
     - **NLP Discovered Domain Phrases:** *predictive modeling*, *exploratory data analysis*, *customer churn analysis*.
     - **Missing Skills (Red):** Docker, AWS, PyTorch.

2. **PDF Resume Test:**
   - Upload any valid PDF resume and paste target job qualifications.
   - Download the full formatted `.txt` analysis report with one click.

---

## 8. Placement Interview Q&A Cheatsheet

- **Q: Why combine rule-based dictionary matching with NLTK POS Chunking?**  
  *A:* "A hybrid approach combines the precision of an established canonical ontology with the open-vocabulary recall of Part-of-Speech noun-phrase chunking. The dictionary guarantees zero false-positives for core languages, while POS chunking uncovers novel compound methodologies (e.g., 'feature engineering', 'distributed caching')."

- **Q: What is the purpose of Skill-Weighted TF-IDF?**  
  *A:* "Standard TF-IDF treats all overlapping terms uniformly based on inverse document frequency. By applying a domain multiplier ($1.85\times$) to recognized technical skills and noun phrases, we ensure that the cosine similarity angle is primarily steered by technical qualifications rather than incidental conversational words."

- **Q: How does the system handle action verb context?**  
  *A:* "It checks sentence-level co-occurrence between candidate skills and active engineering verbs (*'trained'*, *'deployed'*, *'architected'*) as well as quantifiable impact metrics, distinguishing active implementation from a mere passive skill list."

---

*SkillMatch AI – Developed by an Artificial Intelligence & Data Science Engineering Student.*
