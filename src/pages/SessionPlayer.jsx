import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api/client'
import './SessionPlayer.css'

// ── Breathing phases ───────────────────────────────────────────
const PHASES = [
  { id: 'inhale',   name: 'Inhale', instruction: 'Breathe in slowly through your nose',    duration: 4 },
  { id: 'hold-in',  name: 'Hold',   instruction: 'Hold gently — feel the fullness',          duration: 4 },
  { id: 'exhale',   name: 'Exhale', instruction: 'Release slowly through your mouth',        duration: 4 },
  { id: 'hold-out', name: 'Rest',   instruction: 'Pause — let stillness settle',             duration: 4 },
]
const CYCLE_DURATION   = PHASES.reduce((s, p) => s + p.duration, 0) // 16 s
const SESSION_DURATION = 600  // 10 minutes
const MIN_SCALE        = 0.26
const MAX_SCALE        = 1.0
const TICK_MS          = 50   // 20 fps

// ── Easing ─────────────────────────────────────────────────────
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function computeScale(phaseId, elapsed, duration) {
  const t = Math.min(elapsed / duration, 1)
  if (phaseId === 'inhale')   return MIN_SCALE + (MAX_SCALE - MIN_SCALE) * easeInOut(t)
  if (phaseId === 'exhale')   return MAX_SCALE - (MAX_SCALE - MIN_SCALE) * easeInOut(t)
  if (phaseId === 'hold-in')  return MAX_SCALE
  return MIN_SCALE
}

// ── Icons ───────────────────────────────────────────────────────
const BackIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
const PlayIcon    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const PauseIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
const RestartIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
const EndIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
const CheckIcon   = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>

// ── Helpers ─────────────────────────────────────────────────────
function formatTime(secs) {
  const s = Math.max(0, Math.floor(secs))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// ── Component ───────────────────────────────────────────────────
export default function SessionPlayer() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const autoStart  = location.state?.autoStart ?? false

  const [isPlaying,     setIsPlaying]     = useState(autoStart)
  const [isComplete,    setIsComplete]    = useState(false)
  const [phaseIndex,    setPhaseIndex]    = useState(0)
  const [phaseElapsed,  setPhaseElapsed]  = useState(0)
  const [sessionElapsed,setSessionElapsed]= useState(0)
  const [scale,         setScale]         = useState(MIN_SCALE)

  // Refs mirror mutable state for the interval closure
  const isPlayingRef     = useRef(autoStart)
  const phaseIndexRef    = useRef(0)
  const phaseElapsedRef  = useRef(0)
  const sessionElapsedRef= useRef(0)

  // Backend session tracking
  const sessionIdRef      = useRef(null)
  const sessionStartedRef = useRef(false)

  const startBackendSession = useCallback(async () => {
    if (sessionStartedRef.current) return
    sessionStartedRef.current = true
    try {
      const data = await api.postAuth('/sessions/start', {
        session_type:     'box-breathing',
        session_name:     'Focus Breathing',
        planned_duration: SESSION_DURATION,
      })
      sessionIdRef.current = data.session_id
    } catch {
      // best-effort — UI continues regardless
    }
  }, [])

  const endBackendSession = useCallback(async (actualDuration, cyclesCompleted, isCompleted) => {
    if (!sessionIdRef.current) return
    const id = sessionIdRef.current
    sessionIdRef.current      = null
    sessionStartedRef.current = false
    try {
      await api.patch(`/sessions/${id}/end`, {
        actual_duration:  Math.round(actualDuration),
        cycles_completed: cyclesCompleted,
        is_completed:     isCompleted,
      })
    } catch {
      // best-effort
    }
  }, [])

  // Keep ref in sync
  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])

  // Start session immediately when autoStart is true
  useEffect(() => {
    if (autoStart) startBackendSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Tick ──────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlayingRef.current) return

      const dt = TICK_MS / 1000

      phaseElapsedRef.current  += dt
      sessionElapsedRef.current += dt

      // Phase rollover
      const phase = PHASES[phaseIndexRef.current]
      if (phaseElapsedRef.current >= phase.duration) {
        phaseElapsedRef.current = 0
        phaseIndexRef.current   = (phaseIndexRef.current + 1) % PHASES.length
      }

      // Session complete
      if (sessionElapsedRef.current >= SESSION_DURATION) {
        isPlayingRef.current      = false
        sessionElapsedRef.current = SESSION_DURATION
        setIsPlaying(false)
        setIsComplete(true)
        endBackendSession(SESSION_DURATION, Math.floor(SESSION_DURATION / CYCLE_DURATION), true)
      }

      const p = PHASES[phaseIndexRef.current]
      setScale(computeScale(p.id, phaseElapsedRef.current, p.duration))
      setPhaseIndex(phaseIndexRef.current)
      setPhaseElapsed(phaseElapsedRef.current)
      setSessionElapsed(Math.min(sessionElapsedRef.current, SESSION_DURATION))
    }, TICK_MS)

    return () => clearInterval(interval)
  }, []) // mount-only — the interval reads from refs

  // ── Controls ──────────────────────────────────────────────────
  const togglePlay = () => {
    if (isComplete) return
    if (!sessionStartedRef.current) startBackendSession()
    setIsPlaying(p => !p)
  }

  const restart = useCallback(async () => {
    await endBackendSession(
      Math.round(sessionElapsedRef.current),
      Math.floor(sessionElapsedRef.current / CYCLE_DURATION),
      false,
    )
    phaseIndexRef.current     = 0
    phaseElapsedRef.current   = 0
    sessionElapsedRef.current = 0
    isPlayingRef.current      = true
    setPhaseIndex(0)
    setPhaseElapsed(0)
    setSessionElapsed(0)
    setScale(MIN_SCALE)
    setIsComplete(false)
    setIsPlaying(true)
    startBackendSession()
  }, [endBackendSession, startBackendSession])

  const handleEndSession = useCallback(async () => {
    await endBackendSession(
      Math.round(sessionElapsedRef.current),
      Math.floor(sessionElapsedRef.current / CYCLE_DURATION),
      false,
    )
    navigate('/home')
  }, [endBackendSession, navigate])

  // ── Derived display values ────────────────────────────────────
  const phase          = PHASES[phaseIndex]
  const phaseCountdown = Math.max(1, Math.ceil(phase.duration - phaseElapsed))
  const progressPct    = (sessionElapsed / SESSION_DURATION) * 100
  const cyclesDone     = Math.floor(sessionElapsed / CYCLE_DURATION)
  const hasStarted     = sessionElapsed > 0 || isPlaying

  const guidanceText = isComplete
    ? 'Well done.'
    : isPlaying
    ? phase.instruction
    : hasStarted
    ? 'Paused — take your time.'
    : 'Press play to begin your session.'

  return (
    <div className="player-page">
      {/* Ambient background glow */}
      <div className="player-bg-glow" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="player-header">
        <button className="player-back" onClick={handleEndSession}>
          <BackIcon />
          <span>Dashboard</span>
        </button>
        <p className="player-session-name">Focus Breathing</p>
        <p className="player-time-remaining">
          {formatTime(SESSION_DURATION - sessionElapsed)} remaining
        </p>
      </header>

      {/* ── Stage ── */}
      <div className="player-stage">

        {/* Phase label */}
        <p className="phase-name-label" aria-live="polite">
          {hasStarted ? phase.name.toUpperCase() : ''}
        </p>

        {/* Breathing scene */}
        <div className="breath-scene" aria-label="Breathing animation">
          {/* Ambient rings — CSS only */}
          <div className="ambient-ring ar-3" />
          <div className="ambient-ring ar-2" />
          <div className="ambient-ring ar-1" />

          {/* Main orb — JS-driven scale */}
          <div
            className="breath-orb"
            style={{ transform: `scale(${scale})` }}
            aria-hidden="true"
          >
            <div className="orb-sheen" />
          </div>

          {/* Countdown — fixed center, does NOT scale */}
          {hasStarted ? (
            <span className="phase-countdown" aria-live="polite" aria-atomic="true">
              {phaseCountdown}
            </span>
          ) : (
            <button className="orb-cta" onClick={togglePlay} aria-label="Start session">
              <PlayIcon />
            </button>
          )}
        </div>

        {/* Guidance text */}
        <p key={phase.id + String(isPlaying)} className="phase-guidance">
          {guidanceText}
        </p>

      </div>

      {/* ── Footer ── */}
      <footer className="player-footer">
        {/* Progress bar */}
        <div className="progress-row" aria-label={`Session progress: ${Math.round(progressPct)}%`}>
          <span className="progress-time">{formatTime(sessionElapsed)}</span>
          <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="progress-time">{formatTime(SESSION_DURATION)}</span>
        </div>

        {/* Controls */}
        <div className="player-controls">
          <button className="ctrl-btn" onClick={restart} aria-label="Restart session" title="Restart">
            <RestartIcon />
          </button>
          <button className="ctrl-btn primary" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="ctrl-btn" onClick={handleEndSession} aria-label="End session" title="End session">
            <EndIcon />
          </button>
        </div>
      </footer>

      {/* ── Completion overlay ── */}
      {isComplete && (
        <div className="completion-overlay" role="dialog" aria-modal="true" aria-label="Session complete">
          <div className="completion-card">
            <div className="completion-icon">
              <CheckIcon />
            </div>
            <h2 className="completion-title">Session Complete</h2>
            <p className="completion-subtitle">10 minutes of focused breathing</p>

            <div className="completion-stats">
              <div className="stat-block">
                <strong>{cyclesDone}</strong>
                <span>Cycles</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <strong>10:00</strong>
                <span>Duration</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <strong>Box</strong>
                <span>Technique</span>
              </div>
            </div>

            <div className="completion-actions">
              <button className="btn-primary" onClick={() => navigate('/home')}>
                Return to Dashboard
              </button>
              <button className="btn-ghost" onClick={restart}>
                Begin Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
