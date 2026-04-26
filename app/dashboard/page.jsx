'use client'
'use client'
import { useState } from 'react'

export default function Dashboard() {
  const [jobDescription, setJobDescription] = useState('')
  const [cvText, setCvText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [coverLetter, setCoverLetter] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleAnalyse = async () => {
    if (!jobDescription.trim() || !cvText.trim()) { setError('Please fill in both fields.'); return }
    setLoading(true); setLoadingType('analyse'); setError(null); setAnalysis(null); setCoverLetter(null)
    try {
      const res = await fetch('/api/analyse', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, cvText, jobTitle, companyName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setAnalysis(data.analysis)
    } catch (err) { setError(err.message || 'Analysis failed.') }
    finally { setLoading(false); setLoadingType(null) }
  }

  const handleGenerateLetter = async () => {
    if (!jobDescription.trim() || !cvText.trim()) { setError('Please fill in both fields.'); return }
    setLoading(true); setLoadingType('letter'); setError(null); setCoverLetter(null)
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, cvText, jobTitle, companyName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setCoverLetter(data.coverLetter)
    } catch (err) { setError(err.message || 'Failed.') }
    finally { setLoading(false); setLoadingType(null) }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scoreColor = (s) => s >= 75 ? '#16a34a' : s >= 50 ? '#ca8a04' : '#dc2626'
  const scoreBg = (s) => s >= 75 ? '#f0fdf4' : s >= 50 ? '#fefce8' : '#fef2f2'
  const scoreLabel = (s) => s >= 75 ? 'Strong Match' : s >= 50 ? 'Moderate Match' : 'Weak Match'

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>🔍</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-primary)', fontWeight: '400', margin: 0 }}>
            CV Analyser
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '52px' }}>
          Paste a job description and your CV to get an AI-powered match score and cover letter.
        </p>
      </div>

      {/* Job details row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
        marginBottom: '1rem',
      }}>
        {[
          { label: 'Job Title', key: 'jobTitle', val: jobTitle, set: setJobTitle, placeholder: 'e.g. Junior Software Developer', icon: '💼' },
          { label: 'Company', key: 'company', val: companyName, set: setCompanyName, placeholder: 'e.g. Takealot, Discovery, FNB', icon: '🏢' },
        ].map(({ label, val, set, placeholder, icon }) => (
          <div key={label} style={{
            background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px',
            padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                {label} <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                style={{
                  border: 'none', outline: 'none', width: '100%', fontSize: '0.9375rem',
                  color: 'var(--text-primary)', background: 'transparent', fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main text inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Job Description', val: jobDescription, set: setJobDescription, placeholder: 'Paste the full job description here...', badge: 'Required' },
          { label: 'Your CV', val: cvText, set: setCvText, placeholder: 'Paste your CV text here...', badge: 'Required' },
        ].map(({ label, val, set, placeholder, badge }) => (
          <div key={label} style={{
            background: 'white', border: '1.5px solid var(--border)', borderRadius: '14px',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            transition: 'border-color 0.15s',
          }}>
            <div style={{
              padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--surface)',
            }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)' }}>{label}</span>
              <span style={{
                fontSize: '0.6875rem', fontWeight: '600', color: 'var(--green)',
                background: 'var(--green-light)', padding: '2px 8px', borderRadius: '100px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{badge}</span>
            </div>
            <textarea
              value={val} onChange={e => set(e.target.value)} placeholder={placeholder} rows={13}
              style={{
                border: 'none', outline: 'none', resize: 'none', padding: '1rem 1.25rem',
                fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.6',
                background: 'transparent', fontFamily: 'var(--font-sans)', flex: 1,
              }}
            />
            <div style={{ padding: '0.5rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {val.trim() ? `${val.trim().split(/\s+/).length} words` : 'No content yet'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
          padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '1rem',
        }}>{error}</div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '2.5rem' }}>
        <button onClick={handleAnalyse} disabled={loading} style={{
          background: loading && loadingType === 'analyse' ? '#155538' : 'var(--green)',
          color: 'white', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '10px',
          fontWeight: '600', fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', opacity: loading && loadingType === 'letter' ? 0.5 : 1,
          transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
        }}>
          {loading && loadingType === 'analyse' ? (
            <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Analysing...</>
          ) : '🔍 Analyse My CV'}
        </button>
        <button onClick={handleGenerateLetter} disabled={loading} style={{
          background: 'white', color: 'var(--green)', border: '1.5px solid var(--green)',
          padding: '0.75rem 1.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.9rem',
          cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          opacity: loading && loadingType === 'analyse' ? 0.5 : 1, transition: 'all 0.15s',
          fontFamily: 'var(--font-sans)',
        }}>
          {loading && loadingType === 'letter' ? (
            <><span>⏳</span> Generating...</>
          ) : '✍️ Generate Cover Letter'}
        </button>
      </div>

      {/* Analysis result */}
      {analysis && (
        <div style={{ marginBottom: '1.5rem' }} className="fade-up">
          {/* Score hero */}
          <div style={{
            background: scoreBg(analysis.matchScore),
            border: `1.5px solid ${scoreColor(analysis.matchScore)}30`,
            borderRadius: '16px', padding: '1.75rem 2rem', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: scoreColor(analysis.matchScore), textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                {scoreLabel(analysis.matchScore)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '600px', margin: 0 }}>
                {analysis.summary}
              </p>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0, marginLeft: '2rem' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: scoreColor(analysis.matchScore), lineHeight: 1 }}>
                {analysis.matchScore}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: scoreColor(analysis.matchScore) }}>/ 100</div>
            </div>
          </div>

          {/* Strengths + Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ width: '28px', height: '28px', background: '#f0fdf4', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>✅</div>
                <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>Strengths</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analysis.strengths?.map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <span style={{ color: '#16a34a', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ width: '28px', height: '28px', background: '#fffbeb', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>🔧</div>
                <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>Improvements</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysis.improvements?.map((item, i) => (
                  <li key={i} style={{ fontSize: '0.8375rem', lineHeight: '1.5' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>{item.area}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keywords + SA notes */}
          <div style={{ display: 'grid', gridTemplateColumns: analysis.saContext ? '1fr 1fr' : '1fr', gap: '1rem' }}>
            {analysis.missingKeywords?.length > 0 && (
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <div style={{ width: '28px', height: '28px', background: 'var(--gold-light)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>🔑</div>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>Missing Keywords</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add these to your CV</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i} style={{
                      padding: '4px 12px', background: 'var(--gold-light)', color: '#92620a',
                      borderRadius: '100px', fontSize: '0.8125rem', fontWeight: '500',
                      border: '1px solid rgba(201,168,76,0.3)',
                    }}>{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {analysis.saContext && (
              <div style={{
                background: 'linear-gradient(135deg, var(--green-light) 0%, #f0fdf4 100%)',
                border: '1.5px solid rgba(26,107,69,0.2)', borderRadius: '14px', padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>🇿🇦</span>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--green)' }}>SA Market Notes</span>
                </div>
                <p style={{ fontSize: '0.8375rem', color: 'var(--green)', opacity: 0.85, lineHeight: '1.6', margin: 0 }}>{analysis.saContext}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cover letter result */}
      {coverLetter && (
        <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }} className="fade-up">
          <div style={{
            padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>✍️</span>
              <span style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Generated Cover Letter</span>
            </div>
            <button onClick={handleCopy} style={{
              background: copied ? 'var(--green-light)' : 'white',
              color: copied ? 'var(--green)' : 'var(--text-secondary)',
              border: '1.5px solid var(--border)', padding: '0.4rem 1rem',
              borderRadius: '8px', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: '500',
              fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
            }}>
              {copied ? '✓ Copied!' : 'Copy to clipboard'}
            </button>
          </div>
          <div style={{ padding: '1.75rem 2rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.9', whiteSpace: 'pre-wrap', margin: 0 }}>
              {coverLetter}
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}