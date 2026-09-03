import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus, Trash2, Dumbbell, ChevronDown, ChevronUp, Save, Check, Play, Pause,
  RotateCcw, Timer, Trophy, Flame, TrendingUp, Volume2, VolumeX
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

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

interface PRRecord {
  exercise: string
  weight: number
  reps: number
  date: string
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
    id: '1', name: 'Day 1 — Back & Biceps',
    exercises: [
      { id: 'e1', name: 'Weighted Pull-up', sets: 5, reps: '8-12', rest: '2-3 min', setLogs: [] },
      { id: 'e2', name: 'Lat Pulldown', sets: 4, reps: '10-12', rest: '90s', setLogs: [] },
      { id: 'e3', name: 'Barbell Row', sets: 4, reps: '8-10', rest: '2 min', setLogs: [] },
      { id: 'e4', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '60s', setLogs: [] },
    ]
  },
  {
    id: '2', name: 'Day 2 — Chest & Delts',
    exercises: [
      { id: 'e5', name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '2-3 min', setLogs: [] },
      { id: 'e6', name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2 min', setLogs: [] },
      { id: 'e7', name: 'Lateral Raise', sets: 4, reps: '15-20', rest: '60s', setLogs: [] },
      { id: 'e8', name: 'Tricep Pushdown', sets: 4, reps: '10-12', rest: '60s', setLogs: [] },
    ]
  },
  {
    id: '3', name: 'Day 3 — Legs & Core',
    exercises: [
      { id: 'e9', name: 'Barbell Squat', sets: 4, reps: '8-10', rest: '3 min', setLogs: [] },
      { id: 'e10', name: 'Romanian Deadlift', sets: 4, reps: '10-12', rest: '2 min', setLogs: [] },
      { id: 'e11', name: 'Stomach Vacuum', sets: 4, reps: '45-60s', rest: '45s', setLogs: [] },
      { id: 'e12', name: 'Plank', sets: 3, reps: '60s', rest: '45s', setLogs: [] },
    ]
  },
  {
    id: '4', name: 'Day 4 — Arms & Delts',
    exercises: [
      { id: 'e13', name: 'Lateral Raise (Drop)', sets: 4, reps: '15-20', rest: '60s', setLogs: [] },
      { id: 'e14', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '75s', setLogs: [] },
      { id: 'e15', name: 'Close-Grip Bench', sets: 4, reps: '10-12', rest: '90s', setLogs: [] },
      { id: 'e16', name: 'Tricep Kickback', sets: 3, reps: '15-20', rest: '45s', setLogs: [] },
    ]
  },
]

function parseRestToSeconds(rest: string): number {
  const match = rest.match(/(\d+)/)
  return match ? parseInt(match[1]) * (rest.includes('min') ? 60 : 1) : 90
}

function generateWarmup(workingWeight: number): { weight: number; reps: number }[] {
  if (workingWeight <= 20) return []
  const bar = 45
  const w1 = Math.max(bar, Math.round(workingWeight * 0.4 / 5) * 5)
  const w2 = Math.max(bar, Math.round(workingWeight * 0.6 / 5) * 5)
  const w3 = Math.round(workingWeight * 0.8 / 5) * 5
  return [
    { weight: w1, reps: 10 },
    { weight: w2, reps: 8 },
    { weight: w3, reps: 5 },
  ].filter(w => w.weight <= workingWeight && w.weight >= bar)
}

function useAudio() {
  const [muted, setMuted] = useLocalStorage('fittrack_muted', false)
  const playBeep = useCallback(() => {
    if (muted) return
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch { /* ignore */ }
  }, [muted])
  return { muted, setMuted, playBeep }
}

export default function WorkoutPlanner() {
  const [days, setDays] = useLocalStorage<WorkoutDay[]>('fittrack_workout_days_v2', DEFAULT_DAYS)
  const [prs, setPrs] = useLocalStorage<PRRecord[]>('fittrack_prs', [])
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showWarmup, setShowWarmup] = useState<string | null>(null)
  const [warmupWeight, setWarmupWeight] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState('10-12')
  const [rest, setRest] = useState('90s')
  const { muted, setMuted, playBeep } = useAudio()
  const timerEndedRef = useRef(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000)
      timerEndedRef.current = false
    } else if (timerSeconds === 0 && timerRunning && !timerEndedRef.current) {
      timerEndedRef.current = true
      setTimerRunning(false)
      playBeep()
    }
    return () => clearInterval(interval)
  }, [timerRunning, timerSeconds, playBeep])

  const startTimer = useCallback((seconds: number) => {
    setTimerSeconds(seconds)
    setTimerRunning(true)
    timerEndedRef.current = false
  }, [])

  const updateSetLog = useCallback((dayId: string, exId: string, setIndex: number, field: 'weight' | 'reps', value: number) => {
    setDays(prev => prev.map(d => {
      if (d.id !== dayId) return d
      return {
        ...d,
        exercises: d.exercises.map(e => {
          if (e.id !== exId) return e
          const logs = [...e.setLogs]
          while (logs.length <= setIndex) logs.push({ weight: 0, reps: 0, completed: false })
          logs[setIndex] = { ...logs[setIndex], [field]: value }
          return { ...e, setLogs: logs }
        })
      }
    }))
  }, [setDays])

  const toggleSet = useCallback((dayId: string, exId: string, setIndex: number) => {
    setDays(prev => prev.map(d => {
      if (d.id !== dayId) return d
      return {
        ...d,
        exercises: d.exercises.map(e => {
          if (e.id !== exId) return e
          const logs = [...e.setLogs]
          while (logs.length <= setIndex) logs.push({ weight: 0, reps: 0, completed: false })
          const wasCompleted = logs[setIndex].completed
          logs[setIndex] = { ...logs[setIndex], completed: !wasCompleted }
          if (!wasCompleted) {
            const w = logs[setIndex].weight
            const r = logs[setIndex].reps
            if (w > 0 && r > 0) {
              setPrs(prevPrs => {
                const existing = prevPrs.find(p => p.exercise === e.name)
                const isNewPR = !existing || w > existing.weight || (w === existing.weight && r > existing.reps)
                if (isNewPR) {
                  const filtered = prevPrs.filter(p => p.exercise !== e.name)
                  return [...filtered, { exercise: e.name, weight: w, reps: r, date: new Date().toISOString().slice(0, 10) }]
                }
                return prevPrs
              })
            }
          }
          return { ...e, setLogs: logs }
        })
      }
    }))
  }, [setDays, setPrs])

  const completionRate = useCallback(() => {
    let total = 0, done = 0
    days.forEach(d => d.exercises.forEach(e => {
      total += e.sets
      done += e.setLogs.filter(s => s.completed).length
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
        setLogs: []
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

  const recentPRs = [...prs].sort((a, b) => b.weight - a.weight).slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <h1>Workout Planner</h1>
        <p>Log every set with weight and reps. PRs auto-tracked.</p>
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

      {/* PRs */}
      {recentPRs.length > 0 && (
        <div className="section" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={20} color="#f59e0b" /> Recent PRs
          </h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {recentPRs.map((pr, i) => (
              <div key={i} className="tag" style={{
                background: 'rgba(245,158,11,0.12)',
                color: '#f59e0b',
                fontSize: '0.85rem',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Flame size={14} />
                {pr.exercise}: {pr.weight} lbs x {pr.reps} reps
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timer */}
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
              <button onClick={() => setMuted(!muted)} className="btn btn-secondary" title={muted ? 'Unmute timer' : 'Mute timer'}>
                {muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
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
        const dayDone = day.exercises.reduce((a, e) => a + e.setLogs.filter(s => s.completed).length, 0)
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
                        <th>Weight</th>
                        <th>Reps</th>
                        <th>Rest</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map(ex => (
                        <tr key={ex.id}>
                          <td colSpan={6} style={{ padding: 0, border: 'none' }}>
                            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{ex.name}</span>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button
                                    onClick={() => setShowWarmup(ex.id)}
                                    className="tag tag-amber"
                                    style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                                  >
                                    <Flame size={10} /> Warmup
                                  </button>
                                  <button onClick={() => removeExercise(day.id, ex.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                    <Trash2 size={14}/>
                                  </button>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {Array.from({length: ex.sets}).map((_, i) => {
                                  const log = ex.setLogs[i] || { weight: 0, reps: 0, completed: false }
                                  return (
                                    <div key={i} style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 4,
                                      padding: '6px 8px',
                                      borderRadius: 8,
                                      background: log.completed ? 'rgba(16,185,129,0.12)' : '#1e293b',
                                      border: `1px solid ${log.completed ? '#10b981' : '#334155'}`,
                                    }}>
                                      <button
                                        onClick={() => {
                                          toggleSet(day.id, ex.id, i)
                                          if (!log.completed) startTimer(parseRestToSeconds(ex.rest))
                                        }}
                                        style={{
                                          width: 22, height: 22, borderRadius: 5, border: 'none', cursor: 'pointer',
                                          background: log.completed ? '#10b981' : 'transparent',
                                          color: log.completed ? '#fff' : '#64748b',
                                          fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                      >
                                        {log.completed ? <Check size={12}/> : i + 1}
                                      </button>
                                      <input
                                        type="number"
                                        placeholder="lbs"
                                        value={log.weight || ''}
                                        onChange={e => updateSetLog(day.id, ex.id, i, 'weight', Number(e.target.value))}
                                        style={{
                                          width: 50, padding: '4px 6px', background: 'rgba(15,23,42,0.5)',
                                          border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0',
                                          fontSize: 12, textAlign: 'center'
                                        }}
                                      />
                                      <span style={{ color: '#64748b', fontSize: 11 }}>x</span>
                                      <input
                                        type="number"
                                        placeholder="reps"
                                        value={log.reps || ''}
                                        onChange={e => updateSetLog(day.id, ex.id, i, 'reps', Number(e.target.value))}
                                        style={{
                                          width: 45, padding: '4px 6px', background: 'rgba(15,23,42,0.5)',
                                          border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0',
                                          fontSize: 12, textAlign: 'center'
                                        }}
                                      />
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
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

      {/* Add Exercise Modal */}
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

      {/* Warmup Modal */}
      {showWarmup && (
        <div className="modal-overlay" onClick={() => setShowWarmup(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3><Flame size={18} style={{ verticalAlign: '-2px', marginRight: 6 }} /> Warmup Calculator</h3>
            <div className="form-group">
              <label>Your Working Weight (lbs)</label>
              <input type="number" value={warmupWeight} onChange={e => setWarmupWeight(e.target.value)} placeholder="e.g. 185" autoFocus />
            </div>
            {warmupWeight && Number(warmupWeight) > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Warmup Sets</div>
                {generateWarmup(Number(warmupWeight)).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {generateWarmup(Number(warmupWeight)).map((w, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', background: 'rgba(59,130,246,0.08)', borderRadius: 10,
                        border: '1px solid rgba(59,130,246,0.2)'
                      }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Set {i + 1}</span>
                        <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{w.weight} lbs x {w.reps} reps</span>
                      </div>
                    ))}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: 10,
                      border: '1px solid rgba(16,185,129,0.2)'
                    }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Working</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{warmupWeight} lbs</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Weight too light for warmup sets. Just do 1-2 sets with the bar.</div>
                )}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowWarmup(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
