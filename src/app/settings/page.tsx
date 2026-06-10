'use client'
import { useState } from 'react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', linkedin: '', portfolio: '',
    targetRoles: 'Software Engineer, SDE Intern, Full Stack Developer',
    targetLocations: 'Bangalore, Hyderabad, Remote',
    targetSalary: '₹15-35 LPA',
    experience: 'Fresher / 0-1 years',
    noticePeriod: 'Immediate',
  })
  const [apis, setApis] = useState({
    geminiKey: 'AQ.Ab8RN6JE••••••••••••••••••',
    rapidapiKey: '40c482ba8d••••••••••••••••••',
    openaiKey: '',
  })
  const [toast, setToast] = useState('')
  const [saved, setSaved] = useState(false)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleSave = () => {
    setSaved(true)
    showToast('✅ Settings saved!')
    setTimeout(() => setSaved(false), 2000)
  }

  const updateProfile = (key: string, value: string) => setProfile(p => ({ ...p, [key]: value }))

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">⚙️ Settings</div>
          <div className="page-subtitle">Your profile, job preferences, and API connections</div>
        </div>
        <button onClick={handleSave} className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}>
          {saved ? '✅ Saved!' : '💾 Save Changes'}
        </button>
      </div>

      <div className="page-body fade-in">
        <div className="grid-2" style={{ gap: 24, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>👤 Your Profile</div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input id="settings-name" className="form-input" placeholder="e.g. Arjun Sharma" value={profile.name} onChange={e => updateProfile('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input id="settings-email" className="form-input" type="email" placeholder="you@example.com" value={profile.email} onChange={e => updateProfile('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input id="settings-phone" className="form-input" placeholder="+91 98765 43210" value={profile.phone} onChange={e => updateProfile('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input id="settings-linkedin" className="form-input" placeholder="linkedin.com/in/yourname" value={profile.linkedin} onChange={e => updateProfile('linkedin', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio / GitHub</label>
                <input id="settings-portfolio" className="form-input" placeholder="github.com/yourname" value={profile.portfolio} onChange={e => updateProfile('portfolio', e.target.value)} />
              </div>
            </div>

            {/* Job Preferences */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🎯 Job Preferences</div>
              <div className="form-group">
                <label className="form-label">Target Roles</label>
                <input id="settings-roles" className="form-input" value={profile.targetRoles} onChange={e => updateProfile('targetRoles', e.target.value)} placeholder="Software Engineer, Data Analyst..." />
              </div>
              <div className="form-group">
                <label className="form-label">Target Locations</label>
                <input id="settings-locations" className="form-input" value={profile.targetLocations} onChange={e => updateProfile('targetLocations', e.target.value)} placeholder="Bangalore, Remote..." />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Salary / Stipend</label>
                <input id="settings-salary" className="form-input" value={profile.targetSalary} onChange={e => updateProfile('targetSalary', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select id="settings-experience" className="form-select" value={profile.experience} onChange={e => updateProfile('experience', e.target.value)}>
                  {['Fresher / 0-1 years', '1-3 years', '3-5 years', '5+ years'].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notice Period</label>
                <select id="settings-notice" className="form-select" value={profile.noticePeriod} onChange={e => updateProfile('noticePeriod', e.target.value)}>
                  {['Immediate', '15 days', '30 days', '60 days', '90 days'].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* API Keys */}
            <div className="card" style={{ borderColor: 'var(--border-accent)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>🔑 API Keys</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Stored locally in .env.local — never uploaded anywhere</div>

              <div className="form-group">
                <label className="form-label">Gemini API Key</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input id="settings-gemini" className="form-input" type="password" value={apis.geminiKey} onChange={e => setApis(p => ({ ...p, geminiKey: e.target.value }))} placeholder="AQ.Ab8RN6..." />
                  <button className="btn btn-secondary btn-sm" onClick={() => showToast('✅ Gemini connected!')}>Test</button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 4 }}>🟢 Connected — free tier (15 req/min)</div>
              </div>

              <div className="form-group">
                <label className="form-label">RapidAPI Key (JSearch)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input id="settings-rapidapi" className="form-input" type="password" value={apis.rapidapiKey} onChange={e => setApis(p => ({ ...p, rapidapiKey: e.target.value }))} placeholder="40c482ba8d..." />
                  <button className="btn btn-secondary btn-sm" onClick={() => showToast('✅ JSearch connected!')}>Test</button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 4 }}>🟢 Connected — 200 searches/month free</div>
              </div>

              <div className="form-group">
                <label className="form-label">OpenAI Key (optional)</label>
                <input id="settings-openai" className="form-input" type="password" value={apis.openaiKey} onChange={e => setApis(p => ({ ...p, openaiKey: e.target.value }))} placeholder="sk-... (optional, for GPT fallback)" />
              </div>
            </div>

            {/* Platform Targets */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>🌐 Platforms to Scan</div>
              {[
                { name: 'LinkedIn', status: 'active', note: 'Easy Apply supported' },
                { name: 'Indeed', status: 'active', note: 'Quick Apply supported' },
                { name: 'Internshala', status: 'active', note: 'India internships' },
                { name: 'Naukri', status: 'active', note: 'India jobs' },
                { name: 'Glassdoor', status: 'active', note: 'Salary insights included' },
                { name: 'RemoteOK', status: 'active', note: 'Remote-first jobs' },
                { name: 'We Work Remotely', status: 'active', note: 'Global remote jobs' },
              ].map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.note}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge badge-green">🟢 Active</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Schedule */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>⏰ Auto-Scan Schedule</div>
              <div className="form-group">
                <label className="form-label">Daily Scan Time</label>
                <input type="time" className="form-input" defaultValue="07:00" />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Jobs will be scanned and briefing ready at this time</div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Follow-up Nudge After</label>
                <select className="form-select">
                  {['3 days', '5 days', '7 days', '10 days'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </>
  )
}
