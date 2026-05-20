import { useNavigate, useLocation } from 'react-router-dom'
import './BottomNav.css'

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const BreathIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="7" strokeOpacity="0.55" />
    <circle cx="12" cy="12" r="11" strokeOpacity="0.25" />
  </svg>
)

const ChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const TABS = [
  { path: '/home',     label: 'Home',     Icon: HomeIcon    },
  { path: '/sessions', label: 'Breathe',  Icon: BreathIcon  },
  { path: '/progress', label: 'Progress', Icon: ChartIcon   },
  { path: '/profile',  label: 'Profile',  Icon: ProfileIcon },
]

function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      <div className="nav-inner">
        {TABS.map(({ path, label, Icon }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              className={`nav-tab ${active ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{label}</span>
              {active && <span className="nav-indicator" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
