import { useLocalStorage } from './useLocalStorage'

export type UnitSystem = 'metric' | 'imperial'

export function useUnits() {
  const [unitSystem, setUnitSystem] = useLocalStorage<UnitSystem>('fittrack_units', 'imperial')
  const isMetric = unitSystem === 'metric'

  const weight = {
    display: (lbs: number): string => {
      if (!lbs || lbs <= 0) return ''
      const val = isMetric ? +(lbs * 0.453592).toFixed(1) : lbs
      return `${val} ${isMetric ? 'kg' : 'lbs'}`
    },
    displayShort: (lbs: number): string => {
      if (!lbs || lbs <= 0) return ''
      const val = isMetric ? +(lbs * 0.453592).toFixed(1) : lbs
      return `${val}`
    },
    input: (displayValue: number): number => {
      // User inputs in their chosen unit; convert to internal lbs storage
      if (!displayValue || displayValue <= 0) return 0
      return isMetric ? +(displayValue / 0.453592).toFixed(1) : displayValue
    },
    fromStorage: (lbs: number): number => {
      // Convert stored lbs to display value
      if (!lbs || lbs <= 0) return 0
      return isMetric ? +(lbs * 0.453592).toFixed(1) : lbs
    },
    toStorage: (displayValue: number): number => {
      // Convert display value to stored lbs
      if (!displayValue || displayValue <= 0) return 0
      return isMetric ? +(displayValue / 0.453592).toFixed(1) : displayValue
    },
    label: isMetric ? 'kg' : 'lbs',
  }

  const length = {
    display: (inches: number): string => {
      if (!inches || inches <= 0) return ''
      const val = isMetric ? +(inches * 2.54).toFixed(1) : inches
      return `${val} ${isMetric ? 'cm' : 'in'}`
    },
    label: isMetric ? 'cm' : 'in',
  }

  return { unitSystem, setUnitSystem, isMetric, weight, length }
}
