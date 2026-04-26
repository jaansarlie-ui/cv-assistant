# 🇿🇦 CareerCraft SA — AI-Powered Job Application Assistant

A full-stack web app that helps South African job seekers tailor their CVs and generate cover letters using AI — built with Next.js, Supabase, and the Gemini API.

## 🚀 Live Demo
> https://cv-assistant-lac.vercel.app/

## ✨ Features
- **CV Analyser** — Paste a job description + your CV, get an AI match score and specific improvement tips
- **Cover Letter Generator** — Generate a tailored cover letter in seconds
- **Application Tracker** — Track jobs you've applied to with status updates
- **SA-Aware AI** — Understands NQF levels, BBBEE, and local industries

## 🛠 Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database + Auth | Supabase |
| AI | Google Gemini API |
| Deployment | Vercel |

## 🏃 Running Locally

1. Clone and install
\`\`\`bash
git clone https://github.com/yourusername/cv-assistant
cd cv-assistant && npm install
\`\`\`

2. Create \`.env.local\`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

3. Run: \`npm run dev\`

## 🗄 Database Setup
Run \`supabase/schema.sql\` in your Supabase SQL editor.

## 🧠 How the AI Works
All prompts live in \`lib/prompts.js\` and are tuned for the South African job market — understanding NQF levels, BBBEE requirements, and local industries.
