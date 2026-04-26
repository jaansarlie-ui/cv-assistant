'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = async () => {
    setError(null); setMessage(null)
    if (!form.email || !form.password) { setError('Email and password are required.'); return }
    if (mode === 'signup' && !form.full_name.trim()) { setError('Please enter your full name.'); return }
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.full_name } },
      })
      if (error) setError(error.message)
      else setMessage('Account created! Check your email to confirm, then log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-sans)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'var(--dark)', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '4rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(26,107,69,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🇿🇦</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--gold)' }}>CareerCraft SA</span>
        </Link>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', color: 'white', fontWeight: '400', lineHeight: '1.3', marginBottom: '1rem' }}>
          Your AI-powered<br />career assistant
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9375rem', lineHeight: '1.7', maxWidth: '340px' }}>
          Score your CV, generate cover letters, and track applications — built for the South African job market.
        </p>
      </div>

      {/* Right panel */}
      <div style={{
        width: '460px', flexShrink: 0, background: 'var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '400' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setMessage(null) }}
              style={{ color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '0.875rem', padding: 0 }}>
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input className="input" type="text" value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Your full name" />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="••••••••" />
            </div>
            {error && <div className="error-box">{error}</div>}
            {message && <div className="success-box">{message}</div>}
            <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}