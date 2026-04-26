'use client'
// app/auth/page.jsx
// Login and signup page

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = async () => {
    setError(null)
    setMessage(null)

    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }

    if (mode === 'signup' && !form.full_name.trim()) {
      setError('Please enter your full name.')
      return
    }

    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name } },
      })
      if (error) setError(error.message)
      else setMessage('Account created! Check your email to confirm, then log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-sm">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">🇿🇦 CareerCraft SA</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? 'Welcome back' : 'Create your free account'}
          </p>
        </div>

        <div className="flex rounded-lg border border-gray-200 p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError(null); setMessage(null) }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                placeholder="Jaansarlie Abrahams"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {message && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}