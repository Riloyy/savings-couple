import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Settings } from '../types'

export function useSettings() {
  const queryClient = useQueryClient()

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('goal_amount, goal_name')
        .eq('id', 1)
        .single()
      if (error) throw error
      return { goalAmount: data.goal_amount, goalName: data.goal_name } as Settings
    },
    initialData: { goalAmount: 0, goalName: '' },
  })

  const updateMut = useMutation({
    mutationFn: async ({ goalAmount, goalName }: Settings) => {
      const { error } = await supabase
        .from('settings')
        .update({ goal_amount: goalAmount, goal_name: goalName, updated_at: new Date().toISOString() })
        .eq('id', 1)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['settings'] }) },
  })

  const updateGoal = useCallback((goalAmount: number, goalName: string) => {
    updateMut.mutate({ goalAmount, goalName })
  }, [updateMut])

  return { settings: settings!, updateGoal }
}
