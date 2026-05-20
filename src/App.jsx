import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage          from './pages/LoginPage'
import HomePage           from './pages/HomePage'
import SessionPlayer      from './pages/SessionPlayer'
import HabitTrackerPage   from './pages/HabitTrackerPage'
import ProfileStatsPage   from './pages/ProfileStatsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage  from './pages/ResetPasswordPage'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                  element={<LoginPage />} />
      <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
      <Route path="/reset-password"   element={<ResetPasswordPage />} />
      <Route path="/home"    element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/sessions" element={<ProtectedRoute><SessionPlayer /></ProtectedRoute>} />
      <Route path="/habits"   element={<ProtectedRoute><HabitTrackerPage /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProfileStatsPage /></ProtectedRoute>} />
      <Route path="/profile"  element={<ProtectedRoute><ProfileStatsPage /></ProtectedRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
