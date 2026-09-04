import { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Dumbbell, Scale, Utensils, Activity, Menu, X, Settings, Sparkles, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Welcome from './pages/Welcome'
import './index.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const WorkoutPlanner = lazy(() => import('./pages/WorkoutPlanner'))
const BodyTracker = lazy(() => import('./pages/BodyTracker'))
const MealPlanner = lazy(() => import('./pages/MealPlanner'))
const WorkoutGenerator = lazy(() => import('./pages/WorkoutGenerator'))
const ExerciseHistory = lazy(() => import('./pages/ExerciseHistory'))
const SettingsPage = lazy(() => import('./pages/Settings'))

function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="app">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <Activity size={28} />
          <span>FitTrack</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" end onClick={() => setSidebarOpen(false)}>
            <Activity size={18} /> Dashboard
          </NavLink>
          <NavLink to="/workouts" onClick={() => setSidebarOpen(false)}>
            <Dumbbell size={18} /> Workouts
          </NavLink>
          <NavLink to="/generate" onClick={() => setSidebarOpen(false)}>
            <Sparkles size={18} /> Generator
          </NavLink>
          <NavLink to="/history" onClick={() => setSidebarOpen(false)}>
            <TrendingUp size={18} /> History
          </NavLink>
          <NavLink to="/body" onClick={() => setSidebarOpen(false)}>
            <Scale size={18} /> Body
          </NavLink>
          <NavLink to="/meals" onClick={() => setSidebarOpen(false)}>
            <Utensils size={18} /> Meals
          </NavLink>
          <NavLink to="/settings" onClick={() => setSidebarOpen(false)}>
            <Settings size={18} /> Settings
          </NavLink>
        </div>
        <div className="nav-footer">
          <small>Your Personal Fitness Hub</small>
        </div>
      </nav>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

function App() {
  const [onboarded, setOnboarded] = useLocalStorage('fittrack_onboarded', false)

  if (!onboarded) {
    return <Welcome onComplete={() => setOnboarded(true)} />
  }

  return (
    <HashRouter>
      <AppLayout>
        <Suspense fallback={<div className="loading-screen"><div className="spinner" /></div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<WorkoutPlanner />} />
            <Route path="/generate" element={<WorkoutGenerator />} />
            <Route path="/history" element={<ExerciseHistory />} />
            <Route path="/body" element={<BodyTracker />} />
            <Route path="/meals" element={<MealPlanner />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </HashRouter>
  )
}

export default App
