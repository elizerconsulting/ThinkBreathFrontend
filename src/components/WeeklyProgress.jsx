import { useState, useEffect } from 'react'
import { api } from '../api/client'
import './WeeklyProgress.css'

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function WeeklyProgress() {
  const [days, setDays] = useState([])

  useEffect(() => {
    api.get('/stats/weekly')
      .then(data => setDays(data.days))
      .catch(() => {})
  }, [])

  const completed = days.filter(d => d.count > 0).length

  return (
    <section className="weekly-card">
      <div className="weekly-header">
        <p className="section-label">This Week</p>
        <p className="weekly-count">
          {completed} <span>/ 7 days</span>
        </p>
      </div>

      <div className="day-grid">
        {days.map((day, i) => {
          const state = day.count > 0 ? 'done' : day.is_today ? 'today' : 'future'
          return (
            <div key={i} className={`day-col ${state}`}>
              <div className="day-circle">
                {state === 'done'  && <CheckIcon />}
                {state === 'today' && <span className="today-dot" />}
              </div>
              <span className="day-label">{day.label}</span>
            </div>
          )
        })}
      </div>

      <p className="weekly-message">
        {completed === 0
          ? 'Start your streak today.'
          : completed < 4
          ? `${completed} session${completed > 1 ? 's' : ''} completed — keep the momentum.`
          : `${completed} sessions completed — outstanding consistency.`}
      </p>
    </section>
  )
}

export default WeeklyProgress
