import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import './StatsPreviewCard.css'

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const TOTAL_HABITS = 5

function StatsPreviewCard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalPractices: 0, currentStreak: 0, todayCount: 0 })

  useEffect(() => {
    api.get('/stats/summary')
      .then(data => setStats({
        totalPractices: data.total_practices,
        currentStreak:  data.current_streak,
        todayCount:     data.today_count,
      }))
      .catch(() => {})
  }, [])

  return (
    <section className="spc-card">
      <div className="spc-top">
        <div>
          <p className="section-label" style={{ marginBottom: 'var(--space-1)' }}>Your Progress</p>
          <h2 className="spc-title">
            {stats.totalPractices === 0
              ? 'Start your journey'
              : `${stats.totalPractices} practice${stats.totalPractices !== 1 ? 's' : ''} completed`}
          </h2>
          <p className="spc-sub">
            {stats.currentStreak > 0
              ? `${stats.currentStreak}-day current streak · ${stats.todayCount} of ${TOTAL_HABITS} done today`
              : 'Complete habits to build your stats'}
          </p>
        </div>

        <div className="spc-stats-row">
          <div className="spc-mini-stat">
            <span className="spc-mini-value">{stats.totalPractices}</span>
            <span className="spc-mini-label">total</span>
          </div>
          <div className="spc-mini-sep" aria-hidden="true" />
          <div className="spc-mini-stat">
            <span className="spc-mini-value">{stats.currentStreak}</span>
            <span className="spc-mini-label">streak</span>
          </div>
        </div>
      </div>

      <button className="spc-btn" onClick={() => navigate('/profile')}>
        View full profile <ArrowIcon />
      </button>
    </section>
  )
}

export default StatsPreviewCard
