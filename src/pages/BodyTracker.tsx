import { useState } from 'react'
import { Plus, Trash2, TrendingUp, Ruler, Target, Scale } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Measurement {
  id: string
  date: string
  weight: number
  waist: number
  shoulders: number
  arms: number
  chest: number
}

export default function BodyTracker() {
  const [measurements, setMeasurements] = useLocalStorage<Measurement[]>('fittrack_measurements', [])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ date: '', weight: '', waist: '', shoulders: '', arms: '', chest: '' })

  const addMeasurement = () => {
    if (!form.date || !form.weight) return
    const newEntry: Measurement = {
      id: Date.now().toString(),
      date: form.date,
      weight: Number(form.weight),
      waist: Number(form.waist) || 0,
      shoulders: Number(form.shoulders) || 0,
      arms: Number(form.arms) || 0,
      chest: Number(form.chest) || 0,
    }
    setMeasurements(prev => [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    setForm({ date: '', weight: '', waist: '', shoulders: '', arms: '', chest: '' })
    setShowAdd(false)
  }

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id))
  }

  const latest = measurements[measurements.length - 1]
  const first = measurements[0]
  const weightChange = latest && first ? +(latest.weight - first.weight).toFixed(1) : null
  const waistChange = latest && first ? +(latest.waist - first.waist).toFixed(1) : null
  const shoulderChange = latest && first ? +(latest.shoulders - first.shoulders).toFixed(1) : null
  const ratio = latest && latest.waist > 0 ? (latest.shoulders / latest.waist).toFixed(2) : null
  const goalRatio = 1.65
  const ratioProgress = latest && latest.waist > 0 ? Math.min((latest.shoulders / latest.waist / goalRatio) * 100, 100) : 0

  return (
    <div>
      <div className="page-header">
        <h1>Body Tracker</h1>
        <p>Log measurements and monitor your physique progress</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Weight</span><Target size={18} color="#3b82f6"/></div>
          <div className="card-value">{latest?.weight ?? '--'}<span style={{fontSize:'1rem',color:'#64748b'}}>{latest ? ' kg' : ''}</span></div>
          <div className="card-change" style={{color:'#64748b'}}>
            {weightChange !== null ? (
              <span className={weightChange <= 0 ? 'positive' : 'negative'}>
                {weightChange <= 0 ? '' : '+'}{weightChange} kg
              </span>
            ) : 'Add your first measurement'}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Waist</span><Ruler size={18} color="#ef4444"/></div>
          <div className="card-value">{latest?.waist ?? '--'}<span style={{fontSize:'1rem',color:'#64748b'}}>{latest ? ' cm' : ''}</span></div>
          <div className="card-change" style={{color:'#64748b'}}>
            {waistChange !== null ? (
              <span className={waistChange <= 0 ? 'positive' : 'negative'}>
                {waistChange <= 0 ? '' : '+'}{waistChange} cm
              </span>
            ) : 'No data yet'}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Shoulders</span><TrendingUp size={18} color="#10b981"/></div>
          <div className="card-value">{latest?.shoulders ?? '--'}<span style={{fontSize:'1rem',color:'#64748b'}}>{latest ? ' cm' : ''}</span></div>
          <div className="card-change" style={{color:'#64748b'}}>
            {shoulderChange !== null ? (
              <span className={shoulderChange >= 0 ? 'positive' : 'negative'}>
                {shoulderChange >= 0 ? '+' : ''}{shoulderChange} cm
              </span>
            ) : 'No data yet'}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">V-Taper Ratio</span><Target size={18} color="#f59e0b"/></div>
          <div className="card-value">{ratio ?? '--'}</div>
          {ratio && <div className="progress-bar" style={{marginTop:8}}>
            <div className="progress-fill" style={{width:`${ratioProgress}%`,background:'#f59e0b'}}></div>
          </div>}
          <div className="card-change" style={{color:'#64748b',marginTop:4}}>Target: {goalRatio} (Golden Ratio)</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16}/> Add Measurement
        </button>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
        <div className="card" style={{ minHeight: 300 }}>
          <div className="card-header"><span className="card-title">Weight Trend</span></div>
          {measurements.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={measurements}>
                <defs><linearGradient id="wgt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={d => d.slice(5)}/>
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#64748b" fontSize={11}/>
                <Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:8}}/>
                <Area type="monotone" dataKey="weight" stroke="#3b82f6" fill="url(#wgt)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{height:240}}>
              <Scale size={32} color="#334155" />
              <span>No weight data yet</span>
              <span style={{fontSize:'0.8rem'}}>Add your first measurement below</span>
            </div>
          )}
        </div>

        <div className="card" style={{ minHeight: 300 }}>
          <div className="card-header"><span className="card-title">Measurements Over Time</span></div>
          {measurements.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={measurements}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={d => d.slice(5)}/>
                  <YAxis stroke="#64748b" fontSize={11}/>
                  <Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:8}}/>
                  <Line type="monotone" dataKey="waist" stroke="#ef4444" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="shoulders" stroke="#10b981" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="arms" stroke="#f59e0b" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'center' }}>
                <span style={{ fontSize: 12, color: '#ef4444' }}>● Waist</span>
                <span style={{ fontSize: 12, color: '#10b981' }}>● Shoulders</span>
                <span style={{ fontSize: 12, color: '#f59e0b' }}>● Arms</span>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{height:240}}>
              <Ruler size={32} color="#334155" />
              <span>No measurements yet</span>
              <span style={{fontSize:'0.8rem'}}>Log your first entry to see trends</span>
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h2>Measurement History</h2>
        {measurements.length === 0 ? (
          <div className="empty-state">
            <Scale size={32} color="#334155" />
            <span>No measurements recorded</span>
            <span style={{fontSize:'0.8rem'}}>Click "Add Measurement" to get started</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Waist</th>
                <th>Shoulders</th>
                <th>Arms</th>
                <th>Chest</th>
                <th>Ratio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...measurements].reverse().map(m => (
                <tr key={m.id}>
                  <td>{m.date}</td>
                  <td style={{ fontWeight: 600 }}>{m.weight} kg</td>
                  <td>{m.waist || '-'} cm</td>
                  <td>{m.shoulders || '-'} cm</td>
                  <td>{m.arms || '-'} cm</td>
                  <td>{m.chest || '-'} cm</td>
                  <td><span className="tag tag-amber">{m.waist > 0 ? (m.shoulders / m.waist).toFixed(2) : '-'}</span></td>
                  <td>
                    <button onClick={() => deleteMeasurement(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Measurement</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Weight (kg) *</label>
                <input type="number" step="0.1" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Waist (cm)</label>
                <input type="number" value={form.waist} onChange={e => setForm({...form, waist: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Shoulders (cm)</label>
                <input type="number" value={form.shoulders} onChange={e => setForm({...form, shoulders: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Arms (cm)</label>
                <input type="number" value={form.arms} onChange={e => setForm({...form, arms: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Chest (cm)</label>
                <input type="number" value={form.chest} onChange={e => setForm({...form, chest: e.target.value})}/>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addMeasurement}><Plus size={16}/> Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
