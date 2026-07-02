import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
  title?: string
}

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div
      className="min-h-dvh"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {title && (
        <header
          className="flex items-center justify-center h-12 px-4"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <h1 className="font-display text-xl font-semibold text-white">{title}</h1>
        </header>
      )}
      <main
        className="px-4 pb-28 pt-2"
        style={{ paddingTop: title ? 'calc(env(safe-area-inset-top, 0px) + 8px)' : 'calc(env(safe-area-inset-top, 0px) + 16px)' }}
      >
        {children}
      </main>
    </div>
  )
}
