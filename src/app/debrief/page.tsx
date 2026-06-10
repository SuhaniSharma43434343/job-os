'use client'
import { useState } from 'react'

interface DebriefQuestion {
  id: string
  question: string
  category: string
  answer: string
  score?: number
  feedback?: string
  rewrite?: string
}

interface Debrief {
  id: string
  company: string
  role: string
  round: string
  date: string
  interviewer: string
  overallScore?: number
  questions: DebriefQuestion[]
  thankYouSent: boolean
}

const mockDebriefs: Debrief[] = [
  {
    id: '1', company: 'Swiggy', role: 'SDE Intern', round: 'Round 1 - Technical', date: '2026-06-09',
    interviewer: 'Vikram Nair (Senior SWE)', overallScore: 7.4, thankYouSent: true,
    questions: [
      { id: 'q1', question: 'Reverse a linked list iteratively and recursively.', category: 'Coding', answer: 'I explained both approaches. Started with iterative using 3 pointers, then recursive using call stack.', score: 9, feedback: 'Excellent. Clear communication, correct solution.', rewrite: '' },
      { id: 'q2', question: 'Design a notification system for Swiggy\'s delivery updates.', category: 'System Design', answer: 'I talked about pub/sub with Kafka, but got confused on fan-out strategies.', score: 5, feedback: 'Good start with Kafka but missed fan-out approaches and push vs pull trade-offs.', rewrite: 'Better answer: "I\'d use a pub/sub architecture with Kafka topics per event type. For fan-out, we can use a delivery worker pool that reads from the topic and sends via FCM/APNS. For scale, we\'d partition by user region and use idempotent delivery with a Redis dedup cache. The read model for notification history would be Cassandra for time-series access patterns."' },
      { id: 'q3', question: 'Tell me about a time you handled ambiguity in a project.', category: 'Behavioral', answer: 'Talked about my thesis project where requirements kept changing.', score: 7, feedback: 'Good story. Could have quantified the impact more clearly.', rewrite: '' },
    ]
  }
]

export default function DebriefPage() {
  const [debriefs, setDebriefs] = useState<Debrief[]>(mockDebriefs)
  const [selected, setSelected] = useState<Debrief | null>(mockDebriefs[0])
  const [showNew, setShowNew] = useState(false)
  const [toast, setToast] = useState('')
  const [generatingThankYou, setGeneratingThankYou] = useState(false)
  const [thankYou, setThankYou] = useState('')

  // New debrief form
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newRound, setNewRound] = useState('')
  const [newInterviewer, setNewInterviewer] = useState('')
  const [newQs, setNewQs] = useState<{ question: string; answer: string; category: string }[]>([
    { question: '', answer: '', category: 'Coding' }
  ])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleGenerateThankYou = async () => {
    if (!selected) return
    setGeneratingThankYou(true)
    await new Promise(r => setTimeout(r, 2500))
    setThankYou(`Subject: Thank You — ${selected.role} Interview at ${selected.company}

Dear ${selected.interviewer.split(' (')[0]},

Thank you so much for taking the time to interview me today for the ${selected.role} role at ${selected.company}. I really enjoyed our conversation and appreciated the depth of the technical discussion.

The system design question around ${selected.company}'s notification infrastructure was particularly thought-provoking — it made me think deeply about fan-out strategies and trade-offs between push and pull architectures. I've already been reflecting on how I'd approach the Kafka partitioning strategy differently.

I came away even more excited about the opportunity to contribute to ${selected.company}'s engineering team. Please don't hesitate to reach out if you need anything else from my side.

Thanks again,
[Your Name]
[Your Phone] | [Your LinkedIn]`)
    setGeneratingThankYou(false)
  }

  const avgScore = (d: Debrief) => {
    const scored = d.questions.filter(q => q.score !== undefined)
    if (!scored.length) return null
    return (scored.reduce((sum, q) => sum + (q.score || 0), 0) / scored.length).toFixed(1)
  }

  const scoreColor = (s: number) => s >= 8 ? 'var(--accent-green)' : s >= 6 ? 'var(--accent-amber)' : 'var(--accent-red)'

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">📊 Post-Interview Debrief</div>
          <div className="page-subtitle">Log every question, score every answer, and generate thank-you emails</div>
        </div>
        <button onClick={() => setShowNew(true)} className="btn btn-primary">📝 Log New Interview</button>
      </div>

      <div className="page-body fade-in">
        {showNew && (
          <div className="card" style={{ marginBottom: 20, borderColor: 'var(--accent-primary)', background: 'rgba(99,102,241,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>📝 Log New Interview</div>
            <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company</label>
                <input id="debrief-company" className="form-input" placeholder="e.g. Google" value={newCompany} onChange={e => setNewCompany(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Role</label>
                <input id="debrief-role" className="form-input" placeholder="e.g. SDE Intern" value={newRole} onChange={e => setNewRole(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Round</label>
                <input id="debrief-round" className="form-input" placeholder="e.g. Round 1 - Technical" value={newRound} onChange={e => setNewRound(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Interviewer (optional)</label>
                <input id="debrief-interviewer" className="form-input" placeholder="e.g. Priya Sharma" value={newInterviewer} onChange={e => setNewInterviewer(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--text-secondary)' }}>Questions Asked</div>
              {newQs.map((q, i) => (
                <div key={i} className="card" style={{ marginBottom: 10, background: 'var(--bg-glass)' }}>
                  <div className="grid-2" style={{ gap: 10, marginBottom: 8 }}>
                    <input className="form-input" placeholder={`Question ${i + 1}`} value={q.question} onChange={e => setNewQs(prev => prev.map((x, j) => j === i ? { ...x, question: e.target.value } : x))} />
                    <select className="form-select" value={q.category} onChange={e => setNewQs(prev => prev.map((x, j) => j === i ? { ...x, category: e.target.value } : x))}>
                      {['Coding', 'System Design', 'Behavioral', 'Domain', 'HR'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <textarea className="form-textarea" style={{ minHeight: 60 }} placeholder="What was your answer?" value={q.answer} onChange={e => setNewQs(prev => prev.map((x, j) => j === i ? { ...x, answer: e.target.value } : x))} />
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => setNewQs(prev => [...prev, { question: '', answer: '', category: 'Coding' }])}>+ Add Question</button>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => {
                const nd: Debrief = {
                  id: Date.now().toString(), company: newCompany, role: newRole, round: newRound,
                  interviewer: newInterviewer, date: new Date().toISOString().split('T')[0],
                  thankYouSent: false,
                  questions: newQs.map((q, i) => ({ ...q, id: `new-${i}` }))
                }
                setDebriefs(prev => [nd, ...prev])
                setSelected(nd)
                setShowNew(false)
                setNewCompany(''); setNewRole(''); setNewRound(''); setNewInterviewer('')
                setNewQs([{ question: '', answer: '', category: 'Coding' }])
                showToast('✅ Interview logged! Scoring with Gemini...')
              }} disabled={!newCompany || !newRole}>
                📊 Save & Score Answers
              </button>
              <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="grid-2" style={{ gap: 24, alignItems: 'flex-start' }}>
          {/* Debrief List */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>PAST INTERVIEWS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {debriefs.map(d => {
                const avg = avgScore(d)
                return (
                  <div
                    key={d.id}
                    className="card"
                    style={{ cursor: 'pointer', borderColor: selected?.id === d.id ? 'var(--accent-primary)' : undefined }}
                    onClick={() => { setSelected(d); setThankYou('') }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{d.company}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{d.role} · {d.round}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{d.date} · {d.interviewer}</div>
                      </div>
                      {avg && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: scoreColor(parseFloat(avg)) }}>{avg}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>avg score</div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <span className="badge badge-gray">{d.questions.length} questions</span>
                      {d.thankYouSent && <span className="badge badge-green">✉️ Thank-you sent</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Debrief Detail */}
          <div>
            {selected ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.company} — {selected.role}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{selected.round} · {selected.date}</div>
                  </div>
                  {avgScore(selected) && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 800, color: scoreColor(parseFloat(avgScore(selected)!)) }}>
                        {avgScore(selected)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>overall score</div>
                    </div>
                  )}
                </div>

                {/* Questions with scores */}
                {selected.questions.map(q => (
                  <div key={q.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span className="badge badge-gray">{q.category}</span>
                      {q.score && (
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: scoreColor(q.score) }}>
                          {q.score}/10
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{q.question}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 10 }}>Your answer: "{q.answer}"</div>
                    {q.feedback && (
                      <div style={{ padding: '10px 12px', background: 'rgba(6,182,212,0.05)', borderRadius: 8, borderLeft: '3px solid var(--accent-secondary)', marginBottom: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: 4 }}>FEEDBACK</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{q.feedback}</div>
                      </div>
                    )}
                    {q.rewrite && (
                      <div style={{ padding: '10px 12px', background: 'rgba(16,185,129,0.05)', borderRadius: 8, borderLeft: '3px solid var(--accent-green)' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-green)', marginBottom: 4 }}>STRONGER VERSION</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{q.rewrite}</div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Thank You email */}
                <div className="card">
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>✉️ Thank-You Email</div>
                  {thankYou ? (
                    <>
                      <div className="card" style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.8, background: 'var(--bg-glass)', marginBottom: 12 }}>
                        {thankYou}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-success btn-sm" onClick={() => { navigator.clipboard?.writeText(thankYou); showToast('📋 Copied!') }}>📋 Copy</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setThankYou('')}>🔄 Regenerate</button>
                      </div>
                    </>
                  ) : (
                    <button onClick={handleGenerateThankYou} className="btn btn-primary" disabled={generatingThankYou} style={{ width: '100%' }}>
                      {generatingThankYou ? <><span className="spinner" /> Generating...</> : '✨ Generate Thank-You Email'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>Select an interview to view debrief</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </>
  )
}
