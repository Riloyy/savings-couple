import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTransactions } from '../../hooks/useTransactions'
import { Button } from '../ui/Button'
import { X } from 'lucide-react'

interface TransactionFormProps {
  onClose: () => void
}

export function TransactionForm({ onClose }: TransactionFormProps) {
  const { user } = useAuth()
  const { addTransaction } = useTransactions()
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'in' | 'out'>('in')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!user) return
    const num = parseInt(amount.replace(/\./g, ''), 10)
    if (!num || num <= 0) return

    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    addTransaction(user.id, num, type, note)
    setSaving(false)
    onClose()
  }

  function handleAmountInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '')
    const num = parseInt(raw, 10)
    if (raw === '') setAmount('')
    else setAmount(num.toLocaleString('id-ID'))
  }

  const numAmount = parseInt(amount.replace(/\./g, ''), 10) || 0
  const isValid = numAmount > 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-bg-surface rounded-t-3xl p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl font-bold text-text-primary">Tambah Transaksi</h2>
          <button onClick={onClose} className="p-2 -mr-2" aria-label="Tutup">
            <X size={22} className="text-text-secondary" />
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setType('in')}
            className={`flex-1 h-11 rounded-full text-[15px] font-semibold transition-all ${
              type === 'in'
                ? 'bg-positive text-white'
                : 'bg-border/50 text-text-secondary'
            }`}
          >
            Nabung
          </button>
          <button
            onClick={() => setType('out')}
            className={`flex-1 h-11 rounded-full text-[15px] font-semibold transition-all ${
              type === 'out'
                ? 'bg-negative text-white'
                : 'bg-border/50 text-text-secondary'
            }`}
          >
            Tarik
          </button>
        </div>

        <div className="mb-4">
          <label className="text-[13px] text-text-secondary font-medium mb-1 block">Nominal</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-lg font-semibold">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountInput}
              placeholder="0"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-bg-primary text-text-primary text-lg font-semibold tabular-nums focus:outline-none focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20"
              autoFocus
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[13px] text-text-secondary font-medium mb-1 block">Catatan (opsional)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Misal: Gaji bulan ini"
            className="w-full h-12 px-4 rounded-xl border border-border bg-bg-primary text-text-primary text-[15px] focus:outline-none focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20"
          />
        </div>

        <Button full disabled={!isValid || saving} onClick={handleSubmit}>
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </span>
          ) : (
            'Simpan'
          )}
        </Button>
      </div>
    </div>
  )
}
