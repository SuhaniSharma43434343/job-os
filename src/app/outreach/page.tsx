'use client'
import { useState } from 'react'

interface Message {
  id: string
  name: string
  company: string
  role: string
  platform: string
  type: 'connection' | 'referral' | 'followup' | 'nudge'
  status: 'draft' | 'sent' | 'replied' | 'quiet'
  message: string
  sentAt?: string
  daysAgo?: number
}

const mockMessages: Message[] = [
  {
    id: '1', name: 'Priya Sharma', company: 'Google', role: 'SDE Intern', platform: 'LinkedIn',
    type: 'referral', status: 'draft', daysAgo: 0,
    message: `Hi Priya,

I hope you're doing well! I came across your profile while researching Google's engineering team — your work on the Maps infra team is genuinely impressive.

I'm a final-year CSE student with strong experience in distributed systems and React, and I've applied for the SDE Intern role at Google Bangalore. I'd be incredibly grateful if you could refer me or share any insights about the team culture.

No pressure at all — just thought I'd reach out since your background is so aligned with what I'm building toward.

Thanks so much for your time!
[Your Name]`
  },
  {
    id: '2', name: 'Rahul Verma', company: 'Microsoft', role: 'Software Engineer', platform: 'LinkedIn',
    type: 'connection', status: 'sent', sentAt: '2026-06-08', daysAgo: 2,
    message: `Hi Rahul, I'd love to connect! I'm a developer working on similar problems in cloud infrastructure.`
  },
  {
    id: '3', name: 'Sneha Nair', company: 'Zepto', role: 'Backend Intern', platform: 'LinkedIn',
    type: 'followup', status: 'quiet', sentAt: '2026-06-03', daysAgo: 7,
    message: `Hi Sneha, just following up on my message from last week about the Backend Intern role at Zepto...`
  },
  {
    id: '4', name: 'Arjun Mehta', company: 'Razorpay', role: 'Full Stack Dev', platform: 'LinkedIn',
    type: 'nudge', status: 'quiet', sentAt: '2026-06-01', daysAgo: 9,
    message: `Hi Arjun, I wanted to gently follow up — I know you're busy, but any update on the referral for Razorpay would mean a lot...`
  },
]

const typeColors = { referral: 'badge-purple', connection: 'badge-cyan', followup: 'badge-amber', nudge: 'badge-red' }
const statusColors = { draft: 'badge-gray', sent: 'badge-primary', replied: 'badge-green', quiet: 'badge-amber' }

export default function OutreachPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selected, setSelected] = useState<Message | null>(mockMessages[0])
  const [editedMsg, setEditedMsg] = useState(mockMessages[0].message)
  const [filter, setFilter] = useState<string>('all')
  const [toast, setToast] = useState('')
  const [generating, setGenerating] = useState(false)

  // New outreach form
  const [newName, setNewName] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newType, setNewType] = useState<Message['type']>('referral')
  const [showForm, setShowForm] = useState(false)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filtered = messages.filter(m => filter === 'all' || m.type === filter || m.status === filter)

  const handleSelect = (m: Message) => { setSelected(m); setEditedMsg(m.message) }

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    const generated = `Hi ${newName.split(' ')[0]},

I came across your profile while researching ${newCompany}'s team — your background really stood out to me!

I'm a final-year CSE student who has been following ${newCompany}'s growth closely, and I recently applied for the ${newRole} role. I'd be really grateful for any insights you could share about the team, or if you'd be open to referring me.

No pressure at all — I just thought it was worth reaching out to someone with your experience.

Thanks so much,
[Your Name]`

    const newMsg: Message = {
      id: Date.now().toString(),
      name: newName, company: newCompany, role: newRole,
      platform: 'LinkedIn', type: newType, status: 'draft', message: generated
    }
    setMessages(prev => [newMsg, ...prev])
    setSelected(newMsg)
    setEditedMsg(generated)
    setGenerating(false)
    setShowForm(false)
    setNewName(''); setNewCompany(''); setNewRole('')
    showToast('✅ Message generated for ' + newName + '!')
  }

  const handleMarkSent = () => {
    if (!selected) return
    setMessages(prev => prev.map(m => m.id === selected.id ? { ...m, status: 'sent', sentAt: new Date().toISOString().split('T')[0] } : m))
    setSelected(prev => prev ? { ...prev, status: 'sent' } : null)
    showToast('✅ Marked as sent — follow-up scheduled in 5 days')
  }

  const nudges = messages.filter(m => m.status === 'quiet' && (m.daysAgo || 0) >= 5)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🤝 Outreach Manager</div>
          <div className="page-subtitle">Draft personalized messages, manage referrals, and track follow-ups</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {nudges.length > 0 && (
            <button className="btn btn-secondary" onClick={() => showToast(`⚡ ${nudges.length} nudge(s) ready to send!`)}>
              🔔 {nudges.length} Nudge{nudges.length > 1 ? 's' : ''} Ready
            </button>
          )}
          <button onClick={() => setShowForm(true)} className="btn btn-primary">✍️ New Message</button>
        </div>
      </div>

      <div className="page-body fade-in">
        {/* New message form */}
        {showForm && (
          <div className="card" style={{ marginBottom: 20, borderColor: 'var(--accent-primary)', background: 'rgba(99,102,241,0.04)' }}>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 15 }}>✨ Generate New Outreach Message</div>
            <div className="grid-3" style={{ gap: 12, marginBottom: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Contact Name</label>
                <input id="outreach-name" className="form-input" placeholder="Priya Sharma" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Their Company</label>
                <input id="outreach-company" className="form-input" placeholder="Google" value={newCompany} onChange={e => setNewCompany(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Target Role</label>
                <input id="outreach-role" className="form-input" placeholder="SDE Intern" value={newRole} onChange={e => setNewRole(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Message Type</label>
              <div className="chips">
                {(['referral', 'connection', 'followup', 'nudge'] as Message['type'][]).map(t => (
                  <button key={t} onClick={() => setNewType(t)} className={`chip ${newType === t ? 'active' : ''}`}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleGenerate} className="btn btn-primary" disabled={generating || !newName || !newCompany}>
                {generating ? <><span className="spinner" /> Generating...</> : '✨ Generate with Gemini'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div className="chips" style={{ marginBottom: 20 }}>
          {['all', 'draft', 'sent', 'referral', 'followup', 'quiet'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? 'active' : ''}`}>{f}</button>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 20, alignItems: 'flex-start' }}>
          {/* Message List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(m => (
              <div
                key={m.id}
                className="card"
                style={{ cursor: 'pointer', borderColor: selected?.id === m.id ? 'var(--accent-primary)' : undefined, background: selected?.id === m.id ? 'rgba(99,102,241,0.05)' : undefined }}
                onClick={() => handleSelect(m)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`badge ${typeColors[m.type]}`}>{m.type}</span>
                    <span className={`badge ${statusColors[m.status]}`}>{m.status}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.company} · {m.role}</div>
                {m.status === 'quiet' && m.daysAgo && m.daysAgo >= 5 && (
                  <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(245,158,11,0.1)', borderRadius: 6, fontSize: 12, color: 'var(--accent-amber)' }}>
                    ⏰ No reply in {m.daysAgo} days — nudge ready
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Editor */}
          <div>
            {selected ? (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>To: {selected.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{selected.company} · via {selected.platform}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`badge ${typeColors[selected.type]}`}>{selected.type}</span>
                    <span className={`badge ${statusColors[selected.status]}`}>{selected.status}</span>
                  </div>
                </div>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: 280, fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.8 }}
                  value={editedMsg}
                  onChange={e => setEditedMsg(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-success" onClick={() => { showToast('📋 Copied! Paste into LinkedIn.'); navigator.clipboard?.writeText(editedMsg) }}>📋 Copy Message</button>
                  {selected.status === 'draft' && (
                    <button className="btn btn-secondary" onClick={handleMarkSent}>✅ Mark as Sent</button>
                  )}
                  <button className="btn btn-ghost" onClick={() => showToast('🔄 Regenerating...')}>🔄 Regenerate</button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✉️</div>
                <h3>Select a message to edit</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </>
  )
}
