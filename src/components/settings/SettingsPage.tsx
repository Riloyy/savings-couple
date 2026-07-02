import { useState } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useAuth } from '../../hooks/useAuth'
import { RILO, ISNA, formatIDR } from '../../data/mock'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function SettingsPage() {
  const { settings, updateGoal } = useSettings()
  const { logout } = useAuth()
  const [goalName, setGoalName] = useState(settings.goalName)
  const [goalAmount, setGoalAmount] = useState(settings.goalAmount.toLocaleString('id-ID'))
  const [saved, setSaved] = useState(false)

  function handleAmountInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '')
    const num = parseInt(raw, 10)
    if (raw === '') setGoalAmount('')
    else setGoalAmount(num.toLocaleString('id-ID'))
  }

  function handleSave() {
    const num = parseInt(goalAmount.replace(/\./g, ''), 10) || 0
    if (!goalName.trim() || num <= 0) return
    updateGoal(num, goalName.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-text-primary">Pengaturan</h2>

      <Card>
        <h3 className="font-display text-base font-semibold text-text-primary mb-4">Goal Tabungan</h3>
        <div className="mb-3">
          <label className="text-[13px] text-text-secondary font-medium block mb-1">Nama Goal</label>
          <input
            type="text"
            value={goalName}
            onChange={e => setGoalName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-bg-primary text-text-primary text-[15px] focus:outline-none focus:border-blue-accent"
          />
        </div>
        <div className="mb-4">
          <label className="text-[13px] text-text-secondary font-medium block mb-1">Target Nominal</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[15px] font-semibold">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={goalAmount}
              onChange={handleAmountInput}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg-primary text-text-primary text-[15px] font-semibold tabular-nums focus:outline-none focus:border-blue-accent"
            />
          </div>
        </div>
        <Button full onClick={handleSave} disabled={saved}>
          {saved ? 'Tersimpan ✓' : 'Simpan Goal'}
        </Button>
      </Card>

      <Card>
        <h3 className="font-display text-base font-semibold text-text-primary mb-3">Akun Terdaftar</h3>
        {[RILO, ISNA].map(u => (
          <div key={u.id} className="flex items-center gap-3 py-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: u.avatarColor }}
            >
              {u.name[0]}
            </div>
            <div>
              <p className="text-[15px] font-semibold text-text-primary">{u.name}</p>
              <p className="text-[13px] text-text-secondary">ID: {u.id}</p>
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <h3 className="font-display text-base font-semibold text-text-primary mb-3">Device Terdaftar</h3>
        <p className="text-[13px] text-text-secondary mb-3">Reset device manual via Supabase dashboard.</p>
        <div className="bg-love-pink-soft rounded-xl px-4 py-3">
          <p className="text-[13px] text-text-primary">HP ini terdaftar sejak</p>
          <p className="text-[15px] font-semibold text-text-primary">2 Juli 2026</p>
        </div>
      </Card>

      <Button variant="danger" full onClick={logout}>
        Keluar
      </Button>
    </div>
  )
}
