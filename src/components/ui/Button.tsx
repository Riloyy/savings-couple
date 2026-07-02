import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  full?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', full, children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full font-semibold transition-all active:scale-97 disabled:opacity-40 disabled:cursor-not-allowed select-none'
  const sizes = 'h-12 px-6 text-[15px]'
  const variants = {
    primary: 'bg-blue-accent text-white hover:bg-blue-accent-dark',
    ghost: 'bg-transparent text-text-primary hover:bg-blue-accent/10',
    danger: 'bg-negative text-white hover:opacity-90',
  }

  return (
    <button
      className={`${base} ${sizes} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
