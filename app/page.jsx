import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', color: 'white', fontFamily: 'var(--font-sans)' }}>

      {/* Nav */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>🇿🇦</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--gold)' }}>
            CareerCraft SA
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/auth" style={{
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
            fontSize: '0.875rem', padding: '0.5rem 1rem',
          }}>
            Log In
          </Link>
          <Link href="/auth" style={{
            background: 'var(--green)', color: 'white', textDecoration: 'none',
            fontSize: '0.875rem', padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: '500',
          }}>
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: '800px', margin: '0 auto', textAlign: 'center',
        padding: '6rem 2rem 4rem',
      }}>
        <div className="fade-up" style={{
          display: 'inline-block', background: 'rgba(201,168,76,0.15)',
          border: '1px solid rgba(201,168,76,0.3)', borderRadius: '100px',
          padding: '0.375rem 1rem', fontSize: '0.8125rem', color: 'var(--gold)',
          marginBottom: '1.5rem', fontWeight: '500',
        }}>
          Built for the South African job market
        </div>

        <h1 className="fade-up-delay-1" style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          lineHeight: '1.15', marginBottom: '1.5rem', fontWeight: '400',
          color: 'white',
        }}>
          Land your next job with<br />
          <span style={{ color: 'var(--gold)' }}>AI on your side</span>
        </h1>

        <p className="fade-up-delay-2" style={{
          fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)',
          lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem',
        }}>
          Score your CV against any job description, generate tailored cover letters,
          and track every application — all tuned for SA companies and NQF requirements.
        </p>

        <div className="fade-up-delay-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/auth" style={{
            background: 'var(--green)', color: 'white', textDecoration: 'none',
            padding: '0.875rem 2rem', borderRadius: '10px', fontWeight: '600',
            fontSize: '0.9375rem', transition: 'background 0.15s',
          }}>
            Start for free →
          </Link>
          <Link href="/dashboard" style={{
            background: 'rgba(255,255,255,0.08)', color: 'white', textDecoration: 'none',
            padding: '0.875rem 2rem', borderRadius: '10px', fontWeight: '500',
            fontSize: '0.9375rem', border: '1px solid rgba(255,255,255,0.12)',
          }}>
            View demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{
        maxWidth: '960px', margin: '0 auto', padding: '4rem 2rem',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem',
      }}>
        {[
          {
            icon: '🔍',
            title: 'CV Match Score',
            desc: 'Paste any job description and get an instant AI score showing how well your CV matches — with specific improvements.',
          },
          {
            icon: '✍️',
            title: 'Cover Letter Generator',
            desc: 'Generate professional, tailored cover letters in seconds. SA-aware — understands NQF levels, BBBEE, and local industries.',
          },
          {
            icon: '📋',
            title: 'Application Tracker',
            desc: 'Keep track of every job you apply to. Update statuses, add notes, and never lose track of an opportunity.',
          },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px', padding: '1.75rem',
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.875rem' }}>{icon}</div>
            <h3 style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.5rem',
              color: 'white', fontWeight: '400',
            }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.3)', fontSize: '0.8125rem',
      }}>
        CareerCraft SA — Built with Next.js, Supabase & AI
      </footer>
    </div>
  )
}