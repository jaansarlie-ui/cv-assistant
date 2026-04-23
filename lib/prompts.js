// lib/prompts.js
// All AI prompts live here — easy to iterate and improve in one place

/**
 * CV Analysis Prompt
 * Returns a JSON object with: matchScore, strengths, improvements, keywords
 */
export const cvAnalysisPrompt = (jobDescription, cvText) => `
You are an expert South African recruitment consultant with 15 years of experience 
across industries like fintech, retail, mining, telecoms, and technology.

Analyse the following CV against the job description and respond ONLY with valid JSON.
No markdown, no explanation — just the JSON object.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CV:
${cvText}

Respond with this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": [
    "<specific strength relevant to this job>",
    "<another strength>",
    "<another strength>"
  ],
  "improvements": [
    {
      "area": "<area to improve e.g. 'Missing keywords'>",
      "suggestion": "<specific, actionable advice>"
    }
  ],
  "missingKeywords": ["<keyword from job ad not in CV>"],
  "saContext": "<any notes specific to SA market e.g. NQF level fit, BBBEE relevance>"
}

Be specific and honest. Base everything on the actual content of the CV and job description.
South African context to be aware of: NQF qualification levels (1-10), BBBEE requirements, 
common SA industries, local company names, and SA-specific certifications.
`

/**
 * Cover Letter Generation Prompt
 * Returns a plain text cover letter (not JSON)
 */
export const coverLetterPrompt = (jobDescription, cvText, jobTitle, companyName) => `
You are an expert South African career coach. Write a professional, compelling cover letter
for the following job application.

IMPORTANT RULES:
- Write in a confident, professional tone suited to the South African corporate market
- Do NOT use generic phrases like "I am writing to express my interest"
- Make it specific to this company and role — reference details from the job description
- Keep it to 3-4 paragraphs, under 350 words
- End with a clear call to action
- Do NOT include address blocks, date, or "Dear Sir/Madam" — start directly with the opening paragraph

JOB TITLE: ${jobTitle || 'the advertised position'}
COMPANY: ${companyName || 'your company'}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CV:
${cvText}

Write the cover letter now:
`
