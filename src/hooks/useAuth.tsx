import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'
import { USERS } from '../data/mock'

interface AuthState {
  user: User | null
  isLocked: boolean
  login: (userId: string, pin: string) => boolean
  lock: () => void
  unlock: () => boolean
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const MOCK_PIN = '123456'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(USERS[0])
  const [isLocked, setIsLocked] = useState(false)

  const login = useCallback((userId: string, pin: string): boolean => {
    if (pin !== MOCK_PIN) return false
    const found = USERS.find(u => u.id === userId)
    if (!found) return false
    setUser(found)
    setIsLocked(false)
    return true
  }, [])

  const lock = useCallback(() => setIsLocked(true), [])
  const unlock = useCallback((): boolean => {
    setIsLocked(false)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsLocked(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLocked, login, lock, unlock, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
