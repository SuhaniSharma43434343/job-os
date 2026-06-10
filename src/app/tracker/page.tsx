'use client'
import { useState } from 'react'

type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Saved'

interface Application {
  id: string
  company: string
  role: string
  platform: string
  status: Status
  date: string
  notes: string
  salary: string
  location: string
}

const mockApps: Application[] = [
  { id: '1', company: 'Google', role: 'SDE Intern', platform: 'LinkedIn', status: 'Interview', date: '2026-06-05', notes: 'Round 1 on June 15', salary: '₹80K/mo', location: 'Bangalore' },
  { id: '2', company: 'Microsoft', role: 'Software Engineer', platform: 'Indeed', status: 'Applied', date: '2026-06-07', notes: 'Applied via LinkedIn Easy Apply', salary: '₹25-35 LPA', location: 'Hyderabad' },
  { id: '3', company: 'Razorpay', role: 'Full Stack Dev', platform: 'Naukri', status: 'Rejected', date: '2026-05-28', notes: 'Got automated rejection after 10 days', salary: '₹18-28 LPA', location: 'Bangalore' },
  { id: '4', company: 'Swiggy', role: 'Data Engineer Intern', platform: 'Glassdoor', status: 'Applied', date: '2026-06-08', notes: '', salary: '₹45K/mo', location: 'Bangalore' },
  { id: '5', company: 'Flipkart', role: 'Backend Engineer', platform: 'LinkedIn', status: 'Offer', date: '2026-05-20', notes: 'Offer received! ₹22 LPA CTC. Deciding.', salary: '₹22 LPA', location: 'Bangalore' },
  { id: '6', company: 'CRED', role: 'Product Engineer Intern', platform: 'LinkedIn', status: 'Saved', date: '2026-06-09', notes: 'Apply before June 20', salary: '₹60K/mo', location: 'Bangalore' },
]

const statusConfig: Record<Status, { color: string; bg: string; icon: string }> = {
  Applied: { color: 'var(--accent-primary)', bg: 'rgba(99,102,241,0.12)', icon: '📨' },
  Interview: { color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.12)', icon: '🎯' },
  Offer: { color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.12)', icon: '🎉' },
  Rejected: { color: 'var(--accent-red)', bg: 'rgba(239,68,68,0.1)', icon: '❌' },
  Saved: { color: 'var(--accent-secondary)', bg: 'rgba(6,182,212,0.12)', icon: '💾' },
}

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>(mockApps)
  const [filter, setFilter] = useState<Status | 'All'>('All')
  const [editId, setEditId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filtered = filter === 'All' ? apps : apps.filter(a => a.status === filter)

  const counts: Record<string, number> = { All: apps.length }
  ;(['Applied', 'Interview', 'Offer', 'Rejected', 'Saved'] as Status[]).forEach(s => {
    counts[s] = apps.filter(a => a.status === s).length
  })

  const updateStatus = (id: string, status: Status) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    showToast('✅ Status updated to ' + status)
  }

  const updateNotes = (id: string, notes: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, notes } : a))
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">📋 Application Tracker</div>
          <div className="page-subtitle">{apps.length} total applications · Track status, notes, and follow-ups</div>
        </div>
        <button className="btn btn-primary" onClick={() => showToast('📄 Export coming soon!')}>📥 Export CSV</button>
      </div>

      <div className="page-body fade-in">
        {/* Summary cards */}
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {(['Applied', 'Interview', 'Offer', 'Rejected'] as Status[]).map(s => (
            <div key={s} className="stat-card" style={{ '--accent-color': statusConfig[s].color } as React.CSSProperties}>
              <div className="stat-label">{statusConfig[s].icon} {s}</div>
              <div className="stat-value">{counts[s] || 0}</div>
              <div className="stat-change">
                {s === 'Interview' ? 'Active interviews' : s === 'Offer' ? 'Congratulations! 🎉' : s === 'Applied' ? 'Awaiting response' : 'Keep going!'}
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="chips" style={{ marginBottom: 20 }}>
          {(['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Saved'] as (Status | 'All')[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? 'active' : ''}`}>
              {f} ({counts[f] || 0})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {['Company & Role', 'Platform', 'Date Applied', 'Status', 'Notes', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr key={app.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-primary)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{app.company}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{app.role}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 2 }}>{app.salary}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`platform-badge platform-${app.platform.toLowerCase()}`}>{app.platform}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12.5, color: 'var(--text-secondary)' }}>{app.date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={app.status}
                      onChange={e => updateStatus(app.id, e.target.value as Status)}
                      style={{ background: statusConfig[app.status].bg, color: statusConfig[app.status].color, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-body)' }}
                    >
                      {(['Applied', 'Interview', 'Offer', 'Rejected', 'Saved'] as Status[]).map(s => (
                        <option key={s} value={s} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{statusConfig[s].icon} {s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: 220 }}>
                    {editId === app.id ? (
                      <input
                        className="form-input"
                        style={{ fontSize: 12 }}
                        value={app.notes}
                        onChange={e => updateNotes(app.id, e.target.value)}
                        onBlur={() => { setEditId(null); showToast('📝 Notes saved') }}
                        autoFocus
                      />
                    ) : (
                      <div onClick={() => setEditId(app.id)} style={{ fontSize: 12, color: app.notes ? 'var(--text-secondary)' : 'var(--text-muted)', cursor: 'text', padding: '4px 0' }}>
                        {app.notes || 'Click to add notes...'}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast('🎯 Interview prep for ' + app.company + ' loading...')}>🎯</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast('📊 Debrief for ' + app.company + ' logged!')}>📊</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div className="toast-container"><div className="toast toast-info">{toast}</div></div>}
    </>
  )
}
