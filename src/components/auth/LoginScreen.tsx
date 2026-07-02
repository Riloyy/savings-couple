import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { USERS } from '../../data/mock'
import { Numpad } from '../ui/Numpad'
import { Heart } from 'lucide-react'

export function LoginScreen() {
  const { login } = useAuth()
  const [userId, setUserId] = useState<string>('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<'select' | 'pin'>('select')

  function handleSelectUser(id: string) {
    setUserId(id)
    setStep('pin')
    setError('')
  }

  function handleDigit(d: string) {
    if (pin.length >= 6) return
    const next = pin + d
    setPin(next)
    setError('')
    if (next.length === 6) {
      const ok = login(userId, next)
      if (!ok) {
        setError('PIN salah, coba lagi')
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

  if (step === 'select') {
    return (
      <div className="min-h-dvh bg-bg-primary flex flex-col items-center justify-center px-6"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mb-8 flex flex-col items-center">
          <Heart size={48} className="text-love-pink" fill="var(--color-love-pink)" />
          <h1 className="font-display text-2xl font-bold text-text-primary mt-3">Tabungan Bersama</h1>
          <p className="text-text-secondary text-[15px] mt-1">Siapa kamu?</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {USERS.map(u => (
            <button
              key={u.id}
              onClick={() => handleSelectUser(u.id)}
              className="flex items-center gap-4 bg-bg-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(31,51,80,0.06)] active:scale-[0.98] transition-transform"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: u.avatarColor }}
              >
                {u.name[0]}
              </div>
              <span className="font-display text-lg font-semibold text-text-primary">Masuk sebagai {u.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col items-center justify-center px-6"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mb-8 flex flex-col items-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3"
          style={{ backgroundColor: USERS.find(u => u.id === userId)?.avatarColor }}
        >
          {USERS.find(u => u.id === userId)?.name[0]}
        </div>
        <h2 className="font-display text-xl font-bold text-text-primary">Masukkan PIN</h2>
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

      <button
        onClick={() => { setStep('select'); setPin(''); setError('') }}
        className="mt-6 text-text-secondary text-[13px] underline"
      >
        Kembali
      </button>
    </div>
  )
}
