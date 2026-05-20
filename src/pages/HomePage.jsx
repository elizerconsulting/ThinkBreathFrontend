import TopNav from '../components/TopNav'
import BottomNav from '../components/BottomNav'
import DailyGreeting from '../components/DailyGreeting'
import StreakCounter from '../components/StreakCounter'
import SessionCard from '../components/SessionCard'
import WeeklyProgress from '../components/WeeklyProgress'
import HabitsCard from '../components/HabitsCard'
import StatsPreviewCard from '../components/StatsPreviewCard'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <TopNav />

      <div className="hero-section">
        <div className="hero-inner">
          <DailyGreeting />
          <StreakCounter />
        </div>
      </div>

      <main className="home-main">
        <SessionCard />
        <HabitsCard />
        <StatsPreviewCard />
        <WeeklyProgress />
      </main>
      <BottomNav />
    </div>
  )
}

export default HomePage
