import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { useTransactions } from './hooks/useTransactions'
import { useSettings } from './hooks/useSettings'
import { LoginScreen } from './components/auth/LoginScreen'
import { AppLockScreen } from './components/auth/AppLockScreen'
import { AppShell } from './components/layout/AppShell'
import { BottomNav } from './components/layout/BottomNav'
import { DashboardPage } from './components/dashboard/DashboardPage'
import { HistoryPage } from './components/transactions/HistoryPage'
import { SettingsPage } from './components/settings/SettingsPage'
import { TransactionForm } from './components/transactions/TransactionForm'
import type { Page } from './types'

const queryClient = new QueryClient()

function AppContent() {
  const { user, isLocked } = useAuth()
  const [page, setPage] = useState<Page>('dashboard')
  const [showForm, setShowForm] = useState(false)

  if (!user) return <LoginScreen />
  if (isLocked) return <AppLockScreen />

  const TITLES: Record<Page, string> = {
    dashboard: 'Tabungan Bersama',
    history: 'Riwayat',
    settings: 'Pengaturan',
  }

  return (
    <AppShell title={TITLES[page]}>
      {page === 'dashboard' && <DashboardPage onAddTransaction={() => setShowForm(true)} />}
      {page === 'history' && <HistoryPage />}
      {page === 'settings' && <SettingsPage />}
      <BottomNav active={page} onNavigate={setPage} />
      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </AppShell>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}
