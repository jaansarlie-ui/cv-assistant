'use client'
// app/dashboard/tracker/page.jsx
// Application tracker — add, view, update, and delete job applications

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_OPTIONS = ['applied', 'interview', 'offer', 'rejected', 'withdrawn']

const STATUS_STYLES = {
  applied:   { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Applied' },
  interview: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Interview' },
  offer:     { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Offer 🎉' },
  rejected:  { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Rejected' },
  withdrawn: { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Withdrawn' },
}

const EMPTY_FORM = {
  job_title: '',
  company_name: '',
  status: 'applied',
  applied_date: new Date().toISOString().split('T')[0],
  job_url: '',
  notes: '',
}

export default function TrackerPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('applied_date', { ascending: false })

    if (error) {
      console.error('Fetch error:', error)
      setError('Could not load applications. Make sure you are logged in.')
    } else {
      setApplications(data || [])
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.job_title.trim() || !form.company_name.trim()) {
      setError('Job title and company name are required.')
      return
    }
    setSaving(true)
    setError(null)

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in to save applications.')
      setSaving(false)
      return
    }

    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from('applications')
        .update({ ...form })
        .eq('id', editingId)

      if (error) setError('Failed to update application.')
      else {
        setEditingId(null)
        setForm(EMPTY_FORM)
        setShowForm(false)
        fetchApplications()
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('applications')
        .insert([{ ...form, user_id: user.id }])

      if (error) setError('Failed to save application.')
      else {
        setForm(EMPTY_FORM)
        setShowForm(false)
        fetchApplications()
      }
    }
    setSaving(false)
  }

  const handleEdit = (app) => {
    setForm({
      job_title: app.job_title,
      company_name: app.company_name,
      status: app.status,
      applied_date: app.applied_date,
      job_url: app.job_url || '',
      notes: app.notes || '',
    })
    setEditingId(app.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) setError('Failed to delete.')
    else fetchApplications()
  }

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id)
    if (!error) fetchApplications()
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
  }

  // Stats
  const stats = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length
    return acc
  }, {})

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Tracker</h2>
          <p className="text-gray-500 text-sm mt-1">
            {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Application
          </button>
        )}
      </div>

      {/* Stats bar */}
      {applications.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {STATUS_OPTIONS.map(s => (
            <div key={s} className={`${STATUS_STYLES[s].bg} rounded-lg px-3 py-2 text-center`}>
              <div className={`text-xl font-bold ${STATUS_STYLES[s].text}`}>{stats[s]}</div>
              <div className={`text-xs ${STATUS_STYLES[s].text} opacity-80`}>{STATUS_STYLES[s].label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">
            {editingId ? 'Edit Application' : 'Add New Application'}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.job_title}
                onChange={e => setForm({ ...form, job_title: e.target.value })}
                placeholder="e.g. Junior Software Developer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={e => setForm({ ...form, company_name: e.target.value })}
                placeholder="e.g. Takealot"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{STATUS_STYLES[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
              <input
                type="date"
                value={form.applied_date}
                onChange={e => setForm({ ...form, applied_date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job URL <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="url"
                value={form.job_url}
                onChange={e => setForm({ ...form, job_url: e.target.value })}
                placeholder="https://careers.company.co.za/job/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Spoke to recruiter, follow up on Monday..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Application'}
            </button>
            <button
              onClick={cancelForm}
              className="px-5 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Applications list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-gray-500 text-sm">No applications yet. Add your first one above!</div>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-gray-900">{app.job_title}</span>
                  <span className="text-gray-400">@</span>
                  <span className="text-gray-700">{app.company_name}</span>
                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-xs hover:underline"
                    >
                      View listing ↗
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400">
                    Applied {new Date(app.applied_date).toLocaleDateString('en-ZA', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  {app.notes && (
                    <span className="text-xs text-gray-500 truncate max-w-xs">{app.notes}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Inline status updater */}
                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app.id, e.target.value)}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${STATUS_STYLES[app.status].bg} ${STATUS_STYLES[app.status].text}`}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{STATUS_STYLES[s].label}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleEdit(app)}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}