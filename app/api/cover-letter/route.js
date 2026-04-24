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

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API key not configured.' }, { status: 500 })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [{ role: 'user', content: coverLetterPrompt(jobDescription, cvText) }],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenRouter error:', err)
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 502 })
    }

    const data = await response.json()
    const coverLetter = data.choices?.[0]?.message?.content

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
