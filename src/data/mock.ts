import type { User, Settings } from '../types'

export const RILO: User = { id: '3105', shortId: '3105', name: 'Rilo', avatarColor: '#5B8DEF' }
export const ISNA: User = { id: '1012', shortId: '1012', name: 'Isna', avatarColor: '#FF6B81' }
export const USERS: User[] = [RILO, ISNA]

export const USER_EMAILS: Record<string, string> = {
  '3105': 'rilo@tabungan.app',
  '1012': 'isna@tabungan.app',
}

export const NAME_TO_SHORT_ID: Record<string, string> = {
  rilo: '3105',
  isna: '1012',
}

export const DEFAULT_SETTINGS: Settings = {
  goalAmount: 0,
  goalName: '',
}

export function formatIDR(amount: number): string {
  return `Rp${Math.abs(amount).toLocaleString('id-ID')}`
}
