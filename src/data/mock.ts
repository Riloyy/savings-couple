import type { Settings } from '../types'

export const DEFAULT_SETTINGS: Settings = {
  goalAmount: 0,
  goalName: '',
}

export function formatIDR(amount: number): string {
  return `Rp${Math.abs(amount).toLocaleString('id-ID')}`
}
