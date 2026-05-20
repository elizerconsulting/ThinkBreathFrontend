import LoginForm from '../components/LoginForm'
import AuthIllustration from '../components/AuthIllustration'
import './LoginPage.css'

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <LoginForm />
        <AuthIllustration />
      </div>
    </div>
  )
}

export default LoginPage
