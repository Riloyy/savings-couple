import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { PinInput } from '../ui/PinInput'
import { Lock } from 'lucide-react'

export function AppLockScreen() {
  const { unlock } = useAuth()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (pin.length === 6) {
      unlock(pin).then(ok => {
        if (!ok) {
          setError('PIN salah')
          setPin('')
        }
      })
    }
  }, [pin, unlock])

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col items-center justify-center px-6"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mb-8 flex flex-col items-center">
        <Lock size={40} className="text-white mb-3" />
        <h2 className="font-display text-xl font-bold text-white">Terkunci</h2>
        <p className="text-white/70 text-[13px] mt-1">Masukkan PIN untuk membuka</p>
      </div>

      <PinInput
        value={pin}
        onChange={setPin}
        error={error}
        light
      />
    </div>
  )
}
