import { useState, useMemo } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useAuth } from '../../hooks/useAuth'
import { TransactionRow } from './TransactionRow'
import { Filter } from 'lucide-react'

export function HistoryPage() {
  const { transactions } = useTransactions()
  const { users, usersById } = useAuth()
  const [filterUser, setFilterUser] = useState<string>('all')
  const [showFilter, setShowFilter] = useState(false)

  const filtered = useMemo(() => {
    let sorted = [...transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    if (filterUser !== 'all') {
      sorted = sorted.filter(t => t.userId === filterUser)
    }
    return sorted
  }, [transactions, filterUser])

  const filterLabel = filterUser === 'all' ? 'Semua' : (usersById[filterUser]?.name || 'Unknown')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">Riwayat Transaksi</h2>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-1.5 text-[13px] text-text-secondary h-9 px-3 rounded-full bg-bg-surface shadow-sm"
        >
          <Filter size={14} />
          {filterLabel}
        </button>
      </div>

      {showFilter && (
        <div className="flex gap-2">
          <button
            onClick={() => { setFilterUser('all'); setShowFilter(false) }}
            className={`h-9 px-4 rounded-full text-[13px] font-medium transition-all ${
              filterUser === 'all'
                ? 'bg-blue-accent text-white'
                : 'bg-bg-surface text-text-secondary shadow-sm'
            }`}
          >
            Semua
          </button>
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => { setFilterUser(u.id); setShowFilter(false) }}
              className={`h-9 px-4 rounded-full text-[13px] font-medium transition-all ${
                filterUser === u.id
                  ? 'bg-blue-accent text-white'
                  : 'bg-bg-surface text-text-secondary shadow-sm'
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>
      )}

      <div className="bg-bg-surface rounded-2xl p-4 shadow-[0_4px_20px_rgba(31,51,80,0.06)]">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary text-[15px]">Belum ada transaksi.</p>
            <p className="text-text-secondary text-[13px] mt-1">Mulai catat tabungan pertama, yuk!</p>
          </div>
        ) : (
          filtered.map(t => <TransactionRow key={t.id} transaction={t} usersById={usersById} />)
        )}
      </div>
    </div>
  )
}
