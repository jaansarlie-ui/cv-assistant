'use client'
// app/dashboard/page.jsx
// Main dashboard — the core screen users will spend most time on

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('analyse') // 'analyse' | 'tracker'
  const [jobDescription, setJobDescription] = useState('')
  const [cvText, setCvText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [coverLetter, setCoverLetter] = useState(null)
  const [error, setError] = useState(null)


  const router = useRouter()
  
  const handleAnalyse = async () => {
    if (!jobDescription.trim() || !cvText.trim()) {
      setError('Please fill in both the job description and your CV.')
      return
    }
    setLoading(true)
    setError(null)
    setAnalysis(null)
    setCoverLetter(null)

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, cvText, jobTitle, companyName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLetter = async () => {
    setLoading(true)
    setError(null)
    setCoverLetter(null)

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, cvText, jobTitle, companyName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setCoverLetter(data.coverLetter)
    } catch (err) {
      setError(err.message || 'Cover letter generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColour = (score) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">🇿🇦 CareerCraft SA</h1>
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('analyse')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analyse'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            CV Analyser
          </button>
          <button onClick={() => router.push('/dashboard/tracker')} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            Application Tracker
          </button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'analyse' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">CV Analyser</h2>
              <p className="text-gray-500 mt-1">
                Paste a job description and your CV — our AI will score your match and
                tell you exactly what to improve.
              </p>
            </div>

            {/* Optional job details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Takealot"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            {/* Main inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={12}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your CV <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your CV text here..."
                  rows={12}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAnalyse}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Analysing...' : '🔍 Analyse My CV'}
              </button>
              <button
                onClick={handleGenerateLetter}
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : '✍️ Generate Cover Letter'}
              </button>
            </div>

            {/* Analysis results */}
            {analysis && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Analysis Results</h3>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${scoreColour(analysis.matchScore)}`}>
                      {analysis.matchScore}%
                    </div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm">{analysis.summary}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">✅ Strengths</h4>
                    <ul className="space-y-1">
                      {analysis.strengths?.map((s, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">🔧 Improvements</h4>
                    <ul className="space-y-2">
                      {analysis.improvements?.map((item, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-medium text-gray-800">{item.area}:</span>{' '}
                          <span className="text-gray-600">{item.suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {analysis.missingKeywords?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">
                      🔑 Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.saContext && (
                  <div className="bg-blue-50 rounded-lg px-4 py-3">
                    <h4 className="font-semibold text-blue-800 text-sm mb-1">🇿🇦 SA Market Notes</h4>
                    <p className="text-blue-700 text-sm">{analysis.saContext}</p>
                  </div>
                )}
              </div>
            )}

            {/* Cover letter result */}
            {coverLetter && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Generated Cover Letter</h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(coverLetter)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Copy to clipboard
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {coverLetter}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tracker' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Tracker</h2>
            <p className="text-gray-500">
              Track your job applications here. (Build this out in Week 3 — connect it to Supabase
              to save applications per user.)
            </p>
            {/* TODO Week 3: Build application tracker table with Supabase */}
          </div>
        )}
      </main>
    </div>
  )
}
