import { HeartProgress } from './HeartProgress'
import { TotalBalance } from './TotalBalance'
import { BreakdownCard } from './BreakdownCard'
import { useTransactions } from '../../hooks/useTransactions'
import { useSettings } from '../../hooks/useSettings'
import { RILO, ISNA, formatIDR } from '../../data/mock'

interface DashboardPageProps {
  onAddTransaction: () => void
}

export function DashboardPage({ onAddTransaction }: DashboardPageProps) {
  const { total, userTotals } = useTransactions()
  const { settings } = useSettings()

  const riloTotal = userTotals[RILO.id] || 0
  const isnaTotal = userTotals[ISNA.id] || 0
  const riloPct = total > 0 ? Math.max(0, Math.min(100, (riloTotal / total) * 100)) : 0
  const isnaPct = total > 0 ? Math.max(0, Math.min(100, (isnaTotal / total) * 100)) : 0
  const goalPct = settings.goalAmount > 0 ? Math.min(100, (total / settings.goalAmount) * 100) : 0
  const isComplete = total >= settings.goalAmount && settings.goalAmount > 0

  return (
    <div className="space-y-5">
      <TotalBalance total={total} />

      <div className="bg-bg-surface rounded-2xl p-4 shadow-[0_4px_20px_rgba(31,51,80,0.06)]">
        <div className="text-center mb-2">
          <span className="font-display text-base font-semibold text-text-primary">
            Goal: {settings.goalName}
          </span>
        </div>
        <HeartProgress
          pctA={riloPct}
          pctB={isnaPct}
          colorA={RILO.avatarColor}
          colorB={ISNA.avatarColor}
          nameA={RILO.name}
          nameB={ISNA.name}
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
                <span className="text-white text-[12px] font-bold drop-shadow-sm">{goalPct}%</span>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-text-secondary tabular-nums">{formatIDR(total)}</span>
            <span className="text-[11px] text-text-secondary tabular-nums">{formatIDR(settings.goalAmount)}</span>
          </div>
        </div>
      </div>

      <BreakdownCard total={total} userTotals={userTotals} />

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
