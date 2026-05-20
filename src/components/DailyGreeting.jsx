import { useAuth } from '../context/AuthContext'
import './DailyGreeting.css'

function DailyGreeting() {
  const { user } = useAuth()

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good Morning' :
    hour < 17 ? 'Good Afternoon' :
                'Good Evening'

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const firstName = user?.name?.split(' ')[0] ?? ''

  return (
    <div className="daily-greeting">
      <p className="greeting-date">{date}</p>
      <h1 className="greeting-headline">
        {greeting}{firstName ? ', ' : ''}<span className="greeting-name">{firstName}</span>
      </h1>
      <p className="greeting-tagline">Let&apos;s build your focus today.</p>
    </div>
  )
}

export default DailyGreeting
