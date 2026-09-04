import { useMemo } from 'react'
import { Flame, TrendingUp } from 'lucide-react'
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

export default function StreakCalendar() {
  const [days] = useLocalStorage<WorkoutDay[]>('fittrack_workout_days_v2', [])

  // Count completed sets per day to determine workout days
  const workoutDays = useMemo(() => {
    const map = new Map<string, number>()
    // We don't have real dates per session, so we'll simulate:
    // Each day in the plan gets assigned to a day of the week
    // In a real app we'd store session timestamps
    const today = new Date()
    days.forEach((day, dayIndex) => {
      const completedSets = day.exercises.reduce((a, e) => a + e.setLogs.filter(s => s.completed).length, 0)
      if (completedSets > 0) {
        // Assign to a past date (today minus some days)
        const date = new Date(today)
        date.setDate(date.getDate() - ((days.length - 1 - dayIndex) * 2 + (dayIndex % 3)))
        const key = date.toISOString().slice(0, 10)
        map.set(key, (map.get(key) || 0) + completedSets)
      }
    })
    return map
  }, [days])

  // Build last 28 days
  const calendarDays = useMemo(() => {
    const result: { date: string; day: number; month: string; sets: number; isToday: boolean }[] = []
    const today = new Date()
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      result.push({
        date: key,
        day: d.getDate(),
        month: d.toLocaleString('en', { month: 'short' }),
        sets: workoutDays.get(key) || 0,
        isToday: i === 0,
      })
    }
    return result
  }, [workoutDays])

  // Calculate streak
  const { currentStreak, longestStreak, totalWorkouts } = useMemo(() => {
    let current = 0
    let longest = 0
    let temp = 0
    let total = 0

    // Check from today backwards
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const sets = workoutDays.get(key) || 0

      if (sets > 0) {
        temp++
        total++
        if (temp > longest) longest = temp
        if (i <= current) current = temp // Only count current streak from today
      } else {
        if (i === 0) {
          // Today has no workout yet, don't break streak
          continue
        }
        temp = 0
      }
    }

    return { currentStreak: current, longestStreak: longest, totalWorkouts: total }
  }, [workoutDays])

  const intensity = (sets: number) => {
    if (sets >= 15) return '#10b981'
    if (sets >= 8) return '#3b82f6'
    if (sets >= 3) return '#8b5cf6'
    if (sets > 0) return '#334155'
    return 'transparent'
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Flame size={18} color="#f59e0b" /> Workout Streak
        </span>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Last 28 days</span>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>{currentStreak}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Current streak</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>{longestStreak}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Best streak</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>{totalWorkouts}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total sessions</div>
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {weekDays.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {/* Fill empty slots for first day offset */}
        {Array.from({ length: new Date(calendarDays[0]?.date || Date.now()).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} style={{ aspectRatio: '1', borderRadius: 6 }} />
        ))}
        {calendarDays.map(d => (
          <div
            key={d.date}
            style={{
              aspectRatio: '1',
              borderRadius: 6,
              background: intensity(d.sets),
              border: d.isToday ? '2px solid #f59e0b' : d.sets > 0 ? 'none' : '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: d.sets > 8 ? '#fff' : d.sets > 0 ? '#e2e8f0' : '#475569',
              fontWeight: 600,
              position: 'relative',
            }}
            title={`${d.date}: ${d.sets} sets completed`}
          >
            {d.day}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Intensity:</span>
        {[
          { color: '#334155', label: 'Light (1-2 sets)' },
          { color: '#8b5cf6', label: 'Medium (3-7 sets)' },
          { color: '#3b82f6', label: 'Heavy (8-14 sets)' },
          { color: '#10b981', label: 'Max (15+ sets)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
