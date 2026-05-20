import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser, loginUser } from '../api/auth'
import './LoginForm.css'

function LoginForm() {
  const [isLogin, setIsLogin]   = useState(true)
  const [rememberMe, setRememberMe] = useState(true)
  const navigate = useNavigate()
  const { saveSession } = useAuth()

  const [fields, setFields] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error,  setError]  = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function validate() {
    if (!isLogin && !fields.name.trim())
      return 'Full name is required'
    if (!fields.email.includes('@'))
      return 'Enter a valid email address'
    if (!fields.password)
      return 'Password is required'
    if (!isLogin && fields.password.length < 8)
      return 'Password must be at least 8 characters'
    if (!isLogin && fields.password !== fields.confirmPassword)
      return 'Passwords do not match'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    try {
      if (!isLogin) {
        const data = await registerUser({
          name:     fields.name,
          email:    fields.email,
          password: fields.password,
        })
        saveSession(data.access_token, data.refresh_token, data.user)
        navigate('/home')
      } else {
        const data = await loginUser({ email: fields.email, password: fields.password })
        saveSession(data.access_token, data.refresh_token, data.user)
        navigate('/home')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setIsLogin(prev => !prev)
    setFields({ name: '', email: '', password: '', confirmPassword: '' })
    setError('')
  }

  return (
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

      <div className="heading">
        <h1>{isLogin ? <>Holla,<br />Welcome Back</> : <>Create<br />Account</>}</h1>
        <p>{isLogin ? 'Hey, welcome back to your special place' : 'Join us and get started today'}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            className="form-input"
            type="text"
            name="name"
            placeholder="Full Name"
            value={fields.name}
            onChange={handleChange}
            disabled={loading}
          />
        )}
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={fields.email}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={fields.password}
          onChange={handleChange}
          disabled={loading}
        />
        {!isLogin && (
          <input
            className="form-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={fields.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
        )}

        {isLogin && (
          <div className="form-options">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="remember-checkbox"
              />
              Remember me
            </label>
            <button
                type="button"
                className="forgot-link"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button className="toggle-btn" onClick={switchMode} type="button">
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  )
}

export default LoginForm
