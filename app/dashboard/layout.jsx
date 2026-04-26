'use client'
// app/dashboard/layout.jsx
// Persistent sidebar layout wrapping all dashboard pages

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/dashboard', label: 'CV Analyser', icon: '🔍' },
  { href: '/dashboard/tracker', label: 'Job Tracker', icon: '📋' },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth')
      else setUser(user)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>

      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0, background: 'white',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', padding: '1.5rem 1rem',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', marginBottom: '2rem', display: 'block' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🇿🇦</span>
            <span style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.1rem',
              color: 'var(--green)', fontWeight: '400',
            }}>
              CareerCraft SA
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname === href ? 'active' : ''}`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          {user && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                Signed in as
              </div>
              <div style={{
                fontSize: '0.8125rem', color: 'var(--text-primary)',
                fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user.email}
              </div>
            </div>
          )}
          <button onClick={handleSignOut} className="btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}