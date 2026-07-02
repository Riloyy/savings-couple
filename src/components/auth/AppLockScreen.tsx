import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Numpad } from '../ui/Numpad'
import { Lock } from 'lucide-react'

export function AppLockScreen() {
  const { unlock } = useAuth()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function handleDigit(d: string) {
    if (pin.length >= 6) return
    const next = pin + d
    setPin(next)
    setError('')
    if (next.length === 6) {
      const ok = unlock()
      if (!ok) {
        setError('PIN salah')
        setPin('')
      }
    }
  }

  function handleDelete() {
    setPin(prev => prev.slice(0, -1))
    setError('')
  }

  function handleClear() {
    setPin('')
    setError('')
  }

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col items-center justify-center px-6"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mb-8 flex flex-col items-center">
        <Lock size={40} className="text-blue-accent mb-3" />
        <h2 className="font-display text-xl font-bold text-text-primary">Terkunci</h2>
        <p className="text-text-secondary text-[13px] mt-1">Masukkan PIN untuk membuka</p>
        {error && <p className="text-negative text-[13px] mt-2">{error}</p>}
      </div>

      <div className="flex gap-3 mb-8">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-colors duration-150"
            style={{
              backgroundColor: i < pin.length ? 'var(--color-love-pink)' : 'var(--color-border)',
            }}
          />
        ))}
      </div>

      <Numpad onDigit={handleDigit} onDelete={handleDelete} onClear={handleClear} />
    </div>
  )
}
