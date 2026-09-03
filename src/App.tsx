import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Dumbbell, Scale, Utensils, Activity } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import WorkoutPlanner from './pages/WorkoutPlanner'
import BodyTracker from './pages/BodyTracker'
import MealPlanner from './pages/MealPlanner'
import './index.css'

function App() {
  return (
    <HashRouter>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">
            <Activity size={28} />
            <span>FitTrack</span>
          </div>
          <div className="nav-links">
            <NavLink to="/" end>
              <Activity size={18} /> Dashboard
            </NavLink>
            <NavLink to="/workouts">
              <Dumbbell size={18} /> Workouts
            </NavLink>
            <NavLink to="/body">
              <Scale size={18} /> Body
            </NavLink>
            <NavLink to="/meals">
              <Utensils size={18} /> Meals
            </NavLink>
          </div>
          <div className="nav-footer">
            <small>Your Personal Fitness Hub</small>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<WorkoutPlanner />} />
            <Route path="/body" element={<BodyTracker />} />
            <Route path="/meals" element={<MealPlanner />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
