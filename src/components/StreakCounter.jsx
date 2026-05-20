import { useState, useEffect } from 'react'
import { api } from '../api/client'
import './StreakCounter.css'

const MILESTONES = [3, 7, 30, 100]
const R = 20
const CIRCUMFERENCE = 2 * Math.PI * R

function nextMilestone(streak) {
  return MILESTONES.find(m => m > streak) ?? MILESTONES[MILESTONES.length - 1]
}

const FlameIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2C12 2 5 9 5 14a7 7 0 0014 0C19 9 12 2 12 2z"
      fill="#FBBF24"
    />
    <path
      d="M12 10c0 0-3 4-3 5.5a3 3 0 006 0C15 14 12 10 12 10z"
      fill="rgba(255,255,255,0.55)"
    />
  </svg>
)

function StreakCounter() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    api.get('/stats/summary')
      .then(data => setStreak(data.current_streak))
      .catch(() => {})
  }, [])

  const milestone = nextMilestone(streak)
  const pct = Math.min(100, Math.round((streak / milestone) * 100))
  const daysLeft = milestone - streak

  return (
    <div className="streak-card">
      <div className="streak-header">
        <div className="streak-icon-wrap">
          <FlameIcon />
        </div>
        <div className="streak-text">
          <p className="streak-num">{streak} Day Streak</p>
          <p className="streak-sub">{daysLeft} day{daysLeft !== 1 ? 's' : ''} to {milestone}-day badge</p>
        </div>
        <div className="streak-ring" aria-label={`${pct}% toward goal`}>
          <svg width="52" height="52" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
            <circle
              cx="24" cy="24" r={R}
              fill="none"
              stroke="#FBBF24"
              strokeWidth="4"
              strokeDasharray={`${(pct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
            <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="white">
              {pct}%
            </text>
          </svg>
        </div>
      </div>

      <div className="streak-progress">
        <div className="streak-track">
          <div className="streak-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="streak-goal-label">{milestone}-day goal</span>
      </div>
    </div>
  )
}

export default StreakCounter
