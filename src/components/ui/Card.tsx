import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-bg-surface rounded-2xl shadow-[0_4px_20px_rgba(31,51,80,0.06)] p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
