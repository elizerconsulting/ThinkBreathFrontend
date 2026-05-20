import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/auth'
import './LoginPage.css'
import '../components/LoginForm.css'
import './ResetPasswordPage.css'

function ResetPasswordPage() {
  const [fields, setFields] = useState({ password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (!t) setError('This reset link is invalid or has expired.')
    else setToken(t)
  }, [])

  function handleChange(e) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (fields.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (fields.password !== fields.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await resetPassword({ token, new_password: fields.password })
      setDone(true)
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      setError(err.message || 'This reset link is invalid or has expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="form-panel">
          <div className="logo">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="5" fill="#7C3AED" />
              <path d="M11 5C8.24 5 6 7.24 6 10v1.5h1.5V10a3.5 3.5 0 0 1 7 0v1.5H16V10c0-2.76-2.24-5-5-5z" fill="white" />
              <rect x="5" y="11" width="12" height="7" rx="2" fill="white" />
              <circle cx="11" cy="14.5" r="1.5" fill="#7C3AED" />
            </svg>
            <span>ThinkBreath</span>
          </div>

          {done ? (
            <>
              <div className="heading">
                <h1>All<br />Done</h1>
                <p>Your password has been updated. Redirecting you to sign in...</p>
              </div>
              <p className="toggle-text">
                Not redirected?{' '}
                <button className="toggle-btn" type="button" onClick={() => navigate('/')}>
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="heading">
                <h1>New<br />Password</h1>
                <p>Choose something strong that you'll remember</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={fields.password}
                  onChange={handleChange}
                  disabled={loading || !token}
                  autoFocus
                />
                <input
                  className="form-input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={fields.confirmPassword}
                  onChange={handleChange}
                  disabled={loading || !token}
                />
                {error && <p className="form-error">{error}</p>}
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !token}
                >
                  {loading ? 'Saving...' : 'Set Password'}
                </button>
              </form>

              <p className="toggle-text">
                Back to{' '}
                <button className="toggle-btn" type="button" onClick={() => navigate('/')}>
                  Sign In
                </button>
              </p>
            </>
          )}
        </div>

        <div className="rp-illustration-panel">
          <svg
            viewBox="0 0 480 540"
            xmlns="http://www.w3.org/2000/svg"
            className="rp-illustration-svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="rpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <filter id="shieldShadow" x="-15%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="4" dy="8" stdDeviation="8" floodColor="rgba(0,0,0,0.2)" />
              </filter>
            </defs>

            {/* Background fill */}
            <rect width="480" height="540" fill="url(#rpGrad)" />

            {/* Cloud top-left */}
            <g opacity="0.92">
              <ellipse cx="56" cy="72" rx="36" ry="22" fill="white" />
              <ellipse cx="82" cy="59" rx="28" ry="21" fill="white" />
              <ellipse cx="106" cy="70" rx="23" ry="17" fill="white" />
              <rect x="36" y="72" width="92" height="20" rx="4" fill="white" />
            </g>

            {/* Cloud top-right */}
            <g opacity="0.88">
              <ellipse cx="388" cy="54" rx="30" ry="18" fill="white" />
              <ellipse cx="411" cy="43" rx="24" ry="18" fill="white" />
              <ellipse cx="430" cy="52" rx="19" ry="14" fill="white" />
              <rect x="369" y="54" width="79" height="16" rx="4" fill="white" />
            </g>

            {/* Cloud bottom-left */}
            <g opacity="0.85">
              <ellipse cx="42" cy="460" rx="38" ry="24" fill="white" />
              <ellipse cx="70" cy="447" rx="30" ry="22" fill="white" />
              <ellipse cx="97" cy="458" rx="24" ry="17" fill="white" />
              <rect x="22" y="460" width="97" height="22" rx="4" fill="white" />
            </g>

            {/* Cloud bottom-right */}
            <g opacity="0.85">
              <ellipse cx="400" cy="472" rx="36" ry="22" fill="white" />
              <ellipse cx="426" cy="460" rx="28" ry="20" fill="white" />
              <ellipse cx="450" cy="470" rx="22" ry="16" fill="white" />
              <rect x="382" y="472" width="90" height="20" rx="4" fill="white" />
            </g>

            {/* Shield shadow */}
            <ellipse cx="242" cy="392" rx="88" ry="10" fill="rgba(0,0,0,0.15)" />

            {/* Shield body */}
            <path
              d="M 240 148 L 344 186 L 344 296 Q 344 368 240 408 Q 136 368 136 296 L 136 186 Z"
              fill="white"
              opacity="0.97"
              filter="url(#shieldShadow)"
            />

            {/* Shield inner rim */}
            <path
              d="M 240 168 L 324 200 L 324 296 Q 324 354 240 386 Q 156 354 156 296 L 156 200 Z"
              fill="none"
              stroke="rgba(196,181,253,0.5)"
              strokeWidth="2"
            />

            {/* Open lock shackle (rotated open = unlocked) */}
            <path
              d="M 206 246 L 206 220 A 34 34 0 0 1 274 220"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Lock body */}
            <rect x="202" y="246" width="76" height="62" rx="10" fill="#7c3aed" />

            {/* Keyhole */}
            <circle cx="240" cy="268" r="10" fill="white" opacity="0.95" />
            <rect x="236.5" y="268" width="7" height="14" rx="2" fill="white" opacity="0.95" />

            {/* Key floating to the right of shield */}
            <g transform="translate(370, 310) rotate(-42)">
              {/* Key head (ring) */}
              <circle cx="0" cy="0" r="16" fill="none" stroke="white" strokeWidth="7" opacity="0.93" />
              <circle cx="0" cy="0" r="8" fill="none" stroke="white" strokeWidth="4" opacity="0.6" />
              {/* Key shaft */}
              <rect x="-3.5" y="14" width="7" height="40" rx="3" fill="white" opacity="0.93" />
              {/* Key teeth */}
              <rect x="3.5" y="34" width="10" height="6" rx="2" fill="white" opacity="0.93" />
              <rect x="3.5" y="46" width="7" height="5" rx="2" fill="white" opacity="0.93" />
            </g>

            {/* Checkmark badge */}
            <circle cx="336" cy="174" r="22" fill="#10b981" />
            <path
              d="M 324 174 L 333 183 L 348 164"
              fill="none"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Sparkle near shield top */}
            <g transform="translate(150, 165)" fill="white" opacity="0.7">
              <circle cx="0" cy="0" r="2.5" />
              <rect x="-0.8" y="-9" width="1.6" height="18" rx="1" />
              <rect x="-9" y="-0.8" width="18" height="1.6" rx="1" />
            </g>

            {/* Sparkle right */}
            <g transform="translate(108, 310)" fill="white" opacity="0.55">
              <circle cx="0" cy="0" r="2" />
              <rect x="-0.6" y="-7" width="1.2" height="14" rx="1" />
              <rect x="-7" y="-0.6" width="14" height="1.2" rx="1" />
            </g>

            {/* Floating dots */}
            <circle cx="100" cy="230" r="7" fill="white" opacity="0.25" />
            <circle cx="84" cy="265" r="4" fill="white" opacity="0.2" />
            <circle cx="392" cy="230" r="5" fill="white" opacity="0.22" />
            <circle cx="408" cy="260" r="8" fill="white" opacity="0.18" />
            <circle cx="110" cy="390" r="5" fill="white" opacity="0.18" />
            <circle cx="380" cy="400" r="6" fill="white" opacity="0.18" />
          </svg>
        </div>

      </div>
    </div>
  )
}

export default ResetPasswordPage
