import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { supabase } from '../lib/supabase'

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: 'locked'; remainingMinutes: number; failedAttempts: number }
  | { ok: false; reason: 'wrong_pin'; remainingAttempts: number }
  | { ok: false; reason: 'not_found' }
  | { ok: false; reason: 'auth_error' }

interface AuthState {
  user: User | null
  users: User[]
  usersById: Record<string, User>
  isLocked: boolean
  loading: boolean
  login: (pin: string) => Promise<LoginResult>
  lock: () => void
  unlock: (pin: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

function getCredentials() {
  const list: { name: string; email: string }[] = []
  const n1 = import.meta.env.VITE_USER1_NAME
  const e1 = import.meta.env.VITE_USER1_EMAIL
  const n2 = import.meta.env.VITE_USER2_NAME
  const e2 = import.meta.env.VITE_USER2_EMAIL
  if (n1 && e1) list.push({ name: n1, email: e1 })
  if (n2 && e2) list.push({ name: n2, email: e2 })
  return list
}

function getNameToShortId() {
  const map: Record<string, string> = {}
  const n1 = import.meta.env.VITE_USER1_NAME
  const s1 = import.meta.env.VITE_USER1_SHORT_ID
  const n2 = import.meta.env.VITE_USER2_NAME
  const s2 = import.meta.env.VITE_USER2_SHORT_ID
  if (n1 && s1) map[n1.toLowerCase()] = s1
  if (n2 && s2) map[n2.toLowerCase()] = s2
  return map
}

async function getUserIdByName(name: string): Promise<string | null> {
  const { data } = await supabase.from('users').select('id').eq('name', name).single()
  return data?.id || null
}

async function getUserDataByName(name: string) {
  const { data } = await supabase
    .from('users')
    .select('id, failed_attempts, locked_until')
    .eq('name', name)
    .single()
  return data
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [usersById, setUsersById] = useState<Record<string, User>>({})
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(true)

  // Startup: check session + persisted lock state
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        if (localStorage.getItem('app_locked') === 'true') {
          setIsLocked(true)
        }

        const profile = await fetchUserProfile(session.user.id)
        if (profile) {
          setUser(profile)
          await fetchAllUsers(profile)
        }
      }
      setLoading(false)
    })
  }, [])

  // Auto-lock: background (visibilitychange) or kill/close (pagehide)
  useEffect(() => {
    function lockApp() {
      setIsLocked(true)
      localStorage.setItem('app_locked', 'true')
    }
    function handleVisibility() {
      if (document.visibilityState === 'hidden') lockApp()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pagehide', lockApp)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', lockApp)
    }
  }, [])

  async function fetchUserProfile(uuid: string): Promise<User | null> {
    const { data } = await supabase
      .from('users')
      .select('id, name, avatar_color')
      .eq('id', uuid)
      .single()
    if (!data) return null

    const shortId = getNameToShortId()[data.name.toLowerCase()] || data.name.toLowerCase()
    return {
      id: data.id,
      shortId,
      name: data.name,
      avatarColor: data.avatar_color,
    }
  }

  async function fetchAllUsers(currentUser: User) {
    const { data } = await supabase
      .from('users')
      .select('id, name, avatar_color')

    if (data && data.length > 0) {
      const map: Record<string, User> = {}
      const list: User[] = data.map(u => {
        const shortId = getNameToShortId()[u.name.toLowerCase()] || u.name.toLowerCase()
        const user: User = { id: u.id, shortId, name: u.name, avatarColor: u.avatar_color }
        map[u.id] = user
        return user
      })
      setUsersById(map)
      setUsers(list)
    } else {
      setUsersById({ [currentUser.id]: currentUser })
      setUsers([currentUser])
    }
  }

  const login = useCallback(async (pin: string): Promise<LoginResult> => {
    const failedCredentials: { name: string; uuid: string | null }[] = []

    const USER_CREDENTIALS = getCredentials()
    for (const { name, email } of USER_CREDENTIALS) {
      const userData = await getUserDataByName(name)

      // Skip if locked
      if (userData?.locked_until && new Date(userData.locked_until) > new Date()) {
        failedCredentials.push({ name, uuid: userData.id })
        continue
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pin })
      if (data?.user) {
        // Success — reset this user's attempts
        await supabase.rpc('reset_failed_attempts', { target_user_id: data.user.id })

        const profile = await fetchUserProfile(data.user.id)
        if (!profile) return { ok: false, reason: 'not_found' }

        setUser(profile)
        setIsLocked(false)
        localStorage.removeItem('app_locked')
        await fetchAllUsers(profile)
        return { ok: true }
      }

      const uuid = userData?.id || await getUserIdByName(name)
      failedCredentials.push({ name, uuid })
    }

    // All failed — increment attempts for non-locked users
    for (const { name, uuid } of failedCredentials) {
      if (!uuid) continue

      const userData = await getUserDataByName(name)
      const isLocked = userData?.locked_until && new Date(userData.locked_until) > new Date()
      if (isLocked) continue

      const { data: rpcResult } = await supabase.rpc('increment_failed_attempts', { target_user_id: uuid })
      if (rpcResult?.locked) {
        return { ok: false, reason: 'locked', remainingMinutes: 15, failedAttempts: rpcResult.failed_attempts }
      }
    }

    // No one got locked — get remaining attempts from first failed user
    const firstUuid = failedCredentials.find(c => c.uuid)?.uuid
    if (firstUuid) {
      const { data: userRow } = await supabase.from('users').select('failed_attempts').eq('id', firstUuid).single()
      const remaining = Math.max(0, 5 - (userRow?.failed_attempts || 0))
      return { ok: false, reason: 'wrong_pin', remainingAttempts: remaining }
    }

    return { ok: false, reason: 'auth_error' }
  }, [])

  const lock = useCallback(() => setIsLocked(true), [])

  const unlock = useCallback(async (pin: string): Promise<boolean> => {
    if (!user) return false
    const cred = getCredentials().find(c => c.name === user.name)
    if (!cred) return false

    const { error } = await supabase.auth.signInWithPassword({ email: cred.email, password: pin })
    if (error) return false

    setIsLocked(false)
    localStorage.removeItem('app_locked')
    return true
  }, [user])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUsers([])
    setUsersById({})
    setIsLocked(false)
    localStorage.removeItem('app_locked')
  }, [])

  return (
    <AuthContext.Provider value={{ user, users, usersById, isLocked, loading, login, lock, unlock, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
