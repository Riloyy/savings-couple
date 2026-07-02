import type { User, Transaction, Settings } from '../types'

export const RILO: User = { id: 'rilo', name: 'Rilo', avatarColor: '#5B8DEF' }
export const ISNA: User = { id: 'isna', name: 'Isna', avatarColor: '#FF6B81' }
export const USERS: User[] = [RILO, ISNA]

export const DEFAULT_SETTINGS: Settings = {
  goalAmount: 50000000,
  goalName: 'DP Rumah',
}

export function generateMockTransactions(): Transaction[] {
  const now = Date.now()
  const day = 86400000

  return [
    { id: 't1', userId: 'rilo', amount: 2000000, type: 'in', note: 'Gaji bulan ini', createdAt: new Date(now - 30 * day).toISOString() },
    { id: 't2', userId: 'isna', amount: 1500000, type: 'in', note: 'Freelance project', createdAt: new Date(now - 28 * day).toISOString() },
    { id: 't3', userId: 'rilo', amount: 500000, type: 'in', note: 'Bonus', createdAt: new Date(now - 25 * day).toISOString() },
    { id: 't4', userId: 'isna', amount: 200000, type: 'out', note: 'Cicilan', createdAt: new Date(now - 22 * day).toISOString() },
    { id: 't5', userId: 'rilo', amount: 1000000, type: 'in', note: 'Tabungan rutin', createdAt: new Date(now - 18 * day).toISOString() },
    { id: 't6', userId: 'isna', amount: 800000, type: 'in', note: 'Hasil jualan', createdAt: new Date(now - 15 * day).toISOString() },
    { id: 't7', userId: 'isna', amount: 300000, type: 'in', note: 'THR', createdAt: new Date(now - 12 * day).toISOString() },
    { id: 't8', userId: 'rilo', amount: 750000, type: 'in', note: 'Nabung', createdAt: new Date(now - 10 * day).toISOString() },
    { id: 't9', userId: 'rilo', amount: 150000, type: 'out', note: 'Biaya admin', createdAt: new Date(now - 8 * day).toISOString() },
    { id: 't10', userId: 'isna', amount: 250000, type: 'out', note: 'Zakat', createdAt: new Date(now - 5 * day).toISOString() },
    { id: 't11', userId: 'isna', amount: 1200000, type: 'in', note: 'Gaji', createdAt: new Date(now - 3 * day).toISOString() },
    { id: 't12', userId: 'rilo', amount: 600000, type: 'in', note: 'Side hustle', createdAt: new Date(now - 1 * day).toISOString() },
  ]
}

export function formatIDR(amount: number): string {
  return `Rp${Math.abs(amount).toLocaleString('id-ID')}`
}
