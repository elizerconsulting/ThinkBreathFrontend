import { useState, useEffect, useCallback } from 'react'
import TopNav from '../components/TopNav'
import BottomNav from '../components/BottomNav'
import { api } from '../api/client'
import './HabitTrackerPage.css'

function dateStr(d) {
  return d.toISOString().split('T')[0]
}

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(dateStr(d))
  }
  return days
}

function getDayLabel(dateString) {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  return labels[new Date(dateString + 'T12:00:00').getDay()]
}

function calcStreak(completions) {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (completions.includes(dateStr(d))) streak++
    else break
  }
  return streak
}

const FlameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2C12 2 6 9 6 14a6 6 0 0012 0C18 9 12 2 12 2z" fill="#FBBF24" />
    <path d="M12 10c0 0-3 3.5-3 5a3 3 0 006 0C15 13.5 12 10 12 10z" fill="rgba(255,255,255,0.5)" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function HabitCard({ habit, completions, onToggle, toggling }) {
  const today  = dateStr(new Date())
  const last7  = getLast7Days()
  const streak = calcStreak(completions)
  const doneToday = completions.includes(today)

  return (
    <article className={`hc-card${doneToday ? ' hc-card--done' : ''}`}>
      <div className="hc-header">
        <div className="hc-meta">
          <span className="hc-category" style={{ color: habit.accentColor }}>{habit.category}</span>
          <h3 className="hc-name">{habit.name}</h3>
          <p className="hc-desc">{habit.desc}</p>
        </div>
        <div className="hc-streak">
          <span className="hc-streak-flame" aria-hidden="true"><FlameIcon /></span>
          <span className="hc-streak-count">{streak}</span>
          <span className="hc-streak-label">streak</span>
        </div>
      </div>

      <div className="hc-grid" role="list" aria-label="Last 7 days">
        {last7.map((date) => {
          const done    = completions.includes(date)
          const isToday = date === today
          return (
            <div key={date} className="hc-day" role="listitem">
              <div
                className={`hc-dot${done ? ' hc-dot--done' : ''}${isToday ? ' hc-dot--today' : ''}`}
                style={done ? { background: habit.accentColor } : {}}
                aria-label={done ? 'completed' : isToday ? 'today' : 'not completed'}
              >
                {done && <CheckIcon />}
              </div>
              <span className="hc-day-label" aria-hidden="true">{getDayLabel(date)}</span>
            </div>
          )
        })}
      </div>

      <button
        className={`hc-btn${doneToday ? ' hc-btn--done' : ''}`}
        style={doneToday
          ? { background: habit.accentColor, borderColor: habit.accentColor }
          : { borderColor: habit.accentColor, color: habit.accentColor }}
        onClick={() => onToggle(habit.id, today)}
        disabled={toggling === habit.id}
        aria-pressed={doneToday}
      >
        {doneToday ? <><CheckIcon /> Done today</> : 'Mark complete'}
      </button>
    </article>
  )
}

function HabitTrackerPage() {
  const [habits,      setHabits]      = useState([])
  const [completions, setCompletions] = useState({})
  const [toggling,    setToggling]    = useState(null)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [habitsRes, completionsRes] = await Promise.all([
          api.get('/habits'),
          api.get('/habits/completions'),
        ])

        setHabits(habitsRes.habits.map(h => ({
          id:          h.slug,
          name:        h.name,
          desc:        h.description ?? '',
          category:    h.category,
          accentColor: h.accentColor,
        })))

        setCompletions(completionsRes.completions ?? {})
      } catch {
        // leave empty — user sees habits with no completions
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleToggle = useCallback(async (habitId, date) => {
    // Optimistic update
    setCompletions(prev => {
      const current = prev[habitId] || []
      const updated = current.includes(date)
        ? current.filter(d => d !== date)
        : [...current, date]
      return { ...prev, [habitId]: updated }
    })

    setToggling(habitId)
    try {
      const res = await api.postAuth(`/habits/${habitId}/toggle`, { date })
      // Sync with server truth
      setCompletions(prev => {
        const current = prev[habitId] || []
        const serverDone = res.completed
        const alreadyDone = current.includes(date)
        if (serverDone === alreadyDone) return prev
        const updated = serverDone
          ? [...current, date]
          : current.filter(d => d !== date)
        return { ...prev, [habitId]: updated }
      })
    } catch {
      // Roll back optimistic update
      setCompletions(prev => {
        const current = prev[habitId] || []
        const rolledBack = current.includes(date)
          ? current.filter(d => d !== date)
          : [...current, date]
        return { ...prev, [habitId]: rolledBack }
      })
    } finally {
      setToggling(null)
    }
  }, [])

  const today      = dateStr(new Date())
  const doneCount  = habits.filter(h => (completions[h.id] || []).includes(today)).length
  const totalStreak = habits.reduce((sum, h) => sum + calcStreak(completions[h.id] || []), 0)

  return (
    <div className="habit-page">
      <TopNav />

      <div className="habit-hero">
        <div className="habit-hero-inner">
          <div className="habit-hero-text">
            <p className="section-label" style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 'var(--space-2)' }}>Daily Habits</p>
            <h1 className="habit-hero-title">Build Your Practice</h1>
            <p className="habit-hero-sub">Small consistencies compound into lasting change.</p>
          </div>
          <div className="habit-hero-stats">
            <div className="habit-stat">
              <span className="habit-stat-value">{doneCount}</span>
              <span className="habit-stat-label">of {habits.length} today</span>
            </div>
            <div className="habit-stat-divider" aria-hidden="true" />
            <div className="habit-stat">
              <span className="habit-stat-value">{totalStreak}</span>
              <span className="habit-stat-label">total streak days</span>
            </div>
          </div>
        </div>
      </div>

      <main className="habit-main">
        {loading ? (
          <div className="habit-loading" aria-live="polite">Loading habits...</div>
        ) : (
          <div className="habit-cards-grid">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completions={completions[habit.id] || []}
                onToggle={handleToggle}
                toggling={toggling}
              />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

export default HabitTrackerPage
