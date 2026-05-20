import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../api/auth'
import './LoginPage.css'
import '../components/LoginForm.css'
import './ForgotPasswordPage.css'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    setLoading(true)
    try {
      await forgotPassword({ email })
      setSent(true)
    } catch {
      // Always show the sent state to avoid leaking whether an email is registered
      setSent(true)
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

          {!sent ? (
            <>
              <div className="heading">
                <h1>Forgot<br />Password?</h1>
                <p>Enter your email and we'll send you a reset link</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <input
                  className="form-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  disabled={loading}
                  autoFocus
                />
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Link'}
                </button>
              </form>

              <p className="toggle-text">
                Remember your password?{' '}
                <button className="toggle-btn" type="button" onClick={() => navigate('/')}>
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="heading">
                <h1>Check<br />Your Email</h1>
                <p>
                  We sent a reset link to{' '}
                  <strong style={{ color: '#1a1a2e' }}>{email}</strong>
                </p>
              </div>

              <p className="fp-sent-note">
                Didn't receive it? Check your spam folder, or{' '}
                <button className="toggle-btn" type="button" onClick={() => setSent(false)}>
                  try again
                </button>
                .
              </p>

              <p className="toggle-text">
                <button className="toggle-btn" type="button" onClick={() => navigate('/')}>
                  Back to Sign In
                </button>
              </p>
            </>
          )}
        </div>

        <div className="fp-illustration-panel">
          <svg
            viewBox="0 0 480 540"
            xmlns="http://www.w3.org/2000/svg"
            className="fp-illustration-svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="fpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>

            {/* Background fill */}
            <rect width="480" height="540" fill="url(#fpGrad)" />

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

            {/* Envelope shadow */}
            <ellipse cx="240" cy="374" rx="92" ry="12" fill="rgba(0,0,0,0.14)" />

            {/* Envelope body */}
            <rect x="120" y="192" width="240" height="170" rx="14" fill="white" opacity="0.97" />

            {/* Envelope bottom crease */}
            <path d="M 120 362 L 200 312 L 280 312 L 360 362" fill="#f5f3ff" />

            {/* Envelope side creases */}
            <line x1="120" y1="362" x2="200" y2="312" stroke="rgba(196,181,253,0.5)" strokeWidth="1.5" />
            <line x1="360" y1="362" x2="280" y2="312" stroke="rgba(196,181,253,0.5)" strokeWidth="1.5" />

            {/* Envelope flap outline */}
            <path
              d="M 120 192 L 240 268 L 360 192"
              fill="none"
              stroke="rgba(196,181,253,0.6)"
              strokeWidth="1.5"
            />
            <path d="M 120 192 L 240 268 L 360 192 Z" fill="#f5f3ff" opacity="0.45" />

            {/* @ symbol */}
            <text
              x="240"
              y="328"
              textAnchor="middle"
              fill="#7c3aed"
              fontSize="62"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
              opacity="0.88"
            >@</text>

            {/* Notification badge */}
            <circle cx="356" cy="196" r="18" fill="#f472b6" />
            <text
              x="356"
              y="202"
              textAnchor="middle"
              fill="white"
              fontSize="15"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
            >1</text>

            {/* Paper plane */}
            <g transform="translate(330, 142) rotate(-38)">
              <path d="M 0 0 L 46 -9 L 0 -20 Z" fill="white" opacity="0.96" />
              <path d="M 0 0 L 46 -9 L 22 -1 Z" fill="#c4b5fd" opacity="0.85" />
            </g>

            {/* Paper plane trail dots */}
            <circle cx="304" cy="158" r="3.5" fill="white" opacity="0.7" />
            <circle cx="290" cy="167" r="2.5" fill="white" opacity="0.5" />
            <circle cx="278" cy="177" r="1.8" fill="white" opacity="0.35" />

            {/* Sparkle top-left area */}
            <g transform="translate(148, 172)" fill="white" opacity="0.75">
              <circle cx="0" cy="0" r="2.5" />
              <rect x="-0.8" y="-9" width="1.6" height="18" rx="1" />
              <rect x="-9" y="-0.8" width="18" height="1.6" rx="1" />
            </g>

            {/* Sparkle right area */}
            <g transform="translate(388, 168)" fill="white" opacity="0.6">
              <circle cx="0" cy="0" r="2" />
              <rect x="-0.6" y="-7" width="1.2" height="14" rx="1" />
              <rect x="-7" y="-0.6" width="14" height="1.2" rx="1" />
            </g>

            {/* Floating dots */}
            <circle cx="100" cy="305" r="8" fill="white" opacity="0.28" />
            <circle cx="84" cy="275" r="5" fill="white" opacity="0.2" />
            <circle cx="114" cy="248" r="4" fill="white" opacity="0.22" />
            <circle cx="374" cy="288" r="7" fill="white" opacity="0.25" />
            <circle cx="392" cy="258" r="4.5" fill="white" opacity="0.2" />
            <circle cx="108" cy="400" r="5" fill="white" opacity="0.18" />
            <circle cx="380" cy="420" r="6" fill="white" opacity="0.18" />
          </svg>
        </div>

      </div>
    </div>
  )
}

export default ForgotPasswordPage
