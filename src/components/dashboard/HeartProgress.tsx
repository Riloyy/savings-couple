interface HeartProgressProps {
  pctA: number
  pctB: number
  colorA: string
  colorB: string
  nameA: string
  nameB: string
  isComplete: boolean
}

const HEART_PATH = "M50 88 C50 88 12 62 12 36 C12 24 22 14 34 14 C42 14 48 20 50 26 C52 20 58 14 66 14 C78 14 88 24 88 36 C88 62 50 88 50 88Z"

function SingleHeart({
  pct,
  color,
  isComplete,
  side,
}: {
  pct: number
  color: string
  isComplete: boolean
  side: 'left' | 'right'
}) {
  const fillHeight = Math.max(0, Math.min(100, pct))
  const translateX = side === 'left' ? '-25%' : '25%'

  return (
    <div
      className="relative"
      style={{
        width: '50%',
        transform: `translateX(${translateX})`,
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-auto drop-shadow-sm">
        <defs>
          <clipPath id={`heart-clip-${side}`}>
            <rect x="0" y={100 - fillHeight} width="100" height={fillHeight} />
          </clipPath>
        </defs>
        <path d={HEART_PATH} fill="var(--color-border)" opacity={0.5} />
        <path
          d={HEART_PATH}
          fill={color}
          clipPath={`url(#heart-clip-${side})`}
          style={{ transition: 'clip-path 600ms ease-out' }}
        />
      </svg>
      {isComplete && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            animation: isComplete ? 'heartbeat 0.6s ease-out' : 'none',
          }}
        >
          <span className="text-lg drop-shadow-md">💖</span>
        </div>
      )}
    </div>
  )
}

export function HeartProgress({ pctA, pctB, colorA, colorB, nameA, nameB, isComplete }: HeartProgressProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center w-full max-w-[240px] -mx-4">
        <SingleHeart pct={pctA} color={colorA} isComplete={isComplete} side="left" />
        <SingleHeart pct={pctB} color={colorB} isComplete={isComplete} side="right" />
      </div>
      <div className="flex items-center justify-center gap-8 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorA }} />
          <span className="text-[13px] text-text-secondary">{nameA}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorB }} />
          <span className="text-[13px] text-text-secondary">{nameB}</span>
        </div>
      </div>
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
