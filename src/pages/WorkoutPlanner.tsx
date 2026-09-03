import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Dumbbell, ChevronDown, ChevronUp, Save, Check, Play, Pause, RotateCcw, Timer } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  completedSets: number[]
}

interface WorkoutDay {
  id: string
  name: string
  exercises: Exercise[]
}

const EXERCISE_LIBRARY = [
  'Barbell Squat', 'Romanian Deadlift', 'Bulgarian Split Squat', 'Leg Press',
  'Bench Press', 'Incline Barbell Press', 'Flat Dumbbell Press', 'Cable Fly',
  'Overhead Press', 'Lateral Raise', 'Rear Delt Fly', 'Face Pull',
  'Weighted Pull-up', 'Lat Pulldown', 'Barbell Row', 'Single-Arm DB Row',
  'Barbell Curl', 'Incline Dumbbell Curl', 'Hammer Curl', 'Preacher Curl',
  'Tricep Pushdown', 'Overhead Tricep Extension', 'Close-Grip Bench', 'Tricep Kickback',
  'Stomach Vacuum', 'Plank', 'Hanging Leg Raise', 'Cable Crunch',
  'Barbell Shrug', 'Standing Calf Raise', 'Leg Curl', 'Leg Extension'
]

const DEFAULT_DAYS: WorkoutDay[] = [
  {
    id: '1',
    name: 'Day 1 — Back & Biceps',
    exercises: [
      { id: 'e1', name: 'Weighted Pull-up', sets: 5, reps: '8-12', rest: '2-3 min', completedSets: [] },
      { id: 'e2', name: 'Lat Pulldown', sets: 4, reps: '10-12', rest: '90s', completedSets: [] },
      { id: 'e3', name: 'Barbell Row', sets: 4, reps: '8-10', rest: '2 min', completedSets: [] },
      { id: 'e4', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '60s', completedSets: [] },
    ]
  },
  {
    id: '2',
    name: 'Day 2 — Chest & Delts',
    exercises: [
      { id: 'e5', name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '2-3 min', completedSets: [] },
      { id: 'e6', name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2 min', completedSets: [] },
      { id: 'e7', name: 'Lateral Raise', sets: 4, reps: '15-20', rest: '60s', completedSets: [] },
      { id: 'e8', name: 'Tricep Pushdown', sets: 4, reps: '10-12', rest: '60s', completedSets: [] },
    ]
  },
  {
    id: '3',
    name: 'Day 3 — Legs & Core',
    exercises: [
      { id: 'e9', name: 'Barbell Squat', sets: 4, reps: '8-10', rest: '3 min', completedSets: [] },
      { id: 'e10', name: 'Romanian Deadlift', sets: 4, reps: '10-12', rest: '2 min', completedSets: [] },
      { id: 'e11', name: 'Stomach Vacuum', sets: 4, reps: '45-60s', rest: '45s', completedSets: [] },
      { id: 'e12', name: 'Plank', sets: 3, reps: '60s', rest: '45s', completedSets: [] },
    ]
  },
  {
    id: '4',
    name: 'Day 4 — Arms & Delts',
    exercises: [
      { id: 'e13', name: 'Lateral Raise (Drop)', sets: 4, reps: '15-20', rest: '60s', completedSets: [] },
      { id: 'e14', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '75s', completedSets: [] },
      { id: 'e15', name: 'Close-Grip Bench', sets: 4, reps: '10-12', rest: '90s', completedSets: [] },
      { id: 'e16', name: 'Tricep Kickback', sets: 3, reps: '15-20', rest: '45s', completedSets: [] },
    ]
  },
]

function parseRestToSeconds(rest: string): number {
  const match = rest.match(/(\d+)/)
  return match ? parseInt(match[1]) * (rest.includes('min') ? 60 : 1) : 90
}

export default function WorkoutPlanner() {
  const [days, setDays] = useLocalStorage<WorkoutDay[]>('fittrack_workout_days', DEFAULT_DAYS)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState('10-12')
  const [rest, setRest] = useState('90s')

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000)
    } else if (timerSeconds === 0) {
      setTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [timerRunning, timerSeconds])

  const startTimer = useCallback((seconds: number) => {
    setTimerSeconds(seconds)
    setTimerRunning(true)
  }, [])

  const toggleSet = useCallback((dayId: string, exId: string, setIndex: number) => {
    setDays(prev => prev.map(d => {
      if (d.id !== dayId) return d
      return {
        ...d,
        exercises: d.exercises.map(e => {
          if (e.id !== exId) return e
          const completed = e.completedSets.includes(setIndex)
            ? e.completedSets.filter(s => s !== setIndex)
            : [...e.completedSets, setIndex]
          return { ...e, completedSets: completed }
        })
      }
    }))
  }, [setDays])

  const completionRate = useCallback(() => {
    let total = 0, done = 0
    days.forEach(d => d.exercises.forEach(e => {
      total += e.sets
      done += e.completedSets.length
    }))
    return total > 0 ? Math.round((done / total) * 100) : 0
  }, [days])

  const addExercise = () => {
    if (!selectedDay || !selectedExercise) return
    setDays(prev => prev.map(d => d.id === selectedDay ? {
      ...d,
      exercises: [...d.exercises, {
        id: Date.now().toString(),
        name: selectedExercise,
        sets,
        reps,
        rest,
        completedSets: []
      }]
    } : d))
    setShowAddModal(false)
    setSelectedExercise('')
  }

  const removeExercise = (dayId: string, exId: string) => {
    setDays(prev => prev.map(d => d.id === dayId ? {
      ...d,
      exercises: d.exercises.filter(e => e.id !== exId)
    } : d))
  }

  const totalExercises = days.reduce((a, d) => a + d.exercises.length, 0)
  const totalSets = days.reduce((a, d) => a + d.exercises.reduce((b, e) => b + e.sets, 0), 0)

  return (
    <div>
      <div className="page-header">
        <h1>Workout Planner</h1>
        <p>Build, track, and complete your training split</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Training Days</span><Dumbbell size={18} color="#3b82f6"/></div>
          <div className="card-value">{days.length}</div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Total Exercises</span><Dumbbell size={18} color="#10b981"/></div>
          <div className="card-value">{totalExercises}</div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Weekly Sets</span><Dumbbell size={18} color="#f59e0b"/></div>
          <div className="card-value">{totalSets}</div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Completion</span><Check size={18} color="#8b5cf6"/></div>
          <div className="card-value">{completionRate()}<span style={{fontSize:'1rem',color:'#64748b'}}>%</span></div>
          <div className="progress-bar" style={{marginTop:8}}>
            <div className="progress-fill" style={{width:`${completionRate()}%`,background:'#8b5cf6'}}></div>
          </div>
        </div>
      </div>

      {timerSeconds > 0 && (
        <div className="card" style={{marginBottom:16, borderColor:'rgba(245,158,11,0.3)', background:'rgba(245,158,11,0.05)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <Timer size={24} color="#f59e0b"/>
              <div>
                <div style={{fontSize:'1.8rem',fontWeight:800,color:'#f59e0b'}}>
                  {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
                </div>
                <div style={{fontSize:12,color:'#64748b'}}>Rest Timer</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={() => setTimerRunning(!timerRunning)} className="btn btn-secondary">
                {timerRunning ? <Pause size={16}/> : <Play size={16}/>}
              </button>
              <button onClick={() => { setTimerSeconds(0); setTimerRunning(false) }} className="btn btn-secondary">
                <RotateCcw size={16}/>
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => { setSelectedDay(days[0]?.id || ''); setShowAddModal(true) }}>
          <Plus size={16}/> Add Exercise
        </button>
      </div>

      {days.map(day => {
        const daySets = day.exercises.reduce((a, e) => a + e.sets, 0)
        const dayDone = day.exercises.reduce((a, e) => a + e.completedSets.length, 0)
        const dayPct = daySets > 0 ? Math.round((dayDone / daySets) * 100) : 0
        return (
          <div key={day.id} className="section" style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }}>
            <div
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: expandedDay === day.id ? '1px solid #1e293b' : 'none' }}
              onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="tag tag-blue">{day.name.split(' — ')[0]}</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{day.name.split(' — ')[1]}</span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({dayDone}/{daySets} sets)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="progress-bar" style={{ width: 80, height: 6 }}>
                  <div className="progress-fill" style={{ width: `${dayPct}%`, background: dayPct === 100 ? '#10b981' : '#3b82f6' }}/>
                </div>
                {expandedDay === day.id ? <ChevronUp size={18} color="#64748b"/> : <ChevronDown size={18} color="#64748b"/>}
              </div>
            </div>

            {expandedDay === day.id && (
              <div style={{ padding: '12px 20px 20px' }}>
                {day.exercises.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                    <Dumbbell size={32} color="#334155" style={{ marginBottom: 8 }} />
                    <div>No exercises yet</div>
                    <div style={{ fontSize: '0.8rem' }}>Add exercises to build your workout</div>
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{width:40}}></th>
                        <th>Exercise</th>
                        <th>Sets</th>
                        <th>Reps</th>
                        <th>Rest</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map(ex => (
                        <tr key={ex.id}>
                          <td>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {Array.from({length: ex.sets}).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    toggleSet(day.id, ex.id, i)
                                    if (!ex.completedSets.includes(i)) {
                                      startTimer(parseRestToSeconds(ex.rest))
                                    }
                                  }}
                                  style={{
                                    width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                                    background: ex.completedSets.includes(i) ? '#10b981' : '#1e293b',
                                    color: ex.completedSets.includes(i) ? '#fff' : '#64748b',
                                    fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                  }}
                                >
                                  {ex.completedSets.includes(i) ? <Check size={14}/> : i + 1}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{ex.name}</td>
                          <td>{ex.sets}</td>
                          <td>{ex.reps}</td>
                          <td>
                            <span className="tag tag-amber" style={{cursor:'pointer'}} onClick={() => startTimer(parseRestToSeconds(ex.rest))}>
                              {ex.rest}
                            </span>
                          </td>
                          <td>
                            <button onClick={() => removeExercise(day.id, ex.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                              <Trash2 size={16}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )
      })}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Exercise</h3>
            <div className="form-group">
              <label>Day</label>
              <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Exercise</label>
              <select value={selectedExercise} onChange={e => setSelectedExercise(e.target.value)}>
                <option value="">Select exercise...</option>
                {EXERCISE_LIBRARY.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Sets</label>
                <input type="number" value={sets} onChange={e => setSets(Number(e.target.value))} min={1} max={10}/>
              </div>
              <div className="form-group">
                <label>Reps</label>
                <input type="text" value={reps} onChange={e => setReps(e.target.value)}/>
              </div>
              <div className="form-group">
                <label>Rest</label>
                <input type="text" value={rest} onChange={e => setRest(e.target.value)}/>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addExercise}><Save size={16}/> Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
