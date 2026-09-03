import { useState } from 'react'
import { Plus, Trash2, TrendingUp, Ruler, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface Measurement {
  id: string
  date: string
  weight: number
  waist: number
  shoulders: number
  arms: number
  chest: number
}

const INITIAL_DATA: Measurement[] = [
  { id: '1', date: '2026-08-01', weight: 92.0, waist: 89, shoulders: 51, arms: 36, chest: 102 },
  { id: '2', date: '2026-08-08', weight: 91.5, waist: 88.5, shoulders: 51.5, arms: 36.2, chest: 102.5 },
  { id: '3', date: '2026-08-15', weight: 91.2, waist: 88, shoulders: 52, arms: 36.5, chest: 103 },
  { id: '4', date: '2026-08-22', weight: 90.8, waist: 87.5, shoulders: 52.5, arms: 36.8, chest: 103.5 },
  { id: '5', date: '2026-08-29', weight: 90.4, waist: 87, shoulders: 53, arms: 37, chest: 104 },
]

export default function BodyTracker() {
  const [measurements, setMeasurements] = useState<Measurement[]>(INITIAL_DATA)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ date: '', weight: '', waist: '', shoulders: '', arms: '', chest: '' })

  const addMeasurement = () => {
    if (!form.date || !form.weight) return
    setMeasurements([...measurements, {
      id: Date.now().toString(),
      date: form.date,
      weight: Number(form.weight),
      waist: Number(form.waist) || 0,
      shoulders: Number(form.shoulders) || 0,
      arms: Number(form.arms) || 0,
      chest: Number(form.chest) || 0,
    }])
    setForm({ date: '', weight: '', waist: '', shoulders: '', arms: '', chest: '' })
    setShowAdd(false)
  }

  const deleteMeasurement = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id))
  }

  const latest = measurements[measurements.length - 1]
  const first = measurements[0]
  const weightChange = latest && first ? (latest.weight - first.weight).toFixed(1) : '0'
  const waistChange = latest && first ? (latest.waist - first.waist).toFixed(1) : '0'
  const shoulderChange = latest && first ? (latest.shoulders - first.shoulders).toFixed(1) : '0'
  const ratio = latest ? (latest.shoulders / latest.waist).toFixed(2) : '0'

  return (
    <div>
      <div className="page-header">
        <h1>Body Tracker</h1>
        <p>Log measurements and monitor your physique progress</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Weight</span><Target size={18} color="#3b82f6"/></div>
          <div className="card-value">{latest?.weight || 0}<span style={{fontSize:'1rem',color:'#64748b'}}> kg</span></div>
          <div className={`card-change ${Number(weightChange) <= 0 ? 'positive' : 'negative'}`}>
            {Number(weightChange) <= 0 ? '' : '+'}{weightChange} kg since start
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Waist</span><Ruler size={18} color="#ef4444"/></div>
          <div className="card-value">{latest?.waist || 0}<span style={{fontSize:'1rem',color:'#64748b'}}> cm</span></div>
          <div className={`card-change ${Number(waistChange) <= 0 ? 'positive' : 'negative'}`}>
            {Number(waistChange) <= 0 ? '' : '+'}{waistChange} cm since start
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Shoulders</span><TrendingUp size={18} color="#10b981"/></div>
          <div className="card-value">{latest?.shoulders || 0}<span style={{fontSize:'1rem',color:'#64748b'}}> cm</span></div>
          <div className={`card-change ${Number(shoulderChange) >= 0 ? 'positive' : 'negative'}`}>
            {Number(shoulderChange) >= 0 ? '+' : ''}{shoulderChange} cm since start
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">V-Taper Ratio</span><Target size={18} color="#f59e0b"/></div>
          <div className="card-value">{ratio}</div>
          <div className="card-change positive">Target: 1.65+</div>
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
        </div>

        <div className="card" style={{ minHeight: 300 }}>
          <div className="card-header"><span className="card-title">Measurements Over Time</span></div>
          <ResponsiveContainer width="100%" height={240}>
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
        </div>
      </div>

      <div className="section">
        <h2>Measurement History</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight (kg)</th>
              <th>Waist (cm)</th>
              <th>Shoulders (cm)</th>
              <th>Arms (cm)</th>
              <th>Chest (cm)</th>
              <th>Ratio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...measurements].reverse().map(m => (
              <tr key={m.id}>
                <td>{m.date}</td>
                <td style={{ fontWeight: 600 }}>{m.weight}</td>
                <td>{m.waist || '-'}</td>
                <td>{m.shoulders || '-'}</td>
                <td>{m.arms || '-'}</td>
                <td>{m.chest || '-'}</td>
                <td><span className="tag tag-amber">{(m.shoulders / m.waist).toFixed(2)}</span></td>
                <td>
                  <button onClick={() => deleteMeasurement(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <label>Weight (kg)</label>
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
