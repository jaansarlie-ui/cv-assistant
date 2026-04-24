// app/api/analyse/route.js
// POST /api/analyse
// Receives CV + job description, returns AI analysis

import { NextResponse } from 'next/server'
import { cvAnalysisPrompt } from '@/lib/prompts'

export async function POST(request) {
  try {
    const { jobDescription, cvText, jobTitle, companyName } = await request.json()

    // Basic validation
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

    // Call Gemini API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [{ role: 'user', content: cvAnalysisPrompt(jobDescription, cvText) }],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini API error:', err)
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 502 })
    }

    const data = await response.json()
    const rawText = data.choices?.[0]?.message?.content

    if (!rawText) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 502 })
    }

    // Parse the JSON response from the AI
    // Strip any accidental markdown fences the model might add
    const cleaned = rawText.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(cleaned)

    return NextResponse.json({ success: true, analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
