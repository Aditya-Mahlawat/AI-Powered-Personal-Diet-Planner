// src/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/',          icon: '⊞',  label: 'Dashboard' },
  { to: '/meal-plan', icon: '🍽',  label: 'Meal Plans' },
  { to: '/intake',    icon: '📋', label: 'Intake Log' },
  { to: '/grocery',   icon: '🛒', label: 'Grocery List' },
  { to: '/foods',     icon: '🔍', label: 'Food Directory' },
  { to: '/setup',     icon: '👤', label: 'My Profile' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Signed out')
      navigate('/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <>
      {/* Sidebar — desktop */}
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">🥗</div>
          <div>
            <div className="brand-name">NutriMind</div>
            <div className="brand-tag">AI Diet Planner</div>
          </div>
        </NavLink>

        <div className="nav-section-label">Navigation</div>
        <div className="nav-items">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.displayName || 'User'}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Bottom bar — mobile */}
      <nav className="mobile-nav">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
          >
            <span className="mobile-nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
        <button onClick={handleLogout} className="mobile-nav-item">
          <span className="mobile-nav-icon">⏻</span>
          Sign Out
        </button>
      </nav>
    </>
  )
}
