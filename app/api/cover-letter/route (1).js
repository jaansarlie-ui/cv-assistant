// app/api/cover-letter/route.js
// POST /api/cover-letter
// Receives CV + job description, returns a generated cover letter

import { NextResponse } from 'next/server'
import { coverLetterPrompt } from '@/lib/prompts'

export async function POST(request) {
  try {
    const { jobDescription, cvText, jobTitle, companyName } = await request.json()

    if (!jobDescription || !cvText) {
      return NextResponse.json(
        { error: 'Both jobDescription and cvText are required.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API key not configured.' }, { status: 500 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: coverLetterPrompt(jobDescription, cvText, jobTitle, companyName),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,      // Slightly higher for more natural writing
            maxOutputTokens: 1000,
          },
        }),
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 502 })
    }

    const data = await response.json()
    const coverLetter = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!coverLetter) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 502 })
    }

    return NextResponse.json({ success: true, coverLetter: coverLetter.trim() })
  } catch (error) {
    console.error('Cover letter error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
