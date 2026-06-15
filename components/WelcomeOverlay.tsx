'use client'

import { gsap } from 'gsap'
import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import { useTypewriter } from '~/hooks/useTypewriter'

interface WelcomeOverlayProps {
  guestName: string
  backgroundRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
}

// --------------------------------------------------
// FLOATING PARTICLES CANVAS COMPONENT
// --------------------------------------------------
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
      phase: number
      wobbleSpeed: number
    }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Graduation theme palette: Gold, Soft Blue, Bright Amber, White/Sparkle
    const colors = [
      'rgba(201, 169, 110, ', // Gold #c9a96e
      'rgba(96, 165, 250, ', // Blue #60a5fa
      'rgba(244, 180, 26, ', // Amber #f4b41a
      'rgba(255, 255, 255, ', // White/Sparkle
    ]

    const count = Math.min(50, Math.floor(window.innerWidth / 25))

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height + 100), // distribute vertically
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.7 - 0.3, // Drift upwards
        opacity: Math.random() * 0.55 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.005,
      })
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.y += p.speedY
        p.x += p.speedX + Math.sin(time * p.wobbleSpeed + p.phase) * 0.15

        // Wrap around bottom to top
        if (p.y < -20) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
        }
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20

        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0015 + p.phase)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.opacity * twinkle})`

        // Add light glow to the particles
        ctx.shadowBlur = p.size * 2
        ctx.shadowColor = `${p.color}0.4)`

        ctx.fill()
        ctx.shadowBlur = 0 // reset shadow blur
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

// --------------------------------------------------
// MAIN CINEMATIC WELCOME OVERLAY
// --------------------------------------------------
export default function WelcomeOverlay({
  guestName,
  backgroundRef,
  onClose,
}: WelcomeOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const characterImgRef = useRef<HTMLImageElement>(null)
  const speechContainerRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  const [currentIndex, setCurrentIndex] = useState(0)

  // Dialogue lines matching 6 scenes
  const dialogLines = [
    `Hello ${guestName}!`,

    `Cảm ơn ${guestName} đã dành chút thời gian ghé xem chiếc thiệp tốt nghiệp này. Mình vui lắm luôn! 😊`,

    `Mới đó mà 3.5 năm đại học đã trôi qua nhanh thật. Có deadline, có đồ án, có những hôm thức khuya, nhưng cũng có rất nhiều kỷ niệm đáng nhớ.`,

    `Chỉ cần bạn ghé qua đây thôi cũng đủ khiến ngày tốt nghiệp của mình ý nghĩa hơn rồi. 💛`,

    `Hy vọng sẽ được gặp ${guestName} trong ngày tốt nghiệp để cùng lưu lại thêm một kỷ niệm đẹp nữa.`,

    `Nhớ tải thiệp về để không quên ngày giờ nhé 🚀`,
  ]

  // Character images mapped to 5 states (indexing: Scene 1->01, Scene 2->02, Scene 3->03, Scene 4->04, Scene 5/6->05)
  const characterImages = [
    '/01_idle.webp',
    '/02_wave.webp',
    '/03_happy.webp',
    '/04_thankyou.webp',
    '/05_bye.webp',
    '/05_bye.webp', // Keep the final farewell state for invitation reveal
  ]

  const currentLine = dialogLines[currentIndex]
  const currentImgSrc = characterImages[currentIndex]

  const { displayText, isTyping, completeText } = useTypewriter(currentLine, 30)
  const [displaySrc, setDisplaySrc] = useState(characterImages[0])
  const prevSrcRef = useRef(characterImages[0])

  // Asset Preloading
  useEffect(() => {
    const assets = [
      '/01_idle.webp',
      '/02_wave.webp',
      '/03_happy.webp',
      '/04_thankyou.webp',
      '/05_bye.webp',
    ]
    for (const src of assets) {
      const img = new Image()
      img.src = src
    }
  }, [])

  // Entry Animations on mount
  useEffect(() => {
    lenis?.stop()

    const background = backgroundRef.current
    const overlay = overlayRef.current
    const character = characterRef.current
    const speechContainer = speechContainerRef.current

    // Kill existing animations on these elements to prevent conflicts
    const targetsToKill = [
      background,
      overlay,
      character,
      speechContainer,
    ].filter(Boolean)
    if (targetsToKill.length > 0) {
      gsap.killTweensOf(targetsToKill)
    }

    // Initialize layout positions for GSAP transition
    if (overlay) gsap.set(overlay, { opacity: 0 })
    if (character) gsap.set(character, { y: 100, opacity: 0 })
    if (speechContainer) gsap.set(speechContainer, { y: 50, opacity: 0 })

    const tl = gsap.timeline()
    if (overlay) {
      tl.to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    }
    if (character) {
      tl.to(
        character,
        { y: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.1)' },
        '-=0.2'
      )
    }
    if (speechContainer) {
      tl.to(
        speechContainer,
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.5'
      )
    }

    return () => {
      tl.kill()
      lenis?.start()
    }
  }, [lenis, backgroundRef])

  // GSAP Character State Transitions (Fade + Scale)
  useEffect(() => {
    if (currentImgSrc !== prevSrcRef.current) {
      const targetSrc = currentImgSrc
      prevSrcRef.current = targetSrc

      if (characterImgRef.current) {
        gsap.killTweensOf(characterImgRef.current)
        const tl = gsap.timeline()

        tl.to(characterImgRef.current, {
          opacity: 0,
          scale: 0.92,
          duration: 0.22,
          ease: 'power2.in',
          onComplete: () => {
            setDisplaySrc(targetSrc)
          },
        })

        tl.to(characterImgRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.38,
          ease: 'back.out(1.2)',
        })
      }
    }
  }, [currentImgSrc])

  const handleBoxClick = () => {
    if (isTyping) {
      completeText()
    } else if (currentIndex < dialogLines.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleBoxClick()
    }
  }

  const handleFinish = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        lenis?.start()
        onClose()
      },
    })

    // Animate overlay out
    if (speechContainerRef.current) {
      tl.to(
        speechContainerRef.current,
        { y: 60, opacity: 0, duration: 0.45, ease: 'power2.in' },
        0
      )
    }
    if (characterRef.current) {
      tl.to(
        characterRef.current,
        { y: 100, opacity: 0, duration: 0.45, ease: 'power2.in' },
        '-=0.3'
      )
    }
    if (overlayRef.current) {
      tl.to(
        overlayRef.current,
        { opacity: 0, duration: 0.5, ease: 'power2.inOut' },
        '-=0.25'
      )
    }
  }

  return (
    <div
      ref={overlayRef}
      data-typing-done={!isTyping}
      className="fixed inset-0 z-[9999] flex flex-col justify-end items-center bg-slate-950/50 backdrop-blur-md overflow-hidden select-none p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-8 lg:pb-12"
    >
      {/* Dynamic Floating Particles */}
      <FloatingParticles />

      {/* CHARACTER SPRITE CONTAINER */}
      <div
        ref={characterRef}
        className="relative w-full h-[50vh] md:h-[55vh] lg:h-[60vh] flex items-end justify-center z-10 mb-[180px] sm:mb-[200px] md:mb-[220px] lg:mb-[240px]"
      >
        {/* biome-ignore lint/performance/noImgElement: Standard img is more reliable for static HTML export and resolves parent height issue */}
        <img
          ref={characterImgRef}
          src={displaySrc}
          alt="Mai Đạt Chibi"
          className="h-full max-h-full w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.65)] pointer-events-none select-none"
          draggable="false"
        />
      </div>

      {/* DIALOG BOX WRAPPER (Prevents GSAP translation conflicts) */}
      <div
        ref={speechContainerRef}
        className="fixed bottom-6 md:bottom-8 left-0 right-0 z-20 flex justify-center px-4 md:px-8"
      >
        {/* GLASSMORPHIC DIALOG BOX */}
        <div
          onClick={handleBoxClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          className="relative w-full max-w-[600px] md:max-w-2xl lg:max-w-3xl min-h-[140px] sm:min-h-[160px] md:min-h-[180px] bg-slate-950/70 backdrop-blur-xl border border-[#c9a96e]/30 rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] shadow-[#c9a96e]/5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 flex flex-col justify-between transition-all duration-300 hover:border-[#c9a96e]/50 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-8"
          style={{ position: 'relative' }}
        >
          {/* Dialogue Text Content */}
          <div className="text-slate-100 font-sans text-[18px] md:text-base lg:text-lg leading-[1.8] md:leading-relaxed text-left tracking-wide mt-2 select-text cursor-default flex-1 max-w-full">
            {displayText}
            {isTyping && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#c9a96e]/80 animate-pulse align-middle" />
            )}
          </div>

          {/* Action / Next Indicator Area */}
          <div className="flex justify-between items-center mt-3 pt-1">
            {/* Next indicator chevron */}
            {!isTyping && currentIndex < dialogLines.length - 1 && (
              <div className="ml-auto text-[#c9a96e] font-sans font-bold animate-bounce text-[13px] md:text-sm flex items-center gap-1.5 select-none">
                ▼ Chạm để tiếp tục
              </div>
            )}

            {/* Final Continue Button */}
            {currentIndex === dialogLines.length - 1 && !isTyping && (
              <div className="w-full flex justify-center mt-2 animate-fade-in">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent box click event bubbling
                    handleFinish()
                  }}
                  className="w-full h-[56px] rounded-xl bg-gradient-to-r from-[#e8d5a8] via-[#c9a96e] to-[#b39255] text-slate-950 font-extrabold text-sm md:text-base tracking-widest uppercase shadow-[0_0_20px_rgba(201,169,110,0.25)] hover:shadow-[0_0_35px_rgba(201,169,110,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer flex items-center justify-center"
                >
                  MỞ THIỆP 🎓
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
