import { useEffect, useRef, useState } from 'react'
import { formatIDR } from '../../data/mock'

interface TotalBalanceProps {
  total: number
}

export function TotalBalance({ total }: TotalBalanceProps) {
  const [pulse, setPulse] = useState(false)
  const prevRef = useRef(total)

  useEffect(() => {
    if (prevRef.current !== total) {
      setPulse(true)
      prevRef.current = total
      const timer = setTimeout(() => setPulse(false), 300)
      return () => clearTimeout(timer)
    }
  }, [total])

  return (
    <div className="text-center py-4">
      <p className="text-white/70 text-[13px] mb-1">Total Tabungan</p>
      <p
        className={`font-display text-[40px] font-bold text-white leading-tight tabular-nums transition-transform duration-300 ${pulse ? 'scale-[1.015]' : 'scale-100'}`}
      >
        {formatIDR(total)}
      </p>
    </div>
  )
}
