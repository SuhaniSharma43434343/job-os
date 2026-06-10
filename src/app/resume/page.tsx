'use client'
import { useState, useRef } from 'react'

interface Resume {
  id: string
  name: string
  role: string
  uploadedAt: string
  size: string
  default: boolean
  skills: string[]
}

const mockResumes: Resume[] = [
  { id: '1', name: 'Resume_SDE.pdf', role: 'Software Engineer', uploadedAt: '2026-06-08', size: '142 KB', default: true, skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB'] },
  { id: '2', name: 'Resume_Data.pdf', role: 'Data Engineer', uploadedAt: '2026-06-05', size: '138 KB', default: false, skills: ['Python', 'SQL', 'Spark', 'Airflow', 'BigQuery'] },
  { id: '3', name: 'Resume_PM.pdf', role: 'Product Manager', uploadedAt: '2026-06-01', size: '125 KB', default: false, skills: ['Product Strategy', 'Analytics', 'Roadmapping', 'Agile'] },
]

const tailorExamples = {
  original: '• Developed REST APIs using Node.js\n• Built React components for dashboard\n• Worked with MongoDB databases',
  tailored: '• Engineered high-performance REST APIs using Node.js, handling 10k+ requests/sec, directly aligned with the role\'s backend scalability requirements\n• Architected 12 React components for an internal analytics dashboard, reducing data retrieval time by 40%\n• Designed MongoDB schema with advanced indexing, improving query performance by 3x'
}

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>(mockResumes)
  const [selected, setSelected] = useState<Resume | null>(mockResumes[0])
  const [tab, setTab] = useState<'vault' | 'tailor' | 'cover'>('vault')
  const [jobDesc, setJobDesc] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [tailoring, setTailoringLoading] = useState(false)
  const [tailored, setTailored] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [generatingCover, setGeneratingCover] = useState(false)
  const [toast, setToast] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleTailor = async () => {
    if (!jobDesc) return showToast('⚠️ Please paste the job description')
    setTailoringLoading(true)
    setTailored('')
    // Simulate Gemini call
    await new Promise(r => setTimeout(r, 2500))
    setTailored(tailorExamples.tailored)
    setTailoringLoading(false)
    showToast('✅ Resume tailored for ' + (jobTitle || 'this role') + '!')
  }

  const handleCoverLetter = async () => {
    if (!jobDesc) return showToast('⚠️ Please paste the job description')
    setGeneratingCover(true)
    await new Promise(r => setTimeout(r, 3000))
    setCoverLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle || 'Software Engineer'} position. With my background in full-stack development and proven track record of delivering scalable systems, I am confident I would make a significant contribution to your team.

During my academic career, I built and deployed several production-grade applications, including a real-time delivery tracking platform serving 5,000+ daily active users and an ML-powered resume screening tool used by 200+ recruiters. These projects honed my skills in React, Node.js, Python, and AWS — directly aligned with your role's requirements.

What excites me most about this opportunity is [company]'s mission to [mission]. I have followed your recent expansion into [area] and believe my experience in [relevant skill] positions me uniquely to contribute from day one.

I would love the opportunity to discuss how my skills align with your team's goals. Thank you for considering my application.

Warm regards,
[Your Name]`)
    setGeneratingCover(false)
    showToast('📝 Cover letter generated!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const newResume: Resume = {
      id: Date.now().toString(),
      name: file.name,
      role: 'New Resume',
      uploadedAt: new Date().toISOString().split('T')[0],
      size: `${Math.round(file.size / 1024)} KB`,
      default: false,
      skills: []
    }
    setResumes(prev => [...prev, newResume])
    showToast('✅ Resume uploaded: ' + file.name)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">📄 Resume Vault</div>
          <div className="page-subtitle">Manage your resumes, tailor them with AI, and generate cover letters</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileUpload} />
          <button onClick={() => fileRef.current?.click()} className="btn btn-primary">📤 Upload Resume</button>
        </div>
      </div>

      <div className="page-body fade-in">
        <div className="tabs">
          {[['vault', '📁 My Resumes'], ['tailor', '✨ AI Tailor'], ['cover', '📝 Cover Letter']].map(([key, label]) => (
            <button key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key as 'vault' | 'tailor' | 'cover')}>{label}</button>
          ))}
        </div>

        {tab === 'vault' && (
          <div className="grid-2" style={{ gap: 16 }}>
            {/* Resume List */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>YOUR RESUMES</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {resumes.map(r => (
                  <div
                    key={r.id}
                    className="card"
                    style={{ cursor: 'pointer', borderColor: selected?.id === r.id ? 'var(--accent-primary)' : undefined, background: selected?.id === r.id ? 'rgba(99,102,241,0.05)' : undefined }}
                    onClick={() => setSelected(r)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ fontSize: 32 }}>📄</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{r.role} · {r.size}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Uploaded {r.uploadedAt}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        {r.default && <span className="badge badge-primary">Default</span>}
                        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); showToast('⚠️ Delete feature coming soon') }}>🗑️</button>
                      </div>
                    </div>
                    {r.skills.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                        {r.skills.map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Panel */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>PREVIEW</h3>
              {selected ? (
                <div className="card" style={{ minHeight: 300 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selected.role}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => showToast('📥 Download feature ready after full setup!')}>📥 Download</button>
                      <button className="btn btn-primary btn-sm" onClick={() => setTab('tailor')}>✨ Tailor</button>
                    </div>
                  </div>
                  <div className="divider" />
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                    <div>PDF preview will render here</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>{selected.size} · {selected.role}</div>
                  </div>
                  <div className="divider" />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Key Skills Detected</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {selected.skills.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <h3>Select a resume to preview</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'tailor' && (
          <div className="grid-2" style={{ gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>JOB DETAILS</h3>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input id="tailor-job-title" className="form-input" placeholder="e.g. Software Engineer Intern" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Resume to Tailor</label>
                <select className="form-select" value={selected?.id} onChange={e => setSelected(resumes.find(r => r.id === e.target.value) || null)}>
                  {resumes.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Paste Job Description</label>
                <textarea
                  id="tailor-job-desc"
                  className="form-textarea"
                  style={{ minHeight: 200 }}
                  placeholder="Paste the full job description here. Gemini AI will analyze it and rewrite your resume bullet points to maximize keyword match and ATS score..."
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                />
              </div>
              <button onClick={handleTailor} className="btn btn-primary" disabled={tailoring} style={{ width: '100%' }}>
                {tailoring ? <><span className="spinner" /> Tailoring with Gemini AI...</> : '✨ Tailor My Resume'}
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>AI OUTPUT</h3>
              {tailored ? (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Original Bullets</div>
                    <div className="card" style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', padding: 14, background: 'rgba(239,68,68,0.03)', borderColor: 'rgba(239,68,68,0.1)' }}>
                      {tailorExamples.original}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>✨ Tailored Bullets</div>
                    <div className="card" style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', padding: 14, background: 'rgba(16,185,129,0.03)', borderColor: 'rgba(16,185,129,0.2)' }}>
                      {tailored}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-success" onClick={() => showToast('📥 Tailored resume downloaded!')}>📥 Download Tailored PDF</button>
                    <button className="btn btn-secondary" onClick={() => setTab('cover')}>📝 Generate Cover Letter</button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✨</div>
                  <h3>AI output will appear here</h3>
                  <p>Paste a job description and click Tailor</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'cover' && (
          <div className="grid-2" style={{ gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>GENERATE COVER LETTER</h3>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input id="cover-job-title" className="form-input" placeholder="e.g. SDE Intern at Google" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  id="cover-job-desc"
                  className="form-textarea"
                  style={{ minHeight: 220 }}
                  placeholder="Paste the job description. Gemini will write a personalized cover letter referencing your actual experience and the specific role requirements..."
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                />
              </div>
              <button onClick={handleCoverLetter} className="btn btn-primary" disabled={generatingCover} style={{ width: '100%' }}>
                {generatingCover ? <><span className="spinner" /> Writing with Gemini AI...</> : '📝 Generate Cover Letter'}
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>COVER LETTER</h3>
              {coverLetter ? (
                <div>
                  <div className="card" style={{ whiteSpace: 'pre-wrap', fontSize: 13.5, lineHeight: 1.8, color: 'var(--text-primary)' }}>
                    {coverLetter}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button className="btn btn-success" onClick={() => showToast('📋 Copied to clipboard!')}>📋 Copy</button>
                    <button className="btn btn-secondary" onClick={() => showToast('📥 Downloaded!')}>📥 Download PDF</button>
                    <button className="btn btn-ghost" onClick={() => setCoverLetter('')}>🔄 Regenerate</button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>Your cover letter will appear here</h3>
                  <p>Personalized by Gemini AI for each role</p>
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
