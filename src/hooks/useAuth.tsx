import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { USERS, USER_EMAILS } from '../data/mock'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  isLocked: boolean
  loading: boolean
  login: (userId: string, pin: string) => Promise<boolean>
  lock: () => void
  unlock: () => boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        if (profile) setUser(profile)
      }
      setLoading(false)
    })
  }, [])

  async function fetchUserProfile(uuid: string): Promise<User | null> {
    const { data } = await supabase
      .from('users')
      .select('id, name, avatar_color')
      .eq('id', uuid)
      .single()
    if (!data) return null

    const shortId = data.name.toLowerCase() as 'rilo' | 'isna'
    return {
      id: data.id,
      shortId,
      name: data.name,
      avatarColor: data.avatar_color,
    }
  }

  const login = useCallback(async (userId: string, pin: string): Promise<boolean> => {
    const email = USER_EMAILS[userId]
    if (!email) return false

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    })
    if (error || !data.user) return false

    const profile = await fetchUserProfile(data.user.id)
    if (!profile) return false

    setUser(profile)
    setIsLocked(false)
    return true
  }, [])

  const lock = useCallback(() => setIsLocked(true), [])
  const unlock = useCallback((): boolean => {
    setIsLocked(false)
    return true
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsLocked(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLocked, loading, login, lock, unlock, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
