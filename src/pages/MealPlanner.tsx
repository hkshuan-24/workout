import { useState } from 'react'
import { Plus, Trash2, Droplets, Flame, Beef, Wheat, Droplet } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
}

const MACRO_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function MealPlanner() {
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Oatmeal + Protein Shake', calories: 520, protein: 35, carbs: 65, fat: 10, time: 'Breakfast' },
    { id: '2', name: 'Chicken Rice Bowl', calories: 650, protein: 45, carbs: 70, fat: 18, time: 'Lunch' },
    { id: '3', name: 'Pre-Workout Banana + Whey', calories: 280, protein: 25, carbs: 30, fat: 3, time: 'Pre-Workout' },
    { id: '4', name: 'Post-Workout Steak + Potato', calories: 700, protein: 50, carbs: 60, fat: 22, time: 'Dinner' },
  ])

  const [water, setWater] = useState(5)
  const waterGoal = 8

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', time: 'Breakfast' })

  const addMeal = () => {
    if (!form.name || !form.calories) return
    setMeals([...meals, {
      id: Date.now().toString(),
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      time: form.time,
    }])
    setForm({ name: '', calories: '', protein: '', carbs: '', fat: '', time: 'Breakfast' })
    setShowAdd(false)
  }

  const deleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id))
  }

  const totals = meals.reduce((a, m) => ({
    calories: a.calories + m.calories,
    protein: a.protein + m.protein,
    carbs: a.carbs + m.carbs,
    fat: a.fat + m.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  const goals = { calories: 2400, protein: 200, carbs: 280, fat: 75 }

  const pieData = [
    { name: 'Protein', value: totals.protein * 4 },
    { name: 'Carbs', value: totals.carbs * 4 },
    { name: 'Fat', value: totals.fat * 9 },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>Meal Planner</h1>
        <p>Track calories, macros, and hydration</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Calories</span><Flame size={18} color="#f59e0b"/></div>
          <div className="card-value">{totals.calories}<span style={{fontSize:'1rem',color:'#64748b'}}> / {goals.calories}</span></div>
          <div className="progress-bar" style={{marginTop:8}}>
            <div className="progress-fill" style={{width:`${Math.min((totals.calories/goals.calories)*100,100)}%`,background:'#f59e0b'}}/></div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Protein</span><Beef size={18} color="#8b5cf6"/></div>
          <div className="card-value">{totals.protein}<span style={{fontSize:'1rem',color:'#64748b'}}> / {goals.protein}g</span></div>
          <div className="progress-bar" style={{marginTop:8}}>
            <div className="progress-fill" style={{width:`${Math.min((totals.protein/goals.protein)*100,100)}%`,background:'#8b5cf6'}}/></div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Carbs</span><Wheat size={18} color="#3b82f6"/></div>
          <div className="card-value">{totals.carbs}<span style={{fontSize:'1rem',color:'#64748b'}}> / {goals.carbs}g</span></div>
          <div className="progress-bar" style={{marginTop:8}}>
            <div className="progress-fill" style={{width:`${Math.min((totals.carbs/goals.carbs)*100,100)}%`,background:'#3b82f6'}}/></div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Fat</span><Droplet size={18} color="#ef4444"/></div>
          <div className="card-value">{totals.fat}<span style={{fontSize:'1rem',color:'#64748b'}}> / {goals.fat}g</span></div>
          <div className="progress-bar" style={{marginTop:8}}>
            <div className="progress-fill" style={{width:`${Math.min((totals.fat/goals.fat)*100,100)}%`,background:'#ef4444'}}/></div>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        <div className="card" style={{ minHeight: 300 }}>
          <div className="card-header"><span className="card-title">Macro Breakdown</span></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={MACRO_COLORS[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:8}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: '#8b5cf6' }}>● Protein ({Math.round(totals.protein * 4)} kcal)</span>
            <span style={{ fontSize: 12, color: '#3b82f6' }}>● Carbs ({Math.round(totals.carbs * 4)} kcal)</span>
            <span style={{ fontSize: 12, color: '#ef4444' }}>● Fat ({Math.round(totals.fat * 9)} kcal)</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Water Intake</span><Droplets size={18} color="#06b6d4"/></div>
          <div className="card-value">{water}<span style={{fontSize:'1rem',color:'#64748b'}}> / {waterGoal} glasses</span></div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
            {Array.from({length:waterGoal+4}).map((_,i) => (
              <button key={i} onClick={() => setWater(i+1)} style={{
                width:36,height:36,borderRadius:8,border:'none',cursor:'pointer',
                background: i < water ? '#06b6d4' : '#1e293b',
                transition:'all 0.2s'
              }}/>
            ))}
          </div>
          <button onClick={() => setWater(Math.min(water+1,12))} className="btn btn-primary" style={{marginTop:14,width:'100%',justifyContent:'center'}}>
            <Droplets size={16}/> Add Glass
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 0' }}>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16}/> Add Meal
        </button>
      </div>

      <div className="section">
        <h2>Today's Meals</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Meal</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fat</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <tr key={meal.id}>
                <td><span className="tag tag-blue">{meal.time}</span></td>
                <td style={{ fontWeight: 600 }}>{meal.name}</td>
                <td>{meal.calories}</td>
                <td>{meal.protein}g</td>
                <td>{meal.carbs}g</td>
                <td>{meal.fat}g</td>
                <td>
                  <button onClick={() => deleteMeal(meal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>Quick Meal Templates</h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {[
            { name: 'Protein Oats', cal: 450, p: 30, c: 55, f: 10, time: 'Breakfast' },
            { name: 'Chicken Breast + Rice', cal: 600, p: 50, c: 65, f: 12, time: 'Lunch' },
            { name: 'Pre-Workout Shake', cal: 250, p: 25, c: 25, f: 3, time: 'Pre-Workout' },
            { name: 'Salmon + Quinoa', cal: 550, p: 40, c: 45, f: 20, time: 'Dinner' },
            { name: 'Greek Yogurt + Berries', cal: 300, p: 25, c: 35, f: 5, time: 'Snack' },
            { name: 'Egg White Omelette', cal: 350, p: 30, c: 10, f: 18, time: 'Breakfast' },
          ].map((tmpl, i) => (
            <div key={i} className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => {
              setForm({ name: tmpl.name, calories: String(tmpl.cal), protein: String(tmpl.p), carbs: String(tmpl.c), fat: String(tmpl.f), time: tmpl.time })
              setShowAdd(true)
            }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{tmpl.name}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{tmpl.cal} kcal · {tmpl.p}g protein · {tmpl.c}g carbs · {tmpl.f}g fat</div>
              <span className="tag tag-green" style={{ marginTop: 8 }}>{tmpl.time}</span>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Meal</h3>
            <div className="form-group">
              <label>Meal Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Chicken Rice Bowl"/>
            </div>
            <div className="form-group">
              <label>Time</label>
              <select value={form.time} onChange={e => setForm({...form, time: e.target.value})}>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Pre-Workout</option>
                <option>Post-Workout</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Calories</label>
                <input type="number" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Protein (g)</label>
                <input type="number" value={form.protein} onChange={e => setForm({...form, protein: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Carbs (g)</label>
                <input type="number" value={form.carbs} onChange={e => setForm({...form, carbs: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Fat (g)</label>
                <input type="number" value={form.fat} onChange={e => setForm({...form, fat: e.target.value})}/>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addMeal}><Plus size={16}/> Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
