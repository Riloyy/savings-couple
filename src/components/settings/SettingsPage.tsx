import { useState } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTransactions } from '../../hooks/useTransactions'
import { useAuth } from '../../hooks/useAuth'
import { RILO, ISNA, formatIDR, DEFAULT_SETTINGS } from '../../data/mock'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function SettingsPage() {
  const { settings, updateGoal } = useSettings()
  const { resetTransactions } = useTransactions()
  const { logout } = useAuth()
  const [goalName, setGoalName] = useState(settings.goalName)
  const [goalAmount, setGoalAmount] = useState(settings.goalAmount.toLocaleString('id-ID'))
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)

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
      <h2 className="font-display text-xl font-bold text-white">Pengaturan</h2>

      <Card>
        <h3 className="font-display text-base font-semibold text-text-primary mb-4">Goal Tabungan</h3>
        <div className="mb-3">
          <label className="text-[13px] text-text-secondary font-medium block mb-1">Nama Goal</label>
          <input
            type="text"
            value={goalName}
            onChange={e => setGoalName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-white text-text-primary text-[15px] focus:outline-none focus:border-blue-accent"
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
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-text-primary text-[15px] font-semibold tabular-nums focus:outline-none focus:border-blue-accent"
            />
          </div>
        </div>
        <Button full onClick={handleSave} disabled={saved}>
          {saved ? 'Tersimpan ✓' : 'Simpan Goal'}
        </Button>
        <Button full variant="danger" onClick={() => setShowReset(true)} className="mt-3">
          Reset Goal
        </Button>
      </Card>

      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowReset(false) }}
        >
          <div className="bg-bg-surface rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display text-lg font-bold text-text-primary mb-2">Reset Goal?</h3>
            <p className="text-[13px] text-text-secondary mb-6">
              Semua transaksi akan dihapus dan progres kembali ke nol. Tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 h-11 rounded-full bg-border/50 text-text-primary text-[15px] font-semibold active:scale-95 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetTransactions()
                  updateGoal(DEFAULT_SETTINGS.goalAmount, DEFAULT_SETTINGS.goalName)
                  setGoalName(DEFAULT_SETTINGS.goalName)
                  setGoalAmount(DEFAULT_SETTINGS.goalAmount.toLocaleString('id-ID'))
                  setShowReset(false)
                }}
                className="flex-1 h-11 rounded-full bg-negative text-white text-[15px] font-semibold active:scale-95 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

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
