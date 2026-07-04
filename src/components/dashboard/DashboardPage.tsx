import { HeartProgress } from './HeartProgress'
import { TotalBalance } from './TotalBalance'
import { BreakdownCard } from './BreakdownCard'
import { useTransactions } from '../../hooks/useTransactions'
import { useSettings } from '../../hooks/useSettings'
import { useAuth } from '../../hooks/useAuth'
import { formatIDR } from '../../data/mock'

interface DashboardPageProps {
  onAddTransaction: () => void
}

export function DashboardPage({ onAddTransaction }: DashboardPageProps) {
  const { total, userTotals } = useTransactions()
  const { settings } = useSettings()
  const { user, users } = useAuth()

  const hour = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false })
  const h = parseInt(hour, 10)
  const greeting = h < 11 ? 'Selamat Pagi' : h < 15 ? 'Selamat Siang' : h < 18 ? 'Selamat Sore' : 'Selamat Malam'

  const userA = users[0]
  const userB = users[1]
  const riloTotal = userTotals[userA?.id || ''] || 0
  const isnaTotal = userTotals[userB?.id || ''] || 0
  const riloPct = total > 0 ? Math.max(0, Math.min(100, (riloTotal / total) * 100)) : 0
  const isnaPct = total > 0 ? Math.max(0, Math.min(100, (isnaTotal / total) * 100)) : 0
  const goalPct = settings.goalAmount > 0 ? Math.min(100, (total / settings.goalAmount) * 100) : 0
  const goalPctDisplay = goalPct.toFixed(1).replace('.', ',')
  const isComplete = total >= settings.goalAmount && settings.goalAmount > 0

  return (
    <div className="space-y-5">
      <div className="bg-bg-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(31,51,80,0.06)] flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-sm"
          style={{ backgroundColor: user?.avatarColor }}
        >
          {user?.name?.[0]}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-text-primary">{greeting},</p>
          <p className="text-text-secondary text-[17px] font-medium -mt-0.5">{user?.name}</p>
        </div>
      </div>
      <TotalBalance total={total} />

      <div className="bg-bg-surface rounded-2xl p-4 shadow-[0_4px_20px_rgba(31,51,80,0.06)]">
        <div className="text-center mb-2">
          {settings.goalName && (
            <span className="font-display text-base font-semibold text-text-primary">
              Goal: {settings.goalName}
            </span>
          )}
        </div>
        <HeartProgress
          pctA={riloPct}
          pctB={isnaPct}
          colorA={userA?.avatarColor || '#5B8DEF'}
          colorB={userB?.avatarColor || '#FF6B81'}
          nameA={userA?.name || 'Rilo'}
          nameB={userB?.name || 'Isna'}
          isComplete={isComplete}
        />
        <div className="mt-3">
          <div className="relative h-7 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-600 ease-out flex items-center justify-end pr-2.5"
              style={{
                width: `${goalPct}%`,
                background: 'linear-gradient(90deg, var(--color-blue-accent), var(--color-love-pink))',
              }}
            >
              {goalPct >= 8 && (
                <span className="text-white text-[12px] font-bold drop-shadow-sm">{goalPctDisplay}%</span>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-text-secondary tabular-nums">{formatIDR(total)}</span>
            <span className="text-[11px] text-text-secondary tabular-nums">{formatIDR(settings.goalAmount)}</span>
          </div>
        </div>
      </div>

      <BreakdownCard goalAmount={settings.goalAmount} userTotals={userTotals} users={users} />

      <button
        onClick={onAddTransaction}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-blue-accent text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Tambah transaksi"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
