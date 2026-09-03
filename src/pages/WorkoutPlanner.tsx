import { useState } from 'react'
import { Plus, Trash2, Dumbbell, ChevronDown, ChevronUp, Save } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
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

export default function WorkoutPlanner() {
  const [days, setDays] = useState<WorkoutDay[]>([
    {
      id: '1',
      name: 'Day 1 — Back & Biceps',
      exercises: [
        { id: 'e1', name: 'Weighted Pull-up', sets: 5, reps: '8-12', rest: '2-3 min' },
        { id: 'e2', name: 'Lat Pulldown', sets: 4, reps: '10-12', rest: '90s' },
        { id: 'e3', name: 'Barbell Row', sets: 4, reps: '8-10', rest: '2 min' },
        { id: 'e4', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '60s' },
      ]
    },
    {
      id: '2',
      name: 'Day 2 — Chest & Delts',
      exercises: [
        { id: 'e5', name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '2-3 min' },
        { id: 'e6', name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2 min' },
        { id: 'e7', name: 'Lateral Raise', sets: 4, reps: '15-20', rest: '60s' },
        { id: 'e8', name: 'Tricep Pushdown', sets: 4, reps: '10-12', rest: '60s' },
      ]
    },
    {
      id: '3',
      name: 'Day 3 — Legs & Core',
      exercises: [
        { id: 'e9', name: 'Barbell Squat', sets: 4, reps: '8-10', rest: '3 min' },
        { id: 'e10', name: 'Romanian Deadlift', sets: 4, reps: '10-12', rest: '2 min' },
        { id: 'e11', name: 'Stomach Vacuum', sets: 4, reps: '45-60s', rest: '45s' },
        { id: 'e12', name: 'Plank', sets: 3, reps: '60s', rest: '45s' },
      ]
    },
    {
      id: '4',
      name: 'Day 4 — Arms & Delts',
      exercises: [
        { id: 'e13', name: 'Lateral Raise (Drop)', sets: 4, reps: '15-20', rest: '60s' },
        { id: 'e14', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '75s' },
        { id: 'e15', name: 'Close-Grip Bench', sets: 4, reps: '10-12', rest: '90s' },
        { id: 'e16', name: 'Tricep Kickback', sets: 3, reps: '15-20', rest: '45s' },
      ]
    },
  ])

  const [expandedDay, setExpandedDay] = useState<string | null>('1')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState('10-12')
  const [rest, setRest] = useState('90s')

  const addExercise = () => {
    if (!selectedDay || !selectedExercise) return
    setDays(days.map(d => d.id === selectedDay ? {
      ...d,
      exercises: [...d.exercises, {
        id: Date.now().toString(),
        name: selectedExercise,
        sets,
        reps,
        rest
      }]
    } : d))
    setShowAddModal(false)
    setSelectedExercise('')
  }

  const removeExercise = (dayId: string, exId: string) => {
    setDays(days.map(d => d.id === dayId ? {
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
        <p>Build and customize your training split</p>
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
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => { setSelectedDay(days[0].id); setShowAddModal(true) }}>
          <Plus size={16}/> Add Exercise
        </button>
      </div>

      {days.map(day => (
        <div key={day.id} className="section" style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }}>
          <div
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: expandedDay === day.id ? '1px solid #1e293b' : 'none' }}
            onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="tag tag-blue">{day.name.split(' — ')[0]}</span>
              <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{day.name.split(' — ')[1]}</span>
              <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({day.exercises.length} exercises)</span>
            </div>
            {expandedDay === day.id ? <ChevronUp size={18} color="#64748b"/> : <ChevronDown size={18} color="#64748b"/>}
          </div>

          {expandedDay === day.id && (
            <div style={{ padding: '12px 20px 20px' }}>
              <table className="data-table">
                <thead>
                  <tr>
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
                      <td style={{ fontWeight: 600 }}>{ex.name}</td>
                      <td>{ex.sets}</td>
                      <td>{ex.reps}</td>
                      <td><span className="tag tag-amber">{ex.rest}</span></td>
                      <td>
                        <button onClick={() => removeExercise(day.id, ex.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

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
