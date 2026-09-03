import { useState } from 'react'
import { Activity, Dumbbell, Droplets, Flame, TrendingUp, Scale, Target, Utensils } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const weightData = [
  { day: 'Mon', weight: 91.2 },
  { day: 'Tue', weight: 91.0 },
  { day: 'Wed', weight: 90.8 },
  { day: 'Thu', weight: 90.9 },
  { day: 'Fri', weight: 90.6 },
  { day: 'Sat', weight: 90.5 },
  { day: 'Sun', weight: 90.4 },
]

const workoutData = [
  { day: 'Mon', sets: 24 },
  { day: 'Tue', sets: 22 },
  { day: 'Wed', sets: 0 },
  { day: 'Thu', sets: 26 },
  { day: 'Fri', sets: 28 },
  { day: 'Sat', sets: 0 },
  { day: 'Sun', sets: 0 },
]

export default function Dashboard() {
  const [water, setWater] = useState(5)
  const waterGoal = 8
  const [macros] = useState({ calories: 1850, protein: 142, carbs: 210, fat: 55 })
  const macroGoals = { calories: 2400, protein: 200, carbs: 280, fat: 75 }

  const addWater = () => setWater(w => Math.min(w + 1, waterGoal + 4))

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your fitness at a glance — weight, workouts, nutrition, hydration</p>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Current Weight</span>
            <div className="card-icon" style={{background:'rgba(59,130,246,0.15)'}}><Scale size={20} color="#3b82f6"/></div>
          </div>
          <div className="card-value">90.4<span style={{fontSize:'1rem',color:'#64748b'}}> kg</span></div>
          <div className="card-change positive">-0.8 kg this week</div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Workouts</span>
            <div className="card-icon" style={{background:'rgba(16,185,129,0.15)'}}><Dumbbell size={20} color="#10b981"/></div>
          </div>
          <div className="card-value">4<span style={{fontSize:'1rem',color:'#64748b'}}> / 4</span></div>
          <div className="card-change positive">100% completion</div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Calories</span>
            <div className="card-icon" style={{background:'rgba(245,158,11,0.15)'}}><Flame size={20} color="#f59e0b"/></div>
          </div>
          <div className="card-value">1,850<span style={{fontSize:'1rem',color:'#64748b'}}> / 2,400</span></div>
          <div className="progress-bar" style={{marginTop:8}}>
            <div className="progress-fill" style={{width:`${(macros.calories/macroGoals.calories)*100}%`,background:'#f59e0b'}}></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Protein</span>
            <div className="card-icon" style={{background:'rgba(139,92,246,0.15)'}}><Target size={20} color="#8b5cf6"/></div>
          </div>
          <div className="card-value">142<span style={{fontSize:'1rem',color:'#64748b'}}> / 200g</span></div>
          <div className="progress-bar" style={{marginTop:8}}>
            <div className="progress-fill" style={{width:`${(macros.protein/macroGoals.protein)*100}%`,background:'#8b5cf6'}}></div>
          </div>
        </div>
      </div>

      <div className="card-grid" style={{gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))'}}>
        <div className="card" style={{minHeight:320}}>
          <div className="card-header">
            <span className="card-title">Weight Trend</span>
            <TrendingUp size={16} color="#64748b"/>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weightData}>
              <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
              <XAxis dataKey="day" stroke="#64748b" fontSize={12}/>
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#64748b" fontSize={12}/>
              <Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:8}}/>
              <Area type="monotone" dataKey="weight" stroke="#3b82f6" fill="url(#wg)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{minHeight:320}}>
          <div className="card-header">
            <span className="card-title">Weekly Volume</span>
            <Activity size={16} color="#64748b"/>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
              <XAxis dataKey="day" stroke="#64748b" fontSize={12}/>
              <YAxis stroke="#64748b" fontSize={12}/>
              <Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:8}}/>
              <Bar dataKey="sets" fill="#10b981" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-grid" style={{gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))'}}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Water Intake</span>
            <div className="card-icon" style={{background:'rgba(6,182,212,0.15)'}}><Droplets size={20} color="#06b6d4"/></div>
          </div>
          <div className="card-value">{water}<span style={{fontSize:'1rem',color:'#64748b'}}> / {waterGoal} glasses</span></div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:12}}>
            {Array.from({length:waterGoal+4}).map((_,i) => (
              <button key={i} onClick={() => setWater(i+1)} style={{
                width:32,height:32,borderRadius:8,border:'none',cursor:'pointer',
                background: i < water ? '#06b6d4' : '#1e293b',
                transition:'all 0.2s'
              }}/>
            ))}
          </div>
          <button onClick={addWater} className="btn btn-primary" style={{marginTop:14,width:'100%',justifyContent:'center'}}>
            <Droplets size={16}/> Add Glass
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Today's Macros</span>
            <div className="card-icon" style={{background:'rgba(245,158,11,0.15)'}}><Utensils size={20} color="#f59e0b"/></div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:0.85}}>
                <span style={{color:'#94a3b8'}}>Calories</span>
                <span style={{color:'#f59e0b'}}>{macros.calories}/{macroGoals.calories}</span>
              </div>
              <div className="progress-bar" style={{marginTop:4}}><div className="progress-fill" style={{width:`${(macros.calories/macroGoals.calories)*100}%`,background:'#f59e0b'}}/></div>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:0.85}}>
                <span style={{color:'#94a3b8'}}>Protein</span>
                <span style={{color:'#8b5cf6'}}>{macros.protein}/{macroGoals.protein}g</span>
              </div>
              <div className="progress-bar" style={{marginTop:4}}><div className="progress-fill" style={{width:`${(macros.protein/macroGoals.protein)*100}%`,background:'#8b5cf6'}}/></div>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:0.85}}>
                <span style={{color:'#94a3b8'}}>Carbs</span>
                <span style={{color:'#3b82f6'}}>{macros.carbs}/{macroGoals.carbs}g</span>
              </div>
              <div className="progress-bar" style={{marginTop:4}}><div className="progress-fill" style={{width:`${(macros.carbs/macroGoals.carbs)*100}%`,background:'#3b82f6'}}/></div>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:0.85}}>
                <span style={{color:'#94a3b8'}}>Fat</span>
                <span style={{color:'#ef4444'}}>{macros.fat}/{macroGoals.fat}g</span>
              </div>
              <div className="progress-bar" style={{marginTop:4}}><div className="progress-fill" style={{width:`${(macros.fat/macroGoals.fat)*100}%`,background:'#ef4444'}}/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
