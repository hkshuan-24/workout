import { useState } from 'react'
import {
  Sparkles, Dumbbell, Save, Check, ChevronDown, ChevronUp, ArrowRight, RotateCcw,
  Target, Zap, Flame, Shield, Wind, Heart, BicepsFlexed, Clock, Calendar, TrendingUp,
  Activity, BarChart3, ChevronRight, Award, Moon, Apple, Droplets
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  completedSets: number[]
  notes?: string
}

interface WorkoutDay {
  id: string
  name: string
  exercises: Exercise[]
}

interface Phase {
  name: string
  weeks: string
  focus: string
  volumeRule: string
  intensityRule: string
  progression: string
}

interface ExpectedResult {
  metric: string
  value: string
  timeframe: string
}

interface RecoveryGuidance {
  sleep: string
  protein: string
  calories: string
  hydration: string
}

interface WorkoutPlan {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  tags: string[]
  durationWeeks: number
  frequencyDays: number
  phases: Phase[]
  expectedResults: ExpectedResult[]
  recovery: RecoveryGuidance
  days: WorkoutDay[]
}

/* ─── PRESETS ─── */

const PRESETS: Omit<WorkoutPlan, 'id'>[] = [
  {
    name: 'V-Taper + Big Arms',
    description: 'Wide lats, narrow waist, cannonball delts and sleeve-busting arms. Heavy pull emphasis with arm specialization.',
    icon: <Zap size={24} color="#f59e0b" />,
    tags: ['Back', 'Arms', 'Aesthetics'],
    durationWeeks: 12,
    frequencyDays: 5,
    phases: [
      { name: 'Foundation', weeks: 'Weeks 1-4', focus: 'Form & mind-muscle connection', volumeRule: '3-4 sets per exercise', intensityRule: 'RPE 7-8, leave 2-3 reps in reserve', progression: 'Add 2.5-5 lbs when you can complete all sets cleanly' },
      { name: 'Build', weeks: 'Weeks 5-8', focus: 'Volume & width accumulation', volumeRule: '4-5 sets per exercise, add 1 set to back movements', intensityRule: 'RPE 8-9, 1-2 reps in reserve', progression: 'Increase weight 5-10% every 2 weeks on compounds' },
      { name: 'Peak', weeks: 'Weeks 9-12', focus: 'Max density & arm detail', volumeRule: '5 sets + drop sets on arms & delts', intensityRule: 'RPE 9-10, occasional failure on last set', progression: 'Drop sets, rest-pause on arms; test weighted pull-up max' },
    ],
    expectedResults: [
      { metric: 'Lat Spread', value: '+2-3 inches', timeframe: '10-12 weeks' },
      { metric: 'Arm Circumference', value: '+0.5-1 inch', timeframe: '10-12 weeks' },
      { metric: 'Waist Definition', value: 'Visible abs outline', timeframe: '8-10 weeks' },
      { metric: 'Shoulder Width', value: '3D capped look', timeframe: '10-12 weeks' },
    ],
    recovery: {
      sleep: '7-8 hours nightly — growth hormone peaks during deep sleep',
      protein: '1g per lb bodyweight daily — arms and back need amino acid surplus',
      calories: '+200-300 kcal above maintenance — lean bulk to keep waist tight',
      hydration: '1 gallon daily — muscle fullness and joint health',
    },
    days: [
      {
        id: 'd1', name: 'Day 1 — Width & Back',
        exercises: [
          { id: 'e1', name: 'Weighted Pull-up', sets: 5, reps: '6-10', rest: '2-3 min', completedSets: [], notes: 'Wide grip, full stretch at bottom' },
          { id: 'e2', name: 'Lat Pulldown (Wide)', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Squeeze lats at contraction' },
          { id: 'e3', name: 'Single-Arm DB Row', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Heavy, controlled negatives' },
          { id: 'e4', name: 'Stomach Vacuum', sets: 4, reps: '60s hold', rest: '45s', completedSets: [], notes: 'Pull navel to spine' },
        ]
      },
      {
        id: 'd2', name: 'Day 2 — Arms & Delts',
        exercises: [
          { id: 'e5', name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Strict form, no leg drive' },
          { id: 'e6', name: 'Lateral Raise', sets: 5, reps: '15-20', rest: '60s', completedSets: [], notes: 'Light weight, perfect control' },
          { id: 'e7', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '75s', completedSets: [], notes: 'No swinging, full ROM' },
          { id: 'e8', name: 'Incline Dumbbell Curl', sets: 3, reps: '12-15', rest: '60s', completedSets: [], notes: 'Stretch at bottom' },
          { id: 'e9', name: 'Tricep Pushdown', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Squeeze at full extension' },
          { id: 'e10', name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s', completedSets: [], notes: 'Controlled eccentric' },
        ]
      },
      {
        id: 'd3', name: 'Day 3 — Thickness & Posterior',
        exercises: [
          { id: 'e11', name: 'Barbell Row', sets: 5, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Pendlay style, explosive' },
          { id: 'e12', name: 'Rack Pull', sets: 4, reps: '6-8', rest: '3 min', completedSets: [], notes: 'Overloads the upper back' },
          { id: 'e13', name: 'Face Pull', sets: 4, reps: '15-20', rest: '60s', completedSets: [], notes: 'External rotate at peak' },
          { id: 'e14', name: 'Rear Delt Fly', sets: 4, reps: '15-20', rest: '60s', completedSets: [], notes: 'Light, squeeze rear delts' },
        ]
      },
      {
        id: 'd4', name: 'Day 4 — Chest & Arms',
        exercises: [
          { id: 'e15', name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '2-3 min', completedSets: [], notes: 'Upper chest focus' },
          { id: 'e16', name: 'Flat Dumbbell Press', sets: 4, reps: '10-12', rest: '2 min', completedSets: [], notes: 'Deep stretch, controlled' },
          { id: 'e17', name: 'Hammer Curl', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Brachialis + forearms' },
          { id: 'e18', name: 'Close-Grip Bench', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Tricep emphasis' },
          { id: 'e19', name: 'Preacher Curl', sets: 3, reps: '10-12', rest: '75s', completedSets: [], notes: 'Strict, no momentum' },
        ]
      },
      {
        id: 'd5', name: 'Day 5 — Legs & Core',
        exercises: [
          { id: 'e20', name: 'Barbell Squat', sets: 4, reps: '8-10', rest: '3 min', completedSets: [], notes: 'Depth over weight' },
          { id: 'e21', name: 'Romanian Deadlift', sets: 4, reps: '10-12', rest: '2 min', completedSets: [], notes: 'Hamstring stretch' },
          { id: 'e22', name: 'Hanging Leg Raise', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Control the swing' },
          { id: 'e23', name: 'Plank', sets: 3, reps: '60s hold', rest: '45s', completedSets: [], notes: 'Brace everything' },
        ]
      },
    ]
  },
  {
    name: 'Bulk & Thickness',
    description: 'Maximum mass building. Heavy compounds, high volume, progressive overload. For the thick, dense look.',
    icon: <Flame size={24} color="#ef4444" />,
    tags: ['Mass', 'Strength', 'Size'],
    durationWeeks: 16,
    frequencyDays: 5,
    phases: [
      { name: 'Foundation', weeks: 'Weeks 1-4', focus: 'Build the base, master compounds', volumeRule: '4 sets per exercise', intensityRule: 'RPE 7, controlled tempo 3-1-2', progression: 'Add weight only when form is perfect' },
      { name: 'Build', weeks: 'Weeks 5-10', focus: 'Aggressive overload & volume', volumeRule: '4-5 sets, add 1 set to compounds weekly', intensityRule: 'RPE 8-9, push close to failure', progression: 'Add 5-10 lbs to bench/squat/deadlift every 2-3 weeks' },
      { name: 'Peak', weeks: 'Weeks 11-16', focus: 'Maximal size & density', volumeRule: '5 sets + 1 backoff set on compounds', intensityRule: 'RPE 9, occasional forced reps on accessories', progression: 'Cluster sets on bench/squat; test 5RM every 4 weeks' },
    ],
    expectedResults: [
      { metric: 'Body Weight', value: '+6-10 lbs', timeframe: '12-16 weeks' },
      { metric: 'Bench Press', value: '+20-35 lbs', timeframe: '12-16 weeks' },
      { metric: 'Squat', value: '+30-50 lbs', timeframe: '12-16 weeks' },
      { metric: 'Chest/Back Thickness', value: 'Visibly denser', timeframe: '10-12 weeks' },
    ],
    recovery: {
      sleep: '8+ hours — muscle grows while you sleep, not in the gym',
      protein: '1.1g per lb bodyweight — prioritize whole food sources',
      calories: '+400-500 kcal surplus — scale weight up 0.5-1 lb per week',
      hydration: '1.5 gallons — creatine and high protein demand more water',
    },
    days: [
      {
        id: 'd1', name: 'Day 1 — Push (Chest + Delts + Tris)',
        exercises: [
          { id: 'e1', name: 'Bench Press', sets: 5, reps: '5-8', rest: '3 min', completedSets: [], notes: 'Heavy, progressive overload' },
          { id: 'e2', name: 'Incline DB Press', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Full stretch at bottom' },
          { id: 'e3', name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Standing, strict' },
          { id: 'e4', name: 'Lateral Raise', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Controlled, no swinging' },
          { id: 'e5', name: 'Tricep Pushdown', sets: 4, reps: '10-12', rest: '60s', completedSets: [], notes: 'Full lockout' },
        ]
      },
      {
        id: 'd2', name: 'Day 2 — Pull (Back + Bis + Rear Delts)',
        exercises: [
          { id: 'e6', name: 'Barbell Row', sets: 5, reps: '6-8', rest: '2-3 min', completedSets: [], notes: 'Explosive up, slow down' },
          { id: 'e7', name: 'Weighted Pull-up', sets: 4, reps: '6-10', rest: '2 min', completedSets: [], notes: 'Add weight when ready' },
          { id: 'e8', name: 'Lat Pulldown', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Squeeze at bottom' },
          { id: 'e9', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '75s', completedSets: [], notes: 'No cheating' },
          { id: 'e10', name: 'Hammer Curl', sets: 3, reps: '12-15', rest: '60s', completedSets: [], notes: 'Brachialis focus' },
        ]
      },
      {
        id: 'd3', name: 'Day 3 — Legs & Core',
        exercises: [
          { id: 'e11', name: 'Barbell Squat', sets: 5, reps: '6-8', rest: '3 min', completedSets: [], notes: 'Depth every rep' },
          { id: 'e12', name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Hamstring stretch' },
          { id: 'e13', name: 'Leg Press', sets: 4, reps: '10-12', rest: '2 min', completedSets: [], notes: 'High foot placement' },
          { id: 'e14', name: 'Leg Curl', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Squeeze hamstrings' },
          { id: 'e15', name: 'Standing Calf Raise', sets: 5, reps: '12-15', rest: '60s', completedSets: [], notes: 'Full ROM, pause at top' },
        ]
      },
      {
        id: 'd4', name: 'Day 4 — Upper Body Volume',
        exercises: [
          { id: 'e16', name: 'Flat DB Press', sets: 4, reps: '10-12', rest: '2 min', completedSets: [], notes: 'Deep stretch' },
          { id: 'e17', name: 'Cable Fly', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Cross midline' },
          { id: 'e18', name: 'Single-Arm DB Row', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Heavy, controlled' },
          { id: 'e19', name: 'Lateral Raise (Drop Set)', sets: 3, reps: '15-20', rest: '60s', completedSets: [], notes: 'Drop weight, keep going' },
          { id: 'e20', name: 'Incline Dumbbell Curl', sets: 3, reps: '12-15', rest: '60s', completedSets: [], notes: 'Stretch at bottom' },
          { id: 'e21', name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s', completedSets: [], notes: 'Slow eccentric' },
        ]
      },
      {
        id: 'd5', name: 'Day 5 — Lower Body & Posterior',
        exercises: [
          { id: 'e22', name: 'Front Squat', sets: 4, reps: '8-10', rest: '2-3 min', completedSets: [], notes: 'Upright torso' },
          { id: 'e23', name: 'Bulgarian Split Squat', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Each leg' },
          { id: 'e24', name: 'Leg Extension', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Squeeze quads' },
          { id: 'e25', name: 'Barbell Shrug', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Hold at top 1s' },
          { id: 'e26', name: 'Hanging Leg Raise', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Control the negative' },
        ]
      },
    ]
  },
  {
    name: 'Athletic & Lean',
    description: 'Functional strength, explosive power, and a shredded physique. Athletic performance meets aesthetics.',
    icon: <Wind size={24} color="#10b981" />,
    tags: ['Athletic', 'Functional', 'Lean'],
    durationWeeks: 10,
    frequencyDays: 4,
    phases: [
      { name: 'Foundation', weeks: 'Weeks 1-3', focus: 'Movement quality & conditioning base', volumeRule: '3-4 sets, moderate reps', intensityRule: 'RPE 7, focus on speed & control', progression: 'Master movement patterns before adding load' },
      { name: 'Build', weeks: 'Weeks 4-7', focus: 'Power development & metabolic stress', volumeRule: '4 sets + conditioning finisher (10 min)', intensityRule: 'RPE 8, explosive concentrics', progression: 'Add 5% weight weekly; reduce rest 10s every 2 weeks' },
      { name: 'Peak', weeks: 'Weeks 8-10', focus: 'Conditioning peak & definition', volumeRule: '4 sets + HIIT or complexes (15 min)', intensityRule: 'RPE 8-9, supersets on accessories', progression: 'Circuit training on Day 4; test body fat %' },
    ],
    expectedResults: [
      { metric: 'Body Fat', value: '-3-5%', timeframe: '8-10 weeks' },
      { metric: 'Muscle Definition', value: 'Visible separation', timeframe: '8-10 weeks' },
      { metric: 'Explosive Power', value: '+15-25% jump/throw', timeframe: '8-10 weeks' },
      { metric: 'Work Capacity', value: 'Shorter rest, same output', timeframe: '6-8 weeks' },
    ],
    recovery: {
      sleep: '7-8 hours — recovery is critical with conditioning work',
      protein: '1g per lb bodyweight — preserve muscle in deficit',
      calories: '-300-500 kcal deficit — 1-1.5 lbs fat loss per week max',
      hydration: '1 gallon — metabolic processes need water',
    },
    days: [
      {
        id: 'd1', name: 'Day 1 — Power & Push',
        exercises: [
          { id: 'e1', name: 'Bench Press', sets: 4, reps: '5-6', rest: '3 min', completedSets: [], notes: 'Explosive concentric' },
          { id: 'e2', name: 'Overhead Press', sets: 4, reps: '6-8', rest: '2 min', completedSets: [], notes: 'Strict, powerful' },
          { id: 'e3', name: 'Weighted Dips', sets: 4, reps: '8-10', rest: '90s', completedSets: [], notes: 'Lean forward for chest' },
          { id: 'e4', name: 'Lateral Raise', sets: 4, reps: '15-20', rest: '45s', completedSets: [], notes: 'High reps, burn' },
          { id: 'e5', name: 'Tricep Pushdown', sets: 3, reps: '15-20', rest: '45s', completedSets: [], notes: 'Constant tension' },
        ]
      },
      {
        id: 'd2', name: 'Day 2 — Pull & Speed',
        exercises: [
          { id: 'e6', name: 'Weighted Pull-up', sets: 4, reps: '6-8', rest: '2 min', completedSets: [], notes: 'Explosive up' },
          { id: 'e7', name: 'Pendlay Row', sets: 4, reps: '6-8', rest: '2 min', completedSets: [], notes: 'Explosive, ground start' },
          { id: 'e8', name: 'Face Pull', sets: 4, reps: '15-20', rest: '45s', completedSets: [], notes: 'Rear delt + rotator cuff' },
          { id: 'e9', name: 'Barbell Curl', sets: 3, reps: '12-15', rest: '60s', completedSets: [], notes: 'Controlled' },
          { id: 'e10', name: 'Cable Crunch', sets: 4, reps: '15-20', rest: '45s', completedSets: [], notes: 'Spinal flexion' },
        ]
      },
      {
        id: 'd3', name: 'Day 3 — Legs & Explosive',
        exercises: [
          { id: 'e11', name: 'Barbell Squat', sets: 4, reps: '6-8', rest: '3 min', completedSets: [], notes: 'Powerful out of hole' },
          { id: 'e12', name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Posterior chain' },
          { id: 'e13', name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', rest: '90s', completedSets: [], notes: 'Each leg, deep stretch' },
          { id: 'e14', name: 'Standing Calf Raise', sets: 4, reps: '15-20', rest: '45s', completedSets: [], notes: 'Explosive up, slow down' },
          { id: 'e15', name: 'Plank', sets: 3, reps: '60s', rest: '30s', completedSets: [], notes: 'Brace hard' },
        ]
      },
      {
        id: 'd4', name: 'Day 4 — Full Body Circuit',
        exercises: [
          { id: 'e16', name: 'Kettlebell Swing', sets: 4, reps: '15-20', rest: '60s', completedSets: [], notes: 'Hip hinge power' },
          { id: 'e17', name: 'Push-up (Weighted)', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Controlled tempo' },
          { id: 'e18', name: 'Inverted Row', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Squeeze shoulder blades' },
          { id: 'e19', name: 'Goblet Squat', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Deep squat, upright' },
          { id: 'e20', name: 'Hanging Leg Raise', sets: 4, reps: '12-15', rest: '45s', completedSets: [], notes: 'Control the swing' },
        ]
      },
    ]
  },
  {
    name: 'Strength & Power',
    description: 'Pure strength focus. Low reps, heavy weight, long rests. Build a foundation of raw power.',
    icon: <Shield size={24} color="#8b5cf6" />,
    tags: ['Strength', 'Power', 'Compounds'],
    durationWeeks: 12,
    frequencyDays: 4,
    phases: [
      { name: 'Foundation', weeks: 'Weeks 1-4', focus: 'Technique & neural adaptation', volumeRule: '3-4 sets, 5 reps', intensityRule: 'RPE 7, pause reps on squats & bench', progression: 'Add 2.5-5 lbs weekly on all main lifts' },
      { name: 'Build', weeks: 'Weeks 5-8', focus: 'Strength accumulation', volumeRule: '4-5 sets, 3-5 reps', intensityRule: 'RPE 8-8.5, heavy doubles & triples', progression: 'Wave loading: 5-3-1 pattern over 3 weeks' },
      { name: 'Peak', weeks: 'Weeks 9-12', focus: 'Maximal strength testing', volumeRule: '3-5 sets, 1-3 reps', intensityRule: 'RPE 9+, test singles', progression: 'Test 1RM on squat, bench, deadlift in final week' },
    ],
    expectedResults: [
      { metric: 'Squat 1RM', value: '+30-50 lbs', timeframe: '12 weeks' },
      { metric: 'Bench 1RM', value: '+20-35 lbs', timeframe: '12 weeks' },
      { metric: 'Deadlift 1RM', value: '+40-60 lbs', timeframe: '12 weeks' },
      { metric: 'Overhead Press', value: '+15-25 lbs', timeframe: '12 weeks' },
    ],
    recovery: {
      sleep: '8+ hours — CNS recovery from heavy lifting demands it',
      protein: '1g per lb bodyweight — maintain muscle during low-volume phase',
      calories: 'Maintenance +100-200 — enough to fuel heavy sessions without fat gain',
      hydration: '1 gallon — joint health under heavy loads',
    },
    days: [
      {
        id: 'd1', name: 'Day 1 — Squat & Lower',
        exercises: [
          { id: 'e1', name: 'Barbell Squat', sets: 5, reps: '3-5', rest: '3-4 min', completedSets: [], notes: 'Heavy triples' },
          { id: 'e2', name: 'Front Squat', sets: 4, reps: '5-6', rest: '3 min', completedSets: [], notes: 'Upright torso' },
          { id: 'e3', name: 'Romanian Deadlift', sets: 4, reps: '6-8', rest: '2 min', completedSets: [], notes: 'Hamstring loading' },
          { id: 'e4', name: 'Leg Curl', sets: 3, reps: '10-12', rest: '90s', completedSets: [], notes: 'Accessory work' },
        ]
      },
      {
        id: 'd2', name: 'Day 2 — Bench & Push',
        exercises: [
          { id: 'e5', name: 'Bench Press', sets: 5, reps: '3-5', rest: '3-4 min', completedSets: [], notes: 'Heavy, spotter recommended' },
          { id: 'e6', name: 'Incline Barbell Press', sets: 4, reps: '5-6', rest: '3 min', completedSets: [], notes: 'Upper chest strength' },
          { id: 'e7', name: 'Overhead Press', sets: 4, reps: '5-6', rest: '2-3 min', completedSets: [], notes: 'Standing strict' },
          { id: 'e8', name: 'Close-Grip Bench', sets: 3, reps: '6-8', rest: '2 min', completedSets: [], notes: 'Tricep strength' },
        ]
      },
      {
        id: 'd3', name: 'Day 3 — Deadlift & Pull',
        exercises: [
          { id: 'e9', name: 'Barbell Deadlift', sets: 5, reps: '3-5', rest: '3-4 min', completedSets: [], notes: 'Sumo or conventional' },
          { id: 'e10', name: 'Barbell Row', sets: 4, reps: '5-6', rest: '2-3 min', completedSets: [], notes: 'Pendlay style' },
          { id: 'e11', name: 'Weighted Pull-up', sets: 4, reps: '5-6', rest: '2-3 min', completedSets: [], notes: 'Add weight belt' },
          { id: 'e12', name: 'Barbell Shrug', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Hold at top' },
        ]
      },
      {
        id: 'd4', name: 'Day 4 — Accessory & Weak Points',
        exercises: [
          { id: 'e13', name: 'Bulgarian Split Squat', sets: 3, reps: '8-10', rest: '90s', completedSets: [], notes: 'Each leg' },
          { id: 'e14', name: 'Dumbbell Press', sets: 3, reps: '8-10', rest: '90s', completedSets: [], notes: 'Stability work' },
          { id: 'e15', name: 'Face Pull', sets: 4, reps: '15-20', rest: '60s', completedSets: [], notes: 'Shoulder health' },
          { id: 'e16', name: 'Plank', sets: 3, reps: '60s', rest: '45s', completedSets: [], notes: 'Core stability' },
        ]
      },
    ]
  },
  {
    name: 'Arm Specialization',
    description: 'Biceps and triceps take center stage. High frequency, high volume, pump-focused arm training.',
    icon: <BicepsFlexed size={24} color="#3b82f6" />,
    tags: ['Arms', 'Aesthetics', 'Pump'],
    durationWeeks: 10,
    frequencyDays: 4,
    phases: [
      { name: 'Foundation', weeks: 'Weeks 1-3', focus: 'Form & connection', volumeRule: '4 sets per arm exercise', intensityRule: 'RPE 7-8, 2s squeeze at contraction', progression: 'Add 2.5 lbs when all sets completed cleanly' },
      { name: 'Build', weeks: 'Weeks 4-7', focus: 'Volume & frequency ramp', volumeRule: '4-5 sets + arm superset finisher', intensityRule: 'RPE 8-9, controlled negatives 3s', progression: 'Increase weight 5% every 2 weeks; add 1 set to curls' },
      { name: 'Peak', weeks: 'Weeks 8-10', focus: 'Peak contraction & blood flow', volumeRule: '5 sets + drop sets + rest-pause', intensityRule: 'RPE 9, failure on last set', progression: '21s method on curls; test arm measurement weekly' },
    ],
    expectedResults: [
      { metric: 'Bicep Peak', value: 'More defined peak', timeframe: '8-10 weeks' },
      { metric: 'Tricep Horseshoe', value: 'Visible lateral head', timeframe: '8-10 weeks' },
      { metric: 'Arm Circumference', value: '+0.5-1 inch', timeframe: '8-10 weeks' },
      { metric: 'Vascularity', value: 'Forearm veins visible', timeframe: '6-8 weeks' },
    ],
    recovery: {
      sleep: '7-8 hours — arms recover fast but need consistency',
      protein: '1g per lb bodyweight — arms are small muscles, need frequent protein',
      calories: '+200-300 surplus — enough to grow without gaining fat',
      hydration: '1 gallon — pump and vascularity depend on hydration',
    },
    days: [
      {
        id: 'd1', name: 'Day 1 — Biceps Focus',
        exercises: [
          { id: 'e1', name: 'Barbell Curl', sets: 5, reps: '10-12', rest: '75s', completedSets: [], notes: 'Strict, no swinging' },
          { id: 'e2', name: 'Incline Dumbbell Curl', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Stretch at bottom' },
          { id: 'e3', name: 'Preacher Curl', sets: 4, reps: '10-12', rest: '60s', completedSets: [], notes: 'No momentum' },
          { id: 'e4', name: 'Hammer Curl', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Brachialis + forearm' },
          { id: 'e5', name: 'Cable Curl', sets: 3, reps: '15-20', rest: '45s', completedSets: [], notes: 'Constant tension' },
        ]
      },
      {
        id: 'd2', name: 'Day 2 — Triceps Focus',
        exercises: [
          { id: 'e6', name: 'Close-Grip Bench', sets: 5, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Heavy compound' },
          { id: 'e7', name: 'Tricep Pushdown', sets: 5, reps: '12-15', rest: '60s', completedSets: [], notes: 'Squeeze at lockout' },
          { id: 'e8', name: 'Overhead Tricep Extension', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Stretch at bottom' },
          { id: 'e9', name: 'Tricep Kickback', sets: 4, reps: '15-20', rest: '45s', completedSets: [], notes: 'Squeeze at peak' },
          { id: 'e10', name: 'Bench Dip', sets: 3, reps: '15-20', rest: '45s', completedSets: [], notes: 'Bodyweight burn' },
        ]
      },
      {
        id: 'd3', name: 'Day 3 — Push (Chest + Delts + Arms)',
        exercises: [
          { id: 'e11', name: 'Bench Press', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Strength base' },
          { id: 'e12', name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Shoulder mass' },
          { id: 'e13', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '60s', completedSets: [], notes: 'Superset ready' },
          { id: 'e14', name: 'Tricep Pushdown', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Pump finish' },
        ]
      },
      {
        id: 'd4', name: 'Day 4 — Pull (Back + Arms)',
        exercises: [
          { id: 'e15', name: 'Weighted Pull-up', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Width' },
          { id: 'e16', name: 'Barbell Row', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Thickness' },
          { id: 'e17', name: 'Incline Dumbbell Curl', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Peak contraction' },
          { id: 'e18', name: 'Overhead Tricep Extension', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Long head' },
        ]
      },
    ]
  },
  {
    name: 'Chest & Upper Body',
    description: 'Build a commanding upper body. Chest, shoulders, and arms dominate this aesthetic-focused plan.',
    icon: <Heart size={24} color="#ec4899" />,
    tags: ['Chest', 'Upper Body', 'Aesthetics'],
    durationWeeks: 10,
    frequencyDays: 4,
    phases: [
      { name: 'Foundation', weeks: 'Weeks 1-3', focus: 'Chest activation & range of motion', volumeRule: '4 sets, moderate weight', intensityRule: 'RPE 7, deep stretch on every rep', progression: 'Add 5 lbs when form is locked in' },
      { name: 'Build', weeks: 'Weeks 4-7', focus: 'Upper chest & shoulder width', volumeRule: '4-5 sets, add incline volume', intensityRule: 'RPE 8-9, squeeze hard at top', progression: 'Increase incline press 10% every 2 weeks' },
      { name: 'Peak', weeks: 'Weeks 8-10', focus: 'Detail, separation & vascularity', volumeRule: '5 sets + supersets (fly + press)', intensityRule: 'RPE 9, partials on last set', progression: 'Test max reps on weighted dips; measure chest' },
    ],
    expectedResults: [
      { metric: 'Chest Measurement', value: '+1-2 inches', timeframe: '8-10 weeks' },
      { metric: 'Upper Chest', value: 'Full, rounded look', timeframe: '8-10 weeks' },
      { metric: 'Shoulder Width', value: 'Broader frame', timeframe: '8-10 weeks' },
      { metric: 'Chest Vascularity', value: 'Striations visible', timeframe: '10+ weeks (low body fat)' },
    ],
    recovery: {
      sleep: '7-8 hours — chest and delts need recovery time',
      protein: '1g per lb bodyweight — upper body muscles are large, need fuel',
      calories: '+200-400 surplus — enough to build without excess fat',
      hydration: '1 gallon — muscle pump and recovery',
    },
    days: [
      {
        id: 'd1', name: 'Day 1 — Chest Mass',
        exercises: [
          { id: 'e1', name: 'Bench Press', sets: 5, reps: '6-8', rest: '3 min', completedSets: [], notes: 'Heavy, progressive' },
          { id: 'e2', name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '2 min', completedSets: [], notes: 'Upper chest' },
          { id: 'e3', name: 'Flat Dumbbell Press', sets: 4, reps: '10-12', rest: '2 min', completedSets: [], notes: 'Deep stretch' },
          { id: 'e4', name: 'Cable Fly', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Squeeze at crossover' },
        ]
      },
      {
        id: 'd2', name: 'Day 2 — Shoulders & Arms',
        exercises: [
          { id: 'e5', name: 'Overhead Press', sets: 5, reps: '6-8', rest: '2 min', completedSets: [], notes: 'Strict standing' },
          { id: 'e6', name: 'Lateral Raise', sets: 5, reps: '15-20', rest: '60s', completedSets: [], notes: 'Perfect control' },
          { id: 'e7', name: 'Rear Delt Fly', sets: 4, reps: '15-20', rest: '60s', completedSets: [], notes: '3D delts' },
          { id: 'e8', name: 'Barbell Curl', sets: 4, reps: '10-12', rest: '60s', completedSets: [], notes: 'Strict form' },
          { id: 'e9', name: 'Tricep Pushdown', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Full extension' },
        ]
      },
      {
        id: 'd3', name: 'Day 3 — Back Width',
        exercises: [
          { id: 'e10', name: 'Weighted Pull-up', sets: 5, reps: '6-10', rest: '2 min', completedSets: [], notes: 'Wide grip' },
          { id: 'e11', name: 'Lat Pulldown', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Squeeze lats' },
          { id: 'e12', name: 'Single-Arm DB Row', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Heavy stretch' },
          { id: 'e13', name: 'Face Pull', sets: 4, reps: '15-20', rest: '60s', completedSets: [], notes: 'Rear delt focus' },
        ]
      },
      {
        id: 'd4', name: 'Day 4 — Chest Pump & Detail',
        exercises: [
          { id: 'e14', name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '90s', completedSets: [], notes: 'Upper chest pump' },
          { id: 'e15', name: 'Dumbbell Fly', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Deep stretch' },
          { id: 'e16', name: 'Cable Crossover', sets: 4, reps: '15-20', rest: '45s', completedSets: [], notes: 'Low to high' },
          { id: 'e17', name: 'Push-up (Weighted)', sets: 4, reps: '12-15', rest: '60s', completedSets: [], notes: 'Burnout' },
        ]
      },
    ]
  },
]

const KEYWORD_MAP: Record<string, number[]> = {
  'v taper': [0], 'v-taper': [0], 'taper': [0], 'wide back': [0], 'small waist': [0],
  'big arms': [0, 4], 'huge arms': [4], 'arm': [4], 'bicep': [4], 'tricep': [4],
  'bulk': [1], 'bulky': [1], 'mass': [1], 'thick': [1], 'size': [1], 'big': [1], 'heavy': [1],
  'lean': [2], 'athletic': [2], 'shredded': [2], 'cut': [2], 'ripped': [2], 'toned': [2],
  'strength': [3], 'strong': [3], 'power': [3], 'powerlifting': [3], 'lift heavy': [3],
  'chest': [5], 'upper body': [5], 'pecs': [5],
}

function matchGoals(input: string): number[] {
  const lower = input.toLowerCase()
  const matches = new Set<number>()
  for (const [keyword, indices] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      indices.forEach(i => matches.add(i))
    }
  }
  return Array.from(matches)
}

/* ─── PHASE COLOURS ─── */
const PHASE_COLORS = [
  { border: '#3b82f6', bg: 'rgba(59,130,246,0.08)', dot: '#3b82f6' },
  { border: '#10b981', bg: 'rgba(16,185,129,0.08)', dot: '#10b981' },
  { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', dot: '#f59e0b' },
]

export default function WorkoutGenerator() {
  const [query, setQuery] = useState('')
  const [matched, setMatched] = useState<number[]>([])
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)
  const [, setSavedDays] = useLocalStorage<WorkoutDay[]>('fittrack_workout_days', [])
  const [saved, setSaved] = useState(false)

  const handleSearch = () => {
    const m = matchGoals(query)
    setMatched(m.length > 0 ? m : [0, 1, 2, 3, 4, 5])
    setSelectedPlan(null)
    setSaved(false)
  }

  const selectPlan = (preset: typeof PRESETS[0]) => {
    const plan: WorkoutPlan = {
      ...preset,
      id: `plan-${Date.now()}`,
      days: preset.days.map(d => ({
        ...d,
        id: `${d.id}-${Date.now()}`,
        exercises: d.exercises.map(e => ({
          ...e,
          id: `${e.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          completedSets: [],
        })),
      })),
    }
    setSelectedPlan(plan)
    setExpandedDay(plan.days[0]?.id || null)
    setExpandedPhase(null)
    setSaved(false)
  }

  const saveToPlanner = () => {
    if (!selectedPlan) return
    setSavedDays(selectedPlan.days)
    setSaved(true)
  }

  const totalExercises = selectedPlan?.days.reduce((a, d) => a + d.exercises.length, 0) || 0
  const totalSets = selectedPlan?.days.reduce((a, d) => a + d.exercises.reduce((b, e) => b + e.sets, 0), 0) || 0

  return (
    <div>
      <div className="page-header">
        <h1><Sparkles size={28} style={{ display: 'inline', verticalAlign: '-4px', marginRight: 8 }} /> Workout Generator</h1>
        <p>Describe your goal and get a phased, time-bound training plan</p>
      </div>

      {/* Search */}
      <div className="section" style={{ padding: 28 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. 'V-taper with big arms' or 'bulky mass in 12 weeks'"
            style={{
              flex: 1,
              minWidth: 200,
              padding: '14px 20px',
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
          <button className="btn btn-primary" onClick={handleSearch} style={{ padding: '14px 24px' }}>
            <Sparkles size={18} /> Generate
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          {['V-taper + arms', 'Bulk & thickness', 'Athletic & lean', 'Strength focus', 'Arm specialization', 'Chest & upper body'].map(s => (
            <button
              key={s}
              onClick={() => { setQuery(s); handleSearch() }}
              className="tag tag-blue"
              style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '5px 12px' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {matched.length > 0 && !selectedPlan && (
        <>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: '#f1f5f9' }}>
            {matched.length === 6 ? 'All Plans' : 'Recommended Plans'}
          </h2>
          <div className="card-grid">
            {matched.map(i => {
              const p = PRESETS[i]
              return (
                <div key={i} className="card" style={{ cursor: 'pointer' }} onClick={() => selectPlan(p)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1.05rem' }}>{p.name}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        {p.tags.map(t => <span key={t} className="tag tag-green" style={{ fontSize: '0.7rem' }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 14 }}>{p.description}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: '#64748b', marginBottom: 14 }}>
                    <span><Clock size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />{p.durationWeeks} weeks</span>
                    <span><Calendar size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />{p.frequencyDays} days/week</span>
                    <span><Dumbbell size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />{p.days.length} days</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      View Plan <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Selected Plan */}
      {selectedPlan && (
        <>
          {/* Header */}
          <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedPlan.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{selectedPlan.name}</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0 0' }}>{selectedPlan.description}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => { setSelectedPlan(null); setSaved(false) }}>
                <RotateCcw size={16} /> Back
              </button>
              <button className="btn btn-primary" onClick={saveToPlanner} disabled={saved}>
                {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save to Planner</>}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Duration</span><Clock size={18} color="#3b82f6"/></div>
              <div className="card-value">{selectedPlan.durationWeeks}<span style={{fontSize:'1rem',color:'#64748b'}}>w</span></div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Frequency</span><Calendar size={18} color="#10b981"/></div>
              <div className="card-value">{selectedPlan.frequencyDays}<span style={{fontSize:'1rem',color:'#64748b'}}>/wk</span></div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Exercises</span><Target size={18} color="#f59e0b"/></div>
              <div className="card-value">{totalExercises}</div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Sets/Week</span><Zap size={18} color="#8b5cf6"/></div>
              <div className="card-value">{totalSets}</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="section">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={20} /> Training Timeline
            </h2>
            <div className="phase-timeline" style={{ display: 'flex', gap: 0, position: 'relative' }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 2, background: '#1e293b', zIndex: 0 }} />
              {selectedPlan.phases.map((phase, idx) => {
                const c = PHASE_COLORS[idx]
                const isOpen = expandedPhase === idx
                return (
                  <div key={idx} style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <div
                      onClick={() => setExpandedPhase(isOpen ? null : idx)}
                      style={{ cursor: 'pointer', textAlign: 'center', padding: '0 8px' }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: c.bg,
                        border: `2px solid ${c.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 10px',
                        fontWeight: 800, color: c.dot, fontSize: '0.85rem',
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>{phase.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{phase.weeks}</div>
                    </div>
                    {isOpen && (
                      <div style={{
                        marginTop: 14,
                        padding: 16,
                        background: 'rgba(15,23,42,0.5)',
                        border: `1px solid ${c.border}`,
                        borderRadius: 12,
                        textAlign: 'left',
                      }}>
                        <div style={{ marginBottom: 10 }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Focus</span>
                          <div style={{ color: '#f1f5f9', fontWeight: 600, marginTop: 2 }}>{phase.focus}</div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Volume</span>
                          <div style={{ color: '#e2e8f0', marginTop: 2 }}>{phase.volumeRule}</div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Intensity</span>
                          <div style={{ color: '#e2e8f0', marginTop: 2 }}>{phase.intensityRule}</div>
                        </div>
                        <div>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Progression</span>
                          <div style={{ color: '#e2e8f0', marginTop: 2 }}>{phase.progression}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 12, textAlign: 'center' }}>Click a phase to see detailed progression rules</p>
          </div>

          {/* Expected Results */}
          <div className="section">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={20} color="#f59e0b" /> Expected Results
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {selectedPlan.expectedResults.map((r, i) => (
                <div key={i} style={{
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid #1e293b',
                  borderRadius: 12,
                  padding: 18,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <TrendingUp size={16} color="#10b981" />
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>{r.metric}</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{r.value}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}><Clock size={12} style={{ verticalAlign: '-1px', marginRight: 4 }} />{r.timeframe}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery & Nutrition */}
          <div className="section">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Heart size={20} color="#ef4444" /> Recovery & Nutrition
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {[
                { icon: <Moon size={18} color="#8b5cf6" />, label: 'Sleep', text: selectedPlan.recovery.sleep },
                { icon: <Apple size={18} color="#10b981" />, label: 'Protein', text: selectedPlan.recovery.protein },
                { icon: <Flame size={18} color="#f59e0b" />, label: 'Calories', text: selectedPlan.recovery.calories },
                { icon: <Droplets size={18} color="#06b6d4" />, label: 'Hydration', text: selectedPlan.recovery.hydration },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid #1e293b',
                  borderRadius: 12,
                  padding: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {item.icon}
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</span>
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Workout Days */}
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} /> Workout Schedule
          </h2>
          {selectedPlan.days.map(day => (
            <div key={day.id} className="section" style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
              <div
                className="day-header"
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: expandedDay === day.id ? '1px solid #1e293b' : 'none' }}
                onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="tag tag-blue">{day.name.split(' — ')[0]}</span>
                  <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{day.name.split(' — ')[1]}</span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({day.exercises.length} exercises)</span>
                </div>
                {expandedDay === day.id ? <ChevronUp size={18} color="#64748b"/> : <ChevronDown size={18} color="#64748b"/>}
              </div>

              {expandedDay === day.id && (
                <div style={{ padding: '16px 20px 20px' }}>
                  {/* Desktop: table */}
                  <div className="desktop-only">
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Exercise</th>
                            <th style={{ width: 70 }}>Sets</th>
                            <th style={{ width: 80 }}>Reps</th>
                            <th style={{ width: 90 }}>Rest</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.exercises.map(ex => (
                            <tr key={ex.id}>
                              <td style={{ fontWeight: 600 }}>{ex.name}</td>
                              <td>{ex.sets}</td>
                              <td>{ex.reps}</td>
                              <td><span className="tag tag-amber">{ex.rest}</span></td>
                              <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{ex.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile: cards */}
                  <div className="mobile-only">
                    {day.exercises.map(ex => (
                      <div key={ex.id} className="exercise-card">
                        <div className="exercise-card-header">
                          <span className="exercise-card-name">{ex.name}</span>
                        </div>
                        <div className="exercise-card-meta">
                          <div className="exercise-card-meta-item">
                            <span className="tag tag-blue">{ex.sets} sets</span>
                          </div>
                          <div className="exercise-card-meta-item">
                            <span className="tag tag-green">{ex.reps}</span>
                          </div>
                          <div className="exercise-card-meta-item">
                            <span className="tag tag-amber">{ex.rest}</span>
                          </div>
                        </div>
                        {ex.notes && (
                          <div style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                            {ex.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
