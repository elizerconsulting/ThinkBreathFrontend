import { useState, useEffect } from 'react'
import TopNav from '../components/TopNav'
import BottomNav from '../components/BottomNav'
import { api } from '../api/client'
import './ProfileStatsPage.css'

const HABIT_IDS = ['morning-breath', 'gratitude', 'evening-reflect', 'focus-session', 'mindful-walk']

function formatJoinDate(isoStr) {
  if (!isoStr) return null
  return new Date(isoStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/* ── Icons ───────────────────────────────────────────────── */
const SvgBase = ({ children, size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" {...props}>
    {children}
  </svg>
)

const IconPractices = () => (
  <SvgBase>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="9.5" />
  </SvgBase>
)
const IconClock = () => (
  <SvgBase>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 15.5" />
  </SvgBase>
)
const IconTrend = () => (
  <SvgBase>
    <polyline points="3 18 8 13 13 16 21 7" />
    <polyline points="17 7 21 7 21 11" />
  </SvgBase>
)
const IconCalendar = () => (
  <SvgBase>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="15.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
  </SvgBase>
)

const IconFirstBreath = () => (
  <SvgBase size={22}>
    <circle cx="10" cy="12" r="2" fill="currentColor" stroke="none" />
    <path d="M14 8.5 a5 5 0 0 1 0 7" />
    <path d="M17 5.5 a9 9 0 0 1 0 13" />
  </SvgBase>
)
const IconMomentum = () => (
  <SvgBase size={22}>
    <rect x="3" y="15" width="4" height="5" rx="1" />
    <rect x="10" y="10" width="4" height="10" rx="1" />
    <rect x="17" y="4" width="4" height="16" rx="1" />
  </SvgBase>
)
const IconDedicated = () => (
  <SvgBase size={22}>
    <polygon points="12 2 20 9 12 22 4 9" />
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="8.5" y1="9" x2="12" y2="2" />
    <line x1="15.5" y1="9" x2="12" y2="2" />
  </SvgBase>
)
const IconMorning = () => (
  <SvgBase size={22}>
    <line x1="2" y1="17" x2="22" y2="17" />
    <path d="M6 17 A6 6 0 0 1 18 17" />
    <line x1="12" y1="4" x2="12" y2="2" />
    <line x1="5.5" y1="7.5" x2="4" y2="6" />
    <line x1="18.5" y1="7.5" x2="20" y2="6" />
  </SvgBase>
)
const IconShield = () => (
  <SvgBase size={22}>
    <path d="M12 3 L20 6.5 L20 12 C20 16.5 16.5 20 12 21 C7.5 20 4 16.5 4 12 L4 6.5 Z" />
    <polyline points="9 12 11 14 15 10" />
  </SvgBase>
)
const IconFullCircle = () => (
  <SvgBase size={22}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8 12 11 15 16 9" />
  </SvgBase>
)
const IconFocus = () => (
  <SvgBase size={22}>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="9.5" />
    <line x1="12" y1="2.5" x2="12" y2="4" strokeWidth="1" />
    <line x1="12" y1="20" x2="12" y2="21.5" strokeWidth="1" />
  </SvgBase>
)
const IconSummit = () => (
  <SvgBase size={22}>
    <line x1="2" y1="20" x2="22" y2="20" />
    <polyline points="4 20 12 5 20 20" />
    <polyline points="8.5 14 12 8 15.5 14" />
  </SvgBase>
)
const IconLock = () => (
  <SvgBase size={18}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
  </SvgBase>
)

const ACHIEVEMENT_ICONS = {
  'first-breath': IconFirstBreath,
  'momentum':     IconMomentum,
  'dedicated':    IconDedicated,
  'morning':      IconMorning,
  'week-warrior': IconShield,
  'full-circle':  IconFullCircle,
  'focus-master': IconFocus,
  'unstoppable':  IconSummit,
}

/* ── Achievement definitions ─────────────────────────────── */
const ACHIEVEMENTS = [
  { id: 'first-breath', name: 'First Breath',  desc: 'Complete your first mindfulness practice', tier: 'bronze', check: s => s.totalPractices >= 1 },
  { id: 'momentum',     name: 'Momentum',       desc: 'Reach a 3-day streak on any habit',        tier: 'bronze', check: s => s.bestStreak >= 3 },
  { id: 'dedicated',    name: 'Dedicated',       desc: 'Complete 10 practices in total',           tier: 'bronze', check: s => s.totalPractices >= 10 },
  { id: 'morning',      name: 'Morning Person',  desc: 'Complete morning breathing 5 times',       tier: 'bronze', check: s => (s.habitCounts['morning-breath'] || 0) >= 5 },
  { id: 'week-warrior', name: 'Week Warrior',    desc: 'Sustain a 7-day streak on any habit',      tier: 'silver', check: s => s.bestStreak >= 7 },
  { id: 'full-circle',  name: 'Full Circle',     desc: 'Complete all 5 habits in a single day',    tier: 'silver', check: s => s.hadFullDay },
  { id: 'focus-master', name: 'Focus Master',    desc: 'Complete 10 deep focus sessions',          tier: 'gold',   check: s => (s.habitCounts['focus-session'] || 0) >= 10 },
  { id: 'unstoppable',  name: 'Unstoppable',     desc: 'Reach a 30-day streak',                    tier: 'gold',   check: s => s.bestStreak >= 30 },
]

const TIER_COLOR = { bronze: '#C47A2B', silver: '#7E97AB', gold: '#D97706' }

const EMPTY_STATS = {
  totalPractices: 0, totalMinutes: 0, currentStreak: 0,
  bestStreak: 0, uniqueDays: 0, habitCounts: {}, hadFullDay: false,
  weeklyActivity: [], maxDayCount: 1,
}

/* ── Sub-components ──────────────────────────────────────── */
function StatTile({ value, label, icon, sub }) {
  return (
    <div className="ps-stat-tile">
      <span className="ps-stat-icon">{icon}</span>
      <span className="ps-stat-value">{value.toLocaleString()}</span>
      <span className="ps-stat-label">{label}</span>
      {sub && <span className="ps-stat-sub">{sub}</span>}
    </div>
  )
}

function BarChart({ weeklyActivity, maxDayCount }) {
  return (
    <div className="ps-bar-chart" role="img" aria-label="Weekly habit completion bar chart">
      {weeklyActivity.map(({ date, label, count, isToday }) => {
        const pct = count > 0 ? Math.max(10, Math.round((count / maxDayCount) * 100)) : 0
        return (
          <div key={date} className={`ps-bar-col${isToday ? ' ps-bar-col--today' : ''}`}>
            <div className="ps-bar-track" title={`${count} completion${count !== 1 ? 's' : ''}`}>
              <div className="ps-bar-fill" style={{ height: `${pct}%` }} />
            </div>
            <span className="ps-bar-label">{label}</span>
            {isToday && <span className="ps-bar-today-dot" aria-hidden="true" />}
          </div>
        )
      })}
    </div>
  )
}

function AchievementBadge({ a, unlocked }) {
  const color = TIER_COLOR[a.tier]
  const Icon  = ACHIEVEMENT_ICONS[a.id]
  return (
    <div
      className={`ps-badge${unlocked ? ' ps-badge--unlocked' : ' ps-badge--locked'}`}
      style={unlocked ? { '--badge-accent': color } : {}}
    >
      <div
        className="ps-badge-icon"
        style={unlocked ? { borderColor: color, background: `${color}18`, color } : {}}
      >
        {unlocked ? <Icon /> : <IconLock />}
      </div>
      <div className="ps-badge-body">
        <p className="ps-badge-name">{a.name}</p>
        <p className="ps-badge-desc">{a.desc}</p>
      </div>
      {unlocked && (
        <span
          className="ps-badge-tier"
          style={{ color, borderColor: `${color}50`, background: `${color}14` }}
        >
          {a.tier}
        </span>
      )}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────── */
function ProfileStatsPage() {
  const [user,    setUser]    = useState(null)
  const [stats,   setStats]   = useState(EMPTY_STATS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [userRes, summaryRes, weeklyRes, completionsRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/stats/summary'),
          api.get('/stats/weekly'),
          api.get('/habits/completions'),
        ])

        const completions = completionsRes.completions || {}

        const habitCounts = {}
        for (const slug of HABIT_IDS) {
          habitCounts[slug] = (completions[slug] || []).length
        }

        const dayHabitSets = {}
        for (const [slug, dates] of Object.entries(completions)) {
          for (const date of dates) {
            if (!dayHabitSets[date]) dayHabitSets[date] = new Set()
            dayHabitSets[date].add(slug)
          }
        }
        const hadFullDay = Object.values(dayHabitSets).some(s => s.size >= HABIT_IDS.length)
        const uniqueDays = new Set(Object.values(completions).flat()).size

        const weeklyActivity = weeklyRes.days.map(d => ({
          date:    d.date,
          label:   d.label,
          count:   d.count,
          isToday: d.is_today,
        }))
        const maxDayCount = Math.max(...weeklyActivity.map(d => d.count), 1)

        setUser(userRes)
        setStats({
          totalPractices: summaryRes.total_practices,
          totalMinutes:   summaryRes.total_minutes,
          currentStreak:  summaryRes.current_streak,
          bestStreak:     summaryRes.best_streak,
          uniqueDays,
          habitCounts,
          hadFullDay,
          weeklyActivity,
          maxDayCount,
        })
      } catch {
        setStats(EMPTY_STATS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const unlockedCount = ACHIEVEMENTS.filter(a => a.check(stats)).length
  const avatarLetter  = user?.name?.[0]?.toUpperCase() ?? 'U'
  const joinDate      = formatJoinDate(user?.joined_at)

  return (
    <div className="profile-page">
      <TopNav />

      {/* ── Hero ── */}
      <div className="ps-hero">
        <div className="ps-hero-inner">
          <div className="ps-identity">
            <div className="ps-avatar" aria-label="User avatar">{avatarLetter}</div>
            <div className="ps-info">
              <h1 className="ps-name">{loading ? '' : (user?.name ?? '')}</h1>
              <p className="ps-tagline">{user?.tagline ?? ''}</p>
              {joinDate && <p className="ps-joined">Member since {joinDate}</p>}
            </div>
          </div>

          <div className="ps-hero-pills">
            <div className="ps-pill">
              <span className="ps-pill-value">{stats.currentStreak}</span>
              <span className="ps-pill-label">day streak</span>
            </div>
            <div className="ps-pill-sep" aria-hidden="true" />
            <div className="ps-pill">
              <span className="ps-pill-value">{unlockedCount}</span>
              <span className="ps-pill-label">badges earned</span>
            </div>
            <div className="ps-pill-sep" aria-hidden="true" />
            <div className="ps-pill">
              <span className="ps-pill-value">{stats.totalPractices}</span>
              <span className="ps-pill-label">total practices</span>
            </div>
          </div>
        </div>
      </div>

      <main className="ps-main">

        {/* ── Stats strip ── */}
        <div className="ps-stats-strip">
          <StatTile value={stats.totalPractices} label="Total Practices" icon={<IconPractices />} />
          <StatTile value={stats.totalMinutes}   label="Minutes Mindful"  icon={<IconClock />} />
          <StatTile value={stats.bestStreak}     label="Best Streak"      icon={<IconTrend />} sub="days" />
          <StatTile value={stats.uniqueDays}     label="Active Days"      icon={<IconCalendar />} />
        </div>

        {/* ── Weekly activity ── */}
        <section className="ps-section">
          <div className="ps-section-head">
            <p className="section-label">Weekly Activity</p>
            <span className="ps-section-sub">habit completions · last 7 days</span>
          </div>
          <div className="ps-chart-card">
            {stats.weeklyActivity.length > 0 && (
              <BarChart weeklyActivity={stats.weeklyActivity} maxDayCount={stats.maxDayCount} />
            )}
            <div className="ps-chart-legend">
              <span className="ps-legend-dot ps-legend-dot--muted" />
              <span className="ps-legend-text">past days</span>
              <span className="ps-legend-dot ps-legend-dot--today" />
              <span className="ps-legend-text">today</span>
            </div>
          </div>
        </section>

        {/* ── Achievements ── */}
        <section className="ps-section">
          <div className="ps-section-head">
            <p className="section-label">Achievements</p>
            <span className="ps-section-sub">{unlockedCount} of {ACHIEVEMENTS.length} earned</span>
          </div>
          <div className="ps-achievements-grid">
            {ACHIEVEMENTS.map(a => (
              <AchievementBadge key={a.id} a={a} unlocked={a.check(stats)} />
            ))}
          </div>
        </section>

      </main>
      <BottomNav />
    </div>
  )
}

export default ProfileStatsPage
