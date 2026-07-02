import type { Page } from '../../types'
import { Heart, Clock, Settings } from 'lucide-react'

interface BottomNavProps {
  active: Page
  onNavigate: (page: Page) => void
}

const ITEMS: { page: Page; label: string; icon: typeof Heart }[] = [
  { page: 'dashboard', label: 'Tabungan', icon: Heart },
  { page: 'history', label: 'Riwayat', icon: Clock },
  { page: 'settings', label: 'Setting', icon: Settings },
]

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around h-20 px-4"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: 'rgba(255,255,255,0.85)',
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      {ITEMS.map(item => {
        const isActive = active === item.page
        const Icon = item.icon
        return (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px]"
          >
            <Icon
              size={22}
              className={isActive ? 'text-love-pink' : 'text-text-secondary'}
            />
            <span
              className={`text-[11px] font-medium ${isActive ? 'text-love-pink' : 'text-text-secondary'}`}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
