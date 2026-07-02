export interface User {
  id: string
  shortId: string
  name: string
  avatarColor: string
}

export type TransactionType = 'in' | 'out'

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: TransactionType
  note: string
  createdAt: string
}

export interface Settings {
  goalAmount: number
  goalName: string
}

export type Page = 'dashboard' | 'history' | 'settings'
