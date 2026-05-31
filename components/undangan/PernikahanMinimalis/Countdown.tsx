'use client'
import { useEffect, useState } from 'react'

type Props = { targetDate: string; targetTime: string }

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function calcTimeLeft(targetDate: string, targetTime: string): TimeLeft {
  const target = new Date(`${targetDate}T${targetTime}:00`).getTime()
  const diff = target - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown({ targetDate, targetTime }: Props) {
  const [t, setT] = useState<TimeLeft>(() => calcTimeLeft(targetDate, targetTime))

  useEffect(() => {
    const id = setInterval(() => setT(calcTimeLeft(targetDate, targetTime)), 1000)
    return () => clearInterval(id)
  }, [targetDate, targetTime])

  const items = [
    { label: 'Hari', value: t.days },
    { label: 'Jam', value: t.hours },
    { label: 'Menit', value: t.minutes },
    { label: 'Detik', value: t.seconds },
  ]

  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '16px 20px', minWidth: 72,
        }}>
          <span style={{ fontSize: '2rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {String(value).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}