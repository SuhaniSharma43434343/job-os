'use client'
import { useState } from 'react'

interface Question {
  id: string
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  answer: string
  score?: number
  feedback?: string
  betterStory?: string
}

const MOCK_QUESTIONS: Question[] = [
  { id: '1', question: 'Tell me about yourself and why you want to work at Google.', category: 'Behavioral', difficulty: 'medium', answer: '' },
  { id: '2', question: 'Describe a time you solved a technically challenging problem. What was your approach?', category: 'Behavioral', difficulty: 'hard', answer: '' },
  { id: '3', question: 'Design a URL shortener like bit.ly. Walk me through your system design.', category: 'System Design', difficulty: 'hard', answer: '' },
  { id: '4', question: 'Implement a function to find the Kth largest element in an unsorted array.', category: 'Coding (DSA)', difficulty: 'medium', answer: '' },
  { id: '5', question: 'How do you handle disagreements with teammates or managers?', category: 'Behavioral', difficulty: 'easy', answer: '' },
  { id: '6', question: 'What projects are you most proud of and why?', category: 'Behavioral', difficulty: 'easy', answer: '' },
]

const COMPANY_RESEARCH = {
  company: 'Google',
  recentNews: [
    'Google announced Gemini 2.0 Ultra at I/O 2026 with major improvements in code generation',
    'Google Cloud hit $50B ARR, growing 35% YoY in Q1 2026',
    'Google Maps now uses AI for real-time hazard detection across 100+ cities',
  ],
  culture: 'Data-driven, highly collaborative. "Googlegeist" emphasizes psychological safety and impact at scale. Expect whiteboard-style interviews with emphasis on communication.',
  interviewerNotes: 'Your interviewer Arjun Kapoor (from LinkedIn) is a Staff SWE focused on distributed systems. He recently posted about reliability engineering and chaos testing.',
  gaps: ['Weak on system design scalability concepts', 'No distributed systems project in resume', 'Could strengthen SQL/database answers']
}

export default function InterviewPrepPage() {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS)
  const [company, setCompany] = useState('Google')
  const [role, setRole] = useState('SDE Intern')
  const [tab, setTab] = useState<'research' | 'questions' | 'mock'>('research')
  const [mockQ, setMockQ] = useState<Question | null>(null)
  const [mockAnswer, setMockAnswer] = useState('')
  const [grading, setGrading] = useState(false)
  const [gradedResult, setGradedResult] = useState<{ score: number; feedback: string; rewrite: string } | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const startMock = (q: Question) => {
    setMockQ(q)
    setMockAnswer('')
    setGradedResult(null)
    setTab('mock')
  }

  const handleGrade = async () => {
    if (!mockAnswer.trim()) return showToast('⚠️ Please write your answer first')
    setGrading(true)
    await new Promise(r => setTimeout(r, 2500))
    setGradedResult({
      score: 7,
      feedback: 'Good use of the STAR method. You clearly described the Situation and Task, but the Result could be more quantified. You mentioned the impact was "significant" — try to add a number (e.g., "reduced latency by 40%" or "increased user retention by 15%"). Your communication is clear and confident.',
      rewrite: 'Stronger version: "In my final year project, I faced a critical bug in our WebSocket connection handling that was causing 30% of users to drop from live sessions. I diagnosed the issue using Chrome DevTools and found a race condition in our event listener teardown. I refactored the lifecycle management, added exponential backoff, and deployed a fix within 48 hours. This reduced session drops from 30% to under 2% and improved our user retention metric from 62% to 79% in the following sprint."'
    })
    setGrading(false)
    setQuestions(prev => prev.map(q => q.id === mockQ?.id ? { ...q, score: 7 } : q))
  }

  const diffColor = { easy: 'badge-green', medium: 'badge-amber', hard: 'badge-red' }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🎯 Interview Prep Engine</div>
          <div className="page-subtitle">Company research, question bank, mock interviews with AI grading</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input id="prep-company" className="form-input" style={{ width: 160 }} placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
          <input id="prep-role" className="form-input" style={{ width: 180 }} placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
          <button className="btn btn-primary" onClick={() => showToast('🔍 Loading prep for ' + company + '...')}>Load Prep</button>
        </div>
      </div>

      <div className="page-body fade-in">
        <div className="tabs">
          {[['research', '🏢 Company Brief'], ['questions', '📋 Questions'], ['mock', '🎤 Mock Interview']].map(([key, label]) => (
            <button key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key as 'research' | 'questions' | 'mock')}>{label}</button>
          ))}
        </div>

        {tab === 'research' && (
          <div className="grid-2" style={{ gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Recent news */}
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>📰 Recent News — {company}</div>
                {COMPANY_RESEARCH.recentNews.map((n, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: i < COMPANY_RESEARCH.recentNews.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                    <span style={{ color: 'var(--accent-secondary)', marginTop: 2 }}>→</span>
                    <span style={{ fontSize: 13.5, lineHeight: 1.6 }}>{n}</span>
                  </div>
                ))}
              </div>

              {/* Culture */}
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>🏛️ Culture & Interview Style</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{COMPANY_RESEARCH.culture}</p>
              </div>

              {/* Interviewer */}
              <div className="card" style={{ borderColor: 'var(--border-accent)', background: 'rgba(99,102,241,0.03)' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>👤 Interviewer Intel</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{COMPANY_RESEARCH.interviewerNotes}</p>
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--accent-primary)' }}>💡 Tip: Mention reliability engineering or resilience patterns in your system design answer</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Gap Analysis */}
              <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.03)' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>⚠️ Your Gaps for This Role</div>
                {COMPANY_RESEARCH.gaps.map((g, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13.5, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-amber)', marginTop: 2 }}>●</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{g}</span>
                  </div>
                ))}
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={() => setTab('questions')}>
                  📋 See targeted questions →
                </button>
              </div>

              {/* Game Plan */}
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>🗺️ Your Game Plan</div>
                {[
                  { step: '1', title: 'Lead with projects', desc: 'Open "Tell me about yourself" with your most impactful project, not your education.' },
                  { step: '2', title: 'Quantify everything', desc: 'Add numbers to every achievement — "reduced by X%", "served X users", "took X days".' },
                  { step: '3', title: 'System design pivot', desc: 'Practice the URL shortener and news feed problems before the interview.' },
                  { step: '4', title: 'Ask smart questions', desc: 'Ask about their oncall culture and reliability roadmap — will resonate with this interviewer.' },
                ].map(p => (
                  <div key={p.step} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{p.step}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 2 }}>{p.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'questions' && (
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Questions {company} commonly asks for {role} roles. Click any question to practice in Mock Interview mode.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {questions.map(q => (
                <div key={q.id} className="question-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className={`badge ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
                      <span className="badge badge-gray">{q.category}</span>
                      {q.score && <span className={`score-indicator score-${q.score}`}>Score: {q.score}/10</span>}
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => startMock(q)}>🎤 Practice</button>
                  </div>
                  <div className="question-text">{q.question}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'mock' && (
          <div className="grid-2" style={{ gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>
                {mockQ ? '🎤 ANSWER THIS QUESTION' : 'SELECT A QUESTION'}
              </h3>
              {mockQ ? (
                <>
                  <div className="card" style={{ marginBottom: 16, borderColor: 'var(--border-accent)', background: 'rgba(99,102,241,0.03)' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <span className={`badge ${diffColor[mockQ.difficulty]}`}>{mockQ.difficulty}</span>
                      <span className="badge badge-gray">{mockQ.category}</span>
                    </div>
                    <div className="question-text">{mockQ.question}</div>
                  </div>
                  <textarea
                    id="mock-answer"
                    className="answer-area"
                    style={{ minHeight: 200, width: '100%' }}
                    placeholder="Type your answer here. Try to use the STAR method (Situation, Task, Action, Result) for behavioral questions..."
                    value={mockAnswer}
                    onChange={e => setMockAnswer(e.target.value)}
                  />
                  <button onClick={handleGrade} className="btn btn-primary" disabled={grading} style={{ width: '100%', marginTop: 12 }}>
                    {grading ? <><span className="spinner" /> Gemini is grading your answer...</> : '📊 Grade My Answer'}
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => { setMockQ(null); setTab('questions') }}>
                    ← Back to questions
                  </button>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎤</div>
                  <h3>No question selected</h3>
                  <p>Go to Questions tab and click "Practice" on any question</p>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setTab('questions')}>Browse Questions</button>
                </div>
              )}
            </div>

            {/* Grade Result */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>AI FEEDBACK</h3>
              {gradedResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ fontSize: 48, fontFamily: 'var(--font-heading)', fontWeight: 800, color: gradedResult.score >= 8 ? 'var(--accent-green)' : gradedResult.score >= 6 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>
                      {gradedResult.score}/10
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Answer Score</div>
                  </div>
                  <div className="card">
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>💬 Feedback</div>
                    <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{gradedResult.feedback}</p>
                  </div>
                  <div className="card" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.03)' }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>✨ Stronger Version</div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>{gradedResult.rewrite}</p>
                  </div>
                  <button className="btn btn-secondary" onClick={() => { setMockQ(null); setGradedResult(null); setTab('questions') }}>
                    Practice Next Question →
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>AI feedback will appear here</h3>
                  <p>Answer a question and click "Grade My Answer"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {toast && <div className="toast-container"><div className="toast toast-info">{toast}</div></div>}
    </>
  )
}
