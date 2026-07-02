import { USERS, formatIDR } from '../../data/mock'

interface BreakdownCardProps {
  total: number
  userTotals: Record<string, number>
  goalAmount: number
  goalName: string
}

export function BreakdownCard({ total, userTotals, goalAmount, goalName }: BreakdownCardProps) {
  const totalPct = total > 0 ? Math.round((userTotals['rilo'] ?? 0) / total * 100) + Math.round((userTotals['isna'] ?? 0) / total * 100) : 0
  const goalPct = goalAmount > 0 ? Math.min(100, Math.round((total / goalAmount) * 100)) : 0

  return (
    <div className="bg-bg-surface rounded-2xl p-4 shadow-[0_4px_20px_rgba(31,51,80,0.06)]">
      <h3 className="font-display text-base font-semibold text-text-primary mb-3">Kontribusi</h3>

      <div className="mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-blue-accent), var(--color-love-pink))' }}
          >
            <span className="text-white text-[10px] font-bold">&</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <span className="text-[15px] font-semibold text-text-primary">Gabungan</span>
              <span className="text-[13px] text-text-secondary tabular-nums">{formatIDR(total)}</span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-600 ease-out"
                style={{
                  width: `${goalPct}%`,
                  background: 'linear-gradient(90deg, var(--color-blue-accent), var(--color-love-pink))',
                }}
              />
            </div>
            <span className="text-[11px] text-text-secondary">{goalPct}% dari target "{goalName}"</span>
          </div>
        </div>
      </div>

      {USERS.map(u => {
        const userTotal = userTotals[u.id] || 0
        const pctOfTotal = total > 0 ? Math.round((userTotal / total) * 100) : 0
        return (
          <div key={u.id} className="flex items-center gap-3 mb-3 last:mb-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: u.avatarColor }}
            >
              {u.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="text-[15px] font-semibold text-text-primary">{u.name}</span>
                <span className="text-[13px] text-text-secondary tabular-nums">{formatIDR(userTotal)}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-600 ease-out"
                  style={{
                    width: `${pctOfTotal}%`,
                    backgroundColor: u.avatarColor,
                  }}
                />
              </div>
              <span className="text-[11px] text-text-secondary">{pctOfTotal}% dari total</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
