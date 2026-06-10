'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stat { label: string; value: string | number; change: string; color: string; icon: string }
interface Activity { time: string; text: string; icon: string; type: string }

const mockStats: Stat[] = [
  { label: 'Jobs Found Today', value: 12, change: '+5 from yesterday', color: 'var(--accent-primary)', icon: '🔍' },
  { label: 'Applications Sent', value: 34, change: '+3 this week', color: 'var(--accent-secondary)', icon: '📨' },
  { label: 'Interviews Booked', value: 4, change: '2 upcoming', color: 'var(--accent-green)', icon: '🎯' },
  { label: 'Response Rate', value: '23%', change: '+5% vs avg', color: 'var(--accent-amber)', icon: '📈' },
  { label: 'Outreach Sent', value: 18, change: '3 replies pending', color: 'var(--accent-purple)', icon: '🤝' },
]

const mockActivity: Activity[] = [
  { time: '2 min ago', text: 'New job match: SDE Intern at Google (94% match)', icon: '⭐', type: 'match' },
  { time: '1 hr ago', text: 'Cover letter generated for Microsoft SWE role', icon: '📝', type: 'resume' },
  { time: '3 hrs ago', text: 'Application submitted to Flipkart (Backend Engineer)', icon: '✅', type: 'apply' },
  { time: '5 hrs ago', text: 'Interview prep ready for Amazon SDE II', icon: '🎯', type: 'interview' },
  { time: 'Yesterday', text: 'Referral message drafted for Zepto (via Rahul S.)', icon: '🤝', type: 'outreach' },
  { time: 'Yesterday', text: 'Post-interview debrief: Swiggy round 1 scored 7.8/10', icon: '📊', type: 'debrief' },
]

const topJobs = [
  { title: 'SDE Intern', company: 'Google', score: 94, platform: 'LinkedIn', location: 'Bangalore', remote: false },
  { title: 'Software Engineer', company: 'Microsoft', score: 88, platform: 'Indeed', location: 'Hyderabad', remote: true },
  { title: 'Backend Engineer Intern', company: 'Zepto', score: 82, platform: 'Internshala', location: 'Mumbai', remote: false },
  { title: 'Full Stack Developer', company: 'Razorpay', score: 79, platform: 'Naukri', location: 'Bangalore', remote: true },
]

function ScoreBar({ score }: { score: number }) {
  const cls = score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low'
  const color = score >= 80 ? 'var(--accent-green)' : score >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)'
  return (
    <div className="match-score">
      <div className="match-score-bar">
        <div className={`match-score-fill ${cls}`} style={{ width: `${score}%` }} />
      </div>
      <span className="score-number" style={{ color, fontSize: '18px', fontWeight: 700 }}>{score}%</span>
    </div>
  )
}

export default function Dashboard() {
  const [greeting, setGreeting] = useState('Good morning')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours()
      setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
      setDate(now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{date} · {time}</div>
          <div className="page-title">{greeting} 👋</div>
          <div className="page-subtitle">Your daily briefing is ready. 12 new jobs matched your profile overnight.</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/jobs" className="btn btn-primary">🔍 Discover Jobs</Link>
          <Link href="/resume" className="btn btn-secondary">📄 My Resumes</Link>
        </div>
      </div>

      <div className="page-body fade-in">
        {/* Stats */}
        <div className="stats-grid">
          {mockStats.map((s) => (
            <div key={s.label} className="stat-card" style={{ '--accent-color': s.color } as React.CSSProperties}>
              <div className="stat-label">{s.icon} {s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-change">{s.change}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 24 }}>
          {/* Top Job Matches */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600 }}>⭐ Top Matches Today</h2>
              <Link href="/jobs" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            <div className="jobs-grid">
              {topJobs.map((job) => (
                <div key={job.title + job.company} className="card" style={{ padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="job-title" style={{ fontSize: 14 }}>{job.title}</div>
                      <div className="job-company">{job.company} · {job.location}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        <span className={`platform-badge platform-${job.platform.toLowerCase()}`}>{job.platform}</span>
                        {job.remote && <span className="badge badge-cyan">Remote</span>}
                      </div>
                    </div>
                    <ScoreBar score={job.score} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <Link href="/resume" className="btn btn-primary btn-sm">✨ Tailor Resume</Link>
                    <button className="btn btn-secondary btn-sm">📝 Cover Letter</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600 }}>⚡ Recent Activity</h2>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="timeline" style={{ padding: '16px 20px' }}>
                {mockActivity.map((a, i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${i === 0 ? 'active' : ''}`}>{a.icon}</div>
                    <div className="timeline-content">
                      <div className="timeline-title">{a.text}</div>
                      <div className="timeline-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>⚡ Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: '🔍', label: 'Scan New Jobs', href: '/jobs', color: 'var(--accent-primary)' },
                  { icon: '✍️', label: 'Write Outreach', href: '/outreach', color: 'var(--accent-secondary)' },
                  { icon: '🎯', label: 'Prep Interview', href: '/interview-prep', color: 'var(--accent-green)' },
                  { icon: '📊', label: 'Log Debrief', href: '/debrief', color: 'var(--accent-amber)' },
                ].map((action) => (
                  <Link key={action.label} href={action.href} className="card" style={{ padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-primary)' }}>
                    <span style={{ fontSize: 20 }}>{action.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
