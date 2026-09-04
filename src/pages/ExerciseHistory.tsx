import { useMemo, useState } from 'react'
import { TrendingUp, Dumbbell, Calendar, ArrowLeft } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUnits } from '../hooks/useUnits'

interface SetLog {
  weight: number
  reps: number
  completed: boolean
}

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  setLogs: SetLog[]
}

interface WorkoutDay {
  id: string
  name: string
  exercises: Exercise[]
}

interface HistoryEntry {
  date: string
  weight: number
  reps: number
  volume: number
}

export default function ExerciseHistory() {
  const [days] = useLocalStorage<WorkoutDay[]>('fittrack_workout_days_v2', [])
  const [selectedExercise, setSelectedExercise] = useState('')
  const { weight } = useUnits()

  // Build exercise history from all logged sets
  const exerciseHistory = useMemo(() => {
    const history: Record<string, HistoryEntry[]> = {}
    days.forEach(day => {
      day.exercises.forEach(ex => {
        if (!history[ex.name]) history[ex.name] = []
        ex.setLogs.forEach(log => {
          if (log.completed && log.weight > 0 && log.reps > 0) {
            history[ex.name].push({
              date: new Date().toISOString().slice(0, 10), // Use today as fallback; in real app we'd store session dates
              weight: log.weight,
              reps: log.reps,
              volume: log.weight * log.reps,
            })
          }
        })
      })
    })
    // Sort by date (would need actual dates stored; using index as proxy for now)
    Object.keys(history).forEach(name => {
      history[name] = history[name].map((entry, i) => ({
        ...entry,
        date: `Session ${i + 1}`,
      }))
    })
    return history
  }, [days])

  const exerciseNames = useMemo(() => Object.keys(exerciseHistory).sort(), [exerciseHistory])
  const currentData = selectedExercise ? exerciseHistory[selectedExercise] || [] : []

  // Stats
  const maxWeight = currentData.length > 0 ? Math.max(...currentData.map(d => d.weight)) : 0
  const maxReps = currentData.length > 0 ? Math.max(...currentData.map(d => d.reps)) : 0
  const totalVolume = currentData.length > 0 ? currentData.reduce((a, d) => a + d.volume, 0) : 0
  const avgVolume = currentData.length > 0 ? Math.round(totalVolume / currentData.length) : 0

  return (
    <div>
      <div className="page-header">
        <h1><TrendingUp size={28} style={{ display: 'inline', verticalAlign: '-4px', marginRight: 8 }} /> Exercise History</h1>
        <p>Track your progression on every lift over time</p>
      </div>

      {/* Exercise selector */}
      <div className="section" style={{ padding: 20 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select Exercise</label>
          <select
            value={selectedExercise}
            onChange={e => setSelectedExercise(e.target.value)}
            style={{ width: '100%', maxWidth: 400 }}
          >
            <option value="">Choose an exercise...</option>
            {exerciseNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        {exerciseNames.length === 0 && (
          <div style={{ color: '#64748b', marginTop: 12, fontSize: '0.9rem' }}>
            <Dumbbell size={16} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            No completed sets with weight logged yet. Go to Workouts and log some sets with weight and reps.
          </div>
        )}
      </div>

      {selectedExercise && currentData.length > 0 && (
        <>
          {/* Stats cards */}
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Sessions</span><Calendar size={18} color="#3b82f6"/></div>
              <div className="card-value">{currentData.length}</div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Best Weight</span><TrendingUp size={18} color="#10b981"/></div>
              <div className="card-value" style={{ fontSize: '1.4rem' }}>{weight.display(maxWeight)}</div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Best Reps</span><TrendingUp size={18} color="#f59e0b"/></div>
              <div className="card-value">{maxReps}</div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Avg Volume</span><TrendingUp size={18} color="#8b5cf6"/></div>
              <div className="card-value" style={{ fontSize: '1.4rem' }}>{avgVolume}</div>
            </div>
          </div>

          {/* Weight chart */}
          <div className="card" style={{ minHeight: 320 }}>
            <div className="card-header">
              <span className="card-title">Weight Progression — {selectedExercise}</span>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                  formatter={(value: number) => [weight.display(value), 'Weight']}
                />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} name={`Weight (${weight.label})`} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Reps chart */}
          <div className="card" style={{ minHeight: 320 }}>
            <div className="card-header">
              <span className="card-title">Reps Progression — {selectedExercise}</span>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="reps" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} name="Reps" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Volume chart */}
          <div className="card" style={{ minHeight: 320 }}>
            <div className="card-header">
              <span className="card-title">Volume per Session — {selectedExercise}</span>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} name="Volume (weight × reps)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
