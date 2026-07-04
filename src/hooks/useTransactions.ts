import { useCallback, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Transaction, TransactionType } from '../types'

function mapRow(row: any): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    amount: row.amount,
    type: row.type as TransactionType,
    note: row.note || '',
    createdAt: row.created_at,
  }
}

export function useTransactions() {
  const queryClient = useQueryClient()

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(mapRow)
    },
  })

  useEffect(() => {
    const channelName = `transactions-${crypto.randomUUID()}`
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => { queryClient.invalidateQueries({ queryKey: ['transactions'] }) }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [queryClient])

  const addMut = useMutation({
    mutationFn: async ({ userId, amount, type, note }: { userId: string; amount: number; type: TransactionType; note: string }) => {
      const { error } = await supabase.from('transactions').insert({
        user_id: userId,
        amount,
        type,
        note,
      })
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['transactions'] }) },
  })

  const addTransaction = useCallback(async (userId: string, amount: number, type: TransactionType, note: string) => {
    await addMut.mutateAsync({ userId, amount, type, note })
  }, [addMut])

  const isAdding = addMut.isPending

  const resetMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('reset_all_transactions')
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['transactions'] }) },
  })

  const resetTransactions = useCallback(() => {
    resetMut.mutate()
  }, [resetMut])

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

  return { transactions, addTransaction, isAdding, total, userTotals, runningTotal, resetTransactions }
}
