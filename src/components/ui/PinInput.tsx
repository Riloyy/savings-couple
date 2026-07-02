import { useRef } from 'react'

interface PinInputProps {
  value: string
  onChange: (val: string) => void
  error?: string
  label?: string
  light?: boolean
}

export function PinInput({ value, onChange, error, label, light }: PinInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function focusInput() {
    inputRef.current?.focus()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 6)
    onChange(raw)
  }

  return (
    <div className="flex flex-col items-center">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        value={value}
        onChange={handleChange}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      <div
        onClick={focusInput}
        className="cursor-pointer px-6 py-4 rounded-2xl -mx-6 active:bg-black/[0.03] transition-colors"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') focusInput() }}
        aria-label={label || 'Masukkan PIN'}
      >
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full transition-all duration-150"
              style={{
                backgroundColor: i < value.length ? 'var(--color-love-pink)' : 'var(--color-border)',
                transform: i < value.length ? 'scale(1)' : 'scale(0.85)',
              }}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="text-negative text-[13px] mt-2">{error}</p>
      )}

      {!value && !error && (
        <p className={`text-[13px] mt-4 ${light ? 'text-white/70' : 'text-text-secondary'}`}>Ketuk untuk memasukkan PIN</p>
      )}
    </div>
  )
}
