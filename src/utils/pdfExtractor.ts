/**
 * SkillMatch AI – PDF Text Extractor
 * Reads uploaded PDF resume files in the browser using pdfjs-dist.
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker using CDN to ensure smooth client-side parsing without complex bundler worker configs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromPdf(file: File): Promise<{ text: string; error?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const textPieces: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean);
      textPieces.push(pageStrings.join(' '));
    }

    const fullText = textPieces.join('\n\n').trim();

    if (!fullText || fullText.length < 30) {
      return {
        text: '',
        error: 'The uploaded PDF appears empty or contains non-extractable scanned images. Please paste text directly or use a PDF with selectable text.'
      };
    }

    return { text: fullText };
  } catch (err: any) {
    console.error('PDF extraction failed:', err);
    return {
      text: '',
      error: `Failed to read PDF resume: ${err?.message || 'Unsupported format'}. You can paste resume text directly instead.`
    };
  }
}
