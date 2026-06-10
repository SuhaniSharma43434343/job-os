'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: '🌅', label: 'Daily Briefing', badge: null },
  { href: '/jobs', icon: '🔍', label: 'Job Discovery', badge: '12' },
  { href: '/resume', icon: '📄', label: 'Resume Vault', badge: null },
  { href: '/outreach', icon: '🤝', label: 'Outreach', badge: '3' },
  { href: '/interview-prep', icon: '🎯', label: 'Interview Prep', badge: null },
  { href: '/debrief', icon: '📊', label: 'Post-Interview', badge: null },
  { href: '/tracker', icon: '📋', label: 'Tracker', badge: null },
  { href: '/settings', icon: '⚙️', label: 'Settings', badge: null },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🚀</div>
        <div>
          <h1>Job OS</h1>
          <span>Career Engine</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}

        <div className="nav-section-label">Analysis</div>
        {navItems.slice(5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item" style={{ fontSize: '12px', color: 'var(--text-muted)', cursor: 'default' }}>
          <span className="nav-icon">🟢</span>
          AI Connected
        </div>
      </div>
    </aside>
  )
}
