import type { Transaction, User } from '../../types'
import { formatIDR } from '../../data/mock'

interface TransactionRowProps {
  transaction: Transaction & { runningTotal?: number }
  usersById: Record<string, User>
}

const TYPE_LABEL: Record<string, string> = { in: 'Masuk', out: 'Keluar' }

export function TransactionRow({ transaction, usersById }: TransactionRowProps) {
  const user = usersById[transaction.userId]
  const isIn = transaction.type === 'in'
  const date = new Date(transaction.createdAt)
  const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
      <div
        className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: isIn ? 'var(--color-positive)' : 'var(--color-negative)' }}
      >
        {isIn ? '↓' : '↑'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className="text-[15px] font-semibold text-text-primary truncate">
            {transaction.note || (isIn ? 'Tabungan' : 'Penarikan')}
          </span>
          <span
            className={`text-[15px] font-semibold tabular-nums shrink-0 ml-3 ${
              isIn ? 'text-positive' : 'text-negative'
            }`}
          >
            {isIn ? '+' : '-'}{formatIDR(transaction.amount)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-text-secondary mt-0.5">
          <span>{dateStr} • {timeStr}</span>
          {user && (
            <>
              <span>•</span>
              <span style={{ color: user.avatarColor }}>{user.name}</span>
            </>
          )}
          {transaction.runningTotal !== undefined && (
            <>
              <span>•</span>
              <span className="tabular-nums">{formatIDR(transaction.runningTotal)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
