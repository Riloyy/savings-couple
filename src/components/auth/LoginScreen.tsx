import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { PinInput } from '../ui/PinInput'
import { Heart, Lock } from 'lucide-react'

export function LoginScreen() {
  const { login } = useAuth()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [locked, setLocked] = useState(false)
  const [remainingMinutes, setRemainingMinutes] = useState(0)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  useEffect(() => {
    if (pin.length === 6 && !loggingIn && !locked) {
      setLoggingIn(true)
      login(pin).then(res => {
        if (!res.ok) {
          if (res.reason === 'locked') {
            setLocked(true)
            setRemainingMinutes(res.remainingMinutes)
            setError(`Akun terkunci. Coba lagi ${res.remainingMinutes} menit lagi.`)
          } else if (res.reason === 'wrong_pin') {
            setError(res.remainingAttempts > 0
              ? `PIN salah. ${res.remainingAttempts} kesempatan lagi.`
              : 'PIN salah.')
            setRemainingAttempts(res.remainingAttempts)
          } else {
            setError('Terjadi kesalahan. Coba lagi.')
          }
          setPin('')
        }
        setLoggingIn(false)
      })
    }
  }, [pin, login, loggingIn, locked])

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col items-center justify-center px-6"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mb-8 flex flex-col items-center">
        <Heart size={48} className="text-love-pink" fill="var(--color-love-pink)" />
        <h1 className="font-display text-2xl font-bold text-white mt-3">Tabungan Bersama</h1>
        <p className="text-white/70 text-[13px] mt-1">Masukkan PIN</p>
      </div>

      {locked ? (
        <div className="flex flex-col items-center gap-3">
          <Lock size={40} className="text-negative" />
          <p className="text-white/80 text-[15px] text-center max-w-xs">
            Terlalu banyak percobaan gagal. Coba lagi dalam {remainingMinutes} menit.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {remainingAttempts !== null && (
            <p className="text-white/70 text-[13px] mb-3">
              {remainingAttempts} dari 5 kesempatan tersisa
            </p>
          )}
          <PinInput
            value={pin}
            onChange={setPin}
            error={error}
            light
          />
        </div>
      )}
    </div>
  )
}
