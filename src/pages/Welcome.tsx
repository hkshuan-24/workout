import { useState } from 'react'
import { Activity, ChevronRight, User, Ruler, Scale, Flame, Droplets, Target } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface OnboardingData {
  name: string
  height: string
  weight: string
  age: string
  calories: string
  protein: string
  carbs: string
  fat: string
  water: string
}

export default function Welcome({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    name: '', height: '', weight: '', age: '',
    calories: '2400', protein: '200', carbs: '280', fat: '75', water: '8'
  })
  const [, setProfile] = useLocalStorage('fittrack_profile', { name: '', height: '', weight: '', age: '' })
  const [, setGoals] = useLocalStorage('fittrack_goals', { calories: 2400, protein: 200, carbs: 280, fat: 75, water: 8 })
  const [, setOnboarded] = useLocalStorage('fittrack_onboarded', false)

  const update = (key: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const finish = () => {
    setProfile({
      name: data.name,
      height: data.height,
      weight: data.weight,
      age: data.age,
    })
    setGoals({
      calories: Number(data.calories) || 2400,
      protein: Number(data.protein) || 200,
      carbs: Number(data.carbs) || 280,
      fat: Number(data.fat) || 75,
      water: Number(data.water) || 8,
    })
    setOnboarded(true)
    onComplete()
  }

  const steps = [
    {
      title: 'Welcome to FitTrack',
      subtitle: 'Your personal fitness hub. Let\'s set you up in 30 seconds.',
      icon: <Activity size={48} color="#3b82f6" />,
      fields: null,
    },
    {
      title: 'About You',
      subtitle: 'Basic info to personalize your experience.',
      icon: <User size={40} color="#8b5cf6" />,
      fields: [
        { key: 'name' as const, label: 'Your Name', placeholder: 'e.g. Alex', icon: <User size={16} /> },
        { key: 'age' as const, label: 'Age', placeholder: 'e.g. 18', icon: <User size={16} />, type: 'number' },
        { key: 'height' as const, label: 'Height (cm)', placeholder: 'e.g. 186', icon: <Ruler size={16} />, type: 'number' },
        { key: 'weight' as const, label: 'Current Weight (kg)', placeholder: 'e.g. 91', icon: <Scale size={16} />, type: 'number' },
      ],
    },
    {
      title: 'Your Goals',
      subtitle: 'Daily targets for calories, macros, and hydration.',
      icon: <Target size={40} color="#f59e0b" />,
      fields: [
        { key: 'calories' as const, label: 'Daily Calories (kcal)', placeholder: '2400', icon: <Flame size={16} />, type: 'number' },
        { key: 'protein' as const, label: 'Protein (g)', placeholder: '200', icon: <Target size={16} />, type: 'number' },
        { key: 'carbs' as const, label: 'Carbs (g)', placeholder: '280', icon: <Target size={16} />, type: 'number' },
        { key: 'fat' as const, label: 'Fat (g)', placeholder: '75', icon: <Target size={16} />, type: 'number' },
        { key: 'water' as const, label: 'Water (glasses)', placeholder: '8', icon: <Droplets size={16} />, type: 'number' },
      ],
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'linear-gradient(135deg, #06060a 0%, #0f172a 50%, #06060a 100%)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: '40px 32px',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 32 : 10,
              height: 10,
              borderRadius: 5,
              background: i <= step ? '#3b82f6' : '#1e293b',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'rgba(59, 130, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {current.icon}
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.6rem',
          fontWeight: 800,
          textAlign: 'center',
          color: '#f1f5f9',
          marginBottom: 8,
        }}>{current.title}</h1>
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.95rem',
          marginBottom: 32,
        }}>{current.subtitle}</p>

        {/* Fields */}
        {current.fields && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {current.fields.map(f => (
              <div key={f.key}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  marginBottom: 6,
                  fontWeight: 500,
                }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={f.type || 'text'}
                    value={data[f.key]}
                    onChange={e => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      paddingLeft: 44,
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid #334155',
                      borderRadius: 12,
                      color: '#e2e8f0',
                      fontSize: '1rem',
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#334155'}
                  />
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    {f.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => isLast ? finish() : setStep(step + 1)}
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {isLast ? 'Get Started' : 'Continue'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
