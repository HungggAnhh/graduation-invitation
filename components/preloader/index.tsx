'use client'

import cn from 'clsx'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'


interface PreloaderProps {
  onComplete?: () => void
  className?: string
}

export function Preloader({ onComplete, className }: PreloaderProps) {
  const [isComplete, setIsComplete] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isComplete) return

    const tl = gsap.timeline()
    const loader = loaderRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const line = lineRef.current
    const progress = progressRef.current

    if (!((((loader && title ) && subtitle ) && line ) && progress)) return

    gsap.set([title, subtitle], { opacity: 0, y: 30 })
    gsap.set(line, { scaleX: 0 })
    gsap.set(progress, { width: '0%' })

    tl.to(title, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 })
      .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .to(line, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, '-=0.2')
      .to(progress, { width: '100%', duration: 1.2, ease: 'power2.inOut' }, '-=0.4')
      .to([title, subtitle, line], { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, '+=0.2')
      .to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        onStart: () => { onComplete?.() },
        onComplete: () => { setIsComplete(true) },
      })

    return () => { tl.kill() }
  }, [isComplete, onComplete])

  if (isComplete) return null

  return (
    <div
      ref={loaderRef}
      className={cn('fixed inset-0 z-50 flex flex-col items-center justify-center', className)}
      style={{
        background: 'linear-gradient(135deg, #080d1a 0%, #0f1b3d 50%, #080d1a 100%)',
      }}
    >
      <div className="texture" />

      <h1
        ref={titleRef}
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          background: 'linear-gradient(135deg, #e8d5a8, #c9a96e, #60a5fa, #c9a96e)',
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.05em',
          animation: 'shimmerGold 3s linear infinite',
        }}
      >
        Hùng Anh
      </h1>

      <p
        ref={subtitleRef}
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 'clamp(0.75rem, 2vw, 1rem)',
          color: 'rgba(238, 240, 247, 0.5)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginTop: '16px',
        }}
      >
        Graduation Ceremony 2026
      </p>

      <div
        ref={lineRef}
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, #2563eb, #c9a96e)',
          marginTop: '24px',
          transformOrigin: 'center',
        }}
      />

      <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '20px', overflow: 'hidden' }}>
        <div ref={progressRef} style={{ height: '100%', background: 'linear-gradient(90deg, #2563eb, #c9a96e)', borderRadius: '2px' }} />
      </div>
    </div>
  )
}
