import { useEffect, useState } from 'react'

interface Heart {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  opacity: number
}

export function FloatingHearts() {
  const [hearts] = useState<Heart[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 14 + Math.random() * 10,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.15,
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute bottom-0"
          style={{
            left: `${h.x}%`,
            animation: `heart-float-${h.id} ${h.duration}s ${h.delay}s infinite linear`,
            opacity: 0,
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="var(--color-love-pink)"
          >
            <path d="M12 21.35C12 21.35 4 16 4 9.5 4 6.46 6.46 4 9.5 4c1.74 0 3.41.81 4.5 2.09C15.09 4.81 16.76 4 18.5 4 21.54 4 24 6.46 24 9.5c0 6.5-8 11.85-8 11.85L12 21.35z" />
          </svg>
        </div>
      ))}
      <style>{`
        ${hearts.map(h => `
          @keyframes heart-float-${h.id} {
            0% {
              transform: translateY(0) translateX(0) scale(0.6) rotate(0deg);
              opacity: 0;
            }
            5% {
              opacity: ${h.opacity};
            }
            85% {
              opacity: ${h.opacity * 0.5};
            }
            100% {
              transform: translateY(-100vh) translateX(${(Math.random() - 0.5) * 40}px) scale(1) rotate(${Math.random() > 0.5 ? 15 : -15}deg);
              opacity: 0;
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  )
}
