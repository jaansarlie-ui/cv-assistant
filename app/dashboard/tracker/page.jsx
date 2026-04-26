'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_OPTIONS = ['applied', 'interview', 'offer', 'rejected', 'withdrawn']

const STATUS_CONFIG = {
  applied:   { label: 'Applied',   bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6', border: '#BFDBFE' },
  interview: { label: 'Interview', bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B', border: '#FDE68A' },
  offer:     { label: 'Offer 🎉',  bg: '#F0FDF4', text: '#166534', dot: '#22C55E', border: '#BBF7D0' },
  rejected:  { label: 'Rejected',  bg: '#FFF1F2', text: '#9F1239', dot: '#F43F5E', border: '#FECDD3' },
  withdrawn: { label: 'Withdrawn', bg: '#F8FAFC', text: '#64748B', dot: '#94A3B8', border: '#E2E8F0' },
}

const STAT_CONFIG = [
  { key: 'applied',   icon: '📤', label: 'Applied' },
  { key: 'interview', icon: '🗣️', label: 'Interview' },
  { key: 'offer',     icon: '🎉', label: 'Offer' },
  { key: 'rejected',  icon: '❌', label: 'Rejected' },
  { key: 'withdrawn', icon: '↩️', label: 'Withdrawn' },
]

const EMPTY_FORM = {
  job_title: '', company_name: '', status: 'applied',
  applied_date: new Date().toISOString().split('T')[0], job_url: '', notes: '',
}

export default function TrackerPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { fetchApplications() }, [])

  const fetchApplications = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('applications').select('*').order('applied_date', { ascending: false })
    if (error) setError('Could not load applications.')
    else setApplications(data || [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.job_title.trim() || !form.company_name.trim()) { setError('Job title and company are required.'); return }
    setSaving(true); setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setSaving(false); return }

    const op = editingId
      ? supabase.from('applications').update({ ...form }).eq('id', editingId)
      : supabase.from('applications').insert([{ ...form, user_id: user.id }])

    const { error } = await op
    if (error) setError('Failed to save application.')
    else { setEditingId(null); setForm(EMPTY_FORM); setShowForm(false); fetchApplications() }
    setSaving(false)
  }

  const handleEdit = (app) => {
    setForm({ job_title: app.job_title, company_name: app.company_name, status: app.status,
      applied_date: app.applied_date, job_url: app.job_url || '', notes: app.notes || '' })
    setEditingId(app.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) setError('Failed to delete.')
    else fetchApplications()
  }

  const handleStatusChange = async (id, newStatus) => {
    await supabase.from('applications').update({ status: newStatus }).eq('id', id)
    fetchApplications()
  }

  const stats = STATUS_OPTIONS.reduce((acc, s) => { acc[s] = applications.filter(a => a.status === s).length; return acc }, {})
  const filtered = filterStatus === 'all' ? applications : applications.filter(a => a.status === filterStatus)

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📋</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-primary)', fontWeight: '400', margin: 0 }}>
              Job Tracker
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '52px' }}>
            {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{
            background: 'var(--green)', color: 'white', border: 'none',
            padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600',
            fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            + Add Application
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
        {STAT_CONFIG.map(({ key, icon, label }) => (
          <button key={key} onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)} style={{
            background: filterStatus === key ? STATUS_CONFIG[key].bg : 'white',
            border: `1.5px solid ${filterStatus === key ? STATUS_CONFIG[key].border : 'var(--border)'}`,
            borderRadius: '12px', padding: '1rem 0.75rem', cursor: 'pointer',
            textAlign: 'center', transition: 'all 0.15s',
          }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: STATUS_CONFIG[key].text, lineHeight: 1, marginBottom: '4px' }}>
              {stats[key]}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</div>
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div style={{
          background: 'white', border: '1.5px solid var(--border)', borderRadius: '16px',
          overflow: 'hidden', marginBottom: '1.5rem',
        }} className="fade-up">
          <div style={{ padding: '1rem 1.5rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              {editingId ? '✏️ Edit Application' : '+ New Application'}
            </span>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); setError(null) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Job Title *</label>
              <input className="input" type="text" value={form.job_title}
                onChange={e => setForm({ ...form, job_title: e.target.value })} placeholder="e.g. Junior Software Developer" />
            </div>
            <div>
              <label className="label">Company *</label>
              <input className="input" type="text" value={form.company_name}
                onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="e.g. Takealot, FNB, Discovery" />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date Applied</label>
              <input className="input" type="date" value={form.applied_date} onChange={e => setForm({ ...form, applied_date: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Job URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input className="input" type="url" value={form.job_url}
                onChange={e => setForm({ ...form, job_url: e.target.value })} placeholder="https://careers.company.co.za/..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Notes <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <textarea className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Spoke to recruiter, follow up on Monday..." rows={3} style={{ resize: 'none' }} />
            </div>
          </div>
          {error && <div style={{ margin: '0 1.5rem', marginBottom: '1rem' }} className="error-box">{error}</div>}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
            <button onClick={handleSubmit} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Application'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); setError(null) }} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter indicator */}
      {filterStatus !== 'all' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Showing: </span>
          <span style={{
            padding: '3px 12px', borderRadius: '100px', fontSize: '0.8125rem', fontWeight: '500',
            background: STATUS_CONFIG[filterStatus].bg, color: STATUS_CONFIG[filterStatus].text,
            border: `1px solid ${STATUS_CONFIG[filterStatus].border}`,
          }}>{STATUS_CONFIG[filterStatus].label}</span>
          <button onClick={() => setFilterStatus('all')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8125rem' }}>
            Clear filter ×
          </button>
        </div>
      )}

      {/* Applications list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem', background: 'white',
          border: '1.5px dashed var(--border)', borderRadius: '16px',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{filterStatus === 'all' ? '📋' : STATUS_CONFIG[filterStatus]?.dot ? '🔍' : '📋'}</div>
          <div style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
            {filterStatus === 'all' ? 'No applications yet' : `No ${STATUS_CONFIG[filterStatus].label} applications`}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {filterStatus === 'all' ? 'Click "Add Application" to track your first job application.' : 'Try a different filter or add a new application.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((app, idx) => (
            <div key={app.id} className="fade-up" style={{
              background: 'white', border: '1.5px solid var(--border)', borderRadius: '14px',
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
              animationDelay: `${idx * 0.05}s`, transition: 'border-color 0.15s, box-shadow 0.15s',
            }}>
              {/* Status dot */}
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                background: STATUS_CONFIG[app.status].dot,
              }} />

              {/* Main info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{app.job_title}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>at</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>{app.company_name}</span>
                  {app.job_url && (
                    <a href={app.job_url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '0.75rem', color: 'var(--green)', textDecoration: 'none', fontWeight: '500',
                    }}>View listing ↗</a>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Applied {new Date(app.applied_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {app.notes && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                      💬 {app.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Status selector */}
              <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)} style={{
                padding: '5px 10px', borderRadius: '100px', border: `1.5px solid ${STATUS_CONFIG[app.status].border}`,
                background: STATUS_CONFIG[app.status].bg, color: STATUS_CONFIG[app.status].text,
                fontSize: '0.8125rem', fontWeight: '600', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', outline: 'none',
              }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
              </select>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => handleEdit(app)} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                  padding: '5px 12px', borderRadius: '8px', fontSize: '0.8125rem', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontWeight: '500',
                }}>Edit</button>
                <button onClick={() => handleDelete(app.id)} style={{
                  background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48',
                  padding: '5px 12px', borderRadius: '8px', fontSize: '0.8125rem', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontWeight: '500',
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}