import { useNavigate } from 'react-router-dom'
import './SessionCard.css'

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const TargetIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

function SessionCard() {
  const navigate = useNavigate()
  return (
    <section className="session-section">
      <p className="section-label" style={{ marginBottom: 'var(--space-3)' }}>Today&apos;s Session</p>

      <div className="session-card">
        {/* Left visual panel */}
        <div className="session-visual" aria-hidden="true">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="48" r="12" fill="white" />
            <circle
              cx="48" cy="48" r="28"
              stroke="white" strokeWidth="1.5"
              opacity="0.5"
              className="breathe-ring ring-1"
            />
            <circle
              cx="48" cy="48" r="44"
              stroke="white" strokeWidth="1"
              opacity="0.25"
              className="breathe-ring ring-2"
            />
          </svg>
        </div>

        {/* Right content */}
        <div className="session-content">
          <span className="session-tag">Recommended</span>

          <h2 className="session-title">Focus Breathing</h2>
          <p className="session-desc">
            Calm your mind and sharpen attention with guided breathing patterns
            designed for sustained, deep focus.
          </p>

          <div className="session-meta">
            <span className="meta-pill"><ClockIcon /> 10 min</span>
            <span className="meta-pill"><TargetIcon /> Attention</span>
            <span className="meta-pill">Beginner</span>
          </div>

          <button className="session-btn" onClick={() => navigate('/sessions', { state: { autoStart: true } })}>
            Begin Session <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

export default SessionCard
