'use client'
import { useState } from 'react'

const PLATFORMS = ['LinkedIn', 'Indeed', 'Internshala', 'Naukri', 'Glassdoor', 'Remote']
const JOB_TYPES = ['Full-time', 'Internship', 'Remote', 'Hybrid', 'Part-time']
const EXPERIENCE = ['Fresher', '0-1 yr', '1-3 yrs', '3-5 yrs', '5+ yrs']

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  platform: string
  type: string
  posted: string
  score: number
  description: string
  remote: boolean
  applied: boolean
}

const mockJobs: Job[] = [
  { id: '1', title: 'Software Development Engineer Intern', company: 'Google', location: 'Bangalore, India', salary: '₹80,000/mo', platform: 'LinkedIn', type: 'Internship', posted: '2 hrs ago', score: 94, description: 'Join Google\'s SWE internship program. Work on large-scale systems with mentorship from senior engineers.', remote: false, applied: false },
  { id: '2', title: 'Software Engineer - New Grad', company: 'Microsoft', location: 'Hyderabad, India', salary: '₹25-35 LPA', platform: 'Indeed', type: 'Full-time', posted: '5 hrs ago', score: 88, description: 'Join Microsoft\'s engineering team building cloud-scale solutions on Azure. Strong CS fundamentals required.', remote: true, applied: false },
  { id: '3', title: 'Backend Engineer Intern', company: 'Zepto', location: 'Mumbai, India', salary: '₹50,000/mo', platform: 'Internshala', type: 'Internship', posted: '8 hrs ago', score: 82, description: 'Build backend systems for India\'s fastest-growing quick commerce platform. Python/Go preferred.', remote: false, applied: false },
  { id: '4', title: 'Full Stack Developer', company: 'Razorpay', location: 'Bangalore, India', salary: '₹18-28 LPA', platform: 'Naukri', type: 'Full-time', posted: '12 hrs ago', score: 79, description: 'Work on Razorpay\'s payment infrastructure serving millions of merchants. React + Node.js stack.', remote: true, applied: true },
  { id: '5', title: 'Data Engineer Intern', company: 'Swiggy', location: 'Bangalore, India', salary: '₹45,000/mo', platform: 'Glassdoor', type: 'Internship', posted: '1 day ago', score: 76, description: 'Build data pipelines and analytics infrastructure for Swiggy\'s delivery operations.', remote: false, applied: false },
  { id: '6', title: 'Junior Software Engineer', company: 'Remote First Co.', location: 'Remote (Global)', salary: '$40,000-$60,000/yr', platform: 'Remote', type: 'Remote', posted: '1 day ago', score: 71, description: 'Fully remote role building SaaS products. Flexible hours, global team, competitive pay.', remote: true, applied: false },
  { id: '7', title: 'Product Engineer Intern', company: 'CRED', location: 'Bangalore, India', salary: '₹60,000/mo', platform: 'LinkedIn', type: 'Internship', posted: '2 days ago', score: 68, description: 'Build user-facing features for CRED\'s fintech platform. React Native + TypeScript.', remote: false, applied: false },
  { id: '8', title: 'Cloud Engineer', company: 'AWS (Amazon)', location: 'Hyderabad, India', salary: '₹22-32 LPA', platform: 'Indeed', type: 'Full-time', posted: '2 days ago', score: 65, description: 'Join AWS to build and operate global infrastructure. Strong Linux and networking skills needed.', remote: false, applied: false },
]

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--accent-green)' : score >= 65 ? 'var(--accent-amber)' : 'var(--accent-red)'
  return <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color }}>{score}%</span>
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [platforms, setPlatforms] = useState<Set<string>>(new Set())
  const [types, setTypes] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const toggle = (id: string) => setSelected(prev => {
    const n = new Set(prev)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })

  const togglePlatform = (p: string) => setPlatforms(prev => {
    const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n
  })
  const toggleType = (t: string) => setTypes(prev => {
    const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n
  })

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
    const matchPlatform = platforms.size === 0 || platforms.has(j.platform)
    const matchType = types.size === 0 || types.has(j.type)
    return matchSearch && matchPlatform && matchType
  })

  const handleScanJobs = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    showToast('✅ Scanned 6 platforms — 12 new jobs found!')
  }

  const handleApplySelected = () => {
    if (selected.size === 0) return showToast('⚠️ Please select at least one job')
    showToast(`🚀 Preparing ${selected.size} applications — check Resume page to review & submit!`)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🔍 Job Discovery</div>
          <div className="page-subtitle">Scanned 6 platforms · {jobs.length} jobs matched your profile · Ranked by fit</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {selected.size > 0 && (
            <button onClick={handleApplySelected} className="btn btn-success">
              ✅ Apply to {selected.size} Selected
            </button>
          )}
          <button onClick={handleScanJobs} className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Scanning...</> : '🔄 Scan New Jobs'}
          </button>
        </div>
      </div>

      <div className="page-body fade-in">
        {/* Search */}
        <div className="search-bar">
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <span className="search-icon">🔎</span>
            <input
              id="job-search"
              className="form-input search-input"
              placeholder="Search job title, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Platform</div>
          <div className="chips" style={{ marginBottom: 12 }}>
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => togglePlatform(p)} className={`chip ${platforms.has(p) ? 'active' : ''}`}>{p}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Job Type</div>
          <div className="chips">
            {JOB_TYPES.map(t => (
              <button key={t} onClick={() => toggleType(t)} className={`chip ${types.has(t) ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Job List */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> jobs · {selected.size} selected
          </div>
          <button onClick={() => setSelected(new Set(filtered.map(j => j.id)))} className="btn btn-ghost btn-sm">
            Select All
          </button>
        </div>

        <div className="jobs-grid">
          {filtered.map((job) => (
            <div key={job.id} className={`job-card ${selected.has(job.id) ? 'selected' : ''}`}>
              {/* Checkbox */}
              <div className="job-checkbox" onClick={() => toggle(job.id)}>
                {selected.has(job.id) && <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>

              {/* Info */}
              <div className="job-info" onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div className="job-title">{job.title}</div>
                    <div className="job-company">{job.company} · {job.location}</div>
                    <div className="job-meta">
                      <span className={`platform-badge platform-${job.platform.toLowerCase()}`}>{job.platform}</span>
                      <span className="badge badge-gray">{job.type}</span>
                      {job.remote && <span className="badge badge-cyan">🌍 Remote</span>}
                      {job.applied && <span className="badge badge-green">✅ Applied</span>}
                      <span className="job-salary">{job.salary}</span>
                      <span className="job-posted">{job.posted}</span>
                    </div>

                    {expandedJob === job.id && (
                      <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, paddingTop: 12, borderTop: '1px solid var(--border-primary)' }}>
                        {job.description}
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); showToast('✨ Tailoring resume for ' + job.company + '...') }}>
                            ✨ Tailor Resume
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); showToast('📝 Generating cover letter...') }}>
                            📝 Cover Letter
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); showToast('🎯 Interview prep loaded!') }}>
                            🎯 Prep Interview
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <ScoreBadge score={job.score} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast toast-info">{toast}</div>
        </div>
      )}
    </>
  )
}
