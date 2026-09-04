import { useState } from 'react'
import { Save, Trash2, AlertTriangle, Download, Upload, Scale, FileJson, FileSpreadsheet } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUnits } from '../hooks/useUnits'

export default function Settings() {
  const [goals, setGoals] = useLocalStorage('fittrack_goals', { calories: 2400, protein: 200, carbs: 280, fat: 75, water: 8 })
  const [profile, setProfile] = useLocalStorage('fittrack_profile', { name: '', height: '186', weight: '91', age: '18' })
  const [showReset, setShowReset] = useState(false)
  const { unitSystem, setUnitSystem, isMetric, weight, length } = useUnits()
  const [exportMsg, setExportMsg] = useState('')

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

  const exportData = (format: 'json' | 'csv') => {
    const data: Record<string, unknown> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || 'null')
        } catch {
          data[key] = localStorage.getItem(key)
        }
      }
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fittrack-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setExportMsg('JSON backup downloaded')
    } else {
      // CSV export for weights and workouts
      const weights = data['fittrack_weights'] as Array<{ date: string; weight: number }> || []
      const measurements = data['fittrack_measurements'] as Array<Record<string, unknown>> || []
      let csv = 'FitTrack Data Export\n\n'
      csv += 'Section,Date,Value,Notes\n'
      weights.forEach(w => {
        csv += `Weight,${w.date},${w.weight},kg\n`
      })
      measurements.forEach(m => {
        csv += `Measurements,${m.date || ''},${JSON.stringify(m)},\n`
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fittrack-backup-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setExportMsg('CSV backup downloaded')
    }
    setTimeout(() => setExportMsg(''), 3000)
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
        })
        setExportMsg('Data imported successfully. Reloading...')
        setTimeout(() => window.location.reload(), 1500)
      } catch {
        setExportMsg('Invalid JSON file')
        setTimeout(() => setExportMsg(''), 3000)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your goals, units, and data</p>
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
        </div>

        <div className="card glass">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9' }}>Profile</h2>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={profile.name} onChange={e => updateProfile('name', e.target.value)} placeholder="Your name"/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Height ({length.label})</label>
              <input type="number" value={profile.height} onChange={e => updateProfile('height', e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Weight ({weight.label})</label>
              <input type="number" value={profile.weight} onChange={e => updateProfile('weight', e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" value={profile.age} onChange={e => updateProfile('age', e.target.value)}/>
            </div>
          </div>
        </div>

        {/* Unit System */}
        <div className="card glass">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scale size={20} /> Unit System
          </h2>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button
              onClick={() => setUnitSystem('imperial')}
              className="btn"
              style={{
                flex: 1,
                justifyContent: 'center',
                background: unitSystem === 'imperial' ? 'linear-gradient(90deg, #3b82f6, #2563eb)' : 'rgba(30,41,59,0.6)',
                color: unitSystem === 'imperial' ? '#fff' : '#94a3b8',
                border: unitSystem === 'imperial' ? 'none' : '1px solid #334155',
              }}
            >
              Imperial (lbs / in)
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className="btn"
              style={{
                flex: 1,
                justifyContent: 'center',
                background: unitSystem === 'metric' ? 'linear-gradient(90deg, #3b82f6, #2563eb)' : 'rgba(30,41,59,0.6)',
                color: unitSystem === 'metric' ? '#fff' : '#94a3b8',
                border: unitSystem === 'metric' ? 'none' : '1px solid #334155',
              }}
            >
              Metric (kg / cm)
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            All weights display in {weight.label} and measurements in {length.label}. Internal storage stays in lbs/in for compatibility.
          </p>
        </div>

        {/* Data Export / Import */}
        <div className="card glass">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={20} /> Data Backup
          </h2>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={() => exportData('json')} className="btn btn-primary">
              <FileJson size={16} /> Export JSON
            </button>
            <button onClick={() => exportData('csv')} className="btn btn-secondary">
              <FileSpreadsheet size={16} /> Export CSV
            </button>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Upload size={14} /> Import Backup (JSON)
            </label>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ padding: '8px 0', background: 'transparent', border: 'none' }}
            />
          </div>
          {exportMsg && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, color: '#10b981', fontSize: '0.85rem' }}>
              {exportMsg}
            </div>
          )}
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
