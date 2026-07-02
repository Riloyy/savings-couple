import { useState, useCallback } from 'react'
import type { Settings } from '../types'
import { DEFAULT_SETTINGS } from '../data/mock'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  const updateGoal = useCallback((goalAmount: number, goalName: string) => {
    setSettings({ goalAmount, goalName })
  }, [])

  return { settings, updateGoal }
}
