import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

function loadFromStorage() {
  try {
    const token = localStorage.getItem('access_token')
    const user  = JSON.parse(localStorage.getItem('user') || 'null')
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const stored = loadFromStorage()
  const [token, setToken] = useState(stored.token)
  const [user,  setUser]  = useState(stored.user)

  const saveSession = useCallback((accessToken, refreshToken, userData) => {
    localStorage.setItem('access_token',  accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user',          JSON.stringify(userData))
    setToken(accessToken)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const isLoggedIn = Boolean(token)

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, saveSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
