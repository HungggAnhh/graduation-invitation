'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownBannerProps {
  targetDate: Date
  isActive?: boolean
}

export function CountdownBanner({
  targetDate,
  isActive = true,
}: CountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  })

  useEffect(() => {
    if (!isActive) return

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now()
      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [targetDate, isActive])

  const fmt = (n: number) => n.toString().padStart(2, '0')

  const units = [
    { value: timeLeft.days, label: 'Ngày' },
    { value: timeLeft.hours, label: 'Giờ' },
    { value: timeLeft.minutes, label: 'Phút' },
    { value: timeLeft.seconds, label: 'Giây' },
  ]

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(12px, 3vw, 28px)', flexWrap: 'wrap' }}>
      {units.map((unit, i) => (
        <div key={unit.label} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 28px)' }}>
          <div
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'clamp(68px, 16vw, 120px)',
              height: 'clamp(80px, 18vw, 130px)',
              padding: '12px 8px',
              borderRadius: '16px',
              animation: 'pulseGlow 4s ease-in-out infinite',
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <span
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #e8d5a8, #c9a96e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
              }}
            >
              {fmt(unit.value)}
            </span>
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                color: 'rgba(96, 165, 250, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginTop: '6px',
              }}
            >
              {unit.label}
            </span>
          </div>

          {i < 3 && (
            <span style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              color: '#c9a96e',
              opacity: 0.5,
            }}>:</span>
          )}
        </div>
      ))}
    </div>
  )
}
