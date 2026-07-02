interface NumpadProps {
  onDigit: (d: string) => void
  onDelete: () => void
  onClear: () => void
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '']

export function Numpad({ onDigit, onDelete, onClear }: NumpadProps) {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {KEYS.map((k, i) => {
        if (!k) {
          if (i === 9) return <div key={i} />
          if (i === 11) return (
            <button
              key={i}
              onClick={onDelete}
              className="h-14 rounded-full bg-bg-surface text-text-primary text-xl font-semibold shadow-sm active:scale-95 transition-all"
              aria-label="Hapus"
            >
              ⌫
            </button>
          )
          return <div key={i} />
        }
        return (
          <button
            key={i}
            onClick={() => onDigit(k)}
            className="h-14 rounded-full bg-bg-surface text-text-primary text-2xl font-semibold shadow-sm active:scale-95 transition-all"
          >
            {k}
          </button>
        )
      })}
    </div>
  )
}
