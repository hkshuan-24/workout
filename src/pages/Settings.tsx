import { useState } from 'react'
import { Save, Trash2, AlertTriangle } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Settings() {
  const [goals, setGoals] = useLocalStorage('fittrack_goals', { calories: 2400, protein: 200, carbs: 280, fat: 75, water: 8 })
  const [profile, setProfile] = useLocalStorage('fittrack_profile', { name: '', height: '186', weight: '91', age: '18' })
  const [showReset, setShowReset] = useState(false)

  const updateGoal = (key: string, value: number) => {
    setGoals({ ...goals, [key]: value })
  }

  const updateProfile = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value })
  }

  const resetAll = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your goals and profile</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        <div className="card glass">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9' }}>Daily Goals</h2>
          <div className="form-group">
            <label>Calories (kcal)</label>
            <input type="number" value={goals.calories} onChange={e => updateGoal('calories', Number(e.target.value))}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Protein (g)</label>
              <input type="number" value={goals.protein} onChange={e => updateGoal('protein', Number(e.target.value))}/>
            </div>
            <div className="form-group">
              <label>Carbs (g)</label>
              <input type="number" value={goals.carbs} onChange={e => updateGoal('carbs', Number(e.target.value))}/>
            </div>
            <div className="form-group">
              <label>Fat (g)</label>
              <input type="number" value={goals.fat} onChange={e => updateGoal('fat', Number(e.target.value))}/>
            </div>
          </div>
          <div className="form-group">
            <label>Water (glasses)</label>
            <input type="number" value={goals.water} onChange={e => updateGoal('water', Number(e.target.value))}/>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}>
            <Save size={16}/> Save Goals
          </button>
        </div>

        <div className="card glass">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9' }}>Profile</h2>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={profile.name} onChange={e => updateProfile('name', e.target.value)} placeholder="Your name"/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" value={profile.height} onChange={e => updateProfile('height', e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" value={profile.weight} onChange={e => updateProfile('weight', e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" value={profile.age} onChange={e => updateProfile('age', e.target.value)}/>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}>
            <Save size={16}/> Save Profile
          </button>
        </div>
      </div>

      <div className="card glass" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={20}/> Danger Zone
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 16 }}>
          Resetting will clear all your data including measurements, meals, workouts, and settings. This cannot be undone.
        </p>
        {!showReset ? (
          <button onClick={() => setShowReset(true)} className="btn btn-secondary" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <Trash2 size={16}/> Reset All Data
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowReset(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={resetAll} className="btn btn-primary" style={{ background: '#ef4444' }}>
              <Trash2 size={16}/> Confirm Reset
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
