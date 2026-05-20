import { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../api/auth'
import './TopNav.css'

const NAV_LINKS = [
  { path: '/home',     label: 'Home' },
  { path: '/sessions', label: 'Sessions' },
  { path: '/habits',   label: 'Habits' },
]

function TopNav() {
  const navigate          = useNavigate()
  const { pathname }      = useLocation()
  const { user, clearSession } = useAuth()
  const [open, setOpen]   = useState(false)
  const dropdownRef       = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    setOpen(false)
    try { await logoutUser() } catch {}
    clearSession()
    navigate('/')
  }

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <button className="nav-logo" onClick={() => navigate('/home')}>
          <span className="nav-logo-dot" />
          ThinkBreath
        </button>

        <nav className="nav-links" aria-label="Main navigation">
          {NAV_LINKS.map(({ path, label }) => (
            <button
              key={path}
              className={`nav-link ${pathname === path ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="nav-right" ref={dropdownRef}>
          <button
            className="nav-avatar"
            aria-label="Account menu"
            aria-expanded={open}
            onClick={() => setOpen(prev => !prev)}
          >
            {initials}
          </button>

          {open && (
            <div className="nav-dropdown" role="menu">
              <div className="nav-dropdown-user">
                <span className="nav-dropdown-name">{user?.name || 'Account'}</span>
                <span className="nav-dropdown-email">{user?.email || ''}</span>
              </div>

              <div className="nav-dropdown-divider" />

              <button
                className="nav-dropdown-item"
                role="menuitem"
                onClick={() => { setOpen(false); navigate('/profile') }}
              >
                View Profile
              </button>

              <button
                className="nav-dropdown-item nav-dropdown-item--danger"
                role="menuitem"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNav
