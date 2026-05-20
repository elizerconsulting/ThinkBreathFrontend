import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import './HabitsCard.css'

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

function HabitsCard() {
  const navigate = useNavigate()
  const [doneCount, setDoneCount] = useState(0)
  const [total,     setTotal]     = useState(5)

  useEffect(() => {
    api.get('/stats/summary')
      .then(data => {
        setDoneCount(data.today_count)
        setTotal(data.total_habits)
      })
      .catch(() => {})
  }, [])

  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  return (
    <section className="habits-preview-card">
      <div className="habits-preview-top">
        <div>
          <p className="section-label" style={{ marginBottom: 'var(--space-1)' }}>Habit Tracker</p>
          <h2 className="habits-preview-title">
            {doneCount === 0
              ? 'Start your habits today'
              : doneCount === total
              ? 'All habits complete!'
              : `${doneCount} of ${total} done today`}
          </h2>
          <p className="habits-preview-sub">
            {doneCount === total
              ? 'Outstanding. You showed up for every practice.'
              : 'Build your mindfulness routine one check at a time.'}
          </p>
        </div>
        <div className="habits-ring-wrap" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-neutral-100)" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="26"
              fill="none"
              stroke="var(--color-brand-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
              transform="rotate(-90 32 32)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <text x="32" y="37" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-neutral-800)">{pct}%</text>
          </svg>
        </div>
      </div>

      <div className="habits-preview-dots" aria-label="Habits progress">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`hp-dot${i < doneCount ? ' hp-dot--done' : ''}`}
            title={`Habit ${i + 1}`}
          />
        ))}
      </div>

      <button className="habits-preview-btn" onClick={() => navigate('/habits')}>
        View all habits <ArrowIcon />
      </button>
    </section>
  )
}

export default HabitsCard
