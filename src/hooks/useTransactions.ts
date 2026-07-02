import { useState, useCallback, useMemo } from 'react'
import type { Transaction, TransactionType } from '../types'
import { generateMockTransactions } from '../data/mock'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions)

  const addTransaction = useCallback((userId: string, amount: number, type: TransactionType, note: string) => {
    const t: Transaction = {
      id: `t${Date.now()}`,
      userId,
      amount,
      type,
      note,
      createdAt: new Date().toISOString(),
    }
    setTransactions(prev => [t, ...prev])
  }, [])

  const total = useMemo(() => {
    return transactions.reduce((sum, t) => sum + (t.type === 'in' ? t.amount : -t.amount), 0)
  }, [transactions])

  const userTotals = useMemo(() => {
    const byUser: Record<string, number> = {}
    for (const t of transactions) {
      const delta = t.type === 'in' ? t.amount : -t.amount
      byUser[t.userId] = (byUser[t.userId] || 0) + delta
    }
    return byUser
  }, [transactions])

  const runningTotal = useMemo(() => {
    let running = 0
    return [...transactions].reverse().map(t => {
      running += t.type === 'in' ? t.amount : -t.amount
      return { ...t, runningTotal: running }
    }).reverse()
  }, [transactions])

  return { transactions, addTransaction, total, userTotals, runningTotal }
}
