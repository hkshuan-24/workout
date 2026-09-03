import { useMemo } from 'react'
import { Activity, Dumbbell, Droplets, Flame, TrendingUp, Scale, Target, Utensils, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface WeightEntry { date: string; weight: number }
interface WorkoutEntry { date: string; sets: number }

export default function Dashboard() {
  const [weightHistory] = useLocalStorage<WeightEntry[]>('fittrack_weights', [])
  const [workoutDays] = useLocalStorage<any[]>('fittrack_workout_days_v2', [])
  const totalWorkouts = workoutDays.reduce((a: number, d: any) => a + d.exercises.reduce((b: number, e: any) => b + (e.setLogs?.filter((s: any) => s.completed).length || 0), 0), 0)
  const totalSets = workoutDays.reduce((a: number, d: any) => a + d.exercises.reduce((b: number, e: any) => b + (e.sets || 0), 0), 0)
  const workoutPct = totalSets > 0 ? Math.round((totalWorkouts / totalSets) * 100) : 0
  const nextWorkout = workoutDays.find((d: any) => d.exercises.some((e: any) => (e.setLogs?.filter((s: any) => s.completed).length || 0) < (e.sets || 0)))
  const nextWorkoutName = nextWorkout ? (nextWorkout.name.split(' — ')[1] || nextWorkout.name) : 'All done!'
  const [water, setWater] = useLocalStorage('fittrack_water', 0)
  const [macros] = useLocalStorage('fittrack_macros', { calories: 0, protein: 0, carbs: 0, fat: 0 })
  const [macroGoals] = useLocalStorage('fittrack_goals', { calories: 2400, protein: 200, carbs: 280, fat: 75, water: 8 })
  const waterGoal = macroGoals.water

  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null
  const weightChange = useMemo(() => {
    if (weightHistory.length < 2) return null
    return +(weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight).toFixed(1)
  }, [weightHistory])

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your fitness at a glance — add your data to see progress</p>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Current Weight</span>
            <div className="card-icon" style={{ background: 'rgba(59,130,246,0.15)' }}><Scale size={20} color="#3b82f6" /></div>
          </div>
          <div className="card-value">{latestWeight !== null ? latestWeight : '--'}<span style={{ fontSize: '1rem', color: '#64748b' }}>{latestWeight !== null ? ' kg' : ''}</span></div>
          <div className="card-change" style={{ color: '#64748b' }}>
            {weightChange !== null ? (
              <span className={weightChange <= 0 ? 'positive' : 'negative'}>
                {weightChange <= 0 ? '' : '+'}{weightChange} kg since first log
              </span>
            ) : (
              'Add a measurement in Body Tracker'
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Workouts</span>
            <div className="card-icon" style={{ background: 'rgba(16,185,129,0.15)' }}><Activity size={20} color="#10b981" /></div>
          </div>
          <div className="card-value">{workoutPct}<span style={{fontSize:'1rem',color:'#64748b'}}>%</span></div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${workoutPct}%`, background: '#10b981' }}></div>
          </div>
          <div className="card-change" style={{ color: '#64748b', marginTop: 4 }}>
            {totalWorkouts}/{totalSets} sets done · Next: {nextWorkoutName}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Calories</span>
            <div className="card-icon" style={{ background: 'rgba(245,158,11,0.15)' }}><Flame size={20} color="#f59e0b" /></div>
          </div>
          <div className="card-value">{macros.calories}<span style={{ fontSize: '1rem', color: '#64748b' }}> / {macroGoals.calories}</span></div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${Math.min((macros.calories / macroGoals.calories) * 100, 100)}%`, background: '#f59e0b' }}></div>
          </div>
          <div className="card-change" style={{ color: '#64748b', marginTop: 4 }}>
            {macros.calories === 0 ? 'Add meals to track calories' : `${Math.round((macros.calories / macroGoals.calories) * 100)}% of daily goal`}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Protein</span>
            <div className="card-icon" style={{ background: 'rgba(139,92,246,0.15)' }}><Target size={20} color="#8b5cf6" /></div>
          </div>
          <div className="card-value">{macros.protein}<span style={{ fontSize: '1rem', color: '#64748b' }}> / {macroGoals.protein}g</span></div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${Math.min((macros.protein / macroGoals.protein) * 100, 100)}%`, background: '#8b5cf6' }}></div>
          </div>
          <div className="card-change" style={{ color: '#64748b', marginTop: 4 }}>
            {macros.protein === 0 ? 'Add meals to track protein' : `${Math.round((macros.protein / macroGoals.protein) * 100)}% of daily goal`}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Next Up</span>
            <div className="card-icon" style={{ background: 'rgba(245,158,11,0.15)' }}><Clock size={20} color="#f59e0b" /></div>
          </div>
          <div className="card-value" style={{ fontSize: '1.2rem', lineHeight: 1.3 }}>{nextWorkoutName}</div>
          <div className="card-change" style={{ color: '#64748b' }}>
            {nextWorkout
              ? `${nextWorkout.exercises.filter((e: any) => (e.setLogs?.filter((s: any) => s.completed).length || 0) < (e.sets || 0)).length} exercises remaining`
              : 'Rest day or all complete'
          </div>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' }}>
        <div className="card" style={{ minHeight: 320 }}>
          <div className="card-header">
            <span className="card-title">Weight Trend</span>
            <TrendingUp size={16} color="#64748b" />
          </div>
          {weightHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weightHistory}>
                <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={d => d.slice(5)} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
                <Area type="monotone" dataKey="weight" stroke="#3b82f6" fill="url(#wg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.9rem', gap: 8 }}>
              <Scale size={32} color="#334155" />
              <span>No weight data yet</span>
              <span style={{ fontSize: '0.8rem' }}>Add your first measurement in Body Tracker</span>
            </div>
          )}
        </div>

        <div className="card" style={{ minHeight: 320 }}>
          <div className="card-header">
            <span className="card-title">Weekly Volume</span>
            <Activity size={16} color="#64748b" />
          </div>
          {workoutHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={workoutHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="sets" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.9rem', gap: 8 }}>
              <Dumbbell size={32} color="#334155" />
              <span>No workout data yet</span>
              <span style={{ fontSize: '0.8rem' }}>Complete sets in Workouts to see volume</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Water Intake</span>
            <div className="card-icon" style={{ background: 'rgba(6,182,212,0.15)' }}><Droplets size={20} color="#06b6d4" /></div>
          </div>
          <div className="card-value">{water}<span style={{ fontSize: '1rem', color: '#64748b' }}> / {waterGoal} glasses</span></div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            {Array.from({ length: waterGoal + 4 }).map((_, i) => (
              <button key={i} onClick={() => setWater(i + 1)} style={{
                width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: i < water ? '#06b6d4' : '#1e293b',
                transition: 'all 0.2s'
              }} />
            ))}
          </div>
          <button onClick={() => setWater(Math.min(water + 1, 12))} className="btn btn-primary" style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
            <Droplets size={16} /> Add Glass
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Today's Macros</span>
            <div className="card-icon" style={{ background: 'rgba(245,158,11,0.15)' }}><Utensils size={20} color="#f59e0b" /></div>
          </div>
          {macros.calories === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b' }}>
              <Utensils size={32} color="#334155" style={{ marginBottom: 8 }} />
              <div>No meals logged yet</div>
              <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Add meals in Meal Planner</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {[
                { label: 'Calories', value: macros.calories, goal: macroGoals.calories, color: '#f59e0b' },
                { label: 'Protein', value: macros.protein, goal: macroGoals.protein, color: '#8b5cf6' },
                { label: 'Carbs', value: macros.carbs, goal: macroGoals.carbs, color: '#3b82f6' },
                { label: 'Fat', value: macros.fat, goal: macroGoals.fat, color: '#ef4444' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 0.85 }}>
                    <span style={{ color: '#94a3b8' }}>{m.label}</span>
                    <span style={{ color: m.color }}>{m.value}/{m.goal}{m.label === 'Calories' ? '' : 'g'}</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: 4 }}>
                    <div className="progress-fill" style={{ width: `${Math.min((m.value / m.goal) * 100, 100)}%`, background: m.color }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
